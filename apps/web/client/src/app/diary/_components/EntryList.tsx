'use client';
import { useEffect, useState } from 'react';

export interface Entry {
    id?: string;
    entry: string;
    summary?: string;
    sentiment?: string;
    intents?: string[];
    mbti?: string;
    psychologyModelConfidence?: number;
    createdAt?: string;
}

export function EntryList() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [sentimentFilter, setSentimentFilter] = useState('All');
    const [intentFilter, setIntentFilter] = useState('All');
    const [mbtiFilter, setMbtiFilter] = useState('All');
    const [confidenceFilter, setConfidenceFilter] = useState(0);

    const load = async () => {
        const res = await fetch('/api/diary/entries');
        const data = await res.json();
        setEntries(data.entries);
    };

    useEffect(() => {
        load();
    }, []);

    const sentiments = Array.from(new Set(entries.map((e) => e.sentiment).filter(Boolean))) as string[];
    const intents = Array.from(new Set(entries.flatMap((e) => e.intents || [])));
    const mbtis = Array.from(new Set(entries.map((e) => e.mbti).filter(Boolean))) as string[];

    const filtered = entries.filter((e) => {
        return (
            (sentimentFilter === 'All' || e.sentiment === sentimentFilter) &&
            (intentFilter === 'All' || e.intents?.includes(intentFilter)) &&
            (mbtiFilter === 'All' || e.mbti === mbtiFilter) &&
            (e.psychologyModelConfidence === undefined || e.psychologyModelConfidence >= confidenceFilter)
        );
    });

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <select value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
                    <option>All</option>
                    {sentiments.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
                <select value={intentFilter} onChange={(e) => setIntentFilter(e.target.value)}>
                    <option>All</option>
                    {intents.map((i) => (
                        <option key={i}>{i}</option>
                    ))}
                </select>
                <select value={mbtiFilter} onChange={(e) => setMbtiFilter(e.target.value)}>
                    <option>All</option>
                    {mbtis.map((m) => (
                        <option key={m}>{m}</option>
                    ))}
                </select>
                <label className="flex items-center gap-1">
                    <span className="text-xs">MBTI ≥ {confidenceFilter.toFixed(1)}</span>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={confidenceFilter}
                        onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                    />
                </label>
            </div>
            {filtered.map((e, i) => (
                <div key={e.id || i} className="border p-2 rounded">
                    <div className="font-medium">{e.summary || e.entry}</div>
                    <div className="text-sm text-gray-500 flex gap-2">
                        <span>{e.sentiment}</span>
                        {e.mbti && <span>{e.mbti}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}

//# AETH: Displays past diary entries with filtering for sentiment, intent and MBTI
