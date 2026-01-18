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
    if not messages:
        return {"plan": [], "current_step": "No query provided", "is_complete": True}
    
    user_query = messages[-1].content if messages else ""
    
    planning_prompt = f"""Analyze this user request and create a step-by-step execution plan.

User Request: {user_query}

Create a plan with 2-5 actionable steps. Each step should be clear and specific.
Available actions: search (web search), compute (Python code), write (save to file), analyze (review data).

Respond in this exact JSON format:
{{"plan": ["step 1 description", "step 2 description", ...]}}

Only respond with the JSON, no other text."""

    response = llm.invoke([
        SystemMessage(content=NABD_SYSTEM_PROMPT),
        HumanMessage(content=planning_prompt)
    ])
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        plan_data = json.loads(content)
        plan = plan_data.get("plan", [])
    except (json.JSONDecodeError, KeyError):
        plan = ["Search for relevant information", "Analyze findings", "Compile report"]
    
    return {
        "plan": plan,
        "current_step": plan[0] if plan else "Complete",
        "current_step_index": 0,
        "tools_output": {},
        "is_complete": False
    }


def executor_node(state: AgentState) -> dict:
    """Execute the current step using appropriate tools."""
    llm = get_llm()
    
    current_step = state.get("current_step", "")
    plan = state.get("plan", [])
    tools_output = state.get("tools_output", {}).copy()
    messages = state.get("messages", [])
    user_query = messages[-1].content if messages else ""
    
    if not current_step or current_step == "Complete":
        return {"tools_output": tools_output}
    
    execution_prompt = f"""You are executing this step: {current_step}

Original user request: {user_query}
Full plan: {plan}
Previous outputs: {json.dumps(tools_output, indent=2)}

Decide which tool to use and provide the exact parameters.
Available tools:
- web_search(query): Search the internet
- python_repl(code): Execute Python code
- file_writer(content, filename): Save content to a file

Respond in this exact JSON format:
{{"tool": "tool_name", "params": {{"param1": "value1"}}}}

Only respond with the JSON, no other text."""

    response = llm.invoke([
        SystemMessage(content=NABD_SYSTEM_PROMPT),
        HumanMessage(content=execution_prompt)
    ])
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        tool_decision = json.loads(content)
        tool_name = tool_decision.get("tool", "")
        params = tool_decision.get("params", {})
        
        tool_result = ""
        if tool_name == "web_search":
            tool_result = web_search.invoke({"query": params.get("query", current_step)})
        elif tool_name == "python_repl":
            tool_result = python_repl.invoke({"code": params.get("code", "print('No code provided')")})
        elif tool_name == "file_writer":
            tool_result = file_writer.invoke({
                "content": params.get("content", ""),
                "filename": params.get("filename", "output.txt")
            })
        else:
            tool_result = web_search.invoke({"query": current_step})
        
        tools_output[current_step] = {
            "tool": tool_name,
            "result": tool_result
        }
        
    except (json.JSONDecodeError, KeyError) as e:
        tool_result = web_search.invoke({"query": current_step})
        tools_output[current_step] = {
            "tool": "web_search",
            "result": tool_result,
            "note": f"Fallback due to: {str(e)}"
        }
    
    return {"tools_output": tools_output}


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
    plan = state.get("plan", [])
    tools_output = state.get("tools_output", {})
    user_query = messages[-1].content if messages else ""
    
    writing_prompt = f"""Compile a comprehensive final report based on the gathered information.

Original Request: {user_query}
Execution Plan: {plan}
Gathered Data: {json.dumps(tools_output, indent=2)}

Write a well-structured Markdown report that:
1. Directly addresses the user's original request
2. Synthesizes all gathered information
3. Provides clear conclusions and actionable insights
4. Is professional and easy to read

Write the complete report now."""

    response = llm.invoke([
        SystemMessage(content=NABD_SYSTEM_PROMPT),
        HumanMessage(content=writing_prompt)
    ])
    
    final_report = response.content
    
    return {
        "final_report": final_report,
        "messages": [AIMessage(content=final_report)]
    }


def should_continue(state: AgentState) -> Literal["executor", "writer"]:
    """Determine if we should continue executing or write the final report."""
    if state.get("is_complete", False):
        return "writer"
    return "executor"


def create_agent_graph() -> StateGraph:
    """Create and compile the agent state graph."""
    workflow = StateGraph(AgentState)
    
    workflow.add_node("planner", planner_node)
    workflow.add_node("executor", executor_node)
    workflow.add_node("reviewer", reviewer_node)
    workflow.add_node("writer", writer_node)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "executor")
    workflow.add_edge("executor", "reviewer")
    workflow.add_conditional_edges(
        "reviewer",
        should_continue,
        {
            "executor": "executor",
            "writer": "writer"
        }
    )
    workflow.add_edge("writer", END)
    
    return workflow.compile()
