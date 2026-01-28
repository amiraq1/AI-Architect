import os
import uvicorn
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, AsyncGenerator
from uuid import uuid4
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# مكتبات الذكاء الاصطناعي
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# تحميل متغيرات البيئة
load_dotenv()

from app.agent import build_agent_app, agent_app as fallback_agent_app

def _normalize_backend(raw: Optional[str]) -> str:
    if not raw:
        return "none"
    return raw.strip().lower()


async def init_checkpointer():
    backend = _normalize_backend(os.getenv("CHECKPOINT_BACKEND"))
    if backend in {"none", "off", "disabled"}:
        return None, None

    try:
        if backend == "sqlite":
            from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
            conn_str = os.getenv("CHECKPOINT_DB_URI", "checkpoints.sqlite")
            cm = AsyncSqliteSaver.from_conn_string(conn_str)
            saver = await cm.__aenter__()
            return saver, cm

        if backend == "postgres":
            try:
                from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
            except Exception as exc:
                raise RuntimeError("langgraph-checkpoint-postgres is not installed.") from exc

            conn_str = os.getenv("CHECKPOINT_DB_URI")
            if not conn_str:
                raise RuntimeError("CHECKPOINT_DB_URI is required for postgres backend.")

            cm = AsyncPostgresSaver.from_conn_string(conn_str)
            saver = await cm.__aenter__()
            await saver.setup()
            return saver, cm

        raise RuntimeError(f"Unsupported CHECKPOINT_BACKEND '{backend}'.")
    except Exception as exc:
        print(f"Checkpointing disabled: {exc}")
        return None, None


@asynccontextmanager
async def lifespan(app: FastAPI):
    checkpointer, cm = await init_checkpointer()
    app.state.agent_app = build_agent_app(checkpointer=checkpointer)
    app.state.checkpointer_cm = cm
    try:
        yield
    finally:
        if cm:
            await cm.__aexit__(None, None, None)

# --- إعدادات التطبيق ---
app = FastAPI(
    title="Nabd AI Platform",
    description="منصة نبض للذكاء الاصطناعي المستقل",
    version="2.0.0",
    lifespan=lifespan,
)

def _parse_origins(raw: str) -> List[str]:
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def get_allowed_origins() -> List[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS")
    if raw:
        return _parse_origins(raw)

    origins: List[str] = []
    wasp_web_url = os.getenv("WASP_WEB_CLIENT_URL")
    if wasp_web_url:
        origins.append(wasp_web_url.strip())

    env = (os.getenv("ENV") or "development").lower()
    if env != "production":
        origins.extend(_parse_origins(os.getenv("CORS_DEV_ORIGINS", "http://localhost:3000")))

    # Remove duplicates while preserving order
    seen = set()
    deduped: List[str] = []
    for origin in origins:
        if origin not in seen:
            seen.add(origin)
            deduped.append(origin)
    return deduped


# تفعيل CORS للسماح للواجهة الأمامية بالاتصال
allowed_origins = get_allowed_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- نماذج البيانات (Pydantic Models) ---
class ChatRequest(BaseModel):
    message: str
    mode: str = "general"  # general, coder, writer, researcher
    history: List[Dict[str, str]] = Field(default_factory=list)  # سجل المحادثة السابق
    stream: bool = False
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    tool_usage: Optional[List[str]] = None
    session_id: Optional[str] = None

# --- إعداد نموذج اللغة (Groq) ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("⚠️ GROQ_API_KEY is missing in .env file!")

# نستخدم Llama 3 للسرعة والكفاءة
llm = ChatGroq(
    temperature=0.5,
    model_name="llama3-70b-8192", 
    api_key=GROQ_API_KEY
)

# --- تعريف البرومبتات (System Prompts) ---
SYSTEM_PROMPTS = {
    "general": """أنت (نبض)، مساعد ذكي متطور للمستخدمين العرب. 
    مهمتك: الإجابة بوضوح، دقة، وودية. استخدم اللغة العربية دائمًا.""",
    
    "coder": """أنت مبرمج خبير في منصة نبض.
    مهمتك: كتابة أكواد نظيفة (Clean Code) واحترافية.
    القواعد:
    1. الكود يجب أن يكون قابلاً للتنفيذ.
    2. اشرح المنطق باختصار بالعربية، واكتب الكود بالإنجليزية.
    3. اتبع معايير PEP8 في بايثون.""",
    
    "writer": """أنت كاتب مبدع ومحترف.
    مهمتك: صياغة محتوى جذاب، خالي من الأخطاء، ومنسق بعناية.
    استخدم تنسيق Markdown للعناوين والقوائم.""",
    
    "researcher": """أنت باحث أكاديمي دقيق.
    مهمتك: تقديم معلومات موثقة، تحليل عميق، وذكر المصادر إن أمكن.
    تجنب الإجابات السطحية."""
}

ARABIC_ENFORCEMENT = "تنبيه صارم: يجب أن يكون ردك باللغة العربية الفصحى (أو اللهجة العراقية إذا طلب المستخدم)، وحافظ على تنسيق RTL."


def _resolve_session_id(request: ChatRequest) -> str:
    return request.session_id or str(uuid4())


def _get_agent_app():
    return getattr(app.state, "agent_app", fallback_agent_app)


def _invoke_config(session_id: str) -> Dict[str, Dict[str, str]]:
    return {"configurable": {"thread_id": session_id}}

def build_messages(request: ChatRequest) -> List[BaseMessage]:
    selected_system_prompt = SYSTEM_PROMPTS.get(request.mode, SYSTEM_PROMPTS["general"])
    full_system_message = f"{selected_system_prompt}\n\n{ARABIC_ENFORCEMENT}"

    messages: List[BaseMessage] = [SystemMessage(content=full_system_message)]

    for msg in request.history:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))
        else:
            messages.append(AIMessage(content=msg["content"]))

    messages.append(HumanMessage(content=request.message))
    return messages


def _format_sse(data: str, event: Optional[str] = None) -> str:
    lines = data.splitlines() or [""]
    payload = []
    if event:
        payload.append(f"event: {event}")
    payload.extend([f"data: {line}" for line in lines])
    return "\n".join(payload) + "\n\n"


def _chunk_text(text: str, chunk_size: int = 8) -> List[str]:
    words = text.split()
    if not words:
        return [""]
    chunks = []
    for idx in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[idx:idx + chunk_size]) + " ")
    return chunks


async def process_chat(request: ChatRequest, session_id: str) -> str:
    messages = build_messages(request)
    agent_app = _get_agent_app()

    try:
        result = await agent_app.ainvoke({"messages": messages}, config=_invoke_config(session_id))
        last_message = result["messages"][-1]
        return last_message.content
    except Exception as e:
        print(f"Error: {str(e)}") # للتشخيص في التيرمينال
        return "عذراً، واجهت مشكلة تقنية أثناء معالجة طلبك. يرجى المحاولة مرة أخرى."


async def stream_chat(request: ChatRequest, session_id: str) -> AsyncGenerator[str, None]:
    messages = build_messages(request)
    agent_app = _get_agent_app()

    yield _format_sse(session_id, event="session")

    if not hasattr(agent_app, "astream_events"):
        full_text = await process_chat(request, session_id)
        for chunk in _chunk_text(full_text):
            yield _format_sse(chunk)
        yield _format_sse("[DONE]")
        return

    try:
        async for event in agent_app.astream_events(
            {"messages": messages},
            config=_invoke_config(session_id),
            version="v1",
        ):
            if event.get("event") != "on_chat_model_stream":
                continue

            chunk = event.get("data", {}).get("chunk")
            text = getattr(chunk, "content", None)
            if text:
                yield _format_sse(text)

        yield _format_sse("[DONE]")
    except Exception as e:
        yield _format_sse(f"عذراً، حدث خطأ أثناء البث: {str(e)}", event="error")

# --- نقاط النهاية (Endpoints) ---

@app.get("/")
async def root():
    return {"status": "online", "message": "مرحباً بك في منصة نبض 2.0 🚀"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "model": "llama3-70b-8192"}

@app.post("/run", response_model=ChatResponse)
async def run_agent(request: ChatRequest):
    """
    نقطة النهاية الرئيسية للمحادثة.
    تستقبل الرسالة والوضع (Mode) وتعيد الرد الذكي.
    """
    if request.stream:
        session_id = _resolve_session_id(request)
        return StreamingResponse(
            stream_chat(request, session_id),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
    session_id = _resolve_session_id(request)
    ai_reply = await process_chat(request, session_id)
    return ChatResponse(response=ai_reply, session_id=session_id)


@app.post("/run/stream")
async def run_agent_stream(request: ChatRequest):
    """
    نقطة نهاية للبث المباشر (Streaming) على شكل SSE.
    """
    session_id = _resolve_session_id(request)
    return StreamingResponse(
        stream_chat(request, session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )

# --- تشغيل الخادم (لأغراض التصحيح المباشر) ---
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)
