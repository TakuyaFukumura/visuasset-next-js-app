import type {PortfolioEntry} from './PortfolioChart';

interface PortfolioTableProps {
    readonly data: PortfolioEntry[];
    readonly total: number;
}

export default function PortfolioTable({data, total}: PortfolioTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">ジャンル</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">金額（万円）</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">割合（%）</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{row.name}</td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.value}</td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.percentage.toFixed(1)}</td>
                        </tr>
                    ))}
                    <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">合計</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{total}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">100.0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
