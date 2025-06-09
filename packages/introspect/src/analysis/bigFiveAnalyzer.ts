export type BigFiveScores = Record<string, number>;

//# AETH: BigFive analyzer placeholder returning zeroed trait scores
export function analyzeBigFive(text: string): BigFiveScores {
    const traits = ['O', 'C', 'E', 'A', 'N'];
    return traits.reduce((acc, t) => {
        acc[t] = 0;
        return acc;
    }, {} as BigFiveScores);
}

//# AETH: Future versions will implement real linguistic scoring
