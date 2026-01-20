import axios from 'axios';
import { HttpError } from 'wasp/server';
import type { AskNabd } from 'wasp/server/operations';
import type { Message } from 'wasp/entities';

// تعريف نوع البيانات المتوقعة
type NabdArgs = {
  query: string;
  agentMode: string; // 'coder', 'writer', 'general', 'researcher'
  modelName: string; // 'llama-3.1-8b-instant' (fast), 'llama-3.3-70b-versatile' (smart)
};

export const askNabd: AskNabd<NabdArgs, string> = async (args, context) => {
  // 1. التحقق من أن المستخدم مسجل دخول
  if (!context.user) {
    throw new HttpError(401, 'يجب عليك تسجيل الدخول أولاً');
  }

  // 2. التحقق من الاشتراك وميزات الـ Premium
  // (Model Names mapped to simple terms for check)
  const isSmartModel = args.modelName === 'llama-3.3-70b-versatile' || args.modelName === 'smart';
  const isCoderMode = args.agentMode === 'coder';

  const isPremiumFeature = isSmartModel || isCoderMode;

  // تحقق من حالة الاشتراك (يأتي جاهزاً مع OpenSaaS)
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
    const nabdUrl = process.env.NABD_API_URL || 'https://YOUR-REPL-URL.replit.app';
    const nabdKey = process.env.NABD_SECRET_KEY;

    if (!nabdUrl) { throw new HttpError(500, 'Configuration error: NABD_API_URL missing'); }

    const response = await axios.post(
      `${nabdUrl}/run`,
      {
        prompt: args.query,
        agent_mode: args.agentMode,
        model_name: args.modelName,
        thread_id: context.user.id.toString()
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
