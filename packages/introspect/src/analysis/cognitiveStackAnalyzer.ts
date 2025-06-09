export interface CognitiveFunctionEvidence {
    function: string;
    evidence: string[];
    score: number;
}

export interface CognitiveStackAnalysis {
    type: string;
    functions: CognitiveFunctionEvidence[];
}

const STACKS: Record<string, string[]> = {
    ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
};

//# AETH: Analyze cognitive stack using basic keyword evidence
const FUNCTION_KEYWORDS: Record<string, string[]> = {
    Ne: ['idea', 'possibility'],
    Ti: ['logic', 'analyze'],
    Fe: ['care', 'support'],
    Si: ['past', 'memory'],
};

export function analyzeCognitiveStack(type: string, text: string): CognitiveStackAnalysis {
    const lower = text.toLowerCase();
    const stack = STACKS[type] || [];
    const functions = stack.map((fn) => {
        const words = FUNCTION_KEYWORDS[fn] || [];
        const evidence = words.filter((w) => lower.includes(w));
        return { function: fn, evidence, score: evidence.length / (words.length || 1) };
    });
    return { type, functions };
}

//# AETH: Placeholder stack analysis for future ML enhancement
