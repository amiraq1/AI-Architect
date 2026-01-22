/**
 * Nabd AI API Route
 * Handles communication with Nabd AI backend
 */

import { NextRequest, NextResponse } from 'next/server';

const NABD_API_URL = process.env.NABD_API_URL || 'http://localhost:5000';
const NABD_SECRET_KEY = process.env.NABD_SECRET_KEY || 'nabd-secret-2026-v1';
const USE_MOCK = process.env.USE_MOCK_AI === 'true' || !process.env.NABD_API_URL;

// Mock responses for development
function getMockResponse(query: string, agentMode: string): string {
    const responses: Record<string, string[]> = {
        general: [
            `أهلاً! أنا نبض، مساعدك الذكي. سؤالك عن "${query}" مثير للاهتمام!\n\nإليك ما أعرفه:\n- هذا موضوع مهم في عالمنا اليوم\n- يمكنني مساعدتك في فهمه بشكل أعمق\n- هل تريد المزيد من التفاصيل؟`,
            `مرحباً! سؤال رائع عن "${query}".\n\n**النقاط الرئيسية:**\n1. هذا موضوع واسع ومتشعب\n2. له تطبيقات عملية كثيرة\n3. يمكنني شرحه بالتفصيل\n\nهل تريد أن أتعمق في جانب معين؟`,
        ],
        coder: [
            `\`\`\`python\n# مثال على الكود المطلوب\ndef hello_world():\n    """دالة ترحيبية بسيطة"""\n    print("مرحباً بالعالم!")\n    return True\n\nif __name__ == "__main__":\n    hello_world()\n\`\`\`\n\n**شرح الكود:**\n- أنشأنا دالة بسيطة\n- تطبع رسالة ترحيبية\n- تعيد قيمة True`,
            `إليك الحل البرمجي:\n\n\`\`\`javascript\n// تحليل البيانات\nconst analyzeData = (data) => {\n  return data\n    .filter(item => item.active)\n    .map(item => ({\n      ...item,\n      processed: true\n    }));\n};\n\`\`\`\n\nهذا الكود يقوم بـ:\n1. فلترة العناصر النشطة\n2. إضافة علامة المعالجة`,
        ],
        writer: [
            `# ${query}\n\nفي عالم مليء بالتحديات والفرص، نجد أنفسنا أمام سؤال مهم...\n\n## المقدمة\nيعتبر هذا الموضوع من أهم المواضيع المعاصرة التي تؤثر على حياتنا اليومية.\n\n## التحليل\nعند النظر عن كثب، نكتشف أبعاداً متعددة لهذا الموضوع...`,
            `**عنوان المقال:** ${query}\n\n---\n\n*بقلم: نبض AI*\n\nفي ضوء التطورات الأخيرة، يبرز هذا الموضوع كواحد من أهم القضايا التي تستحق الاهتمام والدراسة المعمقة...`,
        ],
        researcher: [
            `## تحليل بحثي: ${query}\n\n### المصادر:\n1. دراسة 2024 - جامعة بغداد\n2. تقرير منظمة الأمم المتحدة\n3. بحث أكاديمي محكّم\n\n### النتائج الرئيسية:\n- النتيجة الأولى: ...\n- النتيجة الثانية: ...\n\n### التوصيات:\nبناءً على الأدلة المتاحة...`,
            `# بحث علمي\n\n**الموضوع:** ${query}\n\n## الملخص التنفيذي\nيهدف هذا البحث إلى استكشاف الجوانب المختلفة للموضوع المطروح...\n\n## المنهجية\nتم استخدام منهج تحليلي وصفي...`,
        ],
    };

    const modeResponses = responses[agentMode] || responses.general;
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
}

import { getPromptForAgentMode } from '@/lib/prompts';

// ... (imports remain)

// ... (mock function remains)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, agentMode = 'general', modelName = 'llama-3.1-8b-instant' } = body;

        // Get the advanced system prompt based on the agent mode
        const systemPrompt = getPromptForAgentMode(agentMode);

        if (!query?.trim()) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // Try to connect to Nabd backend
        if (!USE_MOCK) {
            try {
                const response = await fetch(`${NABD_API_URL}/run`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-NABD-SECRET': NABD_SECRET_KEY,
                    },
                    body: JSON.stringify({
                        prompt: query,
                        system_prompt: systemPrompt, // Send the advanced prompt
                        agent_mode: agentMode,
                        model_name: modelName,
                        thread_id: `nextjs_${Date.now()}`,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    return NextResponse.json(data);
                }
            } catch (backendError) {
                console.warn('Nabd backend unavailable, using mock response:', backendError);
            }
        }

        // Fallback to mock response
        console.log('Using mock AI response for:', query);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

        const mockResponse = getMockResponse(query, agentMode);

        return NextResponse.json({
            response: mockResponse,
            model: modelName,
            mode: agentMode,
            is_mock: true,
        });

    } catch (error) {
        console.error('Nabd API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
