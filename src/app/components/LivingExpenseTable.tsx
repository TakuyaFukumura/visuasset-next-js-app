import type {LivingExpenseDataPoint} from './LivingExpenseSettings';

interface LivingExpenseTableProps {
    readonly data: LivingExpenseDataPoint[];
}

export default function LivingExpenseTable({data}: LivingExpenseTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">経過年数</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">西暦</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">資産残高（万円）</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">生活費換算</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.elapsedYears} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.elapsedYears}年目</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.year}年</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.balanceManen.toLocaleString()}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.livingConversionYears}年{row.livingConversionMonths}ヶ月分</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
