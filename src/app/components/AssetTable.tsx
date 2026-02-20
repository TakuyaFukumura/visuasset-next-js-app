import type {AssetData} from '../../../lib/parseAssets';

interface AssetTableProps {
    readonly data: AssetData[];
}

export default function AssetTable({data}: AssetTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">年</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">株式（万円）</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">現預金（万円）</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">暗号資産（万円）</th>
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">合計（万円）</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.year}</td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.stocks}</td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.cash}</td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right">{row.crypto}</td>
                            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-right font-semibold">
                                {row.stocks + row.cash + row.crypto}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
