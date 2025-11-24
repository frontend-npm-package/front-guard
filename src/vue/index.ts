import { App, DirectiveBinding } from 'vue';
import { sanitizeHtml } from '../core/sanitizer';

export const vSanitize = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        el.innerHTML = sanitizeHtml(binding.value);
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        if (binding.value !== binding.oldValue) {
            el.innerHTML = sanitizeHtml(binding.value);
        }
    }
};

export const FrontGuardVue = {
    install(app: App) {
        app.directive('sanitize', vSanitize);
    }
};

export * from './useSafeInput';
