export type ThreatLevel = 'safe' | 'suspicious' | 'dangerous';

export interface SecurityReport {
    isSafe: boolean;
    threatLevel: ThreatLevel;
    detectedPatterns: string[];
}

const DANGEROUS_PATTERNS = [
    { name: 'Script Tag', regex: /<script\b[^>]*>([\s\S]*?)<\/script>/gim },
    { name: 'Inline Event Handler', regex: /\son[a-z]+\s*=/gim },
    { name: 'Javascript Protocol', regex: /javascript:/gim },
    { name: 'VBScript Protocol', regex: /vbscript:/gim },
    { name: 'Data Protocol', regex: /data:text\/html/gim },
    { name: 'Iframe Tag', regex: /<iframe\b[^>]*>/gim },
    { name: 'Object/Embed Tag', regex: /<(object|embed)\b[^>]*>/gim },
    { name: 'Base64 Obfuscation', regex: /base64\s*,/gim }, // Simple check, can be refined
];

const SUSPICIOUS_PATTERNS = [
    { name: 'HTML Entity Encoding', regex: /&#[xX]?[0-9a-fA-F]+;/g },
    { name: 'Unicode Escapes', regex: /\\u[0-9a-fA-F]{4}/g },
];

export const detectXSS = (input: string): SecurityReport => {
    const detectedPatterns: string[] = [];
    let threatLevel: ThreatLevel = 'safe';

    // Check Dangerous Patterns
    for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.regex.test(input)) {
            detectedPatterns.push(pattern.name);
            threatLevel = 'dangerous';
        }
    }

    // Check Suspicious Patterns (only if not already dangerous)
    if (threatLevel !== 'dangerous') {
        for (const pattern of SUSPICIOUS_PATTERNS) {
            if (pattern.regex.test(input)) {
                detectedPatterns.push(pattern.name);
                if (threatLevel === 'safe') threatLevel = 'suspicious';
            }
        }
    }

    return {
        isSafe: threatLevel === 'safe',
        threatLevel,
        detectedPatterns,
    };
};
