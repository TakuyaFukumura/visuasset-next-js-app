/**
 * AssetTable コンポーネントのテスト
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import AssetTable from '../../../../src/app/components/AssetTable';
import '@testing-library/jest-dom';
import type {AssetData} from '../../../../lib/parseAssets';

const sampleData: AssetData[] = [
    {year: 2020, stocks: 100, cash: 200, crypto: 50},
    {year: 2021, stocks: 150, cash: 220, crypto: 80},
];

describe('AssetTable', () => {
    describe('基本的なレンダリング', () => {
        it('テーブルが表示される', () => {
            render(<AssetTable data={sampleData}/>);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('ヘッダー列が表示される', () => {
            render(<AssetTable data={sampleData}/>);
            expect(screen.getByText('年')).toBeInTheDocument();
            expect(screen.getByText('株式（万円）')).toBeInTheDocument();
            expect(screen.getByText('現預金（万円）')).toBeInTheDocument();
            expect(screen.getByText('暗号資産（万円）')).toBeInTheDocument();
            expect(screen.getByText('合計（万円）')).toBeInTheDocument();
        });

        it('データ行が正しい数だけ表示される', () => {
            render(<AssetTable data={sampleData}/>);
            const rows = screen.getAllByRole('row');
            // ヘッダー行 1 行 + データ行 2 行
            expect(rows).toHaveLength(3);
        });

        it('年が正しく表示される', () => {
            render(<AssetTable data={sampleData}/>);
            expect(screen.getByText('2020')).toBeInTheDocument();
            expect(screen.getByText('2021')).toBeInTheDocument();
        });

        it('各資産額が正しく表示される', () => {
            render(<AssetTable data={sampleData}/>);
            expect(screen.getByText('100')).toBeInTheDocument();
            expect(screen.getByText('200')).toBeInTheDocument();
            expect(screen.getByText('50')).toBeInTheDocument();
        });
    });

    describe('合計値の計算', () => {
        it('合計が正しく計算される（100 + 200 + 50 = 350）', () => {
            render(<AssetTable data={sampleData}/>);
            expect(screen.getByText('350')).toBeInTheDocument();
        });

        it('合計が正しく計算される（150 + 220 + 80 = 450）', () => {
            render(<AssetTable data={sampleData}/>);
            expect(screen.getByText('450')).toBeInTheDocument();
        });
    });

    describe('空データ', () => {
        it('データが空の場合もヘッダーは表示される', () => {
            render(<AssetTable data={[]}/>);
            expect(screen.getByText('年')).toBeInTheDocument();
            const rows = screen.getAllByRole('row');
            // ヘッダー行のみ
            expect(rows).toHaveLength(1);
        });
    });
});
