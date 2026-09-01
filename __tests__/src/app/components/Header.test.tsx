/**
 * Header コンポーネントのテスト
 *
 * このテストファイルは、src/app/components/Header.tsxの機能をテストします。
 * ダークモード/ライトモードの切り替えボタンとヘッダーの表示をテストしています。
 */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {DarkModeProvider} from '@/app/components/DarkModeProvider';
import Header from '../../../../src/app/components/Header';
import '@testing-library/jest-dom';

// usePathname のモック
const mockUsePathname = jest.fn<string | null, []>();
jest.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}));

describe('Header', () => {
    beforeEach(() => {
        mockUsePathname.mockReturnValue('/');
    });

    const renderWithProvider = (initialTheme?: 'light' | 'dark') => {
        if (initialTheme) {
            window.localStorage.getItem = jest.fn(() => initialTheme);
        }

        return render(
            <DarkModeProvider>
                <Header/>
            </DarkModeProvider>
        );
    };

    describe('基本的なレンダリング', () => {
        it('ヘッダータイトルが表示される', () => {
            renderWithProvider();

            expect(screen.getByText('visuasset')).toBeInTheDocument();
        });

        it('ヘッダーのHTML構造が正しい', () => {
            renderWithProvider();

            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();
            expect(header.tagName).toBe('HEADER');
        });

        it('テーマ切り替えボタンが表示される', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            expect(button).toBeInTheDocument();
        });
    });

    describe('ライトモード', () => {
        it('ライトモード時に太陽アイコンが表示される', () => {
            renderWithProvider('light');

            expect(screen.getByText('☀️')).toBeInTheDocument();
        });

        it('ライトモードのテキストラベルが表示されない', () => {
            renderWithProvider('light');

            expect(screen.queryByText('ライトモード')).not.toBeInTheDocument();
        });

        it('ボタンのtitle属性が正しく設定される', () => {
            renderWithProvider('light');

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            expect(button).toHaveAttribute('title', 'テーマを切り替え');
        });
    });

    describe('ダークモード', () => {
        it('ダークモード時に月アイコンが表示される', () => {
            window.localStorage.setItem('theme', 'dark');
            renderWithProvider();

            expect(screen.getByText('🌙')).toBeInTheDocument();
        });

        it('ダークモードのテキストラベルが表示されない', () => {
            window.localStorage.setItem('theme', 'dark');
            renderWithProvider();

            expect(screen.queryByText('ダークモード')).not.toBeInTheDocument();
        });

        it('ボタンのtitle属性が正しく設定される', () => {
            renderWithProvider('dark');

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            expect(button).toHaveAttribute('title', 'テーマを切り替え');
        });
    });

    describe('テーマ切り替え機能', () => {
        it('ライトモードからダークモードに切り替わる', () => {
            window.localStorage.setItem('theme', 'light');
            renderWithProvider();

            // 初期状態の確認
            expect(screen.getByText('☀️')).toBeInTheDocument();

            // ボタンをクリック
            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            fireEvent.click(button);

            // ダークモードに変更されたことを確認
            expect(screen.getByText('🌙')).toBeInTheDocument();
            expect(screen.queryByText('ダークモード')).not.toBeInTheDocument();
        });

        it('ダークモードからライトモードに切り替わる', () => {
            renderWithProvider('dark');

            // 初期状態の確認
            expect(screen.getByText('🌙')).toBeInTheDocument();

            // ボタンをクリック
            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            fireEvent.click(button);

            // ライトモードに変更されたことを確認
            expect(screen.getByText('☀️')).toBeInTheDocument();
            expect(screen.queryByText('ライトモード')).not.toBeInTheDocument();
        });

        it('複数回のクリックで正しく切り替わる', () => {
            renderWithProvider('light');

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});

            // ライトモード → ダークモード
            fireEvent.click(button);
            expect(screen.getByText('🌙')).toBeInTheDocument();

            // ダークモード → ライトモード
            fireEvent.click(button);
            expect(screen.getByText('☀️')).toBeInTheDocument();

            // ライトモード → ダークモード
            fireEvent.click(button);
            expect(screen.getByText('🌙')).toBeInTheDocument();
        });
    });

    describe('ボタンのアクセシビリティ', () => {
        it('ボタンがキーボードでアクセス可能', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            expect(button).toBeInTheDocument();

            // タブキーでフォーカス可能かを確認
            button.focus();
            expect(button).toHaveFocus();
        });

        it('適切なaria属性が設定されている', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});

            // title属性による説明があることを確認
            expect(button).toHaveAttribute('title');
            expect(button.getAttribute('title')).toBe('テーマを切り替え');
        });
    });

    describe('レスポンシブデザイン', () => {
        beforeEach(() => {
            window.localStorage.setItem('theme', 'light');
            renderWithProvider();
        });

        it('テキストラベルが適切なクラスで制御されている', () => {
            // 'hidden sm:inline' クラスでモバイルでは非表示になることを想定
            expect(screen.queryByText('ライトモード')).not.toBeInTheDocument();
        });

        it('アイコンが常に表示される', () => {

            const icon = screen.getByText('☀️');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('CSS クラスの適用', () => {
        it('ヘッダーに適切なスタイルクラスが適用される', () => {
            renderWithProvider();

            const header = screen.getByRole('banner');
            expect(header).toHaveClass('bg-white/80', 'dark:bg-gray-800/80');
        });

        it('ボタンに適切なスタイルクラスが適用される', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'テーマを切り替え'});
            expect(button).toHaveClass('flex', 'items-center');
        });
    });

    describe('ナビゲーション', () => {
        it('資産推移リンクが表示される', () => {
            renderWithProvider();
            expect(screen.getByText('資産推移')).toBeInTheDocument();
        });

        it('資産ポートフォリオリンクが表示される', () => {
            renderWithProvider();
            expect(screen.getByText('資産ポートフォリオ')).toBeInTheDocument();
        });

        it('資産推移リンクのhref属性が正しい', () => {
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産推移'});
            expect(link).toHaveAttribute('href', '/');
        });

        it('資産ポートフォリオリンクのhref属性が正しい', () => {
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産ポートフォリオ'});
            expect(link).toHaveAttribute('href', '/portfolio');
        });

        it('トップページ（/）ではリンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/');
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産推移'});
            expect(link).toHaveClass('text-blue-600');
        });

        it('トップページ（/）ではポートフォリオリンクが非アクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/');
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産ポートフォリオ'});
            expect(link).not.toHaveClass('text-blue-600');
        });

        it('ポートフォリオページ（/portfolio）ではポートフォリオリンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/portfolio');
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産ポートフォリオ'});
            expect(link).toHaveClass('text-blue-600');
        });

        it('ポートフォリオページ（/portfolio）では資産推移リンクが非アクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/portfolio');
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産推移'});
            expect(link).not.toHaveClass('text-blue-600');
        });

        it('資産シミュレーションリンクが表示される', () => {
            renderWithProvider();
            expect(screen.getByText('資産シミュレーション')).toBeInTheDocument();
        });

        it('資産シミュレーションリンクのhref属性が正しい', () => {
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産シミュレーション'});
            expect(link).toHaveAttribute('href', '/simulation');
        });

        it('シミュレーションページ（/simulation）ではシミュレーションリンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/simulation');
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産シミュレーション'});
            expect(link).toHaveClass('text-blue-600');
        });

        it('シミュレーションページ（/simulation）では資産推移リンクが非アクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/simulation');
            renderWithProvider();
            const link = screen.getByRole('link', {name: '資産推移'});
            expect(link).not.toHaveClass('text-blue-600');
        });
    });

    describe('ハンバーガーメニュー', () => {
        it('ハンバーガーボタンが表示される', () => {
            renderWithProvider();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            expect(hamburgerButton).toBeInTheDocument();
        });

        it('ハンバーガーボタンにaria-expanded属性が設定される', () => {
            renderWithProvider();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('ハンバーガーボタンをクリックするとメニューが開く', () => {
            renderWithProvider();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(hamburgerButton);
            expect(screen.getByRole('button', {name: 'メニューを閉じる'})).toBeInTheDocument();
        });

        it('メニューを開くと☰が✕に変わる', () => {
            renderWithProvider();
            expect(screen.getByText('☰')).toBeInTheDocument();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(hamburgerButton);
            expect(screen.getByText('✕')).toBeInTheDocument();
        });

        it('メニューを閉じると✕が☰に変わる', () => {
            renderWithProvider();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(hamburgerButton);
            const closeButton = screen.getByRole('button', {name: 'メニューを閉じる'});
            fireEvent.click(closeButton);
            expect(screen.getByText('☰')).toBeInTheDocument();
        });

        it('メニューを開くとナビゲーションリンクがドロップダウン内に表示される', () => {
            renderWithProvider();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(hamburgerButton);
            expect(screen.getAllByRole('link', {name: '資産推移'}).length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByRole('link', {name: '資産ポートフォリオ'}).length).toBeGreaterThanOrEqual(1);
            expect(screen.getAllByRole('link', {name: '資産シミュレーション'}).length).toBeGreaterThanOrEqual(1);
        });

        it('ドロップダウン内のリンクをクリックするとメニューが閉じる', () => {
            renderWithProvider();
            const hamburgerButton = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(hamburgerButton);
            const portfolioLinks = screen.getAllByRole('link', {name: '資産ポートフォリオ'});
            fireEvent.click(portfolioLinks[portfolioLinks.length - 1]);
            expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
        });
    });
});
