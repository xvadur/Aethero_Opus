'use client';
import { useState } from 'react';
import { EntryList } from './_components/EntryList';
import { AnalysisView } from './_components/AnalysisView';
import { MemoryExportButton } from './_components/MemoryExportButton';

export default function DiaryPage() {
    const [text, setText] = useState('');

    const submit = async () => {
        await fetch('/api/diary/entry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        setText('');
    };

    return (
        <div className="p-4 space-y-4">
            <textarea
                className="w-full border p-2"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-500 text-white" onClick={submit}>
                Save Entry
            </button>
            <EntryList />
            <AnalysisView />
            <MemoryExportButton />
        </div>
    );
}

//# AETH: DiaryModule UI skeleton for manual testing and visualization
