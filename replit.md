# Nabd (نبض) - Autonomous AI Agent

## Overview
Nabd is a production-ready MVP for an autonomous AI agent built with Python, FastAPI, and LangGraph. It uses a state machine architecture that plans, executes, reviews, and produces final outputs for complex tasks.

## Architecture
The agent operates in a loop: **Planner → Executor → Reviewer → Writer**

### Core Components
- **State (`app/agent/state.py`)**: Defines `AgentState` with message history, plan steps, tool outputs, and final report
- **Graph (`app/agent/graph.py`)**: LangGraph StateGraph with nodes for planning, execution, review, and writing
- **Tools (`app/tools/defined_tools.py`)**: Web search (DuckDuckGo), file writer, and Python REPL
- **API (`app/main.py`)**: FastAPI endpoint exposing POST `/run` and serving static files
- **Frontend (`static/index.html`)**: Modern cyberpunk-themed chat interface

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

## API Endpoints
- `GET /` - Serves the web interface
- `GET /api/health` - Health check endpoint
- `POST /run` - Execute agent with `{"prompt": "your task..."}`

## Required Environment Variables
- `GROQ_API_KEY` - Groq API key for Llama 3 (get from console.groq.com)

## Project Structure
```
app/
├── __init__.py
├── main.py           # FastAPI entry point + static file serving
├── agent/
│   ├── __init__.py
│   ├── state.py      # AgentState definition
│   └── graph.py      # StateGraph nodes and logic
└── tools/
    ├── __init__.py
    └── defined_tools.py  # Tool implementations
static/
└── index.html        # Cyberpunk chat interface
data/                 # Output directory for file_writer
requirements.txt
```

## Running Locally
```bash
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

## Recent Changes
- 2026-01-18: Added modern cyberpunk frontend with Arabic support, glassmorphism design, and markdown rendering
- 2026-01-18: Initial MVP implementation with planner, executor, reviewer, and writer nodes
