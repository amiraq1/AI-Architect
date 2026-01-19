import os
import uuid
import requests
from urllib.parse import quote_plus
from langchain_core.tools import tool


STATIC_DIR = "./static"
os.makedirs(STATIC_DIR, exist_ok=True)


@tool
def generate_image(prompt: str) -> str:
    """Generate an image based on a text description using AI.
    
    Args:
        prompt: A detailed description of the image to generate.
        
    Returns:
        Markdown image tag to display the generated image, or an error message.
    """
    try:
        encoded_prompt = quote_plus(prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"
        
        response = requests.get(image_url, timeout=60)
        
        if response.status_code == 200:
            filename = f"generated_{uuid.uuid4().hex[:8]}.jpg"
            filepath = os.path.join(STATIC_DIR, filename)
            
            with open(filepath, "wb") as f:
                f.write(response.content)
            
            return f"![Generated Image](/static/{filename})"
        else:
            return "Error: Failed to generate image."
            
    except Exception as e:
        return f"Error generating image: {str(e)}"
