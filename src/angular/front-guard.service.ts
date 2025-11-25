import { Injectable } from '@angular/core';
import { sanitizeInput, sanitizeHtml, SanitizeOptions } from '../core/sanitizer';
import { detectXSS, SecurityReport } from '../core/detector';

@Injectable({
    providedIn: 'root',
})
export class FrontGuardService {
    /**
     * Sanitize plain-text input (removes HTML tags and dangerous characters)
     */
    sanitizeInput(value: string, options?: SanitizeOptions): string {
        return sanitizeInput(value, options);
    }

    /**
     * Sanitize HTML content while preserving safe tags and attributes
     */
    sanitizeHtml(value: string): string {
        return sanitizeHtml(value);
    }

    /**
     * Detect potential XSS threats in the input
     */
    detectXSS(value: string): SecurityReport {
        return detectXSS(value);
    }
}
