/**
 * Nabd AI API Route
 * Handles communication with Groq AI directly
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPromptForAgentMode } from '@/lib/prompts';
import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Initialize Groq client
const groq = new Groq({
    apiKey: GROQ_API_KEY || 'gsk_your_default_key_if_any', // Ensure you set this in .env
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, agentMode = 'general', modelName = 'llama-3.1-8b-instant' } = body;

        if (!query?.trim()) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_your_key_here') {
            console.warn('GROQ_API_KEY is missing or invalid. Using Mock Response for testing.');

            // Mock Response Logic adhering to NABD_CORE_IDENTITY
            const mockResponses: Record<string, string> = {
                coder: `أهلاً بك! بصفتي "نبض" المبرمج، يسعدني مساعدتك.
إليك دالة بسيطة في بايثون لجمع رقمين:

\`\`\`python
def add_numbers(a, b):
    """
    Function to add two numbers.
    """
    return a + b

# Example usage:
result = add_numbers(5, 3)
print(f"The sum is: {result}")
\`\`\`

كما ترى، قمت بكتابة الكود والتعليقات بالإنجليزية ليكون معيارياً، بينما الشرح هنا بالعربية. هل تود مني شرح أجزاء أخرى؟`,

                writer: `أهلاً بك! أنا "نبض"، كاتبك المبدع.
بناءً على طلبك، يمكنني صياغة نص جميل ومؤثر. اللغة العربية هي هويتنا، ويسعدني استخدامهما ببراعة.
هل لديك موضوع محدد تود أن أكتب عنه؟`,

                general: `مرحباً! أنا "نبض"، مساعدك الذكي العربي.
أنا هنا لمساعدتك في أي سؤال. ألتزم دائماً بالرد باللغة العربية الفصحى لتقديم أفضل تجربة للمستخدم العربي.
بم يمكنني مساعدتك اليوم؟`
            };

            const mockResponse = mockResponses[agentMode] || mockResponses['general'];

            return NextResponse.json({
                response: mockResponse,
                model: 'mock-model-for-testing',
                mode: agentMode,
                is_mock: true,
                note: 'تم استخدام رد تجريبي (Mock) لأن مفتاح API غير مضبوط.'
            });
        }

        // Get the advanced system prompt based on the agent mode
        const systemPrompt = getPromptForAgentMode(agentMode);

        try {
            console.log(`Sending request to Groq with mode: ${agentMode}...`);
            // Append a hidden reminder to enforce Arabic response
            const finalUserMessage = `${query}\n\n(ملاحظة هامة للنظام: أجب باللغة العربية الفصحى حصراً، واشرح الكود بالعربية)`;

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: finalUserMessage }
                ],
                model: 'llama-3.1-70b-versatile',
                temperature: 0.7,
                max_tokens: 2048,
            });

            const aiResponse = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من توليد رد.';

            return NextResponse.json({
                response: aiResponse,
                model: 'llama-3.1-70b-versatile',
                mode: agentMode,
                is_mock: false,
            });

        } catch (groqError: any) {
            console.error('Groq API Error:', groqError);
            if (groqError?.error?.code === 'invalid_api_key') {
                // Fallback to mock if key is invalid during call
                return NextResponse.json({
                    response: "عذراً، مفتاح API غير صالح. (هذا رد تلقائي: يرجى التحقق من الإعدادات).",
                    is_mock: true,
                    error: "Invalid API Key"
                });
            }

            return NextResponse.json({
                error: 'AI Provider Error',
                response: `عذراً، حدث خطأ أثناء الاتصال بمزود الذكاء الاصطناعي: ${groqError.message}`
            }, { status: 500 });
        }
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
