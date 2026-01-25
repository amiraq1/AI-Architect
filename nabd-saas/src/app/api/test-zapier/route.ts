import { NextResponse } from 'next/server';
import { notifyZapier } from '@/lib/zapier';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await notifyZapier(body);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
