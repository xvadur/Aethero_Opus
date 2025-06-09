import { describe, expect, test } from 'bun:test';
import { analyzeMBTI } from '../src/analysis/mbtiAnalyzer';

describe('MBTIAnalyzer', () => {
    test('returns type with confidence and matches', () => {
        const result = analyzeMBTI('I enjoy meeting people and organizing events.');
        expect(result.type.length).toBe(4);
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
        expect(result.matches).toBeDefined();
    });
});
