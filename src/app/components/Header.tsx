'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {useDarkMode} from './DarkModeProvider';

export default function Header() {
    const {theme, setTheme} = useDarkMode();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

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
        const isActive =
            pathname !== null &&
            (pathname === href ||
                (href !== '/' && (pathname.startsWith(href + '/') || pathname.startsWith(href + '?'))));
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
                    <div className="flex items-center gap-2 sm:gap-6">
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="sm:hidden flex items-center justify-center px-2 py-2 text-gray-700
                            dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                            rounded-lg transition-colors duration-200"
                            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                            aria-expanded={menuOpen}
                        >
                            <span className="text-xl">{menuOpen ? '✕' : '☰'}</span>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            visuasset
                        </h1>
                        <nav className="hidden sm:flex items-center gap-1">
                            <Link href="/" className={navLinkClass('/')}>
                                資産推移
                            </Link>
                            <Link href="/portfolio" className={navLinkClass('/portfolio')}>
                                資産ポートフォリオ
                            </Link>
                            <Link href="/simulation" className={navLinkClass('/simulation')}>
                                資産シミュレーション
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleThemeToggle}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                            rounded-lg transition-colors duration-200"
                            title={`現在: ${getThemeLabel()}`}
                            aria-label={`現在: ${getThemeLabel()}`}
                        >
                            <span className="text-lg">{getThemeIcon()}</span>
                            <span className="hidden sm:inline">{getThemeLabel()}</span>
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden border-t border-gray-200 dark:border-gray-700
                    bg-white/95 dark:bg-gray-800/95">
                    <nav className="flex flex-col px-4 py-2 gap-1">
                        <Link href="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>
                            資産推移
                        </Link>
                        <Link
                            href="/portfolio"
                            className={navLinkClass('/portfolio')}
                            onClick={() => setMenuOpen(false)}
                        >
                            資産ポートフォリオ
                        </Link>
                        <Link
                            href="/simulation"
                            className={navLinkClass('/simulation')}
                            onClick={() => setMenuOpen(false)}
                        >
                            資産シミュレーション
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
