import { NextRequest, NextResponse } from 'next/server';
import { extractContent } from '@/lib/extract-content';

export const runtime = 'edge'; // Use Edge for speed

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 🛡️ SECURITY: SSRF Protection
        try {
            const parsed = new URL(url);

            // Block non-http protocols
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
            }

            // Block internal/private IPs (Basic check)
            const hostname = parsed.hostname;
            if (
                hostname === 'localhost' ||
                hostname === '127.0.0.1' ||
                hostname.startsWith('192.168.') ||
                hostname.startsWith('10.') ||
                hostname.endsWith('.local')
            ) {
                return NextResponse.json({ error: 'Internal requests blocked' }, { status: 403 });
            }

        } catch (e) {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        console.log(`[Browser] Fetching: ${url}`);

        // Fetch with timeout and user-agent
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; NabdBot/1.0; +https://amiraq.online)'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to fetch (${response.status})` }, { status: response.status });
        }

        const html = await response.text();
        const data = extractContent(html);

        return NextResponse.json({
            url,
            title: data.title,
            content: data.text.slice(0, 15000) // Truncate to save tokens
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Browse failed' }, { status: 500 });
    }
}
