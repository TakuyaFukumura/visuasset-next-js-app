'use client';

import {useMemo, useState} from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import type {AssetData} from '../../../lib/parseAssets';
import SimulationTable from './SimulationTable';

interface SimulationChartProps {
    readonly latestData: AssetData;
}

interface SimulationSettings {
    annualYield: number;
    inflationRate: number;
    monthlyContribution: number;
    projectionYears: number;
    startAge: number;
}

export interface SimulationDataPoint {
    year: number;
    age: number;
    nominal: number;
    real: number;
}

export function calcSimulation(latestData: AssetData, settings: SimulationSettings): SimulationDataPoint[] {
    const {annualYield, inflationRate, monthlyContribution, projectionYears, startAge} = settings;
    const r = annualYield / 100;
    const inflation = inflationRate / 100;
    const monthlyRate = r / 12;
    const startYear = latestData.year;
    const {stocks, cash, crypto} = latestData;

    const result: SimulationDataPoint[] = [];

    for (let n = 0; n <= projectionYears; n++) {
        let stocksValue: number;
        if (monthlyRate === 0) {
            stocksValue = stocks * Math.pow(1 + r, n) + monthlyContribution * 12 * n;
        } else {
            const fvInitial = stocks * Math.pow(1 + r, n);
            const fvContributions =
                monthlyContribution * (Math.pow(1 + monthlyRate, 12 * n) - 1) / monthlyRate;
            stocksValue = fvInitial + fvContributions;
        }

        const nominal = stocksValue + cash + crypto;
        const real = inflation === 0 ? nominal : nominal / Math.pow(1 + inflation, n);

        result.push({
            year: startYear + n,
            age: startAge + n,
            nominal: Math.round(nominal),
            real: Math.round(real),
        });
    }

    return result;
}

export default function SimulationChart({latestData}: SimulationChartProps) {
    const [settings, setSettings] = useState<SimulationSettings>({
        annualYield: 5,
        inflationRate: 2,
        monthlyContribution: 0,
        projectionYears: 30,
        startAge: 28,
    });

    const data = useMemo(() => calcSimulation(latestData, settings), [latestData, settings]);

    const handleChange = (key: keyof SimulationSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (!Number.isFinite(value)) return;
        if (
            (key === 'annualYield' || key === 'inflationRate' || key === 'monthlyContribution' || key === 'startAge') &&
            value < 0
        ) {
            return;
        }
        if (key === 'projectionYears' && value < 1) {
            return;
        }
        setSettings((prev) => ({...prev, [key]: value}));
    };

    return (
        <div>
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div>
                    <label
                        htmlFor="startAge"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        開始年齢（歳）
                    </label>
                    <input
                        id="startAge"
                        type="number"
                        min={0}
                        max={150}
                        step={1}
                        value={settings.startAge}
                        onChange={handleChange('startAge')}
                        aria-describedby="startAge-desc"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span id="startAge-desc"
                          className="sr-only">シミュレーション開始時点の年齢を歳で入力してください（0以上）</span>
                </div>
                <div>
                    <label
                        htmlFor="annualYield"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        利回り（%）
                    </label>
                    <input
                        id="annualYield"
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={settings.annualYield}
                        onChange={handleChange('annualYield')}
                        aria-describedby="annualYield-desc"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span id="annualYield-desc"
                          className="sr-only">株式資産に適用する年間運用利回りをパーセントで入力してください（0〜100）</span>
                </div>
                <div>
                    <label
                        htmlFor="inflationRate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        インフレ率（%）
                    </label>
                    <input
                        id="inflationRate"
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={settings.inflationRate}
                        onChange={handleChange('inflationRate')}
                        aria-describedby="inflationRate-desc"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span id="inflationRate-desc"
                          className="sr-only">物価上昇率をパーセントで入力してください（0〜100）</span>
                </div>
                <div>
                    <label
                        htmlFor="monthlyContribution"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        月々の積立額（万円）
                    </label>
                    <input
                        id="monthlyContribution"
                        type="number"
                        min={0}
                        step={1}
                        value={settings.monthlyContribution}
                        onChange={handleChange('monthlyContribution')}
                        aria-describedby="monthlyContribution-desc"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span id="monthlyContribution-desc"
                          className="sr-only">毎月追加で積み立てる金額を万円単位で入力してください（0以上）</span>
                </div>
                <div>
                    <label
                        htmlFor="projectionYears"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        期間（年）
                    </label>
                    <input
                        id="projectionYears"
                        type="number"
                        min={1}
                        max={50}
                        step={1}
                        value={settings.projectionYears}
                        onChange={handleChange('projectionYears')}
                        aria-describedby="projectionYears-desc"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span id="projectionYears-desc"
                          className="sr-only">シミュレーションする期間を年単位で入力してください（1〜50）</span>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data} margin={{top: 16, right: 16, left: 16, bottom: 8}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="year"/>
                        <YAxis unit="万円"/>
                        <Tooltip formatter={(value) => `${Number(value).toLocaleString()}万円`}/>
                        <Legend/>
                        <Line
                            type="monotone"
                            dataKey="nominal"
                            name="名目資産額"
                            stroke="#3b82f6"
                            dot={false}
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="real"
                            name="インフレ調整後実質価値"
                            stroke="#f97316"
                            dot={false}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <SimulationTable data={data}/>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
                ※ このシミュレーションは参考値です。将来の資産を保証するものではありません。運用利回りは株式資産にのみ適用し、税金・手数料等は考慮していません。
            </p>
        </div>
    );
}
