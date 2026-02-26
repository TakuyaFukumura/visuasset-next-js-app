'use client';

import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import type {LivingExpenseDataPoint} from './LivingExpenseSettings';

interface LivingExpenseChartProps {
    readonly data: LivingExpenseDataPoint[];
}

export default function LivingExpenseChart({data}: LivingExpenseChartProps) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{top: 16, right: 16, left: 16, bottom: 8}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="year"/>
                <YAxis unit="万円"/>
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}万円`}/>
                <Legend/>
                <Line
                    type="monotone"
                    dataKey="balanceManen"
                    name="資産残高"
                    stroke="#3b82f6"
                    dot={false}
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
