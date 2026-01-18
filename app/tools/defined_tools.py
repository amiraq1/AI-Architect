import os
import sys
from io import StringIO
from typing import List
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun


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
        
        return f"Successfully wrote content to {filepath}"
    except Exception as e:
        return f"File write error: {str(e)}"


@tool
def python_repl(code: str) -> str:
    """Execute Python code safely for math and data processing.
    
    Args:
        code: The Python code to execute.
        
    Returns:
        The output or result of the code execution.
    """
    try:
        old_stdout = sys.stdout
        sys.stdout = StringIO()
        
        local_vars = {}
        
        exec(code, {"__builtins__": __builtins__}, local_vars)
        
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout
        
        if output:
            return output.strip()
        
        if local_vars:
            last_var = list(local_vars.values())[-1]
            if last_var is not None:
                return str(last_var)
        
        return "Code executed successfully (no output)"
    except Exception as e:
        sys.stdout = old_stdout
        return f"Execution error: {str(e)}"


def get_tools() -> List:
    """Return a list of all available tools."""
    return [web_search, file_writer, python_repl]
