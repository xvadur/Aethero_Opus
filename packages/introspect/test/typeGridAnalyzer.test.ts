import { describe, expect, test } from 'bun:test';
import { analyzeTypeGrid } from '../src/analysis/typeGridAnalyzer';

describe('TypeGridAnalyzer', () => {
    test('returns analysis result', () => {
        const res = analyzeTypeGrid('Maybe we should consider this theory.');
        expect(res.selectedType).toBeDefined();
        expect(res.reasoning.length).toBeGreaterThan(0);
    });
});
