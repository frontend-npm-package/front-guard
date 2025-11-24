/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeHtml } from './sanitizer';
import { detectXSS } from './detector';

describe('sanitizeInput', () => {
    it('removes script tags', () => {
        const input = 'Hello <script>alert(1)</script> World';
        expect(sanitizeInput(input)).toBe('Hello  World');
    });

    it('handles unicode normalization', () => {
        // \u003C is <, \u003E is >
        const input = '\u003Cscript\u003Ealert(1)\u003C/script\u003E';
        expect(sanitizeInput(input)).toBe('');
    });

    it('respects maxLength', () => {
        expect(sanitizeInput('1234567890', { maxLength: 5 })).toBe('12345');
    });
});

describe('detectXSS', () => {
    it('detects script tags', () => {
        const report = detectXSS('<script>alert(1)</script>');
        expect(report.isSafe).toBe(false);
        expect(report.threatLevel).toBe('dangerous');
        expect(report.detectedPatterns).toContain('Script Tag');
    });

    it('detects javascript protocol', () => {
        const report = detectXSS('javascript:alert(1)');
        expect(report.isSafe).toBe(false);
        expect(report.threatLevel).toBe('dangerous');
    });

    it('passes safe input', () => {
        const report = detectXSS('Hello World');
        expect(report.isSafe).toBe(true);
        expect(report.threatLevel).toBe('safe');
    });
});

describe('sanitizeHtml', () => {
    it('removes script tags but keeps safe html', () => {
        const input = '<div>Safe</div><script>Unsafe</script>';
        // Note: DOMPurify might return different spacing depending on version/env, 
        // but it should definitely remove the script.
        const output = sanitizeHtml(input);
        expect(output).toContain('<div>Safe</div>');
        expect(output).not.toContain('<script>');
        expect(output).not.toContain('Unsafe');
    });
});
