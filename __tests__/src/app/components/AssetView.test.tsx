/**
 * AssetView コンポーネントのテスト
 */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import AssetView from '../../../../src/app/components/AssetView';
import '@testing-library/jest-dom';
import type {AssetData} from '../../../../lib/parseAssets';
import type {MonthlyAssetData} from '../../../../lib/parseMonthlyAssets';

// Recharts は jsdom 環境でグラフを描画できないためモックする
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({children}: { children: React.ReactNode }) => (
            <div data-testid="responsive-container">{children}</div>
        ),
        BarChart: ({children}: { children: React.ReactNode }) => (
            <div data-testid="bar-chart">{children}</div>
        ),
        LineChart: ({children}: { children: React.ReactNode }) => (
            <div data-testid="line-chart">{children}</div>
        ),
        Bar: ({name}: { name: string }) => <div data-testid={`bar-${name}`}/>,
        Line: ({name}: { name: string }) => <div data-testid={`line-${name}`}/>,
        CartesianGrid: () => <div data-testid="cartesian-grid"/>,
        XAxis: () => <div data-testid="x-axis"/>,
        YAxis: () => <div data-testid="y-axis"/>,
        Tooltip: () => <div data-testid="tooltip"/>,
        Legend: () => <div data-testid="legend"/>,
    };
});

const sampleYearlyData: AssetData[] = [
    {year: 2024, stocks: 807, cash: 150, crypto: 40},
];

const sampleMonthlyData: MonthlyAssetData[] = [
    {year: 2024, month: 1, stocks: 750, cash: 150, crypto: 35},
    {year: 2024, month: 12, stocks: 807, cash: 150, crypto: 40},
];

describe('AssetView', () => {
    describe('デフォルト表示（年次モード）', () => {
        it('年次ボタンが表示される', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            expect(screen.getByText('年次')).toBeInTheDocument();
        });

        it('月次ボタンが表示される', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            expect(screen.getByText('月次')).toBeInTheDocument();
        });

        it('デフォルトで年次ボタンが選択状態（aria-pressed）である', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            const yearlyButton = screen.getByText('年次');
            expect(yearlyButton).toHaveAttribute('aria-pressed', 'true');
        });

        it('デフォルトで月次ボタンが非選択状態（aria-pressed）である', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            const monthlyButton = screen.getByText('月次');
            expect(monthlyButton).toHaveAttribute('aria-pressed', 'false');
        });

        it('デフォルトで棒グラフ（年次）が表示される', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        });

        it('デフォルトで折れ線グラフ（月次）は表示されない', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
        });
    });

    describe('月次モードへの切り替え', () => {
        it('月次ボタンをクリックすると折れ線グラフが表示される', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            fireEvent.click(screen.getByText('月次'));
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        it('月次ボタンをクリックすると棒グラフが非表示になる', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            fireEvent.click(screen.getByText('月次'));
            expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
        });

        it('月次モード切り替え後に月次ボタンが選択状態（aria-pressed）になる', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            fireEvent.click(screen.getByText('月次'));
            expect(screen.getByText('月次')).toHaveAttribute('aria-pressed', 'true');
            expect(screen.getByText('年次')).toHaveAttribute('aria-pressed', 'false');
        });

        it('月次→年次と切り替えると棒グラフが再表示される', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={sampleMonthlyData} monthlyError={null}/>);
            fireEvent.click(screen.getByText('月次'));
            fireEvent.click(screen.getByText('年次'));
            expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
            expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
        });
    });

    describe('月次エラー時の表示', () => {
        it('monthlyError がある場合、月次モードでエラーメッセージが表示される', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={null} monthlyError="月次データの読み込みに失敗しました"/>);
            fireEvent.click(screen.getByText('月次'));
            expect(screen.getByText('月次データの読み込みに失敗しました')).toBeInTheDocument();
        });

        it('monthlyError がある場合、月次モードで折れ線グラフは表示されない', () => {
            render(<AssetView yearlyData={sampleYearlyData} monthlyData={null} monthlyError="月次データの読み込みに失敗しました"/>);
            fireEvent.click(screen.getByText('月次'));
            expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
        });
    });
});
