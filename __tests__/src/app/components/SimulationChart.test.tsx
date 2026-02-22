/**
 * SimulationChart コンポーネントのテスト
 */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import SimulationChart, {calcSimulation} from '../../../../src/app/components/SimulationChart';
import '@testing-library/jest-dom';
import type {AssetData} from '../../../../lib/parseAssets';

// Recharts は jsdom 環境でグラフを描画できないためモックする
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({children}: {children: React.ReactNode}) => (
            <div data-testid="responsive-container">{children}</div>
        ),
        LineChart: ({children}: {children: React.ReactNode}) => (
            <div data-testid="line-chart">{children}</div>
        ),
        Line: ({name}: {name: string}) => <div data-testid={`line-${name}`}/>,
        CartesianGrid: () => <div data-testid="cartesian-grid"/>,
        XAxis: () => <div data-testid="x-axis"/>,
        YAxis: () => <div data-testid="y-axis"/>,
        Tooltip: () => <div data-testid="tooltip"/>,
        Legend: () => <div data-testid="legend"/>,
    };
});

const sampleData: AssetData = {year: 2025, stocks: 1000, cash: 150, crypto: 40};

describe('SimulationChart', () => {
    describe('基本的なレンダリング', () => {
        it('コンポーネントがレンダリングされる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        });

        it('LineChart がレンダリングされる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        it('名目資産額の折れ線が表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByTestId('line-名目資産額')).toBeInTheDocument();
        });

        it('インフレ調整後実質価値の折れ線が表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByTestId('line-インフレ調整後実質価値')).toBeInTheDocument();
        });
    });

    describe('設定パネルの表示', () => {
        it('利回り入力フィールドが表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByLabelText('利回り（%）')).toBeInTheDocument();
        });

        it('インフレ率入力フィールドが表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByLabelText('インフレ率（%）')).toBeInTheDocument();
        });

        it('月々の積立額入力フィールドが表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByLabelText('月々の積立額（万円）')).toBeInTheDocument();
        });

        it('期間入力フィールドが表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByLabelText('期間（年）')).toBeInTheDocument();
        });

        it('開始年齢入力フィールドが表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByLabelText('開始年齢（歳）')).toBeInTheDocument();
        });
    });

    describe('デフォルト値の確認', () => {
        it('利回りのデフォルト値が 5 である', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('利回り（%）') as HTMLInputElement;
            expect(input.value).toBe('5');
        });

        it('インフレ率のデフォルト値が 2 である', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('インフレ率（%）') as HTMLInputElement;
            expect(input.value).toBe('2');
        });

        it('月々の積立額のデフォルト値が 0 である', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('月々の積立額（万円）') as HTMLInputElement;
            expect(input.value).toBe('0');
        });

        it('期間のデフォルト値が 30 である', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('期間（年）') as HTMLInputElement;
            expect(input.value).toBe('30');
        });

        it('開始年齢のデフォルト値が 28 である', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('開始年齢（歳）') as HTMLInputElement;
            expect(input.value).toBe('28');
        });
    });

    describe('設定値の変更', () => {
        it('利回りの値を変更できる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('利回り（%）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '7'}});
            expect(input.value).toBe('7');
        });

        it('インフレ率の値を変更できる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('インフレ率（%）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '3'}});
            expect(input.value).toBe('3');
        });

        it('月々の積立額の値を変更できる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('月々の積立額（万円）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '10'}});
            expect(input.value).toBe('10');
        });

        it('期間の値を変更できる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('期間（年）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '20'}});
            expect(input.value).toBe('20');
        });

        it('開始年齢の値を変更できる', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('開始年齢（歳）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '35'}});
            expect(input.value).toBe('35');
        });
    });

    describe('免責事項の表示', () => {
        it('免責事項テキストが表示される', () => {
            render(<SimulationChart latestData={sampleData}/>);
            expect(screen.getByText(/このシミュレーションは参考値です/)).toBeInTheDocument();
        });
    });

    describe('入力バリデーション', () => {
        it('利回りに負の値を入力しても設定が変わらない', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('利回り（%）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '-1'}});
            expect(input.value).toBe('5');
        });

        it('インフレ率に負の値を入力しても設定が変わらない', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('インフレ率（%）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '-1'}});
            expect(input.value).toBe('2');
        });

        it('月々の積立額に負の値を入力しても設定が変わらない', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('月々の積立額（万円）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '-1'}});
            expect(input.value).toBe('0');
        });

        it('期間に 0 を入力しても設定が変わらない', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('期間（年）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '0'}});
            expect(input.value).toBe('30');
        });

        it('開始年齢に負の値を入力しても設定が変わらない', () => {
            render(<SimulationChart latestData={sampleData}/>);
            const input = screen.getByLabelText('開始年齢（歳）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '-1'}});
            expect(input.value).toBe('28');
        });
    });
});

describe('calcSimulation', () => {
    const baseData: AssetData = {year: 2025, stocks: 1000, cash: 150, crypto: 40};

    it('n=0 のとき初期値がそのまま返る', () => {
        const result = calcSimulation(baseData, {annualYield: 5, inflationRate: 2, monthlyContribution: 0, projectionYears: 0, startAge: 28});
        expect(result).toHaveLength(1);
        expect(result[0].year).toBe(2025);
        expect(result[0].age).toBe(28);
        expect(result[0].nominal).toBe(1190);
        expect(result[0].real).toBe(1190);
    });

    it('利回り 0%・インフレ率 0%・積立額 0 のとき名目と実質が変化しない', () => {
        const result = calcSimulation(baseData, {annualYield: 0, inflationRate: 0, monthlyContribution: 0, projectionYears: 10, startAge: 28});
        const last = result[result.length - 1];
        expect(last.nominal).toBe(1190);
        expect(last.real).toBe(1190);
    });

    it('利回りが正のとき名目資産額が増加する', () => {
        const result = calcSimulation(baseData, {annualYield: 5, inflationRate: 0, monthlyContribution: 0, projectionYears: 10, startAge: 28});
        expect(result[10].nominal).toBeGreaterThan(result[0].nominal);
    });

    it('インフレ率が正のとき実質価値は名目資産額より小さい（n>0）', () => {
        const result = calcSimulation(baseData, {annualYield: 5, inflationRate: 2, monthlyContribution: 0, projectionYears: 10, startAge: 28});
        expect(result[10].real).toBeLessThan(result[10].nominal);
    });

    it('月々の積立額が正のとき名目資産額がさらに増加する', () => {
        const withContrib = calcSimulation(baseData, {annualYield: 5, inflationRate: 0, monthlyContribution: 10, projectionYears: 10, startAge: 28});
        const withoutContrib = calcSimulation(baseData, {annualYield: 5, inflationRate: 0, monthlyContribution: 0, projectionYears: 10, startAge: 28});
        expect(withContrib[10].nominal).toBeGreaterThan(withoutContrib[10].nominal);
    });

    it('返り値の要素数がシミュレーション期間 + 1 である', () => {
        const result = calcSimulation(baseData, {annualYield: 5, inflationRate: 2, monthlyContribution: 0, projectionYears: 30, startAge: 28});
        expect(result).toHaveLength(31);
    });

    it('年が連続して正しくインクリメントされる', () => {
        const result = calcSimulation(baseData, {annualYield: 5, inflationRate: 2, monthlyContribution: 0, projectionYears: 3, startAge: 28});
        expect(result.map((d) => d.year)).toEqual([2025, 2026, 2027, 2028]);
    });

    it('年齢が開始年齢から連続して正しくインクリメントされる', () => {
        const result = calcSimulation(baseData, {annualYield: 5, inflationRate: 2, monthlyContribution: 0, projectionYears: 3, startAge: 28});
        expect(result.map((d) => d.age)).toEqual([28, 29, 30, 31]);
    });

    it('利回り 0%・積立額あり のとき積立分だけ増加する', () => {
        const monthlyContribution = 5;
        const result = calcSimulation(baseData, {annualYield: 0, inflationRate: 0, monthlyContribution, projectionYears: 1, startAge: 28});
        // 1年後: stocks + monthlyContribution×12ヶ月、cash・cryptoは変化なし
        const expectedNominal = baseData.stocks + monthlyContribution * 12 + baseData.cash + baseData.crypto;
        expect(result[1].nominal).toBe(expectedNominal);
    });
});
