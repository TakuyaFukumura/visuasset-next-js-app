'use client';

import {useState} from 'react';
import AssetChart from './AssetChart';
import AssetTable from './AssetTable';
import AssetMonthlyChart from './AssetMonthlyChart';
import AssetMonthlyTable from './AssetMonthlyTable';
import type {AssetData} from '../../../lib/parseAssets';
import type {MonthlyAssetData} from '../../../lib/parseMonthlyAssets';

type ViewMode = 'yearly' | 'monthly';

interface AssetViewProps {
    readonly yearlyData: AssetData[];
    readonly monthlyData: MonthlyAssetData[] | null;
    readonly monthlyError: string | null;
}

export default function AssetView({yearlyData, monthlyData, monthlyError}: AssetViewProps) {
    const [mode, setMode] = useState<ViewMode>('yearly');

    return (
        <>
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setMode('yearly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        mode === 'yearly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                    年次
                </button>
                <button
                    onClick={() => setMode('monthly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        mode === 'monthly'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                    月次
                </button>
            </div>

            {mode === 'yearly' && (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                        <AssetChart data={yearlyData}/>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <AssetTable data={yearlyData}/>
                    </div>
                </>
            )}

            {mode === 'monthly' && (
                <>
                    {monthlyError ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <p className="text-red-600 dark:text-red-400">{monthlyError}</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                                {monthlyData && <AssetMonthlyChart data={monthlyData}/>}
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                {monthlyData && <AssetMonthlyTable data={monthlyData}/>}
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
}
