/**
 * Nabd AI Agent - OpenSaaS Server Action (Simplified)
 * Copy this file to: src/server/actions.ts
 */

import axios from 'axios';
import { HttpError } from 'wasp/server';
import type { AskNabd } from 'wasp/server/operations';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type NabdArgs = {
  query: string;
  agentMode: string; // 'general', 'coder', 'writer', 'researcher'
  modelName: string; // 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile'
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ACTION
// ═══════════════════════════════════════════════════════════════════════════════

export const askNabd: AskNabd<NabdArgs, string> = async (args, context) => {
  // 1. التحقق من أن المستخدم مسجل دخول
  if (!context.user) {
    throw new HttpError(401, 'يجب عليك تسجيل الدخول أولاً');
  }

  // 2. التحقق من الاشتراك المدفوع للموديلات الذكية
  const isPremium = context.user.subscriptionStatus === 'active';
  if (args.modelName === 'llama-3.3-70b-versatile' && !isPremium) {
    throw new HttpError(403, 'الموديل الذكي متاح للمشتركين فقط 💎');
  }

  // 3. الاتصال بسيرفر "نبض" (Replit)
  try {
    const nabdUrl = process.env.NABD_API_URL;
    const nabdKey = process.env.NABD_SECRET_KEY;

    if (!nabdUrl || !nabdKey) {
      throw new HttpError(500, 'NABD_API_URL or NABD_SECRET_KEY not configured');
    }

    const response = await axios.post(
      `${nabdUrl}/run`,
      {
        prompt: args.query,
        agent_mode: args.agentMode,
        model_name: args.modelName,
        thread_id: `opensaas_${context.user.id}` // ربط الذاكرة بالمستخدم
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-NABD-SECRET': nabdKey
        },
        timeout: 120000 // 2 minutes timeout للمهام الطويلة
      }
    );

    // 4. إرجاع رد الذكاء الاصطناعي
    return response.data.result || response.data;

  } catch (error: any) {
    console.error('Nabd Error:', error.response?.data || error.message);

    if (error instanceof HttpError) {
      throw error;
    }

    const message = error.response?.data?.detail || 'حدث خطأ أثناء الاتصال بالوكيل الذكي';
    throw new HttpError(error.response?.status || 500, message);
  }
};
