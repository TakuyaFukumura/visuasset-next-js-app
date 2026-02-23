import {parseAssets} from '../../lib/parseAssets';
import AssetChart from './components/AssetChart';
import AssetTable from './components/AssetTable';

export default function Home() {
    const data = parseAssets();

    return (
        <div
            className="font-sans min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-6">
            <main className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">資産推移</h2>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <AssetChart data={data}/>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <AssetTable data={data}/>
                </div>
            </main>
        </div>
    );
}

