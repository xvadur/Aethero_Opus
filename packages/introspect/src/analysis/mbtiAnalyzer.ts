export interface MBTIResult {
    type: string;
    confidence: number;
}

//# AETH: MBTI analyzer uses weighted keyword scoring for better estimates
const DIMENSIONS = {
    E: ['talk', 'social', 'group', 'meet', 'party', 'public', 'team'],
    I: ['alone', 'quiet', 'reflect', 'introspect', 'private', 'solo'],
    S: ['fact', 'detail', 'practical', 'realistic', 'observe'],
    N: ['imagine', 'theory', 'concept', 'idea', 'dream'],
    T: ['logic', 'analyze', 'objective', 'reason', 'system'],
    F: ['feel', 'emotion', 'empath', 'care', 'compassion'],
    J: ['plan', 'organize', 'schedule', 'decide', 'structure'],
    P: ['spontaneous', 'flexible', 'improvise', 'explore', 'adapt'],
} as const;

function countMatches(text: string, keywords: readonly string[]) {
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    return (text.match(regex) || []).length;
}

export function analyzeMBTI(text: string): MBTIResult {
    const lower = text.toLowerCase();
    const scores = {
        E: countMatches(lower, DIMENSIONS.E),
        I: countMatches(lower, DIMENSIONS.I),
        S: countMatches(lower, DIMENSIONS.S),
        N: countMatches(lower, DIMENSIONS.N),
        T: countMatches(lower, DIMENSIONS.T),
        F: countMatches(lower, DIMENSIONS.F),
        J: countMatches(lower, DIMENSIONS.J),
        P: countMatches(lower, DIMENSIONS.P),
    };
    const letters = [
        scores.E >= scores.I ? 'E' : 'I',
        scores.S >= scores.N ? 'S' : 'N',
        scores.T >= scores.F ? 'T' : 'F',
        scores.J >= scores.P ? 'J' : 'P',
    ];
    const diffs = [
        Math.abs(scores.E - scores.I),
        Math.abs(scores.S - scores.N),
        Math.abs(scores.T - scores.F),
        Math.abs(scores.J - scores.P),
    ];
    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const confidence = diffs.reduce((a, b) => a + b, 0) / total / 4;
    return { type: letters.join(''), confidence: Math.min(1, confidence) };
}

//# AETH: Analyzer kept lightweight for easy replacement with ML model later
