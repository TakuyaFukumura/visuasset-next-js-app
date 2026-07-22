'use client';

import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from 'react';

type Theme = 'light' | 'dark';

const isTheme = (value: string | null): value is Theme => value === 'light' || value === 'dark';

const getStoredTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const savedTheme = localStorage.getItem('theme');
    return isTheme(savedTheme) ? savedTheme : 'light';
};

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({children}: { readonly children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);
    const isDark = theme === 'dark';

    useEffect(() => {
        // HTMLタグにdarkクラスを追加/削除
        if (isDark) {
            document.documentElement.classList.add('dark');
            return;
        }

        document.documentElement.classList.remove('dark');
    }, [isDark]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const value = useMemo(() => ({theme, setTheme: handleSetTheme, isDark}), [theme, isDark]);

    return (
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
