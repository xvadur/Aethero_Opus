import { desc } from 'drizzle-orm';
import { db, memoryLogs } from '@onlook/db/src/client';
import { analyzeText } from '../pipeline';
import { logMemory } from '../memory-logger';
import { analyzeTypeGrid } from '../analysis/typeGridAnalyzer';
import { analyzeCognitiveStack } from '../analysis/cognitiveStackAnalyzer';

export interface DiaryChatInput {
    text: string;
    userId?: string;
    conversationId?: string;
}

export interface DiaryChatResult {
    reply: string;
    memoryUsed: string[];
    mbti?: string;
    bigFive?: Record<string, number>;
    personalityTheme?: import('../personalityThemeManager').PersonalityTheme;
    csjAnalysis?: {
        typeGrid: ReturnType<typeof analyzeTypeGrid>;
        cognitive: ReturnType<typeof analyzeCognitiveStack>;
    };
}

//# AETH: DiaryChatAgent handles conversational requests with memory context
export async function diaryChatAgent(input: DiaryChatInput): Promise<DiaryChatResult> {
    const { text, userId, conversationId } = input;
    const analysis = analyzeText(text);

    const recent = await db
        .select({ content: memoryLogs.content })
        .from(memoryLogs)
        .orderBy(desc(memoryLogs.createdAt))
        .limit(5);

    const memoryUsed = recent.map((m) => m.content);

    const prompt = `=== USER MESSAGE ===\n${text}\n\n=== MEMORY CONTEXT ===\n${memoryUsed.join(
        '\n',
    )}\n\n=== PERSONALITY PROFILE ===\nMBTI: ${
        analysis.psychologyModel?.MBTI || 'unknown'
    }\nBigFive: ${JSON.stringify(analysis.psychologyModel?.BigFive || {})}\n\n=== TASK ===\nProvide a thoughtful, helpful, introspective reply. You may suggest follow-up questions.`;

    //# AETH: Placeholder LLM call. Replace with real model integration later
    const reply = `Echo: ${text}`;

    await logMemory({
        timestamp: new Date().toISOString(),
        userId,
        conversationId,
        entry: text,
        summary: analysis.summary,
        sentiment: analysis.sentiment,
        intents: analysis.intents,
        agentChain: ['DiaryChatAgent'],
        source: 'api',
        psychologyModel: analysis.psychologyModel,
        psychologyModelConfidence: analysis.psychologyModelConfidence,
    });

    return {
        reply,
        memoryUsed,
        mbti: analysis.psychologyModel?.MBTI,
        bigFive: analysis.psychologyModel?.BigFive,
        personalityTheme: analysis.personalityTheme,
        csjAnalysis: analysis.csjAnalysis,
    };
}
