import os
import uuid
from typing import Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver

from app.agent.graph import workflow
from app.agent.state import AgentState
from app.tools.speech_ops import generate_audio


# Create upload directory
UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for persistent SQLite memory."""
    os.makedirs("data", exist_ok=True)
    
    async with AsyncSqliteSaver.from_conn_string("data/memory.db") as checkpointer:
        app.state.agent = workflow.compile(checkpointer=checkpointer)
        print("✅ Permanent Memory Loaded! (SQLite)")
        yield
    
    print("🛑 Memory Connection Closed.")


app = FastAPI(
    title="Nabd (نبض) - Autonomous AI Agent",
    description="A high-performance autonomous agent that plans, executes, and delivers results.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RunRequest(BaseModel):
    prompt: str
    thread_id: str = "default_user"
    agent_mode: str = "general"
    image_path: Optional[str] = None


class SpeakRequest(BaseModel):
    text: str
    voice: str = "ar-SA-HamidNeural"


class SpeakResponse(BaseModel):
    audio_url: str


class UploadResponse(BaseModel):
    success: bool
    image_path: str
    filename: str


class RunResponse(BaseModel):
    success: bool
    result: str
    plan: list[str]
    steps_executed: int


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/upload", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file for vision analysis."""
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )
    
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    unique_filename = f"image_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        # Save file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        return UploadResponse(
            success=True,
            image_path=file_path,
            filename=unique_filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")


@app.post("/run", response_model=RunResponse)
async def run_agent(run_request: RunRequest, request: Request):
    """Execute the autonomous agent with the given prompt."""
    
    if not run_request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    groq_key = os.getenv("GROQ_API_KEY")
    
    if not groq_key:
        raise HTTPException(
            status_code=500, 
            detail="GROQ_API_KEY not configured. Please set the API key."
        )
    
    try:
        # Access the compiled agent from app state
        agent_graph = request.app.state.agent
        
        # Build prompt with image context if provided
        prompt = run_request.prompt
        if run_request.image_path:
            prompt = f"{prompt}\n\n[Image attached: {run_request.image_path}]"
        
        initial_state: AgentState = {
            "messages": [HumanMessage(content=prompt)],
            "plan": [],
            "current_step": "",
            "current_step_index": 0,
            "tools_output": {},
            "final_report": "",
            "review_feedback": "",
            "is_complete": False,
            "agent_mode": run_request.agent_mode,
            "image_path": run_request.image_path
        }
        
        config = {"configurable": {"thread_id": run_request.thread_id}}
        final_state = await agent_graph.ainvoke(initial_state, config=config)
        
        return RunResponse(
            success=True,
            result=final_state.get("final_report", "No report generated"),
            plan=final_state.get("plan", []),
            steps_executed=final_state.get("current_step_index", 0) + 1
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution error: {str(e)}")


@app.post("/speak", response_model=SpeakResponse)
async def speak_text(request: SpeakRequest):
    """Convert text to speech using edge-tts."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    try:
        audio_url = await generate_audio(request.text, request.voice)
        return SpeakResponse(audio_url=audio_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


os.makedirs("static", exist_ok=True)
os.makedirs("data", exist_ok=True)
app.mount("/files", StaticFiles(directory="data"), name="files")
app.mount("/static", StaticFiles(directory="static"), name="static_files")
app.mount("/", StaticFiles(directory="static", html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
