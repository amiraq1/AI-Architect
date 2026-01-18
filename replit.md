# Nabd (نبض) - Autonomous AI Agent

## Overview
Nabd is a production-ready MVP for an autonomous AI agent built with Python, FastAPI, and LangGraph. It uses a state machine architecture that plans, executes, reviews, and produces final outputs for complex tasks.

## Architecture
The agent operates in a loop: **Planner → Executor → Reviewer → Writer**

### Core Components
- **State (`app/agent/state.py`)**: Defines `AgentState` with message history, plan steps, tool outputs, and final report
- **Graph (`app/agent/graph.py`)**: LangGraph StateGraph with nodes for planning, execution, review, and writing
- **Tools (`app/tools/defined_tools.py`)**: Web search (Tavily), file writer, and Python REPL
- **API (`app/main.py`)**: FastAPI endpoint exposing POST `/run`

## Tech Stack
- Python 3.11
- FastAPI (async web framework)
- LangGraph (StateGraph architecture)
- LangChain + Google Gemini (gemini-1.5-flash)
- DuckDuckGo Search (free, no API key needed)
- Pydantic v2 (data validation)

## API Endpoints
- `GET /` - Health check and status
- `GET /health` - Simple health check
- `POST /run` - Execute agent with `{"prompt": "your task..."}`

## Required Environment Variables
- `GOOGLE_API_KEY` - Google API key for Gemini (get from Google AI Studio)

## Project Structure
```
app/
├── __init__.py
├── main.py           # FastAPI entry point
├── agent/
│   ├── __init__.py
│   ├── state.py      # AgentState definition
│   └── graph.py      # StateGraph nodes and logic
└── tools/
    ├── __init__.py
    └── defined_tools.py  # Tool implementations
data/                 # Output directory for file_writer
requirements.txt
```

## Running Locally
```bash
uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload
```

## Recent Changes
- 2026-01-18: Initial MVP implementation with planner, executor, reviewer, and writer nodes
