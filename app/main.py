import os
import uvicorn
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# مكتبات الذكاء الاصطناعي
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# تحميل متغيرات البيئة
load_dotenv()

# --- إعدادات التطبيق ---
app = FastAPI(
    title="Nabd AI Platform",
    description="منصة نبض للذكاء الاصطناعي المستقل",
    version="2.0.0"
)

# تفعيل CORS للسماح للواجهة الأمامية بالاتصال
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # يمكن تقييد هذا في الإنتاج
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- نماذج البيانات (Pydantic Models) ---
class ChatRequest(BaseModel):
    message: str
    mode: str = "general"  # general, coder, writer, researcher
    history: List[Dict[str, str]] = []  # سجل المحادثة السابق

class ChatResponse(BaseModel):
    response: str
    tool_usage: Optional[List[str]] = None

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

# --- منطق المعالجة (Core Logic) ---
async def process_chat(request: ChatRequest) -> str:
    # 1. اختيار البرومبت المناسب
    selected_system_prompt = SYSTEM_PROMPTS.get(request.mode, SYSTEM_PROMPTS["general"])
    full_system_message = f"{selected_system_prompt}\n\n{ARABIC_ENFORCEMENT}"

    # 2. بناء سجل الرسائل
    messages = [SystemMessage(content=full_system_message)]
    
    # إضافة التاريخ السابق (Context)
    for msg in request.history:
        if msg["role"] == "user":
            messages.append(HumanMessage(content=msg["content"]))
        else:
            messages.append(AIMessage(content=msg["content"]))
            
    # إضافة الرسالة الحالية
    messages.append(HumanMessage(content=request.message))

    # 3. استدعاء النموذج (Invoking Groq)
    # ملاحظة: هنا سنقوم لاحقاً بربط LangGraph لتشغيل الأدوات (Tools)
    try:
        response = await llm.ainvoke(messages)
        return response.content
    except Exception as e:
        return f"عذراً، حدث خطأ أثناء المعالجة: {str(e)}"

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
    ai_reply = await process_chat(request)
    return ChatResponse(response=ai_reply)

# --- تشغيل الخادم (لأغراض التصحيح المباشر) ---
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)
