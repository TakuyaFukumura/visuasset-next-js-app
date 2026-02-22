/**
 * SimulationTable コンポーネントのテスト
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import SimulationTable from '../../../../src/app/components/SimulationTable';
import '@testing-library/jest-dom';
import type {SimulationDataPoint} from '../../../../src/app/components/SimulationChart';

const sampleData: SimulationDataPoint[] = [
    {year: 2025, age: 28, nominal: 1190, real: 1190},
    {year: 2026, age: 29, nominal: 1250, real: 1225},
    {year: 2027, age: 30, nominal: 1313, real: 1261},
];

describe('SimulationTable', () => {
    describe('基本的なレンダリング', () => {
        it('テーブルが表示される', () => {
            render(<SimulationTable data={sampleData}/>);
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        it('ヘッダー列が表示される', () => {
            render(<SimulationTable data={sampleData}/>);
            expect(screen.getByText('年')).toBeInTheDocument();
            expect(screen.getByText('年齢（歳）')).toBeInTheDocument();
            expect(screen.getByText('名目資産額（万円）')).toBeInTheDocument();
            expect(screen.getByText('実質価値（万円）')).toBeInTheDocument();
        });

        it('データ行が正しい数だけ表示される（ヘッダー行 + データ行）', () => {
            render(<SimulationTable data={sampleData}/>);
            const rows = screen.getAllByRole('row');
            // ヘッダー行 1 行 + データ行 3 行
            expect(rows).toHaveLength(4);
        });
    });

    describe('データの表示', () => {
        it('年が正しく表示される', () => {
            render(<SimulationTable data={sampleData}/>);
            expect(screen.getByText('2025')).toBeInTheDocument();
            expect(screen.getByText('2026')).toBeInTheDocument();
            expect(screen.getByText('2027')).toBeInTheDocument();
        });

        it('年齢が正しく表示される', () => {
            render(<SimulationTable data={sampleData}/>);
            expect(screen.getByText('28')).toBeInTheDocument();
            expect(screen.getByText('29')).toBeInTheDocument();
            expect(screen.getByText('30')).toBeInTheDocument();
        });

        it('名目資産額が正しく表示される', () => {
            render(<SimulationTable data={sampleData}/>);
            expect(screen.getAllByText('1,190').length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText('1,250')).toBeInTheDocument();
            expect(screen.getByText('1,313')).toBeInTheDocument();
        });

        it('実質価値が正しく表示される', () => {
            render(<SimulationTable data={sampleData}/>);
            expect(screen.getByText('1,225')).toBeInTheDocument();
            expect(screen.getByText('1,261')).toBeInTheDocument();
        });
    });

    describe('空データ', () => {
        it('データが空の場合もヘッダーは表示される', () => {
            render(<SimulationTable data={[]}/>);
            expect(screen.getByText('年')).toBeInTheDocument();
            expect(screen.getByText('年齢（歳）')).toBeInTheDocument();
            expect(screen.getByText('名目資産額（万円）')).toBeInTheDocument();
            expect(screen.getByText('実質価値（万円）')).toBeInTheDocument();
        });

        it('データが空の場合はデータ行が表示されない', () => {
            render(<SimulationTable data={[]}/>);
            const rows = screen.getAllByRole('row');
            // ヘッダー行のみ
            expect(rows).toHaveLength(1);
        });
    });
});
