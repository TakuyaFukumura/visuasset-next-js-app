'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type {AssetData} from '../../../lib/parseAssets';

interface AssetChartProps {
    readonly data: AssetData[];
}

export default function AssetChart({data}: AssetChartProps) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{top: 16, right: 16, left: 16, bottom: 8}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis unit="万円" />
                <Tooltip formatter={(value) => `${value}万円`} />
                <Legend />
                <Bar dataKey="stocks" name="株式" stackId="a" fill="#3b82f6" />
                <Bar dataKey="cash" name="現預金" stackId="a" fill="#22c55e" />
                <Bar dataKey="crypto" name="暗号資産" stackId="a" fill="#f59e0b" />
            </BarChart>
        </ResponsiveContainer>
    );
}
