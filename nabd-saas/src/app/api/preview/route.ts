import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

        // Reuse basic SSRF checks
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return NextResponse.json({ error: 'Invalid scheme' }, { status: 400 });
            }
            if (['localhost', '127.0.0.1'].includes(parsed.hostname)) {
                return NextResponse.json({ error: 'Internal blocked' }, { status: 403 });
            }
        } catch { return NextResponse.json({ error: 'Invalid URL' }, { status: 400 }); }

        // Fetch HTML Head only (try to save bandwidth)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

        const res = await fetch(url, {
            headers: { 'User-Agent': 'NabdBot-Preview/1.0' },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) throw new Error('Failed fetch');

        // Parse meta tags using Regex (Cheerio is heavy for edge)
        const html = await res.text();

        // Simple regex extraction for OG tags
        const getMeta = (prop: string) => {
            const match = html.match(new RegExp(`<meta property="${prop}" content="(.*?)"`, 'i')) ||
                html.match(new RegExp(`<meta name="${prop}" content="(.*?)"`, 'i'));
            return match ? match[1] : null;
        };

        const title = getMeta('og:title') || getMeta('twitter:title') || html.match(/<title>(.*?)<\/title>/i)?.[1] || '';
        const description = getMeta('og:description') || getMeta('description') || '';
        const image = getMeta('og:image') || getMeta('twitter:image') || '';

        return NextResponse.json({ title, description, image, url });

    } catch (error) {
        return NextResponse.json({ error: 'Preview failed' }, { status: 500 });
    }
}
