import { pgTable, uuid, text, timestamp, varchar, jsonb, numeric } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const memoryLogs = pgTable('memory_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id'),
    conversationId: uuid('conversation_id'),
    content: text('content').notNull(),
    summary: text('summary'),
    sentiment: varchar('sentiment'),
    intents: jsonb('intents').$type<string[]>().default([]).notNull(),
    timezone: varchar('timezone'),
    device: varchar('device'),
    agentChain: jsonb('agent_chain').$type<string[]>().default([]).notNull(),
    source: varchar('source'),
    mbti: varchar('mbti'),
    bigFive: jsonb('big_five').$type<Record<string, number>>(),
    psychologyModelConfidence: numeric('psychology_model_confidence'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const memoryLogInsertSchema = createInsertSchema(memoryLogs);

export type MemoryLog = typeof memoryLogs.$inferSelect;
export type NewMemoryLog = typeof memoryLogs.$inferInsert;
//# AETH: MemoryLog database schema for storing diary entries and metadata
