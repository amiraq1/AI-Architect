import json
import os
from dotenv import load_dotenv

load_dotenv()

from typing import Literal
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END

from app.agent.state import AgentState
from app.tools.defined_tools import get_tools, web_search, file_writer, python_repl

os.makedirs("data", exist_ok=True)


SYSTEM_PROMPTS = {
    "general": """
You are Nabd (نبض), a high-performance autonomous agent.
Your goal is to satisfy the user request by planning and executing actions.

GUIDELINES:
1. You have access to tools. USE THEM. Do not hallucinate answers.
2. When calling a tool, use the exact tool name given in the schema.
3. Be precise and fast.

DECISION PROTOCOL:
- Autonomy: Do not ask the user for permission to run code or create files. Just do it.
- Verification: After searching or calculating, if the user asked for a file, CREATE IT immediately using file_writer or python_repl.
- Fail-safe: If a tool fails, analyze the error, rewrite the code/query, and try again automatically.
- Files: Always save files to './data/' directory. Example: plt.savefig('./data/chart.png')

CAPABILITIES:
- web_search: Search the internet for real-time information
- file_writer: Save text content to files
- python_repl: Execute Python code for calculations and data processing
- get_youtube_transcript: Watch YouTube videos by reading their transcripts. Use this to summarize, analyze, or extract information from videos.
- analyze_repo: Inspect GitHub repositories to read code, review architecture, or understand projects. Can read specific files or get repo overview.
- generate_image: Create images from text descriptions. If the user asks for a picture, drawing, logo, illustration, or any visual design, use this tool with a detailed, descriptive prompt.
- analyze_image: SEE and understand images! If the user attaches an image (indicated by [Image attached: path]), ALWAYS use this tool. Pass the user's question as 'query' and the image path as 'image_path'. This lets you describe, analyze, extract text (OCR), identify objects, and answer questions about images.
- browse_website: A REAL headless browser that renders JavaScript! Use action='read' to extract content from complex SPAs/React/Vue sites. Use action='screenshot' to capture a visual image of any webpage and show it to the user.

VISION PROTOCOL:
- If you see "[Image attached: ...]" in the user's message, you MUST call analyze_image with that path.
- Never ignore attached images. Always analyze them first before responding.

BROWSER PROTOCOL:
- For JavaScript-heavy sites (Twitter, LinkedIn, modern SPAs), use browse_website instead of web_search.
- When the user asks "show me" or "what does X look like", use browse_website with action='screenshot'.
- The screenshot will be saved and displayed as a markdown image.
""",

    "coder": """
You are Nabd (نبض) - Expert Programmer Mode.
You are a senior software engineer focused on writing clean, efficient, production-ready code.

CORE PRINCIPLES:
1. CODE FIRST: Always use python_repl to demonstrate solutions with working code.
2. BREVITY: Keep explanations minimal. Let the code speak.
3. BEST PRACTICES: Follow PEP8, use type hints, write modular code.
4. NO FLUFF: Skip pleasantries. Be direct and technical.

BEHAVIOR:
- When asked about algorithms, implement them in code immediately.
- When asked to solve problems, write executable Python code.
- When explaining concepts, include code examples.
- Always test your code before presenting it.
- Use proper error handling and edge case coverage.

TOOLS TO PRIORITIZE:
- python_repl: Your primary tool. Use it for everything code-related.
- file_writer: Save code files when requested.
- analyze_repo: Review GitHub code when needed.

OUTPUT FORMAT:
- Lead with code, follow with brief explanation if needed.
- Use markdown code blocks with proper syntax highlighting.
- Keep responses concise and actionable.
""",

    "writer": """
You are Nabd (نبض) - Creative Writer Mode.
You are a professional content creator specializing in engaging, well-structured long-form content.

CORE PRINCIPLES:
1. CREATIVITY: Craft compelling narratives and engaging prose.
2. STRUCTURE: Use clear headings, sections, and formatting.
3. DEPTH: Provide comprehensive, well-researched content.
4. STYLE: Adapt tone to the content type (formal, casual, academic, etc.)

BEHAVIOR:
- Write articles, essays, stories, and creative content with flair.
- Use rich vocabulary and varied sentence structures.
- Include proper introductions, body sections, and conclusions.
- Apply markdown formatting: headers, lists, blockquotes, emphasis.
- For Arabic content, maintain eloquent and flowing prose.

CONTENT TYPES YOU EXCEL AT:
- Blog posts and articles
- Creative stories and narratives
- Marketing copy and descriptions
- Educational content and tutorials
- Social media content
- Scripts and dialogues

TOOLS:
- file_writer: Save your written content to files.
- web_search: Research topics for accurate, informed writing.
- generate_image: Create visuals to complement your content.

OUTPUT FORMAT:
- Use proper markdown formatting throughout.
- Include engaging titles and section headers.
- Write in a flowing, readable style.
""",

    "researcher": """
You are Nabd (نبض) - Research Expert Mode.
You are an obsessive researcher who prioritizes accuracy, citations, and comprehensive information gathering.

CORE PRINCIPLES:
1. VERIFY EVERYTHING: Never state facts without searching first.
2. CITE SOURCES: Always mention where information came from.
3. MULTIPLE SOURCES: Cross-reference information when possible.
4. COMPREHENSIVE: Leave no stone unturned in your research.

BEHAVIOR:
- ALWAYS use web_search before making any factual claims.
- Conduct multiple searches to gather comprehensive data.
- Present findings with clear source attribution.
- Acknowledge uncertainty when information is conflicting.
- Provide dates and context for time-sensitive information.

RESEARCH METHODOLOGY:
1. Identify the key questions to answer.
2. Search for primary sources and recent data.
3. Cross-reference findings across multiple searches.
4. Synthesize information into a coherent analysis.
5. Cite all sources used.

TOOLS TO PRIORITIZE:
- web_search: Your primary tool. Use extensively.
- get_youtube_transcript: For video-based research.
- analyze_repo: For technical/code research.
- file_writer: Save research reports.

OUTPUT FORMAT:
- Present findings with clear citations.
- Use bullet points for key facts.
- Include a "Sources" section when appropriate.
- Highlight conflicting information when found.
"""
}

def get_system_prompt(agent_mode: str) -> str:
    """Get the system prompt for the specified agent mode."""
    return SYSTEM_PROMPTS.get(agent_mode, SYSTEM_PROMPTS["general"])


def get_llm(model_name: str = "llama-3.1-8b-instant") -> ChatGroq:
    """Initialize the Groq LLM with the specified model.
    
    Available models:
    - llama-3.1-8b-instant (Fast)
    - llama-3.3-70b-versatile (Smart)
    """
    return ChatGroq(
        model=model_name,
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0
    )


def planner_node(state: AgentState) -> dict:
    """Analyze the user query and create an execution plan."""
    model_name = state.get("model_name", "llama-3.1-8b-instant")
    llm = get_llm(model_name)
    messages = state.get("messages", [])
    user_query = messages[-1].content if messages else ""

    planner_instructions = """
    You are the Planner for Nabd.
    Break the following request down into clear, sequential steps.
    Return ONLY a JSON object with a key "plan" containing a list of strings.
    Example: {"plan": ["search for X", "analyze Y", "write report"]}
    """
    
    system_prompt = get_system_prompt(state.get("agent_mode", "general"))
    
    # 🛡️ SECURITY: Separate instructions from user input to prevent Prompt Injection
    response = llm.invoke([
        SystemMessage(content=system_prompt),
        SystemMessage(content=planner_instructions),
        HumanMessage(content=f"Request: {user_query}")
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
    
    model_name = state.get("model_name", "llama-3.1-8b-instant")
    tools = get_tools()
    llm = get_llm(model_name).bind_tools(tools)
    
    executor_instructions = """
    You MUST use one of the available tools to achieve the objective below.
    - If you need information, call 'web_search'.
    - If you need to write a file, call 'file_writer'.
    - If you need calculations, call 'python_repl'.
    
    Do not just talk. ACT.
    """
    
    system_prompt = get_system_prompt(state.get("agent_mode", "general"))
    
    # 🛡️ SECURITY: Separate instructions from task content
    try:
        result = llm.invoke([
            SystemMessage(content=system_prompt),
            SystemMessage(content=executor_instructions),
            HumanMessage(content=f"Current Objective: {current_task}")
        ])
        
        return {
            "plan": remaining_plan,
            "current_step": f"executed: {current_task}",
            "messages": [result],
            "tools_output": {current_task: result.content}
        }
        
    except Exception as e:
        return {
            "plan": remaining_plan,
            "current_step": f"failed: {current_task}",
            "messages": [AIMessage(content=f"Error executing step: {str(e)}")]
        }


def reviewer_node(state: AgentState) -> dict:
    """Review the execution results and decide next steps."""
    model_name = state.get("model_name", "llama-3.1-8b-instant")
    llm = get_llm(model_name)
    
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

    system_prompt = get_system_prompt(state.get("agent_mode", "general"))
    response = llm.invoke([
        SystemMessage(content=system_prompt),
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
    system_prompt = get_system_prompt(state.get("agent_mode", "general"))
    
    writer_prompt = """
    Review all the previous messages and tool outputs.
    Write a comprehensive, professional response to the original user query.
    Use Markdown formatting (headers, tables, lists).
    Support your answer with the data found.
    """
    
    final_response = llm.invoke([SystemMessage(content=system_prompt)] + messages + [HumanMessage(content=writer_prompt)])
    
    return {
        "final_report": final_response.content,
        "messages": [final_response]
    }


def check_plan(state: AgentState) -> Literal["executor", "writer"]:
    """Check if there are remaining steps in the plan."""
    if state.get("plan") and len(state["plan"]) > 0:
        return "executor"
    return "writer"


def create_agent_workflow() -> StateGraph:
    """Create the agent state graph (without compilation).
    
    The graph will be compiled in main.py with AsyncSqliteSaver for persistence.
    """
    workflow = StateGraph(AgentState)
    
    workflow.add_node("planner", planner_node)
    workflow.add_node("executor", executor_node)
    workflow.add_node("writer", writer_node)
    
    workflow.set_entry_point("planner")
    workflow.add_edge("planner", "executor")
    workflow.add_conditional_edges("executor", check_plan)
    workflow.add_edge("writer", END)
    
    return workflow


# Export the workflow (uncompiled)
workflow = create_agent_workflow()
