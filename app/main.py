import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

from app.agent.graph import create_agent_graph
from app.agent.state import AgentState
from app.tools.speech_ops import generate_audio


app = FastAPI(
    title="Nabd (نبض) - Autonomous AI Agent",
    description="A high-performance autonomous agent that plans, executes, and delivers results.",
    version="1.0.0"
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


class SpeakRequest(BaseModel):
    text: str
    voice: str = "ar-SA-HamidNeural"


class SpeakResponse(BaseModel):
    audio_url: str


class RunResponse(BaseModel):
    success: bool
    result: str
    plan: list[str]
    steps_executed: int


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/run", response_model=RunResponse)
async def run_agent(request: RunRequest):
    """Execute the autonomous agent with the given prompt."""
    
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    groq_key = os.getenv("GROQ_API_KEY")
    
    if not groq_key:
        raise HTTPException(
            status_code=500, 
            detail="GROQ_API_KEY not configured. Please set the API key."
        )
    
    try:
        agent_graph = create_agent_graph(request.agent_mode)
        
        initial_state: AgentState = {
            "messages": [HumanMessage(content=request.prompt)],
            "plan": [],
            "current_step": "",
            "current_step_index": 0,
            "tools_output": {},
            "final_report": "",
            "review_feedback": "",
            "is_complete": False,
            "agent_mode": request.agent_mode
        }
        
        config = {"configurable": {"thread_id": request.thread_id}}
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
