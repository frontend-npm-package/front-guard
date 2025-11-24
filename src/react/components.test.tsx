/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { SafeHtml, SafeText, withSanitizedProps } from './components';
import { useSafeInput } from './hooks';
import { SecurityProvider } from './provider';

describe('SafeHtml', () => {
    it('renders safe HTML correctly', () => {
        render(<SafeHtml html="<p>Hello</p>" />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hello').tagName).toBe('P');
    });

    it('strips dangerous scripts', () => {
        const dangerous = '<div>Safe</div><script>alert(1)</script>';
        const { container } = render(<SafeHtml html={dangerous} />);
        expect(container.innerHTML).toContain('<div>Safe</div>');
        expect(container.innerHTML).not.toContain('<script>');
    });
});

describe('SafeText', () => {
    it('escapes HTML entities', () => {
        render(<SafeText text="<script>alert(1)</script>" />);
        expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
    });
});

describe('withSanitizedProps', () => {
    it('sanitizes specified props', () => {
        const TestComponent = ({ content, other }: { content: string; other: string }) => (
            <div data-testid="test">
                <span data-testid="content">{content}</span>
                <span data-testid="other">{other}</span>
            </div>
        );

        const SafeComponent = withSanitizedProps(TestComponent, ['content']);

        render(<SafeComponent content="<script>alert(1)</script>Safe" other="<script>Keep</script>" />);

        expect(screen.getByTestId('content').textContent).toBe('Safe');
        expect(screen.getByTestId('other').textContent).toBe('<script>Keep</script>');
    });
});

describe('useSafeInput', () => {
    it('sanitizes input updates', () => {
        const { result } = renderHook(() => useSafeInput(''));

        act(() => {
            result.current.setValue('<script>bad</script>Good');
        });

        expect(result.current.value).toBe('Good');
        expect(result.current.isSafe).toBe(false);
    });

    it('reports threats', () => {
        const { result } = renderHook(() => useSafeInput(''));

        act(() => {
            result.current.setValue('javascript:alert(1)');
        });

        expect(result.current.report?.threatLevel).toBe('dangerous');
    });
});

describe('SecurityProvider Strict Mode', () => {
    it('blocks dangerous input in strict mode', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <SecurityProvider config={{ strictMode: true }}>{children}</SecurityProvider>
        );

        const { result } = renderHook(() => useSafeInput(''), { wrapper });

        act(() => {
            result.current.setValue('<script>bad</script>');
        });

        // Should NOT update value because strict mode blocks dangerous input entirely
        expect(result.current.value).toBe('');
    });
});
