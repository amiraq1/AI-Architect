from typing import TypedDict, Annotated, List, Dict, Any, Optional
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    plan: List[str]
    current_step: str
    current_step_index: int
    tools_output: Dict[str, Any]
    final_report: str
    review_feedback: str
    is_complete: bool
    agent_mode: str
    image_path: Optional[str]

