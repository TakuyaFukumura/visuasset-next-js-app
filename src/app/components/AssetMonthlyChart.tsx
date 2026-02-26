'use client';

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import type {MonthlyAssetData} from '../../../lib/parseMonthlyAssets';
import {GENRE_COLORS, GENRE_NAMES} from '../constants/genres';

interface AssetMonthlyChartProps {
    readonly data: MonthlyAssetData[];
}

export default function AssetMonthlyChart({data}: AssetMonthlyChartProps) {
    const chartData = data.map((row) => ({
        ...row,
        yearMonth: `${row.year}/${String(row.month).padStart(2, '0')}`,
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{top: 16, right: 16, left: 16, bottom: 8}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="yearMonth"/>
                <YAxis unit="万円"/>
                <Tooltip formatter={(value) => `${value}万円`}/>
                <Legend/>
                <Line type="monotone" dataKey="stocks" name={GENRE_NAMES.stocks} stroke={GENRE_COLORS.stocks} dot={false}/>
                <Line type="monotone" dataKey="cash" name={GENRE_NAMES.cash} stroke={GENRE_COLORS.cash} dot={false}/>
                <Line type="monotone" dataKey="crypto" name={GENRE_NAMES.crypto} stroke={GENRE_COLORS.crypto} dot={false}/>
            </LineChart>
        </ResponsiveContainer>
    );
}
