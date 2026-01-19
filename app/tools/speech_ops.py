import os
import uuid
import edge_tts
import anyio

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static")


async def generate_audio(text: str, voice: str = "ar-SA-HamidNeural") -> str:
    """Generate speech audio from text using edge-tts.
    
    Args:
        text: The text to convert to speech.
        voice: The voice to use (default: ar-SA-HamidNeural for Arabic).
        
    Returns:
        The relative URL path to the generated audio file.
    """
    os.makedirs(STATIC_DIR, exist_ok=True)
    
    filename = f"speech_{uuid.uuid4().hex[:8]}.mp3"
    filepath = os.path.join(STATIC_DIR, filename)
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filepath)
    
    return f"/static/{filename}"
