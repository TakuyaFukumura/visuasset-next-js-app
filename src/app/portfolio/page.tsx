import Link from 'next/link';
import {parseAssets} from '../../../lib/parseAssets';
import PortfolioChart from '../components/PortfolioChart';
import PortfolioTable from '../components/PortfolioTable';

const GENRE_COLORS: Record<string, string> = {
    stocks: '#3b82f6',
    cash: '#22c55e',
    crypto: '#f59e0b',
};

const GENRE_NAMES: Record<string, string> = {
    stocks: '株式',
    cash: '現預金',
    crypto: '暗号資産',
};

export default async function PortfolioPage({
    searchParams,
}: {
    searchParams: Promise<{year?: string}>;
}) {
    const params = await searchParams;
    const allData = parseAssets();
    const years = allData.map((d) => d.year);
    const latestYear = Math.max(...years);

    const yearParam = params.year ? parseInt(params.year, 10) : latestYear;
    const currentYear = years.includes(yearParam) ? yearParam : latestYear;

    const yearData = allData.find((d) => d.year === currentYear);
    if (!yearData) {
        throw new Error(`No data found for year: ${currentYear}`);
    }
    const total = yearData.stocks + yearData.cash + yearData.crypto;

    const portfolioData = (['stocks', 'cash', 'crypto'] as const).map((key) => ({
        name: GENRE_NAMES[key],
        value: yearData[key],
        percentage: (yearData[key] / total) * 100,
        fill: GENRE_COLORS[key],
    }));

    const prevYear = years.filter((y) => y < currentYear).sort((a, b) => b - a)[0] ?? null;
    const nextYear = years.filter((y) => y > currentYear).sort((a, b) => a - b)[0] ?? null;

    return (
        <div className="font-sans min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <main className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">資産ポートフォリオ</h2>

                <div className="flex items-center justify-center gap-6 mb-6">
                    {prevYear !== null ? (
                        <Link
                            href={`/portfolio?year=${prevYear}`}
                            className="px-3 py-1 rounded-lg bg-white dark:bg-gray-700 shadow hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold transition-colors"
                            aria-label="前の年へ"
                        >
                            ←
                        </Link>
                    ) : (
                        <span
                            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-bold cursor-not-allowed"
                            aria-disabled="true"
                        >
                            ←
                        </span>
                    )}
                    <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {currentYear}年
                    </span>
                    {nextYear !== null ? (
                        <Link
                            href={`/portfolio?year=${nextYear}`}
                            className="px-3 py-1 rounded-lg bg-white dark:bg-gray-700 shadow hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold transition-colors"
                            aria-label="次の年へ"
                        >
                            →
                        </Link>
                    ) : (
                        <span
                            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-bold cursor-not-allowed"
                            aria-disabled="true"
                        >
                            →
                        </span>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <PortfolioChart data={portfolioData} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <PortfolioTable data={portfolioData} total={total} />
                </div>
            </main>
        </div>
    );
}
