import {parseAssets} from '../../../lib/parseAssets';
import SimulationChart from '../components/SimulationChart';

export default function SimulationPage() {
    const allData = parseAssets();

    if (allData.length === 0) {
        throw new Error('No asset data available');
    }

    const latestData = allData.at(-1)!;

    return (
        <div
            className="font-sans min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <main className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">資産推移シミュレーション</h2>
                <SimulationChart latestData={latestData}/>
            </main>
        </div>
    );
}
