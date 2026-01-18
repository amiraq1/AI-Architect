import json
import os
from typing import Literal
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END

from app.agent.state import AgentState
from app.tools.defined_tools import get_tools, web_search, file_writer, python_repl


NABD_SYSTEM_PROMPT = """You are Nabd (نبض), a high-performance autonomous agent. You do not just chat; you act. You are precise, fast, and results-oriented. Always plan before executing. If a tool fails, self-correct and retry.

Your capabilities include:
1. web_search: Search the internet for real-time information
2. file_writer: Save content to files
3. python_repl: Execute Python code for calculations and data processing

Always provide structured, actionable responses."""


def get_llm() -> ChatGroq:
    """Initialize the Groq LLM with Llama 3.3."""
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0
    )


def planner_node(state: AgentState) -> dict:
    """Analyze the user query and create an execution plan."""
    llm = get_llm()
    messages = state.get("messages", [])
    user_query = messages[-1].content if messages else ""

    planner_prompt = f"""
    You are the Planner for Nabd.
    User Query: "{user_query}"
    
    Break this request down into clear, sequential steps.
    Return ONLY a JSON object with a key "plan" containing a list of strings.
    Example: {{"plan": ["search for X", "analyze Y", "write report"]}}
    """
    
    response = llm.invoke([
        SystemMessage(content=NABD_SYSTEM_PROMPT),
        HumanMessage(content=planner_prompt)
    ])
    
    try:
        content = response.content.strip()
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
            
        plan_data = json.loads(content)
        plan = plan_data.get("plan", [])
    except Exception as e:
        print(f"Planning Error: {e}")
        plan = ["web_search based on query", "write final summary"]

    return {
        "plan": plan, 
        "current_step": plan[0] if plan else "Complete",
        "current_step_index": 0,
        "tools_output": {},
        "is_complete": False,
        "messages": [AIMessage(content=f"Plan generated: {plan}")]
    }


def executor_node(state: AgentState) -> dict:
    """Execute the current step using appropriate tools."""
    plan = state.get("plan", [])
    if not plan:
        return {"current_step": "done"}

    current_task = plan[0]
    remaining_plan = plan[1:]
    
    tools = get_tools()
    llm = get_llm().bind_tools(tools)
    
    executor_prompt = f"""
    Current Task: {current_task}
    Execute this task using the available tools. 
    If you need to search, use web_search. 
    If you need to calculate/code, use python_repl.
    """
    
    result = llm.invoke([
        SystemMessage(content=NABD_SYSTEM_PROMPT),
        HumanMessage(content=executor_prompt)
    ])
    
    return {
        "plan": remaining_plan,
        "current_step": f"executed: {current_task}",
        "messages": [result],
        "tools_output": {current_task: result.content}
    }


def reviewer_node(state: AgentState) -> dict:
    """Review the execution results and decide next steps."""
    llm = get_llm()
    
    plan = state.get("plan", [])
    current_step_index = state.get("current_step_index", 0)
    tools_output = state.get("tools_output", {})
    messages = state.get("messages", [])
    user_query = messages[-1].content if messages else ""
    
    review_prompt = f"""Review the execution progress for this task.

Original request: {user_query}
Full plan: {plan}
Current step index: {current_step_index}
Completed outputs: {json.dumps(tools_output, indent=2)}

Evaluate:
1. Is the current step's output sufficient and relevant?
2. Should we proceed to the next step or retry with improvements?
3. Do we have enough information to write the final report?

Respond in this exact JSON format:
{{"decision": "next_step|retry|complete", "feedback": "brief explanation"}}

Only respond with the JSON, no other text."""

    response = llm.invoke([
        SystemMessage(content=NABD_SYSTEM_PROMPT),
        HumanMessage(content=review_prompt)
    ])
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        review_data = json.loads(content)
        decision = review_data.get("decision", "next_step")
        feedback = review_data.get("feedback", "")
    except (json.JSONDecodeError, KeyError):
        decision = "next_step"
        feedback = "Proceeding to next step"
    
    is_last_step = current_step_index >= len(plan) - 1
    
    if decision == "complete":
        return {
            "is_complete": True,
            "review_feedback": feedback,
            "current_step": "Complete"
        }
    elif decision == "retry":
        return {
            "review_feedback": feedback,
            "is_complete": False
        }
    elif is_last_step:
        return {
            "is_complete": True,
            "review_feedback": feedback,
            "current_step": "Complete"
        }
    else:
        next_index = current_step_index + 1
        next_step = plan[next_index] if next_index < len(plan) else "Complete"
        return {
            "current_step_index": next_index,
            "current_step": next_step,
            "review_feedback": feedback,
            "is_complete": False
        }


def writer_node(state: AgentState) -> dict:
    """Compile all gathered data into a final report."""
    llm = get_llm()
    messages = state.get("messages", [])
    
    writer_prompt = """
    Review all the previous messages and tool outputs.
    Write a comprehensive, professional response to the original user query.
    Use Markdown formatting (headers, tables, lists).
    Support your answer with the data found.
    """
    
    final_response = llm.invoke(messages + [HumanMessage(content=writer_prompt)])
    
    return {
        "final_report": final_response.content,
        "messages": [final_response]
    }


def check_plan(state: AgentState) -> Literal["executor", "writer"]:
    """Check if there are remaining steps in the plan."""
    if state.get("plan") and len(state["plan"]) > 0:
        return "executor"
    return "writer"


def create_agent_graph() -> StateGraph:
    """Create and compile the agent state graph."""
    workflow = StateGraph(AgentState)
    
    workflow.add_node("planner", planner_node)
    workflow.add_node("executor", executor_node)
    workflow.add_node("writer", writer_node)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "executor")
    workflow.add_conditional_edges("executor", check_plan)
    workflow.add_edge("writer", END)
    
    return workflow.compile()
