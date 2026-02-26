import {parseAssets} from '../../../lib/parseAssets';
import LivingExpenseSettings from '../components/LivingExpenseSettings';

export default function LivingExpensePage() {
    const allData = parseAssets();

    if (allData.length === 0) {
        throw new Error('No asset data available');
    }

    const latestData = allData.at(-1)!;
    const latestTotalManen = latestData.stocks + latestData.cash + latestData.crypto;

    return (
        <div
            className="font-sans min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-6">
            <main className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">生活費換算シミュレーション</h2>
                <LivingExpenseSettings latestTotalManen={latestTotalManen} latestYear={latestData.year}/>
            </main>
        </div>
    );
}
