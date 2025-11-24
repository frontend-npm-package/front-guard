import { sanitizeInput, SanitizeOptions } from '../core/sanitizer';

/**
 * Zod transform function to sanitize strings.
 * Usage: z.string().transform(zodSanitize)
 */
export const zodSanitize = (val: unknown, options?: SanitizeOptions): string => {
    if (typeof val !== 'string') return String(val);
    return sanitizeInput(val, options);
};

/**
 * Yup transform function to sanitize strings.
 * Usage: yup.string().transform(yupSanitize)
 */
export function yupSanitize(this: any, value: any, _originalValue: any) {
    if (typeof value !== 'string') return value;
    return sanitizeInput(value);
}

/**
 * React Hook Form sanitizer adapter.
 * Usage: register("name", { setValueAs: sanitizeRHF })
 */
export const sanitizeRHF = (value: any): any => {
    if (typeof value !== 'string') return value;
    return sanitizeInput(value);
};
