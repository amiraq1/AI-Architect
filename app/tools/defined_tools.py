import os
from typing import List, Optional
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from app.sandbox import run_python_sandboxed

try:
    from tavily import TavilyClient
    TAVILY_AVAILABLE = True
except ImportError:
    TAVILY_AVAILABLE = False


DATA_DIR = "./data"
os.makedirs(DATA_DIR, exist_ok=True)


def _get_search_provider() -> str:
    """Determine which search provider to use based on config."""
    tavily_key = os.getenv("TAVILY_API_KEY")
    search_provider = os.getenv("SEARCH_PROVIDER", "auto").lower()
    
    if search_provider == "tavily":
        return "tavily"
    elif search_provider == "duckduckgo":
        return "duckduckgo"
    elif search_provider == "auto":
        # Auto: Use Tavily if key is available, otherwise DuckDuckGo
        if tavily_key and TAVILY_AVAILABLE:
            return "tavily"
        return "duckduckgo"
    return "duckduckgo"


def _search_with_tavily(query: str) -> str:
    """Search using Tavily API (optimized for AI agents)."""
    tavily_key = os.getenv("TAVILY_API_KEY")
    if not tavily_key:
        raise ValueError("TAVILY_API_KEY is not set")
    
    client = TavilyClient(api_key=tavily_key)
    
    # استخدام البحث المتقدم المُحسَّن للـ Agents
    response = client.search(
        query=query,
        search_depth="advanced",  # بحث عميق
        max_results=5,
        include_answer=True,  # إجابة مُلخَّصة
        include_raw_content=False,
    )
    
    # تنسيق النتائج
    results = []
    
    # الإجابة المُلخَّصة (إذا وُجدت)
    if response.get("answer"):
        results.append(f"📌 Summary: {response['answer']}\n")
    
    # نتائج البحث
    for i, item in enumerate(response.get("results", []), 1):
        title = item.get("title", "No title")
        url = item.get("url", "")
        content = item.get("content", "")[:300]
        results.append(f"{i}. **{title}**\n   {content}...\n   🔗 {url}\n")
    
    return "\n".join(results) if results else "No search results found."


def _search_with_duckduckgo(query: str) -> str:
    """Search using DuckDuckGo (fallback, free)."""
    search_tool = DuckDuckGoSearchRun()
    results = search_tool.invoke(query)
    return results if results else "No search results found."


@tool
def web_search(query: str) -> str:
    """Search the web for real-time information.
    
    Uses Tavily API (if configured) for superior AI-optimized results,
    or falls back to DuckDuckGo for free searches.
    
    Args:
        query: The search query string.
        
    Returns:
        Search results as a formatted string.
    """
    try:
        provider = _get_search_provider()
        
        if provider == "tavily":
            return _search_with_tavily(query)
        else:
            return _search_with_duckduckgo(query)
            
    except Exception as e:
        # Fallback to DuckDuckGo if Tavily fails
        try:
            return _search_with_duckduckgo(query)
        except Exception as fallback_error:
            return f"Search error: {str(e)} | Fallback error: {str(fallback_error)}"


@tool
def file_writer(content: str, filename: str) -> str:
    """Write content to a file in the data directory.
    
    Args:
        content: The text content to write to the file.
        filename: The name of the file (will be saved in ./data directory).
        
    Returns:
        Confirmation message with the file path.
    """
    try:
        safe_filename = os.path.basename(filename)
        filepath = os.path.join(DATA_DIR, safe_filename)
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        
        return f"File saved to data/{safe_filename}"
    except Exception as e:
        return f"File write error: {str(e)}"


@tool
def python_repl(code: str) -> str:
    """Execute Python code inside a sandboxed container.

    IMPORTANT: To persist files, write only to './data/' directory.
    Example: plt.savefig('./data/chart.png')
    """
    return run_python_sandboxed(code)


from app.tools.video_ops import get_youtube_transcript
from app.tools.github_ops import analyze_repo
from app.tools.image_ops import generate_image
from app.tools.vision_ops import analyze_image
from app.tools.browser_ops import browse_website


def get_tools() -> List:
    """Return a list of all available tools."""
    return [
        web_search, 
        file_writer, 
        python_repl, 
        get_youtube_transcript, 
        analyze_repo, 
        generate_image, 
        analyze_image,
        browse_website
    ]
