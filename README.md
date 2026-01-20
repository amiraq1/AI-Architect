<div align="center">

# 🫀 نبض | Nabd

### Autonomous AI Agent Platform

<p align="center">
  <strong>وكيل ذكاء اصطناعي مستقل يخطط وينفذ ويراجع المهام تلقائياً</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12+-blue?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-green?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-2.0+-purple?style=for-the-badge&logo=langchain&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-Llama_3.3-orange?style=for-the-badge&logo=meta&logoColor=white" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-tools">Tools</a> •
  <a href="#-api">API</a>
</p>

---

</div>

## ✨ Features

### 🤖 Multi-Agent System
Switch between **4 specialized AI experts** with distinct personalities:

| Expert | Mode | Description |
|--------|------|-------------|
| 🤖 **مساعد عام** | `general` | General-purpose assistant for diverse tasks |
| 👨‍💻 **المبرمج** | `coder` | Senior software engineer - code-first approach |
| 📝 **الكاتب** | `writer` | Creative content writer with rich formatting |
| 🔍 **الباحث** | `researcher` | Academic researcher with citations |

### 🧠 Autonomous Planning
- **Plan → Execute → Review** cycle powered by LangGraph
- Automatic error recovery and retry logic
- No user intervention required for multi-step tasks

### 🗄️ Persistent Memory
- **SQLite-based** conversation memory
- Remembers context across sessions
- Thread-based conversation management

### 👁️ Vision Capabilities
- **Image Analysis** using Llama 3.2 Vision
- Upload images and ask questions about them
- OCR, object detection, and visual Q&A

### 🌐 Real Browser (Playwright)
- **JavaScript Rendering** for modern SPAs
- Full-page **screenshots** of any website
- Content extraction from React/Vue/Angular apps

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- [Groq API Key](https://console.groq.com/keys) (free)

### Installation

```bash
# Clone the repository
git clone https://github.com/amiraq1/AI-Architect.git
cd AI-Architect

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Set your API key
export GROQ_API_KEY="your-groq-api-key"

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### Windows (PowerShell)
```powershell
$env:GROQ_API_KEY = "your-groq-api-key"
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Open **http://localhost:5000** in your browser 🎉

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     🌐 Web UI (Alpine.js)                   │
├─────────────────────────────────────────────────────────────┤
│                     ⚡ FastAPI Backend                       │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   /run       │   /upload    │   /speak     │   /api/health  │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                   🧠 LangGraph Agent                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │ Planner  │ → │ Executor │ → │ Reviewer │ → │  Writer  │  │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      🛠️ Tool Layer                          │
│  web_search │ python_repl │ browse_website │ analyze_image  │
├─────────────────────────────────────────────────────────────┤
│                   💾 SQLite Memory                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `web_search` | DuckDuckGo search | Real-time information |
| `python_repl` | Execute Python code | Calculations, charts, data |
| `file_writer` | Save files to disk | Reports, exports |
| `get_youtube_transcript` | Extract video transcripts | Video summarization |
| `analyze_repo` | Inspect GitHub repos | Code review |
| `generate_image` | AI image generation | Visual content |
| `analyze_image` | Vision analysis (Llama 3.2) | Image Q&A, OCR |
| `browse_website` | Playwright browser | Screenshots, JS rendering |

---

## 📡 API Reference

### POST `/run`
Execute an agent task.

```json
{
  "prompt": "ابحث عن آخر أخبار التكنولوجيا",
  "thread_id": "user_123",
  "agent_mode": "researcher",
  "image_path": null
}
```

**Response:**
```json
{
  "success": true,
  "result": "## آخر أخبار التكنولوجيا\n...",
  "plan": ["web_search", "analyze", "write report"],
  "steps_executed": 3
}
```

### POST `/upload`
Upload an image for vision analysis.

```bash
curl -X POST -F "file=@image.jpg" http://localhost:5000/upload
```

### POST `/speak`
Convert text to speech (Arabic TTS).

```json
{
  "text": "مرحباً بك في نبض",
  "voice": "ar-SA-HamidNeural"
}
```

---

## 📁 Project Structure

```
AI-Architect/
├── app/
│   ├── main.py              # FastAPI application
│   ├── agent/
│   │   ├── graph.py         # LangGraph workflow
│   │   └── state.py         # Agent state schema
│   └── tools/
│       ├── defined_tools.py # Tool registry
│       ├── browser_ops.py   # Playwright browser
│       ├── vision_ops.py    # Image analysis
│       ├── video_ops.py     # YouTube transcripts
│       ├── github_ops.py    # GitHub analysis
│       ├── image_ops.py     # Image generation
│       └── speech_ops.py    # Text-to-speech
├── static/
│   ├── index.html           # Web UI
│   ├── uploads/             # Uploaded images
│   └── screenshots/         # Browser screenshots
├── data/
│   └── memory.db            # SQLite memory
└── requirements.txt
```

---

## 🎨 UI Features

- **Dark Neon Theme** with glassmorphism effects
- **RTL Support** for Arabic
- **Mobile Responsive** sidebar
- **Image Upload** with preview
- **Markdown Rendering** with syntax highlighting
- **Text-to-Speech** for responses
- **Expert Mode Selector** with visual badges

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Groq API key for Llama models | ✅ Yes |

### Supported Models

- **LLM:** `llama-3.3-70b-versatile` (via Groq)
- **Vision:** `llama-3.2-11b-vision-preview` (via Groq)
- **TTS:** `ar-SA-HamidNeural` (Edge TTS)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ using LangGraph, Groq, and FastAPI**

<p>
  <a href="https://github.com/amiraq1/AI-Architect">⭐ Star this repo</a> •
  <a href="https://github.com/amiraq1/AI-Architect/issues">🐛 Report Bug</a> •
  <a href="https://github.com/amiraq1/AI-Architect/issues">💡 Request Feature</a>
</p>

</div>
