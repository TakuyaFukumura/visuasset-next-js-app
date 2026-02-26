import {parseAssets} from '../../lib/parseAssets';
import {parseMonthlyAssets} from '../../lib/parseMonthlyAssets';
import type {MonthlyAssetData} from '../../lib/parseMonthlyAssets';
import AssetView from './components/AssetView';

export default function Home() {
    const yearlyData = parseAssets();

    let monthlyData: MonthlyAssetData[] | null = null;
    let monthlyError: string | null = null;
    try {
        monthlyData = parseMonthlyAssets();
    } catch {
        monthlyError = '月次データの読み込みに失敗しました';
    }

    return (
        <div
            className="font-sans min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-6">
            <main className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">資産推移</h2>

                <AssetView
                    yearlyData={yearlyData}
                    monthlyData={monthlyData}
                    monthlyError={monthlyError}
                />
            </main>
        </div>
    );
}

