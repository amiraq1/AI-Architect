import axios from 'axios';
import { HttpError } from 'wasp/server';
import type { AskNabd } from 'wasp/server/operations';
import type { Message } from 'wasp/entities';
import OpenAI from 'openai';

// إعداد عميل OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  // 2. التحقق من الاشتراك وميزات الـ Premium
  const isSmartModel = args.modelName === 'llama-3.3-70b-versatile' || args.modelName === 'smart';
  const isCoderMode = args.agentMode === 'coder';

  const isPremiumFeature = isSmartModel || isCoderMode;
  const hasValidSubscription = context.user.subscriptionStatus === 'active';

  if (isPremiumFeature && !hasValidSubscription) {
    throw new HttpError(403, "⚠️ هذه الميزة متاحة فقط للمشتركين. يرجى الترقية للمتابعة.");
  }

  // 3. احفظ سؤال المستخدم فوراً
  await context.entities.Message.create({
    data: {
      content: args.query,
      role: 'user',
      userId: context.user.id
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
        userId: context.user.id
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

type ChatInput = {
  message: string;
  attachment?: {
    name: string;
    type: string;
    content: string; // Base64 string ex: "data:image/png;base64,..."
  } | null;
  history?: any[]; // سجل المحادثة السابق إذا كنت ترسله
};

export const sendChatMessage = async (args: ChatInput, context: any) => {
  if (!context.user) {
    throw new HttpError(401, 'يجب عليك تسجيل الدخول أولاً');
  }

  const { message, attachment, history = [] } = args;

  // 1. إعداد رسالة النظام (الشخصية)
  const systemMessage = {
    role: "system",
    content: `أنت "نبض"، مساعد ذكي متطور. 
    - لغتك الأساسية هي العربية.
    - إذا أرسل المستخدم صورة، قم بتحليلها بدقة واستخرج أي نصوص أو تفاصيل مهمة.
    - كن مفيداً ومختصراً.`
  };

  // 2. تجهيز رسالة المستخدم الحالية
  let userMessageContent: any[] = [];

  // أ) إضافة النص
  if (message) {
    userMessageContent.push({ type: "text", text: message });
  } else if (attachment) {
    // إذا أرسل صورة فقط بدون نص، نفترض أنه يريد وصفاً لها
    userMessageContent.push({ type: "text", text: "ماذا يوجد في هذه الصورة؟" });
  }

  // ب) إضافة الصورة (إذا وجدت)
  if (attachment && attachment.type.startsWith('image/')) {
    userMessageContent.push({
      type: "image_url",
      image_url: {
        url: attachment.content, // الـ Base64 الذي أرسلناه من الـ Client
        detail: "high" // دقة عالية لرؤية التفاصيل الصغيرة
      }
    });
  }

  // 3. تجميع سجل المحادثة (History) + الرسالة الجديدة
  // ملاحظة: يجب تنسيق الـ history ليطابق شكل OpenAI (user/assistant)
  const messagesPayload = [
    systemMessage,
    ...history,
    { role: "user", content: userMessageContent }
  ];

  try {
    // 4. استدعاء النموذج
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // أفضل نموذج للتعامل مع الصور حالياً
      messages: messagesPayload as any,
      max_tokens: 1000,
    });

    const reply = response.choices[0].message.content;

    // 5. حفظ الرسائل في قاعدة البيانات
    // حفظ رسالة المستخدم
    await context.entities.Message.create({
      data: {
        content: message || "📷 صورة",
        role: 'user',
        userId: context.user.id
      }
    });

    // حفظ رد المساعد
    await context.entities.Message.create({
      data: {
        content: reply || '',
        role: 'assistant',
        userId: context.user.id
      }
    });

    return {
      response: reply,
      hasAttachment: !!attachment,
      attachmentName: attachment?.name
    };

  } catch (error: any) {
    console.error("OpenAI Error:", error);
    throw new HttpError(500, "حدث خطأ أثناء معالجة طلبك.");
  }
};
