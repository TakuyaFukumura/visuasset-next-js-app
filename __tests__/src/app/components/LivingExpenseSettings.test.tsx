/**
 * LivingExpenseSettings コンポーネントのテスト
 */

import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import LivingExpenseSettings, {calcLivingExpenseSimulation} from '../../../../src/app/components/LivingExpenseSettings';
import '@testing-library/jest-dom';

// Recharts は jsdom 環境でグラフを描画できないためモックする
jest.mock('recharts', () => {
    const OriginalModule = jest.requireActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({children}: { children: React.ReactNode }) => (
            <div data-testid="responsive-container">{children}</div>
        ),
        LineChart: ({children}: { children: React.ReactNode }) => (
            <div data-testid="line-chart">{children}</div>
        ),
        Line: ({name}: { name: string }) => <div data-testid={`line-${name}`}/>,
        CartesianGrid: () => <div data-testid="cartesian-grid"/>,
        XAxis: () => <div data-testid="x-axis"/>,
        YAxis: () => <div data-testid="y-axis"/>,
        Tooltip: () => <div data-testid="tooltip"/>,
        Legend: () => <div data-testid="legend"/>,
    };
});

const defaultProps = {latestTotalManen: 1449, latestYear: 2026};

describe('LivingExpenseSettings', () => {
    describe('基本的なレンダリング', () => {
        it('コンポーネントがレンダリングされる', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByText('設定')).toBeInTheDocument();
        });

        it('LineChart がレンダリングされる', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        it('資産残高の折れ線が表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByTestId('line-資産残高')).toBeInTheDocument();
        });
    });

    describe('設定パネルの表示', () => {
        it('家賃入力フィールドが表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByLabelText('家賃')).toBeInTheDocument();
        });

        it('食費入力フィールドが表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByLabelText('食費')).toBeInTheDocument();
        });

        it('娯楽費入力フィールドが表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByLabelText('娯楽費')).toBeInTheDocument();
        });

        it('雑費入力フィールドが表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByLabelText('雑費')).toBeInTheDocument();
        });

        it('実利回り入力フィールドが表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByLabelText('実利回り（%/年）')).toBeInTheDocument();
        });
    });

    describe('デフォルト値の確認', () => {
        it('家賃のデフォルト値が 42000 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('家賃') as HTMLInputElement;
            expect(input.value).toBe('42000');
        });

        it('食費のデフォルト値が 30000 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('食費') as HTMLInputElement;
            expect(input.value).toBe('30000');
        });

        it('娯楽費のデフォルト値が 30000 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('娯楽費') as HTMLInputElement;
            expect(input.value).toBe('30000');
        });

        it('雑費のデフォルト値が 30000 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('雑費') as HTMLInputElement;
            expect(input.value).toBe('30000');
        });

        it('実利回りのデフォルト値が 0 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('実利回り（%/年）') as HTMLInputElement;
            expect(input.value).toBe('0');
        });

        it('月次合計が 132000 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByTestId('monthly-total').textContent).toBe('132,000');
        });

        it('年次合計が 1584000 である', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByTestId('annual-total').textContent).toBe('1,584,000');
        });
    });

    describe('生活費換算の表示', () => {
        it('現在の総資産が表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByTestId('latest-total').textContent).toBe('1,449');
        });

        it('生活費換算が表示される', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            expect(screen.getByTestId('living-conversion')).toBeInTheDocument();
        });
    });

    describe('設定値の変更', () => {
        it('家賃の値を変更できる', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('家賃') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '50000'}});
            expect(input.value).toBe('50000');
        });

        it('実利回りの値を変更できる', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('実利回り（%/年）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '2.5'}});
            expect(input.value).toBe('2.5');
        });
    });

    describe('入力バリデーション', () => {
        it('家賃に負の値を入力しても設定が変わらない', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('家賃') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '-1000'}});
            expect(input.value).toBe('42000');
        });

        it('実利回りに負の値を入力しても設定が変わらない', () => {
            render(<LivingExpenseSettings {...defaultProps}/>);
            const input = screen.getByLabelText('実利回り（%/年）') as HTMLInputElement;
            fireEvent.change(input, {target: {value: '-1'}});
            expect(input.value).toBe('0');
        });
    });
});

describe('calcLivingExpenseSimulation', () => {
    it('月次生活費が 0 の場合は空配列を返す', () => {
        const result = calcLivingExpenseSimulation(1000, 0, 0, 2026);
        expect(result).toHaveLength(0);
    });

    it('n=0 のとき初期値がそのまま返る', () => {
        const result = calcLivingExpenseSimulation(100, 50000, 0, 2026);
        expect(result[0].elapsedYears).toBe(0);
        expect(result[0].year).toBe(2026);
        expect(result[0].balanceYen).toBe(1000000);
        expect(result[0].balanceManen).toBe(100);
    });

    it('livingConversionYears と livingConversionMonths が正しく計算される', () => {
        // 1,000,000円 ÷ 50,000円/月 = 20ヶ月 → 1年8ヶ月分
        const result = calcLivingExpenseSimulation(100, 50000, 0, 2026);
        expect(result[0].livingConversionYears).toBe(1);
        expect(result[0].livingConversionMonths).toBe(8);
    });

    it('利回り 0% のとき残高が単調減少する', () => {
        const result = calcLivingExpenseSimulation(1000, 100000, 0, 2026);
        for (let i = 1; i < result.length; i++) {
            expect(result[i].balanceYen).toBeLessThan(result[i - 1].balanceYen);
        }
    });

    it('残高がゼロ以下になった時点でシミュレーションを終了する', () => {
        // 12,000円の資産 ÷ 1,000円/月 = 12ヶ月ちょうど → year 0のみ返す（1年目はゼロになる）
        const result = calcLivingExpenseSimulation(1.2, 1000, 0, 2026);
        expect(result[result.length - 1].balanceYen).toBeGreaterThan(0);
    });

    it('balanceManen の丸めが正しい（例：12,356,000円 → 1235.6万円）', () => {
        // 12,356,000円 = 1235.6万円
        const result = calcLivingExpenseSimulation(1235.6, 100000, 0, 2026);
        expect(result[0].balanceManen).toBe(1235.6);
    });

    it('利回りが正のとき資産の減少が遅くなる', () => {
        const withYield = calcLivingExpenseSimulation(1000, 100000, 5, 2026);
        const withoutYield = calcLivingExpenseSimulation(1000, 100000, 0, 2026);
        expect(withYield.length).toBeGreaterThan(withoutYield.length);
    });

    it('返り値の elapsedYears が 0 から連続してインクリメントされる', () => {
        const result = calcLivingExpenseSimulation(1000, 100000, 0, 2026);
        result.forEach((row, i) => {
            expect(row.elapsedYears).toBe(i);
        });
    });

    it('返り値の year が currentYear から連続してインクリメントされる', () => {
        const result = calcLivingExpenseSimulation(1000, 100000, 0, 2026);
        result.forEach((row, i) => {
            expect(row.year).toBe(2026 + i);
        });
    });
});
