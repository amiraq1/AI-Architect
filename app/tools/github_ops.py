import os
import re
from langchain_core.tools import tool
from github import Github, GithubException


def extract_repo_name(url: str) -> str:
    """Extract owner/repo from various GitHub URL formats."""
    patterns = [
        r'github\.com[/:]([^/]+)/([^/\s\.]+)',
        r'^([^/]+)/([^/\s]+)$'
    ]
    for pattern in patterns:
        match = re.search(pattern, url.replace('.git', ''))
        if match:
            return f"{match.group(1)}/{match.group(2)}"
    return url


@tool
def analyze_repo(repo_url: str, specific_file: str = None) -> str:
    """Inspect a GitHub repository to understand its code and architecture.
    
    This is a READ-ONLY tool. Use it to:
    - Get an overview of a repository
    - Read specific files
    - Understand project structure
    
    Args:
        repo_url: The GitHub repository URL or "owner/repo" format.
        specific_file: Optional path to a specific file to read (e.g., "src/main.py").
        
    Returns:
        Repository overview or file content.
    """
    try:
        token = os.getenv("GITHUB_ACCESS_TOKEN")
        
        if token:
            g = Github(token)
        else:
            g = Github()
        
        repo_name = extract_repo_name(repo_url)
        
        try:
            repo = g.get_repo(repo_name)
        except GithubException as e:
            if e.status == 404:
                return f"Error: Repository '{repo_name}' not found. Make sure it exists and is public (or you have access)."
            raise
        
        if specific_file:
            try:
                file_content = repo.get_contents(specific_file)
                if file_content.encoding == "base64":
                    content = file_content.decoded_content.decode('utf-8')
                else:
                    content = file_content.content
                
                return f"""## File: {specific_file}

**Repository:** {repo.full_name}
**Size:** {file_content.size} bytes

### Content:
```
{content}
```
"""
            except GithubException as e:
                if e.status == 404:
                    return f"Error: File '{specific_file}' not found in repository."
                return f"Error reading file: {str(e)}"
        
        readme_content = "No README found."
        try:
            readme = repo.get_readme()
            readme_content = readme.decoded_content.decode('utf-8')[:2000]
            if len(readme.decoded_content) > 2000:
                readme_content += "\n\n... (truncated)"
        except GithubException:
            pass
        
        try:
            contents = repo.get_contents("")
            files_list = []
            for item in contents[:30]:
                icon = "📁" if item.type == "dir" else "📄"
                files_list.append(f"{icon} {item.path}")
            
            if len(contents) > 30:
                files_list.append(f"... and {len(contents) - 30} more items")
        except GithubException:
            files_list = ["Unable to list files"]
        
        return f"""## Repository: {repo.full_name}

**Description:** {repo.description or 'No description'}
**Stars:** {repo.stargazers_count} | **Forks:** {repo.forks_count}
**Language:** {repo.language or 'Unknown'}
**Last Updated:** {repo.updated_at.strftime('%Y-%m-%d')}

### Root Directory:
{chr(10).join(files_list)}

### README Preview:
{readme_content}
"""
        
    except GithubException as e:
        if e.status == 403 and 'rate limit' in str(e).lower():
            return "Error: GitHub API rate limit exceeded. Please set GITHUB_ACCESS_TOKEN for higher limits."
        return f"GitHub API error: {str(e)}"
    except Exception as e:
        return f"Error analyzing repository: {str(e)}"
