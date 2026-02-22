import type {SimulationDataPoint} from './SimulationChart';

interface SimulationTableProps {
    readonly data: SimulationDataPoint[];
}

export default function SimulationTable({data}: SimulationTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">年</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">名目資産額（万円）</th>
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">実質価値（万円）</th>
                </tr>
                </thead>
                <tbody>
                {data.map((row) => (
                    <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.year}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.nominal}</td>
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.real}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
