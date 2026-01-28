import os
from typing import List
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from app.sandbox import run_python_sandboxed


DATA_DIR = "./data"
os.makedirs(DATA_DIR, exist_ok=True)


@tool
def web_search(query: str) -> str:
    """Search the web for real-time information using DuckDuckGo.
    
    Args:
        query: The search query string.
        
    Returns:
        Search results as a formatted string.
    """
    try:
        search_tool = DuckDuckGoSearchRun()
        results = search_tool.invoke(query)
        
        if not results:
            return "No search results found."
        
        return results
    except Exception as e:
        return f"Search error: {str(e)}"


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
