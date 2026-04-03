import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemDark ? 'dark' : 'light');
    } else {
        root.classList.add(theme);
    }
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('hrm-theme') as Theme | null;
        return stored ?? 'system';
    });

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem('hrm-theme', theme);
    }, [theme]);

    // Listen for system preference changes when in 'system' mode
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => applyTheme('system');
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    return { theme, setTheme };
}
