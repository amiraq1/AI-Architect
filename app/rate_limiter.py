"""
Rate Limiting Middleware for Nabd AI API

Provides configurable rate limiting to protect the API from abuse
and ensure fair usage across all users.
"""

import os
import time
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Dict, Optional, Callable
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


@dataclass
class RateLimitConfig:
    """Configuration for rate limiting."""
    # Requests per minute for anonymous users
    anonymous_rpm: int = 10
    # Requests per minute for authenticated users
    authenticated_rpm: int = 60
    # Requests per minute for premium users
    premium_rpm: int = 200
    # Window size in seconds
    window_seconds: int = 60
    # Endpoints to exclude from rate limiting
    excluded_paths: list = field(default_factory=lambda: ["/", "/api/health", "/docs", "/openapi.json"])


@dataclass
class RateLimitEntry:
    """Tracks rate limit state for a single client."""
    request_count: int = 0
    window_start: float = field(default_factory=time.time)


class RateLimiter:
    """In-memory rate limiter using sliding window algorithm."""
    
    def __init__(self, config: Optional[RateLimitConfig] = None):
        self.config = config or RateLimitConfig()
        self._load_env_config()
        self.clients: Dict[str, RateLimitEntry] = defaultdict(RateLimitEntry)
    
    def _load_env_config(self):
        """Load configuration from environment variables."""
        if os.getenv("RATE_LIMIT_ANONYMOUS_RPM"):
            self.config.anonymous_rpm = int(os.getenv("RATE_LIMIT_ANONYMOUS_RPM"))
        if os.getenv("RATE_LIMIT_AUTHENTICATED_RPM"):
            self.config.authenticated_rpm = int(os.getenv("RATE_LIMIT_AUTHENTICATED_RPM"))
        if os.getenv("RATE_LIMIT_PREMIUM_RPM"):
            self.config.premium_rpm = int(os.getenv("RATE_LIMIT_PREMIUM_RPM"))
        if os.getenv("RATE_LIMIT_WINDOW_SECONDS"):
            self.config.window_seconds = int(os.getenv("RATE_LIMIT_WINDOW_SECONDS"))
    
    def _get_client_key(self, request: Request) -> str:
        """Generate a unique key for the client."""
        # Try to get user ID from headers (set by Wasp proxy)
        user_id = request.headers.get("X-User-ID")
        if user_id:
            return f"user:{user_id}"
        
        # Fall back to IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return f"ip:{forwarded.split(',')[0].strip()}"
        
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"
    
    def _get_user_tier(self, request: Request) -> str:
        """Determine the user's tier for rate limiting."""
        # Check for premium user header (set by Wasp proxy)
        is_premium = request.headers.get("X-User-Premium", "false").lower() == "true"
        if is_premium:
            return "premium"
        
        # Check for authenticated user
        user_id = request.headers.get("X-User-ID")
        if user_id:
            return "authenticated"
        
        return "anonymous"
    
    def _get_limit_for_tier(self, tier: str) -> int:
        """Get the rate limit for a given tier."""
        limits = {
            "anonymous": self.config.anonymous_rpm,
            "authenticated": self.config.authenticated_rpm,
            "premium": self.config.premium_rpm,
        }
        return limits.get(tier, self.config.anonymous_rpm)
    
    def is_allowed(self, request: Request) -> tuple[bool, dict]:
        """
        Check if request is allowed under rate limiting rules.
        
        Returns:
            Tuple of (is_allowed, rate_limit_info)
        """
        # Skip rate limiting for excluded paths
        if request.url.path in self.config.excluded_paths:
            return True, {}
        
        client_key = self._get_client_key(request)
        tier = self._get_user_tier(request)
        limit = self._get_limit_for_tier(tier)
        
        current_time = time.time()
        entry = self.clients[client_key]
        
        # Reset window if expired
        if current_time - entry.window_start >= self.config.window_seconds:
            entry.request_count = 0
            entry.window_start = current_time
        
        # Check if limit exceeded
        remaining = max(0, limit - entry.request_count)
        reset_time = int(entry.window_start + self.config.window_seconds)
        
        rate_info = {
            "X-RateLimit-Limit": str(limit),
            "X-RateLimit-Remaining": str(remaining),
            "X-RateLimit-Reset": str(reset_time),
            "X-RateLimit-Tier": tier,
        }
        
        if entry.request_count >= limit:
            return False, rate_info
        
        # Increment counter
        entry.request_count += 1
        rate_info["X-RateLimit-Remaining"] = str(max(0, limit - entry.request_count))
        
        return True, rate_info
    
    def cleanup_expired(self):
        """Remove expired entries to prevent memory bloat."""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self.clients.items()
            if current_time - entry.window_start >= self.config.window_seconds * 2
        ]
        for key in expired_keys:
            del self.clients[key]


class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for rate limiting."""
    
    def __init__(self, app, rate_limiter: Optional[RateLimiter] = None):
        super().__init__(app)
        self.rate_limiter = rate_limiter or RateLimiter()
        self._cleanup_counter = 0
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Check rate limit (disabled in development by default)
        env = os.getenv("ENV", "development").lower()
        rate_limit_enabled = os.getenv("RATE_LIMIT_ENABLED", "auto").lower()
        
        if rate_limit_enabled == "false":
            return await call_next(request)
        
        if rate_limit_enabled == "auto" and env != "production":
            return await call_next(request)
        
        is_allowed, rate_info = self.rate_limiter.is_allowed(request)
        
        if not is_allowed:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded. Please try again later.",
                    "error": "too_many_requests",
                    "retry_after": int(rate_info.get("X-RateLimit-Reset", 60)) - int(time.time())
                },
                headers=rate_info
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers to response
        for key, value in rate_info.items():
            response.headers[key] = value
        
        # Periodic cleanup (every 100 requests)
        self._cleanup_counter += 1
        if self._cleanup_counter >= 100:
            self.rate_limiter.cleanup_expired()
            self._cleanup_counter = 0
        
        return response


# Singleton instance
_rate_limiter = None


def get_rate_limiter() -> RateLimiter:
    """Get the global rate limiter instance."""
    global _rate_limiter
    if _rate_limiter is None:
        _rate_limiter = RateLimiter()
    return _rate_limiter
