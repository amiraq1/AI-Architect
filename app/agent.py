import os
import operator
from typing import TypedDict, Annotated, Sequence
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

# استيراد الأدوات التي أنشأناها
from app.tools import TOOLS_LIST

load_dotenv()

# --- 1. إعداد النموذج (LLM) ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("⚠️ GROQ_API_KEY is missing!")

# نستخدم نفس النموذج القوي
llm = ChatGroq(
    temperature=0.5,
    model_name="llama3-70b-8192",
    api_key=GROQ_API_KEY,
    streaming=True
)

# 💡 الخطوة السحرية: ربط الأدوات بالنموذج
# هذا يجعل Llama 3 يعرف أن لديه قدرة على البحث وتشغيل الكود
llm_with_tools = llm.bind_tools(TOOLS_LIST)

# --- 2. تعريف حالة الوكيل (State) ---
# هذه هي "الذاكرة" التي تنتقل بين خطوات التفكير
class AgentState(TypedDict):
    # قائمة تخزن تسلسل الرسائل (تضاف لها رسائل جديدة ولا تحذف القديمة)
    messages: Annotated[Sequence[BaseMessage], operator.add]

# --- 3. تعريف العقد (Nodes) ---

def agent_node(state: AgentState):
    """
    عقدة التفكير: تستلم المحادثة وتقرر ماذا تفعل (ترد أو تستخدم أداة)
    """
    messages = state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

# عقدة تنفيذ الأدوات (جاهزة من LangGraph)
# تقوم تلقائياً بتشغيل Python أو البحث إذا طلب الوكيل ذلك
tools_node = ToolNode(TOOLS_LIST)

# --- 4. شرط الانتقال (Router Logic) ---
def should_continue(state: AgentState):
    """
    شرطي المرور: يقرر الخطوة التالية
    """
    last_message = state["messages"][-1]
    
    # هل طلب الوكيل استخدام أداة؟ (Tool Call)
    if last_message.tool_calls:
        return "tools"  # اذهب إلى عقدة الأدوات
    
    # إذا لم يطلب، فهذا يعني أنه جهز الرد النهائي
    return END  # أنهِ العملية وأرسل الرد للمستخدم

# --- 5. رسم المخطط (Building the Graph) ---
workflow = StateGraph(AgentState)

# إضافة العقد للمخطط
workflow.add_node("agent", agent_node)
workflow.add_node("tools", tools_node)

# تحديد نقطة البداية (دائماً نبدأ بالتفكير)
workflow.set_entry_point("agent")

# رسم المسارات (Edges)
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",  # مسار استخدام الأدوات
        END: END           # مسار الرد النهائي
    }
)

# بعد تنفيذ الأداة، عد دائماً للوكيل ليقرأ النتيجة ويصيغ الرد
workflow.add_edge("tools", "agent")

def build_agent_app(checkpointer=None):
    """Compile the workflow with an optional checkpointer."""
    return workflow.compile(checkpointer=checkpointer)


# تجميع التطبيق النهائي (Compile)
agent_app = build_agent_app()
