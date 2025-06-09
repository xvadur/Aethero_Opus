'use client';
import { useEffect, useState } from 'react';
import { ChartContainer } from '@onlook/ui/chart';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    CartesianGrid,
    Legend,
    PieChart,
    Pie,
} from 'recharts';

interface Entry {
    sentiment?: string;
    intents?: string[];
    mbti?: string;
    createdAt?: string;
}

export function AnalysisView() {
    const [entries, setEntries] = useState<Entry[]>([]);

    const load = async () => {
        const res = await fetch('/api/diary/entries');
        const data = await res.json();
        setEntries(data.entries);
    };

    useEffect(() => {
        load();
    }, []);

    const sentimentData = entries.map((e) => ({
        time: e.createdAt,
        value:
            e.sentiment === 'positive'
                ? 1
                : e.sentiment === 'negative'
                ? -1
                : 0,
    }));

    const intentSet = new Set<string>();
    entries.forEach((e) => (e.intents || []).forEach((i) => intentSet.add(i)));
    const intents = Array.from(intentSet);

    const intentData = entries.map((e) => {
        const base: Record<string, number> = { time: e.createdAt || '' };
        intents.forEach((i) => {
            base[i] = e.intents?.includes(i) ? 1 : 0;
        });
        return base;
    });

    const colors = ['#f97316', '#10b981', '#6366f1', '#ec4899', '#eab308'];
    const config = intents.reduce<Record<string, { color: string }>>((acc, i, idx) => {
        acc[i] = { color: colors[idx % colors.length] };
        return acc;
    }, {});

    const mbtiCounts = entries.reduce<Record<string, number>>((acc, e) => {
        if (e.mbti) acc[e.mbti] = (acc[e.mbti] || 0) + 1;
        return acc;
    }, {});
    const mbtiData = Object.entries(mbtiCounts).map(([type, value]) => ({ type, value }));

    return (
        <div className="space-y-4">
            <ChartContainer config={{ sentiment: { color: '#3b82f6' } }}>
                <LineChart data={sentimentData}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[-1, 1]} hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                </LineChart>
            </ChartContainer>
            <ChartContainer config={config}>
                <BarChart data={intentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {intents.map((i) => (
                        <Bar key={i} dataKey={i} stackId="a" fill={`var(--color-${i})`} />
                    ))}
                </BarChart>
            </ChartContainer>
            <ChartContainer config={{}}>
                <PieChart>
                    <Tooltip />
                    <Pie data={mbtiData} dataKey="value" nameKey="type" label />
                </PieChart>
            </ChartContainer>
        </div>
    );
}

//# AETH: Shows sentiment, intent, and MBTI trends using minimal Recharts wrappers
