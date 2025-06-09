import { describe, expect, test } from 'bun:test';
import { analyzeCognitiveStack } from '../src/analysis/cognitiveStackAnalyzer';

describe('CognitiveStackAnalyzer', () => {
    test('generates stack evidence', () => {
        const res = analyzeCognitiveStack('ENTP', 'I love new ideas and logical analysis.');
        expect(res.type).toBe('ENTP');
        expect(res.functions.length).toBeGreaterThan(0);
    });
});
