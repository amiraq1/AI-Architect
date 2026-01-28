"""
Prometheus Metrics for Nabd AI Platform

Provides comprehensive monitoring metrics for:
- Request latency and throughput
- AI agent performance
- Tool usage statistics
- Error rates
- Token usage estimation
"""

import os
import time
from typing import Callable, Optional
from functools import wraps
from dataclasses import dataclass, field
from collections import defaultdict
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


@dataclass
class MetricValue:
    """A single metric value with labels."""
    value: float = 0.0
    labels: dict = field(default_factory=dict)


class Counter:
    """A counter metric that only goes up."""
    
    def __init__(self, name: str, description: str, labels: list = None):
        self.name = name
        self.description = description
        self.label_names = labels or []
        self._values: dict = defaultdict(float)
    
    def inc(self, labels: dict = None, value: float = 1.0):
        """Increment the counter."""
        key = self._labels_to_key(labels or {})
        self._values[key] += value
    
    def _labels_to_key(self, labels: dict) -> tuple:
        return tuple(sorted(labels.items()))
    
    def collect(self) -> list:
        """Collect all metric values."""
        return [
            {"labels": dict(key), "value": value}
            for key, value in self._values.items()
        ]


class Histogram:
    """A histogram metric for measuring distributions."""
    
    DEFAULT_BUCKETS = (0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, float("inf"))
    
    def __init__(self, name: str, description: str, labels: list = None, buckets: tuple = None):
        self.name = name
        self.description = description
        self.label_names = labels or []
        self.buckets = buckets or self.DEFAULT_BUCKETS
        self._values: dict = defaultdict(lambda: {"buckets": defaultdict(float), "sum": 0.0, "count": 0})
    
    def observe(self, value: float, labels: dict = None):
        """Record an observation."""
        key = self._labels_to_key(labels or {})
        entry = self._values[key]
        
        for bucket in self.buckets:
            if value <= bucket:
                entry["buckets"][bucket] += 1
        
        entry["sum"] += value
        entry["count"] += 1
    
    def _labels_to_key(self, labels: dict) -> tuple:
        return tuple(sorted(labels.items()))
    
    def collect(self) -> list:
        """Collect all metric values."""
        return [
            {
                "labels": dict(key),
                "buckets": dict(entry["buckets"]),
                "sum": entry["sum"],
                "count": entry["count"]
            }
            for key, entry in self._values.items()
        ]


class Gauge:
    """A gauge metric that can go up and down."""
    
    def __init__(self, name: str, description: str, labels: list = None):
        self.name = name
        self.description = description
        self.label_names = labels or []
        self._values: dict = defaultdict(float)
    
    def set(self, value: float, labels: dict = None):
        """Set the gauge value."""
        key = self._labels_to_key(labels or {})
        self._values[key] = value
    
    def inc(self, labels: dict = None, value: float = 1.0):
        """Increment the gauge."""
        key = self._labels_to_key(labels or {})
        self._values[key] += value
    
    def dec(self, labels: dict = None, value: float = 1.0):
        """Decrement the gauge."""
        key = self._labels_to_key(labels or {})
        self._values[key] -= value
    
    def _labels_to_key(self, labels: dict) -> tuple:
        return tuple(sorted(labels.items()))
    
    def collect(self) -> list:
        """Collect all metric values."""
        return [
            {"labels": dict(key), "value": value}
            for key, value in self._values.items()
        ]


# ═══════════════════════════════════════════════════════════════════════════════
# NABD AI METRICS
# ═══════════════════════════════════════════════════════════════════════════════

class NabdMetrics:
    """Central metrics registry for Nabd AI Platform."""
    
    def __init__(self):
        # Request metrics
        self.http_requests_total = Counter(
            "nabd_http_requests_total",
            "Total HTTP requests",
            labels=["method", "path", "status"]
        )
        
        self.http_request_duration_seconds = Histogram(
            "nabd_http_request_duration_seconds",
            "HTTP request latency",
            labels=["method", "path"]
        )
        
        # Agent metrics
        self.agent_requests_total = Counter(
            "nabd_agent_requests_total",
            "Total agent requests",
            labels=["mode", "model"]
        )
        
        self.agent_request_duration_seconds = Histogram(
            "nabd_agent_request_duration_seconds",
            "Agent request processing time",
            labels=["mode", "model"],
            buckets=(0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0, 120.0, float("inf"))
        )
        
        self.agent_errors_total = Counter(
            "nabd_agent_errors_total",
            "Total agent errors",
            labels=["mode", "error_type"]
        )
        
        # Tool usage metrics
        self.tool_calls_total = Counter(
            "nabd_tool_calls_total",
            "Total tool invocations",
            labels=["tool_name", "status"]
        )
        
        self.tool_call_duration_seconds = Histogram(
            "nabd_tool_call_duration_seconds",
            "Tool execution time",
            labels=["tool_name"],
            buckets=(0.1, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, float("inf"))
        )
        
        # Token usage (estimated)
        self.estimated_tokens_total = Counter(
            "nabd_estimated_tokens_total",
            "Estimated tokens used",
            labels=["type", "model"]  # type: input/output
        )
        
        # Active connections
        self.active_connections = Gauge(
            "nabd_active_connections",
            "Current active connections",
            labels=["endpoint"]
        )
        
        # Rate limiting
        self.rate_limit_exceeded_total = Counter(
            "nabd_rate_limit_exceeded_total",
            "Rate limit exceeded events",
            labels=["tier"]
        )
    
    def record_http_request(self, method: str, path: str, status: int, duration: float):
        """Record an HTTP request."""
        self.http_requests_total.inc({"method": method, "path": path, "status": str(status)})
        self.http_request_duration_seconds.observe(duration, {"method": method, "path": path})
    
    def record_agent_request(self, mode: str, model: str, duration: float, error: str = None):
        """Record an agent request."""
        self.agent_requests_total.inc({"mode": mode, "model": model})
        self.agent_request_duration_seconds.observe(duration, {"mode": mode, "model": model})
        
        if error:
            self.agent_errors_total.inc({"mode": mode, "error_type": error})
    
    def record_tool_call(self, tool_name: str, duration: float, success: bool):
        """Record a tool invocation."""
        status = "success" if success else "error"
        self.tool_calls_total.inc({"tool_name": tool_name, "status": status})
        self.tool_call_duration_seconds.observe(duration, {"tool_name": tool_name})
    
    def record_tokens(self, input_tokens: int, output_tokens: int, model: str):
        """Record estimated token usage."""
        self.estimated_tokens_total.inc({"type": "input", "model": model}, input_tokens)
        self.estimated_tokens_total.inc({"type": "output", "model": model}, output_tokens)
    
    def format_prometheus(self) -> str:
        """Format all metrics in Prometheus text format."""
        lines = []
        
        # Counter metrics
        for metric in [self.http_requests_total, self.agent_requests_total, 
                       self.agent_errors_total, self.tool_calls_total,
                       self.estimated_tokens_total, self.rate_limit_exceeded_total]:
            lines.append(f"# HELP {metric.name} {metric.description}")
            lines.append(f"# TYPE {metric.name} counter")
            for item in metric.collect():
                labels_str = ",".join(f'{k}="{v}"' for k, v in item["labels"].items())
                lines.append(f'{metric.name}{{{labels_str}}} {item["value"]}')
        
        # Gauge metrics
        for metric in [self.active_connections]:
            lines.append(f"# HELP {metric.name} {metric.description}")
            lines.append(f"# TYPE {metric.name} gauge")
            for item in metric.collect():
                labels_str = ",".join(f'{k}="{v}"' for k, v in item["labels"].items())
                lines.append(f'{metric.name}{{{labels_str}}} {item["value"]}')
        
        # Histogram metrics
        for metric in [self.http_request_duration_seconds, self.agent_request_duration_seconds,
                       self.tool_call_duration_seconds]:
            lines.append(f"# HELP {metric.name} {metric.description}")
            lines.append(f"# TYPE {metric.name} histogram")
            for item in metric.collect():
                labels_str = ",".join(f'{k}="{v}"' for k, v in item["labels"].items())
                for bucket, count in sorted(item["buckets"].items()):
                    le = "+Inf" if bucket == float("inf") else str(bucket)
                    lines.append(f'{metric.name}_bucket{{{labels_str},le="{le}"}} {count}')
                lines.append(f'{metric.name}_sum{{{labels_str}}} {item["sum"]}')
                lines.append(f'{metric.name}_count{{{labels_str}}} {item["count"]}')
        
        return "\n".join(lines)


class MetricsMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for collecting HTTP metrics."""
    
    def __init__(self, app, metrics: NabdMetrics):
        super().__init__(app)
        self.metrics = metrics
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Skip metrics endpoint itself
        if request.url.path == "/metrics":
            return await call_next(request)
        
        start_time = time.time()
        
        # Track active connections
        path = request.url.path
        self.metrics.active_connections.inc({"endpoint": path})
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            
            self.metrics.record_http_request(
                method=request.method,
                path=path,
                status=response.status_code,
                duration=duration
            )
            
            return response
        finally:
            self.metrics.active_connections.dec({"endpoint": path})


# Singleton instance
_metrics = None


def get_metrics() -> NabdMetrics:
    """Get the global metrics instance."""
    global _metrics
    if _metrics is None:
        _metrics = NabdMetrics()
    return _metrics


def metrics_endpoint():
    """Endpoint handler for /metrics."""
    metrics = get_metrics()
    return Response(
        content=metrics.format_prometheus(),
        media_type="text/plain; version=0.0.4"
    )
