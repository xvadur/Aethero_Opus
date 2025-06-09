import { readFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { db } from '@onlook/db/src/client';
import { memoryLogs, toMemoryLog } from '@onlook/db';
import { desc } from 'drizzle-orm';

function getLogFileName() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `aeth_mem_${date}.jsonl`;
}

export async function GET() {
    try {
        const dbEntries = await db.query.memoryLogs.findMany({
            orderBy: (memoryLogs, { desc: d }) => [d(memoryLogs.createdAt)],
        });
        if (dbEntries.length) {
            return NextResponse.json({ entries: dbEntries.map(toMemoryLog) });
        }
    } catch (error) {
        console.error('DB fetch failed', error);
    }
    try {
        const file = getLogFileName();
        const data = await readFile(file, 'utf8');
        const entries = data.trim().split('\n').map(JSON.parse);
        return NextResponse.json({ entries });
    } catch {
        return NextResponse.json({ entries: [] });
    }
}

//# AETH: API endpoint for retrieving diary entries for the current day
