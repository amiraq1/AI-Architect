/**
 * 🕸️ HTML Content Extractor
 * A lightweight utility to clean HTML and extract readable text.
 * Replaces heavy libraries like 'cheerio' or 'jsdom' for Edge compatibility.
 */

export function extractContent(html: string) {
    // 1. Basic Title Extraction
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'No Title';

    // 2. Remove Scripts and Styles
    let text = html
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
        .replace(/<noscript\b[^>]*>([\s\S]*?)<\/noscript>/gim, "")
        .replace(/<!--[\s\S]*?-->/g, "");

    // 3. Remove Navigation/Header/Footer commonly found tags
    // (This is a regex approximation, strictly for simple scraping)
    text = text
        .replace(/<nav\b[^>]*>([\s\S]*?)<\/nav>/gim, "")
        .replace(/<header\b[^>]*>([\s\S]*?)<\/header>/gim, "")
        .replace(/<footer\b[^>]*>([\s\S]*?)<\/footer>/gim, "");

    // 4. Extract Body Content
    // Strip all tags
    text = text.replace(/<[^>]+>/g, ' ');

    // 5. Clean Whitespace
    text = text
        .replace(/\s+/g, ' ')
        .trim();

    return { title, text };
}
