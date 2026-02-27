/**
 * AssetMonthlyTable コンポーネントのテスト
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import AssetMonthlyTable from '../../../../src/app/components/AssetMonthlyTable';
import '@testing-library/jest-dom';
import type {MonthlyAssetData} from '../../../../lib/parseMonthlyAssets';

const sampleData: MonthlyAssetData[] = [
    {year: 2024, month: 1, stocks: 750, cash: 150, crypto: 35},
    {year: 2024, month: 12, stocks: 807, cash: 150, crypto: 40},
];

describe('AssetMonthlyTable', () => {
    describe('基本的なレンダリング', () => {
        it('テーブルが表示される', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('ヘッダー列が表示される', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByText('年月')).toBeInTheDocument();
            expect(screen.getByText('株式（万円）')).toBeInTheDocument();
            expect(screen.getByText('現預金（万円）')).toBeInTheDocument();
            expect(screen.getByText('暗号資産（万円）')).toBeInTheDocument();
            expect(screen.getByText('合計（万円）')).toBeInTheDocument();
        });

        it('データ行が正しい数だけ表示される', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            const rows = screen.getAllByRole('row');
            // ヘッダー行 1 行 + データ行 2 行
            expect(rows).toHaveLength(3);
        });
    });

    describe('年月フォーマット', () => {
        it('年月が YYYY/MM 形式で表示される', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByText('2024/01')).toBeInTheDocument();
            expect(screen.getByText('2024/12')).toBeInTheDocument();
        });

        it('月が1桁の場合は0埋めされる', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByText('2024/01')).toBeInTheDocument();
        });
    });

    describe('資産額の表示', () => {
        it('各資産額が正しく表示される', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByText('750')).toBeInTheDocument();
            expect(screen.getAllByText('150')).toHaveLength(2);
            expect(screen.getByText('35')).toBeInTheDocument();
        });
    });

    describe('合計値の計算', () => {
        it('合計が正しく計算される（750 + 150 + 35 = 935）', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByText('935')).toBeInTheDocument();
        });

        it('合計が正しく計算される（807 + 150 + 40 = 997）', () => {
            render(<AssetMonthlyTable data={sampleData}/>);
            expect(screen.getByText('997')).toBeInTheDocument();
        });
    });

    describe('空データ', () => {
        it('データが空の場合もヘッダーは表示される', () => {
            render(<AssetMonthlyTable data={[]}/>);
            expect(screen.getByText('年月')).toBeInTheDocument();
            const rows = screen.getAllByRole('row');
            // ヘッダー行のみ
            expect(rows).toHaveLength(1);
        });
    });
});
