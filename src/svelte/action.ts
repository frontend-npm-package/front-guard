import { sanitizeInput, SanitizeOptions } from '../core/sanitizer';

export function sanitize(node: HTMLInputElement | HTMLTextAreaElement, options?: SanitizeOptions) {
    const handleInput = (event: Event) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const value = target.value;
        const sanitized = sanitizeInput(value, options);

        if (value !== sanitized) {
            target.value = sanitized;
            // Dispatch input event to notify other listeners (like Svelte bindings)
            target.dispatchEvent(new Event('input'));
        }
    };

    node.addEventListener('input', handleInput);

    return {
        destroy() {
            node.removeEventListener('input', handleInput);
        }
    };
}
