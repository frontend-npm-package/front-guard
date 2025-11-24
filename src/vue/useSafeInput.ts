import { ref, Ref } from 'vue';
import { sanitizeInput, SanitizeOptions } from '../core/sanitizer';
import { detectXSS, SecurityReport } from '../core/detector';

export interface SafeInputResult {
    value: Ref<string>;
    setValue: (val: string) => void;
    isSafe: Ref<boolean>;
    report: Ref<SecurityReport | null>;
}

export function useSafeInput(initialValue: string = '', options?: SanitizeOptions): SafeInputResult {
    const value = ref(initialValue);
    const isSafe = ref(true);
    const report = ref<SecurityReport | null>(null);

    const setValue = (newValue: string) => {
        const sanitized = sanitizeInput(newValue, options);
        const securityReport = detectXSS(newValue);

        value.value = sanitized;
        isSafe.value = securityReport.isSafe;
        report.value = securityReport;
    };

    return {
        value,
        setValue,
        isSafe,
        report
    };
}
