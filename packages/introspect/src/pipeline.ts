import type { PsychologyModel } from './memory-logger';
import { analyzeMBTI } from './analysis/mbtiAnalyzer';
import { analyzeBigFive } from './analysis/bigFiveAnalyzer';

export interface AnalysisResult {
    summary: string;
    sentiment: string;
    intents: string[];
    psychologyModel?: PsychologyModel;
    psychologyModelConfidence?: number;
}

//# AETH: Placeholder tokenizer splitting paragraphs
function tokenize(text: string): string[] {
    return text.split(/\n+/).filter(Boolean);
}

//# AETH: Simple summarizer returning first sentence
function summarize(text: string): string {
    const sentence = text.split(/\.\s/)[0];
    return sentence.slice(0, 100);
}

//# AETH: Naive sentiment analyzer based on keywords
function analyzeSentiment(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('love') || lower.includes('great')) return 'positive';
    if (lower.includes('hate') || lower.includes('bad')) return 'negative';
    return 'neutral';
}

//# AETH: Intent extractor using simple keyword heuristics
function extractIntents(text: string): string[] {
    const intents: string[] = [];
    if (/\bquestion\b/.test(text)) intents.push('question');
    if (/\bshop\b/.test(text)) intents.push('shopping');
    return intents;
}

//# AETH: MBTI analyzer delegated to external module; BigFive scaffolded
export function analyzeText(text: string): AnalysisResult {
    const summary = summarize(text);
    const sentiment = analyzeSentiment(text);
    const intents = extractIntents(text);
    const mbtiResult = analyzeMBTI(text);
    const bigFive = analyzeBigFive(text);
    const psychologyModel: PsychologyModel = {
        MBTI: mbtiResult.type,
        BigFive: bigFive,
    };
    return {
        summary,
        sentiment,
        intents,
        psychologyModel,
        psychologyModelConfidence: mbtiResult.confidence,
    };
}

//# AETH: Pipeline modules kept small for future agent replacement
