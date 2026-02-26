'use client';

import {useMemo, useState} from 'react';
import LivingExpenseChart from './LivingExpenseChart';
import LivingExpenseTable from './LivingExpenseTable';

interface LivingExpenseSettingsProps {
    readonly latestTotalManen: number;
    readonly latestYear: number;
}

interface ExpenseSettings {
    rent: number;
    food: number;
    entertainment: number;
    misc: number;
    realYield: number;
}

export interface LivingExpenseDataPoint {
    elapsedYears: number;
    year: number;
    balanceYen: number;
    balanceManen: number;
    livingConversionYears: number;
    livingConversionMonths: number;
}

const MAX_SIMULATION_YEARS = 200;

export function calcLivingExpenseSimulation(
    initialBalanceManen: number,
    monthlyExpenseYen: number,
    realYieldPercent: number,
    currentYear: number,
): LivingExpenseDataPoint[] {
    if (monthlyExpenseYen <= 0) {
        return [];
    }

    const initialBalanceYen = initialBalanceManen * 10000;
    const monthlyRate = realYieldPercent / 100 / 12;

    const toManen = (yen: number) => Math.round(yen / 1000) / 10;
    const toLivingConversion = (balanceYen: number) => {
        const months = Math.floor(balanceYen / monthlyExpenseYen);
        return {
            livingConversionYears: Math.floor(months / 12),
            livingConversionMonths: months % 12,
        };
    };

    const result: LivingExpenseDataPoint[] = [];

    result.push({
        elapsedYears: 0,
        year: currentYear,
        balanceYen: initialBalanceYen,
        balanceManen: toManen(initialBalanceYen),
        ...toLivingConversion(initialBalanceYen),
    });

    let balance = initialBalanceYen;

    for (let elapsedYears = 1; elapsedYears <= MAX_SIMULATION_YEARS; elapsedYears++) {
        let stopped = false;
        for (let m = 0; m < 12; m++) {
            balance = balance * (1 + monthlyRate) - monthlyExpenseYen;
            if (balance <= 0) {
                stopped = true;
                break;
            }
        }
        if (stopped) break;

        result.push({
            elapsedYears,
            year: currentYear + elapsedYears,
            balanceYen: balance,
            balanceManen: toManen(balance),
            ...toLivingConversion(balance),
        });
    }

    return result;
}

export default function LivingExpenseSettings({latestTotalManen, latestYear}: LivingExpenseSettingsProps) {
    const [settings, setSettings] = useState<ExpenseSettings>({
        rent: 42000,
        food: 30000,
        entertainment: 30000,
        misc: 30000,
        realYield: 0.0,
    });

    const monthlyTotal = settings.rent + settings.food + settings.entertainment + settings.misc;
    const annualTotal = monthlyTotal * 12;

    const livingMonthsTotal = monthlyTotal > 0 ? Math.floor((latestTotalManen * 10000) / monthlyTotal) : 0;
    const livingYears = Math.floor(livingMonthsTotal / 12);
    const livingRemMonths = livingMonthsTotal % 12;

    const data = useMemo(
        () => calcLivingExpenseSimulation(latestTotalManen, monthlyTotal, settings.realYield, latestYear),
        [latestTotalManen, monthlyTotal, settings.realYield, latestYear],
    );

    const handleChange = (key: keyof ExpenseSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (!Number.isFinite(value) || value < 0) return;
        setSettings((prev) => ({...prev, [key]: value}));
    };

    const inputClass =
        'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
    const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">設定</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                    <div>
                        <label htmlFor="rent" className={labelClass}>家賃</label>
                        <div className="flex items-center gap-1">
                            <input
                                id="rent"
                                type="number"
                                min={0}
                                step={1000}
                                value={settings.rent}
                                onChange={handleChange('rent')}
                                aria-describedby="rent-desc"
                                className={inputClass}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">円/月</span>
                        </div>
                        <span id="rent-desc" className="sr-only">家賃を円単位で入力してください（0以上）</span>
                    </div>
                    <div>
                        <label htmlFor="food" className={labelClass}>食費</label>
                        <div className="flex items-center gap-1">
                            <input
                                id="food"
                                type="number"
                                min={0}
                                step={1000}
                                value={settings.food}
                                onChange={handleChange('food')}
                                aria-describedby="food-desc"
                                className={inputClass}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">円/月</span>
                        </div>
                        <span id="food-desc" className="sr-only">食費を円単位で入力してください（0以上）</span>
                    </div>
                    <div>
                        <label htmlFor="entertainment" className={labelClass}>娯楽費</label>
                        <div className="flex items-center gap-1">
                            <input
                                id="entertainment"
                                type="number"
                                min={0}
                                step={1000}
                                value={settings.entertainment}
                                onChange={handleChange('entertainment')}
                                aria-describedby="entertainment-desc"
                                className={inputClass}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">円/月</span>
                        </div>
                        <span id="entertainment-desc" className="sr-only">娯楽費を円単位で入力してください（0以上）</span>
                    </div>
                    <div>
                        <label htmlFor="misc" className={labelClass}>雑費</label>
                        <div className="flex items-center gap-1">
                            <input
                                id="misc"
                                type="number"
                                min={0}
                                step={1000}
                                value={settings.misc}
                                onChange={handleChange('misc')}
                                aria-describedby="misc-desc"
                                className={inputClass}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">円/月</span>
                        </div>
                        <span id="misc-desc" className="sr-only">雑費を円単位で入力してください（0以上）</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 text-sm text-gray-700 dark:text-gray-300">
                    <p>月次合計：<span data-testid="monthly-total">{monthlyTotal.toLocaleString()}</span> 円/月</p>
                    <p>年次合計：<span data-testid="annual-total">{annualTotal.toLocaleString()}</span> 円/年</p>
                </div>

                <div className="mb-4">
                    <label htmlFor="realYield" className={labelClass}>実利回り（%/年）</label>
                    <input
                        id="realYield"
                        type="number"
                        min={0}
                        step={0.1}
                        value={settings.realYield}
                        onChange={handleChange('realYield')}
                        aria-describedby="realYield-desc"
                        className="w-32 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span id="realYield-desc" className="sr-only">実利回りを年率パーセントで入力してください（0以上、小数第1位まで）</span>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p>現在の総資産：<span data-testid="latest-total">{latestTotalManen.toLocaleString()}</span>万円</p>
                    {monthlyTotal > 0 ? (
                        <p>→ 生活費<span data-testid="living-conversion">{livingYears}年{livingRemMonths}ヶ月分</span></p>
                    ) : (
                        <p>→ 生活費換算：月次生活費を1円以上に設定してください</p>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <LivingExpenseChart data={data}/>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <LivingExpenseTable data={data}/>
            </div>
        </div>
    );
}
