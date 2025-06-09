'use client';
import { useState } from 'react';

interface Message {
    text: string;
    reply?: string;
}

export function DiaryChatAgent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const send = async () => {
        if (!input) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/diary/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input }),
            });
            if (!res.ok) {
                throw new Error('Request failed');
            }
            const data = await res.json();
            setMessages([...messages, { text: input, reply: data.reply }]);
            setInput('');
        } catch (err) {
            setError('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="border p-2 h-40 overflow-y-auto">
                {messages.map((m, idx) => (
                    <div key={idx} className="mb-2">
                        <div className="font-semibold">You:</div>
                        <div>{m.text}</div>
                        {m.reply && (
                            <>
                                <div className="font-semibold">Assistant:</div>
                                <div>{m.reply}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="border flex-1 p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4"
                    onClick={send}
                    disabled={loading}
                >
                    {loading ? '...' : 'Send'}
                </button>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
    );
}

//# AETH: DiaryChatAgent UI component enabling conversation with the analyzer
