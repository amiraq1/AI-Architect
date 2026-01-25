import os
from typing import Optional
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_experimental.utilities import PythonREPL
from youtube_transcript_api import YouTubeTranscriptApi
from github import Github

# --- إعداد الأدوات الأساسية ---

# 1. أداة البحث في الإنترنت (DuckDuckGo)
# لا تحتاج لمفتاح API وتعمل بخصوصية عالية
search_tool = DuckDuckGoSearchRun()

@tool
def web_search(query: str) -> str:
    """
    استخدم هذه الأداة للبحث في الإنترنت عن معلومات حديثة أو أخبار
    أو أحداث لا تعرفها. المدخل هو جملة البحث.
    """
    try:
        return search_tool.run(query)
    except Exception as e:
        return f"فشل البحث: {str(e)}"

# 2. أداة تنفيذ كود بايثون (Python REPL)
# تستخدم للعمليات الحسابية المعقدة أو تحليل البيانات
python_repl = PythonREPL()

@tool
def run_python(code: str) -> str:
    """
    تستخدم لتنفيذ كود Python فقط (للحسابات أو معالجة النصوص).
    المدخل يجب أن يكون كود بايثون صالح.
    """
    try:
        return python_repl.run(code)
    except Exception as e:
        return f"خطأ في التنفيذ: {str(e)}"

# 3. أداة جلب نصوص يوتيوب (YouTube Transcript)
@tool
def get_youtube_transcript(video_url: str) -> str:
    """
    تستخرج النص (الكلام) من فيديو يوتيوب لتحليله أو تلخيصه.
    المدخل يجب أن يكون رابط الفيديو كاملاً.
    """
    try:
        # استخراج ID الفيديو من الرابط
        if "v=" in video_url:
            video_id = video_url.split("v=")[1].split("&")[0]
        elif "youtu.be" in video_url:
            video_id = video_url.split("/")[-1]
        else:
            return "رابط غير صالح. يرجى تزويد رابط يوتيوب صحيح."

        # جلب النص (يدعم العربية والإنجليزية)
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['ar', 'en'])
        
        # دمج النص في فقرة واحدة
        text_content = " ".join([entry['text'] for entry in transcript])
        return text_content[:4000]  # نأخذ أول 4000 حرف لتجنب تجاوز حد الرموز
        
    except Exception as e:
        return f"تعذر جلب نص الفيديو (قد لا يحتوي على ترجمة): {str(e)}"

# 4. أداة تحليل مستودعات GitHub
@tool
def analyze_github_repo(repo_url: str) -> str:
    """
    تجلب ملفات من مستودع GitHub لفحص الكود.
    المدخل هو رابط المستودع (مثلاً: owner/repo).
    """
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        return "خطأ: لم يتم إعداد GITHUB_TOKEN في ملف البيئة."
        
    try:
        g = Github(github_token)
        # تنظيف الرابط للحصول على اسم المستودع فقط
        repo_name = repo_url.replace("https://github.com/", "").strip("/")
        repo = g.get_repo(repo_name)
        
        # جلب هيكل الملفات (أول مستوى فقط للتبسيط)
        contents = repo.get_contents("")
        file_list = []
        
        for content_file in contents:
            file_list.append(f"- {content_file.name} ({content_file.type})")
            
        # محاولة قراءة ملف README إذا وجد
        try:
            readme = repo.get_readme().decoded_content.decode("utf-8")[:1000]
            summary = f"ملخص README:\n{readme}...\n"
        except:
            summary = "لا يوجد ملف README."
            
        return f"هيكل المستودع {repo_name}:\n" + "\n".join(file_list) + "\n\n" + summary
        
    except Exception as e:
        return f"حدث خطأ أثناء فحص GitHub: {str(e)}"
