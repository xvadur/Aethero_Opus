import { analyzeText, logMemory } from '@onlook/introspect';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { text, userId, conversationId } = await req.json();
    const analysis = analyzeText(text);
    await logMemory({
        timestamp: new Date().toISOString(),
        userId,
        conversationId,
        entry: text,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        intents: analysis.intents,
        psychologyModel: analysis.psychologyModel,
        psychologyModelConfidence: analysis.psychologyModelConfidence,
        source: 'manual',
    });
    return NextResponse.json({ ok: true, analysis });
}

//# AETH: API endpoint for logging a diary entry with analysis
