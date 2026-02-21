/**
 * PortfolioChart コンポーネントのテスト
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import PortfolioChart from '../../../../src/app/components/PortfolioChart';
import '@testing-library/jest-dom';
import type {PortfolioEntry} from '../../../../src/app/types/portfolio';

// Recharts は jsdom 環境でグラフを描画できないためモックする
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({children}: { children: React.ReactNode }) => (
            <div data-testid="responsive-container">{children}</div>
        ),
        PieChart: ({children}: { children: React.ReactNode }) => (
            <div data-testid="pie-chart">{children}</div>
        ),
        Pie: ({data}: { data: PortfolioEntry[] }) => (
            <div data-testid="pie">
                {data.map((entry) => (
                    <div key={entry.name} data-testid={`pie-entry-${entry.name}`}>
                        {entry.name}: {entry.value}
                    </div>
                ))}
            </div>
        ),
        Tooltip: () => <div data-testid="tooltip"/>,
        Legend: () => <div data-testid="legend"/>,
    };
});

const sampleData: PortfolioEntry[] = [
    {name: '株式', value: 220, percentage: 37.9, fill: '#3b82f6'},
    {name: '現預金', value: 260, percentage: 44.8, fill: '#22c55e'},
    {name: '暗号資産', value: 100, percentage: 17.2, fill: '#f59e0b'},
];

describe('PortfolioChart', () => {
    describe('基本的なレンダリング', () => {
        it('コンポーネントがレンダリングされる', () => {
            render(<PortfolioChart data={sampleData}/>);
            expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        });

        it('PieChart がレンダリングされる', () => {
            render(<PortfolioChart data={sampleData}/>);
            expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        });

        it('Pie がレンダリングされる', () => {
            render(<PortfolioChart data={sampleData}/>);
            expect(screen.getByTestId('pie')).toBeInTheDocument();
        });
    });

    describe('データ表示', () => {
        it('すべてのジャンルが表示される', () => {
            render(<PortfolioChart data={sampleData}/>);
            expect(screen.getByTestId('pie-entry-株式')).toBeInTheDocument();
            expect(screen.getByTestId('pie-entry-現預金')).toBeInTheDocument();
            expect(screen.getByTestId('pie-entry-暗号資産')).toBeInTheDocument();
        });

        it('各ジャンルの金額が表示される', () => {
            render(<PortfolioChart data={sampleData}/>);
            expect(screen.getByText(/株式: 220/)).toBeInTheDocument();
            expect(screen.getByText(/現預金: 260/)).toBeInTheDocument();
            expect(screen.getByText(/暗号資産: 100/)).toBeInTheDocument();
        });
    });

    describe('空データ', () => {
        it('データが空の場合もレンダリングされる', () => {
            render(<PortfolioChart data={[]}/>);
            expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        });
    });
});
