import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

from app.agent.graph import create_agent_graph
from app.agent.state import AgentState


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


class RunResponse(BaseModel):
    success: bool
    result: str
    plan: list[str]
    steps_executed: int


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "Nabd (نبض)",
        "status": "operational",
        "description": "Autonomous AI Agent - Ready to execute tasks"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/run", response_model=RunResponse)
async def run_agent(request: RunRequest):
    """Execute the autonomous agent with the given prompt."""
    
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    openai_key = os.getenv("OPENAI_API_KEY")
    tavily_key = os.getenv("TAVILY_API_KEY")
    
    if not openai_key:
        raise HTTPException(
            status_code=500, 
            detail="OPENAI_API_KEY not configured. Please set the API key."
        )
    
    if not tavily_key:
        raise HTTPException(
            status_code=500,
            detail="TAVILY_API_KEY not configured. Please set the API key."
        )
    
    try:
        agent = create_agent_graph()
        
        initial_state: AgentState = {
            "messages": [HumanMessage(content=request.prompt)],
            "plan": [],
            "current_step": "",
            "current_step_index": 0,
            "tools_output": {},
            "final_report": "",
            "review_feedback": "",
            "is_complete": False
        }
        
        final_state = await agent.ainvoke(initial_state)
        
        return RunResponse(
            success=True,
            result=final_state.get("final_report", "No report generated"),
            plan=final_state.get("plan", []),
            steps_executed=final_state.get("current_step_index", 0) + 1
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent execution error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
