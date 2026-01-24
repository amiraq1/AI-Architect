import os
import uuid
import asyncio
from typing import Literal
from urllib.parse import urlparse
import socket
from langchain_core.tools import tool
from playwright.async_api import async_playwright

# Create screenshots directory
SCREENSHOTS_DIR = "static/screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)


async def _browse_website_async(url: str, action: Literal["read", "screenshot"] = "read") -> str:
    """Internal async function to browse websites using Playwright."""
    
    try:
        async with async_playwright() as p:
            # Launch headless browser
            browser = await p.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-dev-shm-usage']
            )
            
            # Create context with realistic user agent
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={"width": 1280, "height": 720}
            )
            
            # Create page and navigate
            page = await context.new_page()
            
            try:
                await page.goto(url, wait_until="networkidle", timeout=30000)
            except Exception:
                # Fallback to domcontentloaded if networkidle times out
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            
            result = ""
            
            if action == "read":
                # Extract text content from the page
                content = await page.inner_text("body")
                # Clean up and truncate if too long
                content = content.strip()
                if len(content) > 8000:
                    content = content[:8000] + "\n\n[Content truncated...]"
                result = f"**Page Content from {url}:**\n\n{content}"
                
            elif action == "screenshot":
                # Generate unique filename
                filename = f"screenshot_{uuid.uuid4().hex[:8]}.png"
                filepath = os.path.join(SCREENSHOTS_DIR, filename)
                
                # Take full page screenshot
                await page.screenshot(path=filepath, full_page=True)
                
                # Return markdown image link
                result = f"**Screenshot captured from {url}:**\n\n![Screenshot](/static/screenshots/{filename})\n\nFile saved to: {filepath}"
            
            # Close browser to free resources
            await browser.close()
            
            return result
            
    except Exception as e:
        return f"Browser error: {str(e)}"


@tool
def browse_website(url: str, action: str = "read") -> str:
    """Browse a website using a real headless browser that renders JavaScript.
    
    Use this tool to:
    - Read content from JavaScript-heavy websites (SPAs, React, Vue, etc.)
    - Take screenshots of web pages to show the user
    - Extract data that requires JS rendering
    
    Args:
        url: The full URL to browse (must include https:// or http://).
        action: Either "read" to extract text content, or "screenshot" to capture a visual image.
        
    Returns:
        For "read": The text content of the page.
        For "screenshot": A markdown image link to the captured screenshot.
    """
    # Validate URL structure
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    # 🛡️ SECURITY: SSRF Protection
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname
        if not hostname:
            return "Error: Invalid URL"
        
        # Resolve IP to check for private networks
        try:
            ip = socket.gethostbyname(hostname)
        except socket.gaierror:
             return "Error: Could not resolve hostname"

        # Check for private IP ranges (Basic check)
        is_private = ip.startswith("127.") or ip.startswith("10.") or ip.startswith("192.168.") or ip == "0.0.0.0"
        if is_private or hostname in ["localhost", "0.0.0.0"]:
            return f"Security Error: Access to internal network address ({hostname}) is BLOCKED."
            
    except Exception as e:
        return f"URL Validation Error: {str(e)}"
    
    # Run async function
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're already in an async context, create a new task
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(asyncio.run, _browse_website_async(url, action))
                return future.result(timeout=60)
        else:
            return asyncio.run(_browse_website_async(url, action))
    except Exception as e:
        return f"Browser execution error: {str(e)}"
