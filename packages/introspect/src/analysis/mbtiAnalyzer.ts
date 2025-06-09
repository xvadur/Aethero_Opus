export interface MBTIResult {
    type: string;
    confidence: number;
    matches: Record<string, { word: string; weight: number }[]>;
}

//# AETH: MBTI analyzer uses weighted keywords to infer personality dimensions
export const DIMENSIONS: Record<string, { word: string; weight: number }[]> = {
    E: [
        { word: 'talk', weight: 1.1 },
        { word: 'social', weight: 1.2 },
        { word: 'group', weight: 1 },
        { word: 'meet', weight: 1 },
        { word: 'party', weight: 1.2 },
        { word: 'public', weight: 1 },
        { word: 'team', weight: 1 },
    ],
    I: [
        { word: 'alone', weight: 1.1 },
        { word: 'quiet', weight: 1.1 },
        { word: 'reflect', weight: 1 },
        { word: 'introspect', weight: 1 },
        { word: 'private', weight: 1 },
        { word: 'solo', weight: 1 },
    ],
    S: [
        { word: 'fact', weight: 1 },
        { word: 'detail', weight: 1.1 },
        { word: 'practical', weight: 1 },
        { word: 'realistic', weight: 1 },
        { word: 'observe', weight: 1 },
    ],
    N: [
        { word: 'imagine', weight: 1.1 },
        { word: 'theory', weight: 1 },
        { word: 'concept', weight: 1 },
        { word: 'idea', weight: 1 },
        { word: 'dream', weight: 1 },
    ],
    T: [
        { word: 'logic', weight: 1.2 },
        { word: 'analyze', weight: 1 },
        { word: 'objective', weight: 1 },
        { word: 'reason', weight: 1 },
        { word: 'system', weight: 1 },
    ],
    F: [
        { word: 'feel', weight: 1.1 },
        { word: 'emotion', weight: 1 },
        { word: 'empath', weight: 1 },
        { word: 'care', weight: 1 },
        { word: 'compassion', weight: 1 },
    ],
    J: [
        { word: 'plan', weight: 1.1 },
        { word: 'organize', weight: 1.1 },
        { word: 'schedule', weight: 1 },
        { word: 'decide', weight: 1 },
        { word: 'structure', weight: 1 },
    ],
    P: [
        { word: 'spontaneous', weight: 1.1 },
        { word: 'flexible', weight: 1 },
        { word: 'improvise', weight: 1 },
        { word: 'explore', weight: 1 },
        { word: 'adapt', weight: 1 },
    ],
};

function handleNegations(text: string): string {
    return text.replace(/\b(?:not|no)\s+(\w+)/g, 'not_$1');
}

function applyIntensityScaling(text: string, word: string, baseWeight: number): number {
    const pattern = new RegExp(`\\b(?:very|extremely)\\s+${word}\\b`, 'i');
    return pattern.test(text) ? baseWeight * 1.5 : baseWeight;
}

export function computeKeywordWeightedScoresMBTI(text: string): {
    scores: Record<string, number>;
    matches: Record<string, { word: string; weight: number }[]>;
} {
    const processed = handleNegations(text.toLowerCase());
    const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    const matches: Record<string, { word: string; weight: number }[]> = {
        E: [],
        I: [],
        S: [],
        N: [],
        T: [],
        F: [],
        J: [],
        P: [],
    };

    Object.entries(DIMENSIONS).forEach(([letter, items]) => {
        let sum = 0;
        const used: { word: string; weight: number }[] = [];
        items.forEach(({ word, weight }) => {
            const negRegex = new RegExp(`\\bnot_${word}\\b`, 'g');
            const negCount = (processed.match(negRegex) || []).length;

            const posRegex = new RegExp(`\\b${word}\\b`, 'g');
            const posCount = (processed.match(posRegex) || []).length;

            const scaledWeight = applyIntensityScaling(processed, word, weight);
            if (posCount > 0) {
                used.push({ word, weight: scaledWeight });
            }
            sum += posCount * scaledWeight - negCount * weight;
        });
        scores[letter] = sum;
        matches[letter] = used;
    });
    return { scores, matches };
}

export function analyzeMBTI(text: string): MBTIResult {
    const { scores, matches } = computeKeywordWeightedScoresMBTI(text);
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
    //# AETH: Log MBTI keyword matches for auditability
    console.debug('MBTI analysis', { matches, scores, letters, confidence });
    return { type: letters.join(''), confidence: Math.min(1, confidence), matches };
}

//# AETH: Analyzer kept lightweight for easy replacement with ML model later
