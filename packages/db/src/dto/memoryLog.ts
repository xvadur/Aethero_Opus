import type { MemoryLog } from '../schema';
export const toMemoryLog = (db: MemoryLog) => ({
    id: db.id,
    userId: db.userId,
    conversationId: db.conversationId,
    content: db.content,
    summary: db.summary,
    sentiment: db.sentiment,
    intents: db.intents,
    timezone: db.timezone,
    device: db.device,
    agentChain: db.agentChain,
    source: db.source,
    mbti: db.mbti,
    bigFive: db.bigFive,
    psychologyModelConfidence: db.psychologyModelConfidence,
    createdAt: db.createdAt.toISOString(),
});
//# AETH: DTO mapping DB memory log row to app model
