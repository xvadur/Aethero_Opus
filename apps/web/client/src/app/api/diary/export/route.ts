import { NextResponse } from 'next/server';
import { db } from '@onlook/db/src/client';
import { memoryLogs, toMemoryLog } from '@onlook/db';
import { readFile } from 'node:fs/promises';

function getLogFileName() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `aeth_mem_${date}.jsonl`;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sentiment = searchParams.get('sentiment');
    const intent = searchParams.get('intent');
    const mbti = searchParams.get('mbti');
    const lines: string[] = [];
    try {
        const dbEntries = await db.query.memoryLogs.findMany({
            orderBy: (memoryLogs, { desc: d }) => [d(memoryLogs.createdAt)],
        });
        dbEntries.forEach((e) => {
            const log = toMemoryLog(e);
            if (
                (!sentiment || log.sentiment === sentiment) &&
                (!intent || log.intents.includes(intent)) &&
                (!mbti || log.mbti === mbti)
            ) {
                lines.push(JSON.stringify(log));
            }
        });
    } catch (error) {
        console.error('DB export failed', error);
    }
    try {
        const file = getLogFileName();
        const data = await readFile(file, 'utf8');
        data
            .trim()
            .split('\n')
            .forEach((line) => {
                try {
                    const log = JSON.parse(line);
                    if (
                        (!sentiment || log.sentiment === sentiment) &&
                        (!intent || (log.intents || []).includes(intent)) &&
                        (!mbti || log.psychologyModel?.MBTI === mbti)
                    ) {
                        lines.push(line);
                    }
                } catch {}
            });
    } catch {
        // ignore file errors
    }
    const body = lines.join('\n');
    return new NextResponse(body, {
        headers: {
            'Content-Type': 'application/jsonl',
            'Content-Disposition': 'attachment; filename="aeth_mem_export.jsonl"',
        },
    });
}

//# AETH: Export merged memory log with optional sentiment, intent and MBTI filters
