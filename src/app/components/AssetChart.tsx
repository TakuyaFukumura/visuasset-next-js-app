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
import {GENRE_COLORS, GENRE_NAMES} from '../constants/genres';

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
                <Bar dataKey="stocks" name={GENRE_NAMES.stocks} stackId="a" fill={GENRE_COLORS.stocks} />
                <Bar dataKey="cash" name={GENRE_NAMES.cash} stackId="a" fill={GENRE_COLORS.cash} />
                <Bar dataKey="crypto" name={GENRE_NAMES.crypto} stackId="a" fill={GENRE_COLORS.crypto} />
            </BarChart>
        </ResponsiveContainer>
    );
}
