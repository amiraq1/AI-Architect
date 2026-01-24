/**
 * Nabd AI API Route
 * Handles communication with Groq AI directly
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPromptForAgentMode } from '@/lib/prompts';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ⚡ PERFORMANCE: Simple In-Memory Cache (LRU-like)
// Stores the last 100 successful responses to save API costs and reduce latency.
const responseCache = new Map<string, { response: string, timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 Hour

function getCachedResponse(key: string): string | null {
    if (responseCache.has(key)) {
        const cached = responseCache.get(key)!;
        if (Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.response;
        }
        responseCache.delete(key);
    }
    return null;
}

function setCachedResponse(key: string, value: string) {
    if (responseCache.size > 100) {
        const firstKey = responseCache.keys().next().value;
        if (firstKey) responseCache.delete(firstKey); // Evict oldest
    }
    responseCache.set(key, { response: value, timestamp: Date.now() });
}

// Initialize Groq client
const groq = new Groq({
    apiKey: GROQ_API_KEY || 'gsk_placeholder', // Ensure you set this in .env
});

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    try {
        const body = await request.json();
        const { query, agentMode = 'general', modelName = 'llama-3.1-8b-instant' } = body;

        // 🛡️ SECURITY: Input Validation
        if (!query?.trim()) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // 🛡️ SECURITY: Input Validation
        if (query.length > 5000) {
            return NextResponse.json({ error: 'Query too long' }, { status: 400 });
        }

        // ⚡ PERFORMANCE: Check Cache first
        const cacheKey = `${agentMode}:${query.trim()}`;
        const cachedResult = getCachedResponse(cacheKey);
        if (cachedResult) {
            return NextResponse.json({
                response: cachedResult,
                model: modelName,
                mode: agentMode,
                cached: true,
                latency: Date.now() - startTime
            });
        }

        // ⚠️ DEMO MODE: If no API key is set, return a high-quality mock response.
        if (!GROQ_API_KEY || GROQ_API_KEY.startsWith('gsk_your')) {
            console.warn('⚠️ Nabd is running in DEMO MODE (No API Key found).');

            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500));

            let mockResponse = `هذا رد تجريبي من **نبض** (وضع العرض التجريبي).\n\nبما أن مفتاح API غير مضبوط في ملف \`.env\`، فأنا أقوم بمحاكاة الإجابة.\n\nسألتني: "${query}"\n\nالإجابة النموذجية ستكون هنا مدعومة بالذكاء الاصطناعي الحقيقي عند تفعيله.`;

            if (agentMode === 'coder') {
                mockResponse = `\`\`\`python\n# مثال على كود بايثون (وضع تجريبي)\ndef nabd_demo():\n    print("أهلاً بك في ذكاء نبض!")\n    return "نجاح"\n\`\`\`\n\nهذا كود تجريبي لأن النظام يعمل بدون مفتاح API حالياً.`;
            }

            setCachedResponse(cacheKey, mockResponse);

            return NextResponse.json({
                response: mockResponse,
                model: 'demo-mock-model',
                mode: agentMode,
                cached: false,
                latency: Date.now() - startTime
            });
        }

        // Get the advanced system prompt based on the agent mode
        const systemPrompt = getPromptForAgentMode(agentMode);

        try {
            console.log(`Sending request to Groq with mode: ${agentMode}...`);

            // 🛡️ SECURITY: Prompt Separation to prevent Injection
            // We pass the layout instruction as a separate SYSTEM message, not appended to USER message.
            const messagesList: any[] = [
                { role: 'system', content: systemPrompt },
                { role: 'system', content: "IMPORTANT: Answer strictly in Arabic." },
                { role: 'user', content: query }
            ];

            const completion = await groq.chat.completions.create({
                messages: messagesList,
                model: 'llama-3.1-70b-versatile',
                temperature: 0.7,
                max_tokens: 2048,
            });

            const aiResponse = completion.choices[0]?.message?.content || 'NO_RESPONSE';

            // ⚡ PERFORMANCE: Cache the result
            if (aiResponse !== 'NO_RESPONSE') {
                setCachedResponse(cacheKey, aiResponse);
            }

            return NextResponse.json({
                response: aiResponse,
                model: 'llama-3.1-70b-versatile',
                mode: agentMode,
                cached: false,
                latency: Date.now() - startTime
            });

        } catch (groqError: any) {
            // 🛡️ SECURITY: Secure Logging (Mask API Key)
            const errorMsg = groqError.message || 'Unknown';
            // Simple masking via Regex if API key was present in error
            const safeErrorLog = errorMsg.replace(/gsk_[a-zA-Z0-9]{10,}/, '***KEY***');

            console.error('[Groq API Error]', { message: safeErrorLog, code: groqError?.code });

            if (groqError?.error?.code === 'invalid_api_key') {
                return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
            }

            return NextResponse.json({
                error: 'AI Provider Unavailable',
                // Do NOT expose detailed upstream errors to user
                requestId: crypto.randomUUID()
            }, { status: 502 });
        }
    } catch (error) {
        console.error('[Internal API Error]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
