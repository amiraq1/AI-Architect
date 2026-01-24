/**
 * Nabd AI API Route
 * Handles communication with Groq AI directly
 * Updated: Supports Streaming & Memory History
 */

import { NextRequest } from 'next/server';
import { getPromptForAgentMode } from '@/lib/prompts';
import { sendAlert } from '@/lib/monitoring';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_placeholder',
});

// Use Edge Runtime for Streaming
export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, agentMode = 'general', modelName = 'llama-3.1-70b-versatile' } = body;

        // 🛡️ SECURITY: Input Validation
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400 });
        }

        // 🛡️ MEMORY CONTROL: Keep only last 6 messages to save tokens and reduce confusion
        // We ensure the first system message is always ours, so we strip any client-sent system messages to be safe.
        const userMessages = messages.filter((m: any) => m.role !== 'system');
        const recentHistory = userMessages.slice(-6);

        // Get the advanced system prompt
        const systemPrompt = getPromptForAgentMode(agentMode);

        // Build the full chain
        const fullConversation = [
            { role: 'system', content: systemPrompt },
            { role: 'system', content: "IMPORTANT: Answer strictly in Arabic. Follow the Output Protocol." },
            ...recentHistory
        ];

        console.log(`[Stream] Starting for ${agentMode} with ${recentHistory.length} history items.`);

        // ⚠️ DEMO MODE HANDLING
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.startsWith('gsk_your')) {
            const encoder = new TextEncoder();
            const mockStream = new ReadableStream({
                async start(controller) {
                    const mockText = "⚠️ هذا رد تجريبي (Demo Mode). لم يتم ضبط مفتاح API بعد.\n\nبما أنك ترى هذا النص، فإن تدفق البيانات (Streaming) يعمل بنجاح! 🚀";
                    const chunks = mockText.split(" ");
                    for (const chunk of chunks) {
                        controller.enqueue(encoder.encode(chunk + " "));
                        await new Promise(r => setTimeout(r, 100)); // Simulate typing
                    }
                    controller.close();
                }
            });
            return new Response(mockStream, { headers: { 'Content-Type': 'text/event-stream' } });
        }

        // 🚀 REAL AI REQUEST (STREAMING)
        const response = await groq.chat.completions.create({
            model: 'llama-3.1-70b-versatile',
            messages: fullConversation as any,
            temperature: 0.7,
            max_tokens: 2048,
            stream: true,
        });

        // Convert AsyncIterable to ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } catch (err) {
                    console.error("Stream Error:", err);
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        // 🛡️ SECURITY: Secure Logging
        const errorMsg = error.message || 'Unknown';
        const safeErrorLog = errorMsg.replace(/gsk_[a-zA-Z0-9]{10,}/, '***KEY***');

        console.error('[API Error]', { message: safeErrorLog });

        // 🚨 MONITORING: Send Alert
        if (error?.status >= 500 || error?.code === 'rate_limit_exceeded') {
            await sendAlert('HIGH', 'API Stream Failure', { error: safeErrorLog });
        }

        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
