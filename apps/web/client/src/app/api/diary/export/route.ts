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
    const bigFiveRanges = {
        O: [
            parseFloat(searchParams.get('big_five_openness_min') || '0'),
            parseFloat(searchParams.get('big_five_openness_max') || '1'),
        ],
        C: [
            parseFloat(searchParams.get('big_five_conscientiousness_min') || '0'),
            parseFloat(searchParams.get('big_five_conscientiousness_max') || '1'),
        ],
        E: [
            parseFloat(searchParams.get('big_five_extraversion_min') || '0'),
            parseFloat(searchParams.get('big_five_extraversion_max') || '1'),
        ],
        A: [
            parseFloat(searchParams.get('big_five_agreeableness_min') || '0'),
            parseFloat(searchParams.get('big_five_agreeableness_max') || '1'),
        ],
        N: [
            parseFloat(searchParams.get('big_five_neuroticism_min') || '0'),
            parseFloat(searchParams.get('big_five_neuroticism_max') || '1'),
        ],
    };

    const passesBigFive = (scores?: Record<string, number>) => {
        if (!scores) return true;
        return (['O', 'C', 'E', 'A', 'N'] as const).every((t) => {
            const [min, max] = bigFiveRanges[t];
            const val = scores[t] ?? 0;
            return val >= min && val <= max;
        });
    };
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
                (!mbti || log.mbti === mbti) &&
                passesBigFive(log.bigFive)
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
                        (!mbti || log.psychologyModel?.MBTI === mbti) &&
                        passesBigFive(log.psychologyModel?.BigFive)
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

//# AETH: Export merged memory log with optional sentiment, intent, MBTI and BigFive filters
