import { describe, expect, test } from 'bun:test';
import { analyzeBigFive } from '../src/analysis/bigFiveAnalyzer';

describe('BigFiveAnalyzer', () => {
    test('scores higher openness for creative text', () => {
        const result = analyzeBigFive('I am a creative and imaginative person who loves art.');
        expect(result.scores.O).toBeGreaterThan(0);
        expect(result.scores.O).toBeLessThanOrEqual(1);
        expect(result.matches.O.length).toBeGreaterThan(0);
    });
});
