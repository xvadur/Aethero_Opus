import { appendFile } from 'node:fs/promises';
import { db, memoryLogs } from '@onlook/db/src/client';
import { memoryLogInsertSchema } from '@onlook/db';

export interface PsychologyModel {
    MBTI?: string;
    BigFive?: Record<string, number>;
}

interface MemoryLogEntry {
    timestamp: string;
    userId?: string;
    conversationId?: string;
    entry: string;
    summary?: string;
    sentiment?: string;
    intents?: string[];
    timezone?: string;
    device?: string;
    agentChain?: string[];
    source?: string;
    psychologyModel?: PsychologyModel;
    psychologyModelConfidence?: number;
}

const getLogFileName = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    return `aeth_mem_${date}.jsonl`;
};

export async function logMemory(entry: MemoryLogEntry) {
    const line = JSON.stringify(entry);
    const file = getLogFileName();
    await appendFile(file, line + '\n');
    try {
        const parsed = memoryLogInsertSchema.parse({
            content: entry.entry,
            summary: entry.summary,
            sentiment: entry.sentiment,
            intents: entry.intents || [],
            timezone: entry.timezone,
            device: entry.device,
            agentChain: entry.agentChain || [],
            source: entry.source,
            conversationId: entry.conversationId,
            userId: entry.userId,
            mbti: entry.psychologyModel?.MBTI,
            bigFive: entry.psychologyModel?.BigFive,
            psychologyModelConfidence: entry.psychologyModelConfidence,
        });
        await db.insert(memoryLogs).values(parsed);
    } catch (error) {
        console.error('Failed to log memory in DB', error);
    }
}

//# AETH: MemoryLogger handles introspective entries at paragraph granularity
//# AETH: Each call appends a JSON line with metadata to daily log file
export type { MemoryLogEntry, PsychologyModel };
