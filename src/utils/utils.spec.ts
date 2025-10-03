import {describe, expect, it} from 'vitest';
import {formatDate} from './utils';

describe('formatDate', () => {
    it('should format a valid ISO date string correctly', () => {
        expect(formatDate('2023-10-26T12:00:00Z')).toBe('Oct 26, 2023');
    });

    it('should format a valid ISO date string correctly', () => {
        expect(formatDate('2025-05-11')).toBe('May 11, 2025');
        expect(formatDate('2025-5-11')).toBe('May 11, 2025');
        expect(formatDate('2025-5-011')).toBe('May 11, 2025');
        expect(formatDate('2025-010-11')).toBe('Oct 11, 2025');
    });

    it('should format a valid Date object correctly', () => {
        expect(formatDate(new Date('2023-10-26T12:00:00Z'))).toBe('Oct 26, 2023');
    });

    it('should return the original string for an invalid date string', () => {
        expect(formatDate('not a date')).toBe('not a date');
    });

    it('should return "Invalid Date" for an invalid Date object', () => {
        expect(formatDate(new Date('not a date'))).toBe('Invalid Date');
    });

    it('should handle different valid dates', () => {
        expect(formatDate(new Date('2024-01-15T12:00:00Z'))).toBe('Jan 15, 2024');

        expect(formatDate('1999-12-31T12:00:00Z')).toBe('Dec 31, 1999');
    });
});
