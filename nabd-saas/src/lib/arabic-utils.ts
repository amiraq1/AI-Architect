/**
 * 🕌 Arabic Text Utilities
 * Helper functions to handle Arabic text processing, search, and formatting.
 */

/**
 * Normalizes Arabic text for flexible searching.
 * - Removes Tashkeel (Diacritics).
 * - Unifies Alef forms (أ، إ، آ -> ا).
 * - Unifies Yeh/Alef Maqsura (ى -> ي).
 * - Unifies Teh Marbuta (ة -> ه).
 */
export function normalizeArabic(text: string): string {
    if (!text) return "";

    let normalized = text;

    // Remove Tatweel (Kashida)
    normalized = normalized.replace(/\u0640/g, '');

    // Remove Tashkeel (Fatha, Damma, Kasra, etc.)
    normalized = normalized.replace(/[\u064B-\u065F]/g, '');

    // Unify Alef
    normalized = normalized.replace(/[أإآ]/g, 'ا');

    // Unify Yeh
    normalized = normalized.replace(/ى/g, 'ي');

    // Unify Teh Marbuta
    normalized = normalized.replace(/ة/g, 'ه');

    return normalized;
}

/**
 * Smart Search: Checks if a query exists in text using normalization.
 */
export function fuzzySearch(text: string, query: string): boolean {
    const normText = normalizeArabic(text);
    const normQuery = normalizeArabic(query);
    return normText.includes(normQuery);
}
