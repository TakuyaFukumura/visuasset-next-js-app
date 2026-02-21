import Link from 'next/link';
import {parseAssets} from '../../../lib/parseAssets';
import PortfolioChart from '../components/PortfolioChart';
import PortfolioTable from '../components/PortfolioTable';
import {GENRE_COLORS, GENRE_NAMES} from '../constants/genres';

export default async function PortfolioPage({
    searchParams,
}: {
    searchParams: Promise<{year?: string}>;
}) {
    const params = await searchParams;
    const allData = parseAssets();

    if (allData.length === 0) {
        throw new Error('No portfolio data available');
    }

    const years = allData.map((d) => d.year);
    const latestYear = allData[allData.length - 1].year;

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
        percentage: total > 0 ? (yearData[key] / total) * 100 : 0,
        fill: GENRE_COLORS[key],
    }));

    const currentIndex = years.indexOf(currentYear);
    const prevYear = years[currentIndex - 1] ?? null;
    const nextYear = years[currentIndex + 1] ?? null;

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
                        <button
                            disabled
                            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-bold cursor-not-allowed"
                            aria-label="前の年へ"
                        >
                            ←
                        </button>
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
                        <button
                            disabled
                            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-bold cursor-not-allowed"
                            aria-label="次の年へ"
                        >
                            →
                        </button>
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
