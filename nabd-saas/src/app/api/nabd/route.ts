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

        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY is missing');
            // Fail gracefully or use mock if needed, but here we report error
            return NextResponse.json({
                error: 'Server configuration error: API Key missing',
                response: 'عذراً، هناك مشكلة في إعدادات الخادم (مفتاح API مفقود). يرجى الاتصال بالمسؤول أو التأكد من ملف .env.local.'
            }, { status: 500 });
        }

        // Get the advanced system prompt based on the agent mode
        const systemPrompt = getPromptForAgentMode(agentMode);

        try {
            console.log(`Sending request to Groq with mode: ${agentMode}...`);
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: query }
                ],
                model: 'llama-3.1-70b-versatile', // Use a powerful model
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
