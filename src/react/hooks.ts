import { useState, useCallback } from 'react';
import { sanitizeInput, SanitizeOptions } from '../core/sanitizer';
import { detectXSS, SecurityReport } from '../core/detector';
import { useSecurityConfig } from './provider';

export interface UseSafeInputResult {
    value: string;
    setValue: (newValue: string) => void;
    error: string | null;
    isSafe: boolean;
    report: SecurityReport | null;
}

export const useSafeInput = (initialValue: string = '', options?: SanitizeOptions): UseSafeInputResult => {
    const [value, setInternalValue] = useState(initialValue);
    const [report, setReport] = useState<SecurityReport | null>(null);
    const config = useSecurityConfig();

    const setValue = useCallback((newValue: string) => {
        // 1. Detect threats first
        const securityReport = detectXSS(newValue);
        setReport(securityReport);

        // 2. Check strict mode
        if (config.strictMode && !securityReport.isSafe) {
            if (config.devWarnings) {
                console.warn('[Front-Guard] Blocked dangerous input in strict mode:', securityReport.detectedPatterns);
            }
            return; // Block update
        }

        // 3. Sanitize
        const mergedOptions = { ...config.sanitizeOptions, ...options };
        const clean = sanitizeInput(newValue, mergedOptions);

        // Dev Logging (Before vs After)
        if (config.devWarnings && newValue !== clean) {
            console.groupCollapsed('%c[Front-Guard] Sanitized Input', 'color: orange; font-weight: bold;');
            console.log('%cOriginal:', 'color: red;', newValue);
            console.log('%cSanitized:', 'color: green;', clean);
            console.log('Removed:', newValue.length - clean.length, 'characters');
            console.groupEnd();
        }

        setInternalValue(clean);
    }, [config, options]);

    return {
        value,
        setValue,
        error: report?.isSafe === false ? 'Invalid characters detected' : null,
        isSafe: report?.isSafe ?? true,
        report
    };
};

export const useSanitized = (initialValue: string = '', options?: SanitizeOptions) => {
    const config = useSecurityConfig();
    const mergedOptions = { ...config.sanitizeOptions, ...options };
    return sanitizeInput(initialValue, mergedOptions);
};
