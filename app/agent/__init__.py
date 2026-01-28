from app.agent.state import AgentState
from app.agent.graph import workflow, create_agent_workflow


def build_agent_app(checkpointer=None):
    """Compile the workflow with an optional checkpointer.
    
    This function is called from main.py to create the agent
    with memory persistence support.
    """
    return workflow.compile(checkpointer=checkpointer)


# تجميع التطبيق الافتراضي (بدون checkpointer)
agent_app = build_agent_app()


__all__ = [
    "AgentState", 
    "workflow", 
    "create_agent_workflow",
    "build_agent_app",
    "agent_app"
]
