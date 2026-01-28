import re
from langchain_core.tools import tool
from langchain_community.document_loaders import YoutubeLoader


def extract_video_id(url: str) -> str:
    """Extract video ID from various YouTube URL formats."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'([a-zA-Z0-9_-]{11})'
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return url


@tool
def get_youtube_transcript(video_url: str) -> str:
    """Get the transcript of a YouTube video to analyze its content.
    
    Args:
        video_url: The YouTube video URL or video ID.
        
    Returns:
        Video title and full transcript text, or an error message.
    """
    try:
        video_id = extract_video_id(video_url)
        full_url = f"https://www.youtube.com/watch?v={video_id}"
        
        loader = YoutubeLoader.from_youtube_url(
            full_url,
            add_video_info=True,
            language=["en", "ar", "auto"]
        )
        
        docs = loader.load()
        
        if not docs:
            return f"No transcript found for video: {video_url}. The video may not have captions available."
        
        doc = docs[0]
        title = doc.metadata.get("title", "Unknown Title")
        author = doc.metadata.get("author", "Unknown Author")
        transcript = doc.page_content
        
        return f"""Title: {title}
Author: {author}

Transcript:
{transcript}
"""
        
    except Exception:
        return "عذراً، لم أتمكن من قراءة الفيديو، هل الرابط صحيح؟"
