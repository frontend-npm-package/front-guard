import React, { createContext, useContext, ReactNode } from 'react';
import { SanitizeOptions } from '../core/sanitizer';

export interface SecurityConfig {
    /**
     * Global sanitization options.
     */
    sanitizeOptions?: SanitizeOptions;
    /**
     * If true, logs security warnings to the console in development.
     * @default true
     */
    devWarnings?: boolean;
    /**
     * If true, throws errors when dangerous content is detected.
     * @default false
     */
    strictMode?: boolean;
}

const DEFAULT_CONFIG: SecurityConfig = {
    devWarnings: true,
    strictMode: false,
    sanitizeOptions: {
        stripTags: true,
        normalizeUnicode: true,
    },
};

const SecurityContext = createContext<SecurityConfig>(DEFAULT_CONFIG);

export const SecurityProvider: React.FC<{ children: ReactNode; config?: SecurityConfig }> = ({
    children,
    config = {}
}) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config, sanitizeOptions: { ...DEFAULT_CONFIG.sanitizeOptions, ...config.sanitizeOptions } };

    return (
        <SecurityContext.Provider value={mergedConfig}>
            {children}
        </SecurityContext.Provider>
    );
};

export const useSecurityConfig = () => useContext(SecurityContext);
