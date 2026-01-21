import axios from 'axios';
import puppeteer from 'puppeteer';
import { HttpError } from 'wasp/server';
import type { AskNabd } from 'wasp/server/operations';
import type { Message, Chat } from 'wasp/entities';
import OpenAI from 'openai';

// إعداد عميل OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

async function getOrCreateChat(context: any, userId: number): Promise<Chat> {
  // البحث عن آخر محادثة
  const existingChat = await context.entities.Chat.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });

  if (existingChat) {
    return existingChat;
  }

  // إنشاء محادثة جديدة إذا لم توجد
  return context.entities.Chat.create({
    data: {
      userId
    }
  });
}

// دالة مساعدة للبحث (يمكنك ربطها بـ Google/Bing API لاحقاً)
async function performWebSearch(query: string) {
  console.log(`Searching web for: ${query}`);

  // مثال: لو كنا نستخدم Tavily API (ممتازة للـ Agents)
  // const response = await fetch("https://api.tavily.com/search", { ... })

  // لمحاكاة الاستجابة الآن:
  return JSON.stringify({
    results: [
      { title: "سعر صرف الدولار في العراق اليوم", snippet: "سعر الصرف في الأسواق المحلية يبلغ 150,000 دينار لكل 100 دولار..." },
      { title: "أحدث تقنيات الويب 2026", snippet: "تقنيات الذكاء الاصطناعي التوليدي تسيطر على تطوير الويب..." }
    ]
  });
}

// دالة التصفح الفعلي
async function browseWebsite(url: string) {
  console.log(`Browsing: ${url}`);

  // تشغيل المتصفح
  const browser = await puppeteer.launch({
    headless: true, // "بدون رأس" أي بدون واجهة رسومية ظاهرة
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // إعدادات أمان ضرورية للسيرفرات
  });

  try {
    const page = await browser.newPage();

    // تعيين حجم شاشة افتراضي (لضمان ظهور الموقع بشكل جيد في لقطة الشاشة)
    await page.setViewport({ width: 1280, height: 800 });

    // الذهاب للرابط (ننتظر حتى يتوقف الاتصال الشبكي تقريباً لضمان التحميل)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // 1. استخراج النصوص (للقراءة السريعة)
    // نأخذ أول 3000 حرف فقط لتجنب تجاوز حدود الـ Token
    const textContent = await page.evaluate(() => {
      return document.body.innerText.substring(0, 3000)
        .replace(/\s+/g, ' ') // إزالة المسافات الزائدة
        .trim();
    });

    // 2. أخذ لقطة شاشة (للرؤية)
    const screenshotBuffer = await page.screenshot({
      encoding: 'base64',
      type: 'jpeg',
      quality: 70 // جودة متوسطة لتقليل الحجم
    });

    return JSON.stringify({
      success: true,
      text: textContent,
      screenshot: `data:image/jpeg;base64,${screenshotBuffer}`
    });

  } catch (error) {
    console.error("Browser Error:", error);
    return JSON.stringify({ success: false, error: "فشل في فتح الموقع" });
  } finally {
    await browser.close(); // إغلاق المتصفح دائماً لتوفير الذاكرة
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// نوع المرفق
type FileAttachment = {
  name: string;
  type: string;
  content: string; // Base64 encoded
};

// تعريف نوع البيانات المتوقعة
type NabdArgs = {
  query: string;
  agentMode: string; // 'coder', 'writer', 'general', 'researcher'
  modelName: string; // 'llama-3.1-8b-instant' (fast), 'llama-3.3-70b-versatile' (smart)
  attachment?: FileAttachment | null; // المرفق (اختياري)
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASK NABD (Original - uses Nabd Backend)
// ═══════════════════════════════════════════════════════════════════════════════

export const askNabd: AskNabd<NabdArgs, string> = async (args, context) => {
  // 1. التحقق من أن المستخدم مسجل دخول
  if (!context.user) {
    throw new HttpError(401, 'يجب عليك تسجيل الدخول أولاً');
  }

  // الحصول على المحادثة أو إنشاؤها
  const chat = await getOrCreateChat(context, context.user.id);

  // 2. التحقق من الاشتراك وميزات الـ Premium
  const isSmartModel = args.modelName === 'llama-3.3-70b-versatile' || args.modelName === 'smart';
  const isCoderMode = args.agentMode === 'coder';

  const isPremiumFeature = isSmartModel || isCoderMode;
  const hasValidSubscription = context.user.subscriptionStatus === 'active';

  if (isPremiumFeature && !hasValidSubscription) {
    throw new HttpError(403, "⚠️ هذه الميزة متاحة فقط للمشتركين. يرجى الترقية للمتابعة.");
  }

  // 3. حفظ سؤال المستخدم فوراً
  await context.entities.Message.create({
    data: {
      content: args.query,
      role: 'user',
      chatId: chat.id
    }
  });

  // 4. الاتصال بسيرفر "نبض" (Replit)
  try {
    const nabdUrl = process.env.NABD_API_URL;
    const nabdKey = process.env.NABD_SECRET_KEY;

    if (!nabdUrl) {
      console.error('❌ NABD_API_URL is missing!');
      throw new HttpError(500, 'Configuration error: Server URL is not set.');
    }

    const response = await axios.post(
      `${nabdUrl}/run`,
      {
        prompt: args.query,
        agent_mode: args.agentMode,
        model_name: args.modelName,
        thread_id: context.user.id.toString(),
        // إرسال المرفق إذا وُجد
        ...(args.attachment && {
          attachment: {
            name: args.attachment.name,
            type: args.attachment.type,
            content: args.attachment.content
          }
        })
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NABD-SECRET': nabdKey
        },
        timeout: 60000
      }
    );

    const aiAnswer = response.data.result || response.data.response || JSON.stringify(response.data);

    // 5. احفظ إجابة نبض في قاعدة البيانات
    await context.entities.Message.create({
      data: {
        content: aiAnswer,
        role: 'assistant',
        chatId: chat.id
      }
    });

    return aiAnswer;

  } catch (error: any) {
    console.error('Nabd Error:', error.response?.data || error.message);
    const detail = error.response?.data?.detail || 'حدث خطأ أثناء الاتصال بالوكيل الذكي';
    throw new HttpError(500, detail);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEND CHAT MESSAGE (OpenAI GPT-4o with Vision)
// ═══════════════════════════════════════════════════════════════════════════════

// تعريف نوع المدخلات
type ChatInput = {
  message: string;
  attachment?: { content: string; type: string } | null;
  chatId?: number; // اختياري لو أردنا التحديد
};

// تعريف الأدوات المتاحة للنموذج
const tools = [
  {
    type: "function" as const, // استخدام 'as const' لتثبيت النوع لـ OpenAI TS
    function: {
      name: "search_web",
      description: "استخدم هذه الأداة للبحث في الإنترنت عن معلومات حديثة، أحداث جارية، أسعار، أو معلومات ليست في معرفتك.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "جملة البحث، مثلاً 'سعر الدولار اليوم في بغداد'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "visit_page",
      description: "استخدم هذه الأداة لزيارة رابط URL محدد وقراءة محتواه ورؤية تصميمه.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "الرابط المراد زيارته (يجب أن يبدأ بـ http/https)",
          },
        },
        required: ["url"],
      },
    },
  },
];

export const sendChatMessage = async (args: ChatInput, context: any) => {
  if (!context.user) { throw new HttpError(401); }

  // 1. العثور على المحادثة أو إنشاء واحدة جديدة
  let chat = await context.entities.Chat.findFirst({
    where: { userId: context.user.id },
    orderBy: { updatedAt: 'desc' }
  });

  if (!chat) {
    chat = await context.entities.Chat.create({
      data: { userId: context.user.id }
    });
  }

  // 2. حفظ رسالة المستخدم في قاعدة البيانات
  await context.entities.Message.create({
    data: {
      chatId: chat.id,
      role: 'user',
      content: args.message || (args.attachment ? "تحليل صورة" : ""),
      hasImage: !!args.attachment
    }
  });

  // 3. جلب التاريخ السابق (Context)
  // نأخذ آخر 10 رسائل فقط لتوفير التكلفة وتسريع الاستجابة
  const previousMessages = await context.entities.Message.findMany({
    where: { chatId: chat.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // إعادة ترتيبها زمنياً للصعود (من القديم للجديد) لتفهمها OpenAI
  const historyContext = previousMessages.reverse().map((msg: any) => ({
    role: msg.role,
    content: msg.content
  }));

  // 4. تجهيز الرسالة الحالية (مع الصورة لو وجدت) كما فعلنا سابقاً
  let currentMessageContent: any[] = [];
  if (args.message) currentMessageContent.push({ type: "text", text: args.message });
  if (args.attachment) {
    currentMessageContent.push({
      type: "image_url",
      image_url: { url: args.attachment.content }
    });
  }

  // 1. استدعاء OpenAI (المرحلة الأولى: التفكير)
  const runner = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "أنت نبض، وكيل ذكي. يمكنك البحث في الويب وزيارة المواقع لتحليل محتواها بصرياً ونصياً." },
      ...historyContext,
      { role: "user", content: currentMessageContent }
    ],
    tools: tools, // نزوده بالأدوات
    tool_choice: "auto", // نتركه يقرر متى يستخدمها
  });

  const responseMessage = runner.choices[0].message;

  // 2. التحقق: هل يريد النموذج استخدام أداة؟
  if (responseMessage.tool_calls) {

    // حفظ استدعاء الأداة في سياق الرسائل (مهم جداً للنموذج)
    const messagesChain = [
      { role: "system", content: "أنت نبض، وكيل ذكي. يمكنك البحث في الويب وزيارة المواقع لتحليل محتواها بصرياً ونصياً." },
      ...historyContext,
      { role: "user", content: currentMessageContent },
      responseMessage // نضيف "نية" النموذج لاستدعاء الأداة
    ] as any[];

    // تنفيذ الأدوات المطلوبة
    for (const toolCall of responseMessage.tool_calls) {
      if (toolCall.function.name === "search_web") {

        // استخراج وسيطات البحث (Query)
        const funcArgs = JSON.parse(toolCall.function.arguments);

        // تنفيذ البحث الفعلي
        const searchResult = await performWebSearch(funcArgs.query);

        // إضافة نتيجة البحث إلى سلسلة الرسائل
        messagesChain.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: "search_web",
          content: searchResult,
        });
      } else if (toolCall.function.name === "visit_page") {
        const funcArgs = JSON.parse(toolCall.function.arguments);
        const result = JSON.parse(await browseWebsite(funcArgs.url));

        if (result.success) {
          // خدعة ذكية:
          // بما أن نتيجة الأداة (Tool Output) تقبل نصوصاً فقط،
          // سنضيف نتيجة النص كـ Tool Message،
          // ونضيف لقطة الشاشة كرسالة "User" إضافية وهمية لتراها عين النموذج (Vision).

          messagesChain.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "visit_page",
            content: JSON.stringify({ text_summary: result.text }), // نرسل النص كمرجع
          });

          // نرسل الصورة كرسالة مستخدم جديدة لكي يحللها النموذج
          messagesChain.push({
            role: "user",
            content: [
              { type: "text", text: "لقد قمتُ بزيارة الموقع. هذه لقطة شاشة لما رأيته، بالإضافة للنص الذي استخرجته:" },
              {
                type: "image_url",
                image_url: { url: result.screenshot } // الصورة التي التقطها Puppeteer
              }
            ]
          } as any);

        } else {
          // في حال الفشل
          messagesChain.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "visit_page",
            content: JSON.stringify({ error: result.error }),
          });
        }
      }
    }

    // 3. استدعاء OpenAI مرة ثانية (المرحلة الثانية: الإجابة النهائية بناءً على البحث)
    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesChain,
    });

    const finalAiReply = finalResponse.choices[0].message.content || "";

    // حفظ الرد النهائي في الـ DB
    await context.entities.Message.create({
      data: {
        chatId: chat.id,
        role: 'assistant',
        content: finalAiReply,
      }
    });

    return { response: finalAiReply };

  } else {
    // إذا لم يحتاج لبحث، نرد مباشرة
    const aiReply = responseMessage.content || "";

    // حفظ الرد
    await context.entities.Message.create({
      data: {
        chatId: chat.id,
        role: 'assistant',
        content: aiReply,
      }
    });

    return { response: aiReply };
  }
}

