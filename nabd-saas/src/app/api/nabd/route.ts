/**
 * Nabd AI API Route
 * Handles communication with Nabd AI backend
 */

import { NextRequest, NextResponse } from 'next/server';

const NABD_API_URL = process.env.NABD_API_URL || 'http://localhost:5000';
const NABD_SECRET_KEY = process.env.NABD_SECRET_KEY || 'nabd-secret-2026-v1';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, agentMode = 'general', modelName = 'llama-3.1-8b-instant' } = body;

        if (!query?.trim()) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${NABD_API_URL}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-NABD-SECRET': NABD_SECRET_KEY,
            },
            body: JSON.stringify({
                prompt: query,
                agent_mode: agentMode,
                model_name: modelName,
                thread_id: `nextjs_${Date.now()}`,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
            return NextResponse.json(
                { error: error.detail || 'Failed to connect to Nabd AI' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Nabd API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
