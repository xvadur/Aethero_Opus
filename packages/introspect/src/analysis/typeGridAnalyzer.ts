export interface TypeGridResult {
    interactionStyle: string;
    temperament: string;
    possibleTypes: string[];
    selectedType: string;
    reasoning: string[];
}

//# AETH: Simple heuristic to guess interaction style and temperament
const STYLE_KEYWORDS: Record<string, string[]> = {
    Direct: ['!'],
    Informative: ['maybe', 'perhaps'],
};

const TEMPERAMENT_KEYWORDS: Record<string, string[]> = {
    Abstract: ['theory', 'idea'],
    Concrete: ['practical', 'detail'],
};

export function analyzeTypeGrid(text: string): TypeGridResult {
    const lower = text.toLowerCase();
    const style = Object.entries(STYLE_KEYWORDS).reduce(
        (acc, [style, words]) => (words.some((w) => lower.includes(w.toLowerCase())) ? style : acc),
        'Informative',
    );
    const temperament = Object.entries(TEMPERAMENT_KEYWORDS).reduce(
        (acc, [temp, words]) => (words.some((w) => lower.includes(w.toLowerCase())) ? temp : acc),
        'Concrete',
    );
    const possibleTypes = ['ENTP', 'INTJ', 'ISFJ', 'ESFP'];
    const selectedType = possibleTypes[0];
    const reasoning = [`Detected ${style} language`, `Detected ${temperament} focus`];
    return { interactionStyle: style, temperament, possibleTypes, selectedType, reasoning };
}

//# AETH: Placeholder heuristic pending full CSJ Type Grid implementation
