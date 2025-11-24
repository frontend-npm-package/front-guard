import DOMPurify from 'dompurify';

export interface SanitizeOptions {
    /**
     * If true, removes all HTML tags, leaving only text.
     */
    stripTags?: boolean;
    /**
     * Max length of the input string.
     */
    maxLength?: number;
    /**
     * If true, normalizes unicode characters to NFKC form.
     */
    normalizeUnicode?: boolean;
}

const DEFAULT_OPTIONS: SanitizeOptions = {
    stripTags: true,
    normalizeUnicode: true,
};

/**
 * Sanitizes user input strings (e.g. for form fields).
 * Removes HTML tags, scripts, and normalizes unicode.
 */
export const sanitizeInput = (input: string, options: SanitizeOptions = {}): string => {
    if (!input) return '';

    const opts = { ...DEFAULT_OPTIONS, ...options };
    let clean = input;

    // 1. Normalize Unicode (prevents some obfuscation attacks)
    if (opts.normalizeUnicode) {
        clean = clean.normalize('NFKC');
    }

    // 2. Strip Control Characters (except newlines/tabs)
    // eslint-disable-next-line no-control-regex
    clean = clean.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '');

    // 3. Basic HTML Tag Stripping (if enabled)
    if (opts.stripTags) {
        // Remove script and style tags AND their content first
        clean = clean.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
        clean = clean.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "");
        // Then strip remaining tags
        clean = clean.replace(/<\/?[^>]+(>|$)/g, "");
    } else {
        // If tags are allowed, we still MUST remove script tags and dangerous attributes
        // We use DOMPurify for this if we are allowing some HTML
        clean = sanitizeHtml(clean);
    }

    // 4. Max Length Truncation
    if (opts.maxLength && clean.length > opts.maxLength) {
        clean = clean.slice(0, opts.maxLength);
    }

    return clean;
};

/**
 * Sanitizes HTML content for safe rendering.
 * Uses DOMPurify to strip XSS vectors while preserving safe HTML.
 */
export const sanitizeHtml = (html: string): string => {
    if (typeof window === 'undefined') {
        // Server-side: We need a DOM implementation. 
        // If JSDOM is not available, we return a warning or a basic strip.
        // For this implementation, we assume client-side usage or JSDOM presence for full safety.
        // TODO: Add JSDOM fallback or lightweight server-side parser.
        return html;
    }

    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true }, // Only allow HTML
        ADD_ATTR: ['target'], // Allow target="_blank" etc.
    });
};
