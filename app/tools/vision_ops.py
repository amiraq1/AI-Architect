import os
import base64
from langchain_core.tools import tool
from groq import Groq


@tool
def analyze_image(query: str, image_path: str) -> str:
    """Analyze an image using Llama 3.2 Vision model.
    
    Use this tool when the user attaches an image and asks questions about it.
    Pass the user's question and the image path to analyze the visual content.
    
    Args:
        query: The user's question about the image.
        image_path: The local file path to the image (e.g., static/uploads/image.jpg).
        
    Returns:
        A detailed description or answer based on the image content.
    """
    try:
        # Validate image path
        if not image_path or not os.path.exists(image_path):
            return f"Error: Image file not found at path: {image_path}"
        
        # Read and encode image to base64
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode("utf-8")
        
        # Determine image MIME type
        ext = os.path.splitext(image_path)[1].lower()
        mime_types = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp"
        }
        mime_type = mime_types.get(ext, "image/jpeg")
        
        # Initialize Groq client
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
        # Call Llama 3.2 Vision model
        response = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": query},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:{mime_type};base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1024,
            temperature=0.7
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return f"Vision analysis error: {str(e)}"
