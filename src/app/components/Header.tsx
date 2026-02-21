'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useDarkMode} from './DarkModeProvider';

export default function Header() {
    const {theme, setTheme} = useDarkMode();
    const pathname = usePathname();

    const handleThemeToggle = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    const getThemeIcon = () => {
        if (theme === 'light') {
            return '☀️';
        } else {
            return '🌙';
        }
    };

    const getThemeLabel = () => {
        if (theme === 'light') {
            return 'ライトモード';
        } else {
            return 'ダークモード';
        }
    };

    const navLinkClass = (href: string) => {
        const isActive = pathname !== null && (pathname === href || (href !== '/' && pathname.startsWith(href)));
        return `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;
    };

    return (
        <header
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b
            border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-6">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            visuasset-next-js-app
                        </h1>
                        <nav className="flex items-center gap-1">
                            <Link href="/" className={navLinkClass('/')}>
                                資産推移
                            </Link>
                            <Link href="/portfolio" className={navLinkClass('/portfolio')}>
                                資産ポートフォリオ
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={handleThemeToggle}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                            rounded-lg transition-colors duration-200"
                            title={`現在: ${getThemeLabel()}`}
                        >
                            <span className="text-lg">{getThemeIcon()}</span>
                            <span className="hidden sm:inline">{getThemeLabel()}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
