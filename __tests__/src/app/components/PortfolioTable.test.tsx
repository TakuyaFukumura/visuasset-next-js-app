/**
 * PortfolioTable コンポーネントのテスト
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import PortfolioTable from '../../../../src/app/components/PortfolioTable';
import '@testing-library/jest-dom';
import type {PortfolioEntry} from '../../../../src/app/types/portfolio';

const sampleData: PortfolioEntry[] = [
    {name: '株式', value: 220, percentage: 37.931034482758626, fill: '#3b82f6'},
    {name: '現預金', value: 260, percentage: 44.827586206896555, fill: '#22c55e'},
    {name: '暗号資産', value: 100, percentage: 17.241379310344826, fill: '#f59e0b'},
];
const sampleTotal = 580;

describe('PortfolioTable', () => {
    describe('基本的なレンダリング', () => {
        it('テーブルが表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('ヘッダー列が表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('ジャンル')).toBeInTheDocument();
            expect(screen.getByText('金額（万円）')).toBeInTheDocument();
            expect(screen.getByText('割合（%）')).toBeInTheDocument();
        });

        it('データ行が正しい数だけ表示される（ヘッダー + データ行 + 合計行）', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            const rows = screen.getAllByRole('row');
            // ヘッダー行 1 行 + データ行 3 行 + 合計行 1 行
            expect(rows).toHaveLength(5);
        });

        it('ジャンル名が正しく表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('株式')).toBeInTheDocument();
            expect(screen.getByText('現預金')).toBeInTheDocument();
            expect(screen.getByText('暗号資産')).toBeInTheDocument();
        });

        it('金額が正しく表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('220')).toBeInTheDocument();
            expect(screen.getByText('260')).toBeInTheDocument();
            expect(screen.getByText('100')).toBeInTheDocument();
        });
    });

    describe('割合の表示', () => {
        it('割合が小数点第1位まで表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('37.9')).toBeInTheDocument();
            expect(screen.getByText('44.8')).toBeInTheDocument();
            expect(screen.getByText('17.2')).toBeInTheDocument();
        });
    });

    describe('合計行', () => {
        it('合計行が表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('合計')).toBeInTheDocument();
        });

        it('合計金額が正しく表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('580')).toBeInTheDocument();
        });

        it('合計割合が100.0と表示される', () => {
            render(<PortfolioTable data={sampleData} total={sampleTotal} />);
            expect(screen.getByText('100.0')).toBeInTheDocument();
        });
    });

    describe('空データ', () => {
        it('データが空の場合もヘッダーと合計行は表示される', () => {
            render(<PortfolioTable data={[]} total={0} />);
            expect(screen.getByText('ジャンル')).toBeInTheDocument();
            expect(screen.getByText('合計')).toBeInTheDocument();
        });
    });
});
