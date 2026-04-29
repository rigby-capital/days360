import { describe, it, expect } from 'vitest';
import { parseDate } from '../src/parse-date.js';

describe('parseDate(value)', () => {
  describe('Date objects', () => {
    it('should parse a valid Date', () => {
      const d = new Date(Date.UTC(2025, 0, 15));
      expect(parseDate(d)).toEqual({ year: 2025, month: 1, day: 15 });
    });

    it('should throw TypeError for an invalid Date', () => {
      expect(() => parseDate(new Date('invalid'))).toThrow(TypeError);
      expect(() => parseDate(new Date('invalid'))).toThrow('invalid Date object');
    });
  });

  describe('timestamps (numbers)', () => {
    it('should parse a non-negative timestamp', () => {
      const ts = Date.UTC(2025, 5, 20); // June 20, 2025
      expect(parseDate(ts)).toEqual({ year: 2025, month: 6, day: 20 });
    });

    it('should parse timestamp 0 (epoch)', () => {
      expect(parseDate(0)).toEqual({ year: 1970, month: 1, day: 1 });
    });

    it('should throw TypeError for negative timestamps', () => {
      expect(() => parseDate(-1)).toThrow(TypeError);
      expect(() => parseDate(-1)).toThrow('non-negative timestamp');
    });

    it('should throw TypeError for NaN', () => {
      expect(() => parseDate(NaN)).toThrow(TypeError);
    });

    it('should throw TypeError for Infinity', () => {
      expect(() => parseDate(Infinity)).toThrow(TypeError);
      expect(() => parseDate(-Infinity)).toThrow(TypeError);
    });
  });

  describe('ISO strings (YYYY-MM-DD)', () => {
    it('should parse a valid ISO date string', () => {
      expect(parseDate('2025-01-15')).toEqual({ year: 2025, month: 1, day: 15 });
      expect(parseDate('2016-02-29')).toEqual({ year: 2016, month: 2, day: 29 });
      expect(parseDate('2000-12-31')).toEqual({ year: 2000, month: 12, day: 31 });
    });

    it('should throw TypeError for invalid format', () => {
      expect(() => parseDate('2025/01/15')).toThrow(TypeError);
      expect(() => parseDate('Jan 15, 2025')).toThrow(TypeError);
      expect(() => parseDate('20250115')).toThrow(TypeError);
      expect(() => parseDate('')).toThrow(TypeError);
      expect(() => parseDate('test')).toThrow(TypeError);
    });

    it('should throw TypeError for invalid calendar dates', () => {
      expect(() => parseDate('2025-02-29')).toThrow(TypeError); // not a leap year
      expect(() => parseDate('2025-13-01')).toThrow(TypeError); // month > 12
      expect(() => parseDate('2025-00-01')).toThrow(TypeError); // month = 0
      expect(() => parseDate('2025-04-31')).toThrow(TypeError); // April has 30 days
    });
  });

  describe('invalid types', () => {
    it('should throw TypeError for non-date types', () => {
      expect(() => parseDate(true as any)).toThrow(TypeError);
      expect(() => parseDate(false as any)).toThrow(TypeError);
      expect(() => parseDate(null as any)).toThrow(TypeError);
      expect(() => parseDate(undefined as any)).toThrow(TypeError);
      expect(() => parseDate([] as any)).toThrow(TypeError);
      expect(() => parseDate({} as any)).toThrow(TypeError);
    });
  });
});
