import { describe, it, expect } from 'vitest';
import { formatDate } from './utils';

describe('formatDate', () => {
    it('should format a valid ISO date string correctly', () => {
        const dateString = '2023-10-26T12:00:00Z';
        expect(formatDate(dateString)).toBe('Oct 26, 2023');
    });

    it('should format a valid Date object correctly', () => {
        const dateObject = new Date('2023-10-26T12:00:00Z');
        expect(formatDate(dateObject)).toBe('Oct 26, 2023');
    });

    it('should return the original string for an invalid date string', () => {
        const invalidDateString = 'not a date';
        expect(formatDate(invalidDateString)).toBe(invalidDateString);
    });

    it('should return "Invalid Date" for an invalid Date object', () => {
        const invalidDateObject = new Date('not a date');
        expect(formatDate(invalidDateObject)).toBe('Invalid Date');
    });

    it('should handle different valid dates', () => {
        const date1 = new Date('2024-01-15T12:00:00Z');
        expect(formatDate(date1)).toBe('Jan 15, 2024');

        const date2 = '1999-12-31T12:00:00Z';
        expect(formatDate(date2)).toBe('Dec 31, 1999');
    });
});
