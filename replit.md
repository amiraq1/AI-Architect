# Nabd (نبض) - Multi-Agent AI Platform

## Overview
Nabd is a production-ready multi-agent AI platform built with Python, FastAPI, and LangGraph. It features specialized expert modes (General, Coder, Writer, Researcher) with distinct personalities and behaviors. The agent uses a state machine architecture that plans, executes, reviews, and produces final outputs for complex tasks.

## Architecture
The agent operates in a loop: **Planner → Executor → Reviewer → Writer**

### Expert Modes
- **مساعد عام (General)**: Standard helpful assistant for diverse tasks
- **مبرمج (Coder)**: Focuses on code, brevity, and best practices. Prioritizes python_repl
- **كاتب محتوى (Writer)**: Focuses on creativity, long-form content, and formatting
- **باحث (Researcher)**: Obsessive about citations and using web_search tools

### Core Components
- **State (`app/agent/state.py`)**: Defines `AgentState` with message history, plan steps, tool outputs, agent_mode, and final report
- **Graph (`app/agent/graph.py`)**: LangGraph StateGraph with nodes for planning, execution, review, and writing. Includes mode-specific system prompts
- **Tools (`app/tools/defined_tools.py`)**: Web search, file writer, Python REPL, YouTube transcript, GitHub analysis, image generation
- **API (`app/main.py`)**: FastAPI endpoint exposing POST `/run` with agent_mode parameter
- **Frontend (`static/index.html`)**: Modern cyberpunk-themed chat interface with expert selection sidebar

## Tech Stack
- Python 3.11
- FastAPI (async web framework)
- LangGraph (StateGraph architecture)
- LangChain + Groq (llama-3.3-70b-versatile)
- DuckDuckGo Search (free, no API key needed)
- Pydantic v2 (data validation)
- TailwindCSS, Alpine.js, Marked.js (frontend)

## Frontend Features
- Cyberpunk/Modern Clean theme with dark background and glassmorphism effects
- Neon cyan/electric blue accents with pulse animations
- Arabic RTL support with Cairo font
- Real-time markdown rendering (tables, code blocks, lists)
- Interactive chat interface with thinking animation
- Quick action buttons for common tasks
- **Expert Selection Sidebar**: Collapsible sidebar for choosing agent mode
- **Active Expert Badge**: Shows current expert mode in header and responses

## API Endpoints
- `GET /` - Serves the web interface
- `GET /api/health` - Health check endpoint
- `POST /run` - Execute agent with `{"prompt": "...", "agent_mode": "general|coder|writer|researcher"}`
- `POST /speak` - Text-to-speech endpoint

## Required Environment Variables
- `GROQ_API_KEY` - Groq API key for Llama 3 (get from console.groq.com)

## Project Structure
```
app/
├── __init__.py
├── main.py           # FastAPI entry point + static file serving
├── agent/
│   ├── __init__.py
│   ├── state.py      # AgentState definition with agent_mode
│   └── graph.py      # StateGraph nodes, mode-specific prompts
└── tools/
    ├── __init__.py
    ├── defined_tools.py  # Tool registry
    ├── image_ops.py      # Image generation (Pollinations AI)
    ├── video_ops.py      # YouTube transcript tool
    ├── github_ops.py     # GitHub repo analysis
    └── speech_ops.py     # Text-to-speech
static/
└── index.html        # Cyberpunk chat interface with sidebar
data/                 # Output directory for file_writer
requirements.txt
```

## Running Locally
```bash
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

## Recent Changes
- 2026-01-19: Transformed into Multi-Agent Platform with 4 expert modes (General, Coder, Writer, Researcher)
- 2026-01-19: Added expert selection sidebar with RTL Arabic support
- 2026-01-19: Added image generation capability using Pollinations AI
- 2026-01-19: Updated langchain-community to v0.4.1 for security
- 2026-01-18: Added modern cyberpunk frontend with Arabic support, glassmorphism design, and markdown rendering
- 2026-01-18: Initial MVP implementation with planner, executor, reviewer, and writer nodes
