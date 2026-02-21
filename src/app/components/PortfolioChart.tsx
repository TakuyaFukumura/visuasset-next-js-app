'use client';

import {Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import type {PortfolioEntry} from '../types/portfolio';

interface PortfolioChartProps {
    readonly data: PortfolioEntry[];
}

export default function PortfolioChart({data}: PortfolioChartProps) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({name, percent}: { name?: string; percent?: number }) =>
                        `${name ?? ''} ${((percent ?? 0) * 100).toFixed(1)}%`
                    }
                />
                <Tooltip formatter={(value) => `${value}万円`}/>
                <Legend/>
            </PieChart>
        </ResponsiveContainer>
    );
}
