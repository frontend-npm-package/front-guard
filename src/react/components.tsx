import React from 'react';
import { sanitizeHtml, sanitizeInput } from '../core/sanitizer';

interface SafeHtmlProps {
    html: string;
    className?: string;
    as?: React.ElementType;
}

/**
 * Securely renders HTML content.
 * Automatically sanitizes the input using DOMPurify.
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className, as: Component = 'div' }) => {
    const cleanHtml = sanitizeHtml(html);

    return (
        <Component
            className={className}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    );
};

interface SafeTextProps {
    text: string;
    className?: string;
    as?: React.ElementType;
}

/**
 * Renders text safely by escaping HTML entities.
 * (React does this by default, but this is explicit).
 */
export const SafeText: React.FC<SafeTextProps> = ({ text, className, as: Component = 'span' }) => {
    return <Component className={className}>{text}</Component>;
};

/**
 * HOC to automatically sanitize specific props of a component.
 * @param Component The component to wrap
 * @param keys The keys of the props to sanitize
 */
export function withSanitizedProps<P extends object>(
    Component: React.ComponentType<P>,
    keys: (keyof P)[]
) {
    return (props: P) => {
        const sanitizedProps = { ...props };

        keys.forEach((key) => {
            if (typeof sanitizedProps[key] === 'string') {
                // @ts-ignore - we know it's a string
                sanitizedProps[key] = sanitizeInput(sanitizedProps[key] as string);
            }
        });

        return <Component {...sanitizedProps} />;
    };
}
