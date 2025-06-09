export type BigFiveScores = Record<string, number>;
export interface BigFiveResult {
    scores: BigFiveScores;
    matches: Record<string, { word: string; weight: number }[]>;
}

//# AETH: Weighted keyword lists allow more nuanced scoring
export const TRAIT_KEYWORDS: Record<string, { word: string; weight: number }[]> = {
    O: [
        { word: 'creative', weight: 1.2 },
        { word: 'imaginative', weight: 1.1 },
        { word: 'novel', weight: 1 },
        { word: 'abstract', weight: 0.8 },
        { word: 'curious', weight: 1 },
        { word: 'explore', weight: 1 },
        { word: 'idea', weight: 0.9 },
        { word: 'art', weight: 1 },
    ],
    C: [
        { word: 'organized', weight: 1.3 },
        { word: 'punctual', weight: 1.2 },
        { word: 'plan', weight: 1 },
        { word: 'schedule', weight: 1 },
        { word: 'reliable', weight: 1.1 },
        { word: 'discipline', weight: 1 },
        { word: 'methodical', weight: 1 },
    ],
    E: [
        { word: 'social', weight: 1.2 },
        { word: 'party', weight: 1 },
        { word: 'talk', weight: 1 },
        { word: 'group', weight: 1 },
        { word: 'outgoing', weight: 1.1 },
        { word: 'energetic', weight: 1 },
        { word: 'meeting', weight: 0.8 },
    ],
    A: [
        { word: 'kind', weight: 1.2 },
        { word: 'friendly', weight: 1 },
        { word: 'cooperate', weight: 1 },
        { word: 'support', weight: 1 },
        { word: 'help', weight: 0.9 },
        { word: 'trust', weight: 1.1 },
        { word: 'empathy', weight: 1.2 },
    ],
    N: [
        { word: 'worry', weight: 1 },
        { word: 'anxious', weight: 1.1 },
        { word: 'stress', weight: 1 },
        { word: 'tense', weight: 1 },
        { word: 'sad', weight: 0.9 },
        { word: 'anger', weight: 1 },
        { word: 'fear', weight: 1 },
    ],
};

//# AETH: Compute raw weighted scores for each trait
function handleNegations(text: string): string {
    return text.replace(/\b(?:not|no)\s+(\w+)/g, 'not_$1');
}

function applyIntensityScaling(text: string, word: string, baseWeight: number): number {
    const pattern = new RegExp(`\\b(?:very|extremely)\\s+${word}\\b`, 'i');
    return pattern.test(text) ? baseWeight * 1.5 : baseWeight;
}

export function computeKeywordWeightedScoresBigFive(text: string): {
    scores: Record<string, number>;
    matches: Record<string, { word: string; weight: number }[]>;
} {
    const processed = handleNegations(text.toLowerCase());
    const rawScores: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const matches: Record<string, { word: string; weight: number }[]> = {
        O: [],
        C: [],
        E: [],
        A: [],
        N: [],
    };
    Object.entries(TRAIT_KEYWORDS).forEach(([trait, items]) => {
        let sum = 0;
        const used: { word: string; weight: number }[] = [];
        items.forEach(({ word, weight }) => {
            const negRegex = new RegExp(`\\bnot_${word}\\b`, 'g');
            const negCount = (processed.match(negRegex) || []).length;

            const posRegex = new RegExp(`\\b${word}\\b`, 'g');
            const posCount = (processed.match(posRegex) || []).length;

            const scaled = applyIntensityScaling(processed, word, weight);
            if (posCount > 0) {
                used.push({ word, weight: scaled });
            }
            sum += posCount * scaled - negCount * weight;
        });
        rawScores[trait] = sum;
        matches[trait] = used;
    });
    return { scores: rawScores, matches };
}

//# AETH: Normalize weighted scores using per-trait factors
export function normalizeScores(
    raw: Record<string, number>,
    factors: Record<string, number> = { O: 5, C: 5, E: 5, A: 5, N: 5 },
): BigFiveScores {
    const normalized: BigFiveScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    Object.keys(raw).forEach((trait) => {
        const factor = factors[trait as keyof typeof factors] || 5;
        normalized[trait] = Math.min(1, raw[trait] / factor);
    });
    return normalized;
}

export function analyzeBigFive(text: string): BigFiveResult {
    const { scores: raw, matches } = computeKeywordWeightedScoresBigFive(text);
    const scores = normalizeScores(raw);
    //# AETH: Detailed log for audit and future ML training
    console.debug('BigFive analysis', {
        matchedKeywords: matches,
        normalized: scores,
    });
    return { scores, matches };
}

//# AETH: Modular design allows replacing computeKeywordWeightedScores with ML model
