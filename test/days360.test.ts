import { describe, it, expect } from 'vitest';
import { days360 } from '../src/index.js';

describe('days360(startDate, endDate, method)', () => {
  describe('input validation', () => {
    it('should throw TypeError if the start date is invalid', () => {
      const invalid = [
        true,
        false,
        '',
        'test',
        -10,
        [],
        {},
        null,
        undefined,
        /test/i,
        () => {},
        new Date('test'),
      ];
      for (const value of invalid) {
        expect(() => days360(value as any, new Date()), `startDate = ${String(value)}`).toThrow(
          TypeError,
        );
      }
    });

    it('should throw TypeError if the end date is invalid', () => {
      const invalid = [
        true,
        false,
        '',
        'test',
        -10,
        [],
        {},
        null,
        undefined,
        /test/i,
        () => {},
        new Date('test'),
      ];
      for (const value of invalid) {
        expect(() => days360(new Date(), value as any), `endDate = ${String(value)}`).toThrow(
          TypeError,
        );
      }
    });

    it('should throw TypeError for invalid ISO date strings', () => {
      expect(() => days360('2025-13-01', '2025-01-01')).toThrow(TypeError);
      expect(() => days360('2025-02-30', '2025-01-01')).toThrow(TypeError);
      expect(() => days360('2025-00-01', '2025-01-01')).toThrow(TypeError);
      expect(() => days360('not-a-date', '2025-01-01')).toThrow(TypeError);
    });
  });

  describe('US method (Excel-compatible, default)', () => {
    const cases = [
      { start: '2016-01-15', end: '2016-12-31', expected: 346 },
      { start: '2016-03-31', end: '2016-12-31', expected: 270 },
      { start: '2016-01-01', end: '2016-12-31', expected: 360 },
      { start: '2016-02-29', end: '2016-02-29', expected: -1 },
      { start: '2015-02-28', end: '2015-02-28', expected: -2 },
    ];

    it.each(cases)(
      'days360($start, $end) = $expected',
      ({ start, end, expected }) => {
        // Test with Date objects
        const startDate = new Date(`${start}T00:00:00Z`);
        const endDate = new Date(`${end}T00:00:00Z`);
        expect(days360(startDate, endDate)).toBe(expected);
        expect(days360(startDate, endDate, 'US')).toBe(expected);

        // Test with ISO strings
        expect(days360(start, end)).toBe(expected);
        expect(days360(start, end, 'US')).toBe(expected);
      },
    );
  });

  describe('US_NASD method', () => {
    const cases = [
      { start: '2016-01-15', end: '2016-12-31', expected: 346 },
      { start: '2016-03-31', end: '2016-12-31', expected: 270 },
      { start: '2016-01-01', end: '2016-12-31', expected: 360 },
      { start: '2016-02-29', end: '2016-02-29', expected: 0 },
      { start: '2015-02-28', end: '2015-02-28', expected: 0 },
    ];

    it.each(cases)(
      'days360($start, $end, US_NASD) = $expected',
      ({ start, end, expected }) => {
        const startDate = new Date(`${start}T00:00:00Z`);
        const endDate = new Date(`${end}T00:00:00Z`);
        expect(days360(startDate, endDate, 'US_NASD')).toBe(expected);
        expect(days360(start, end, 'US_NASD')).toBe(expected);
      },
    );
  });

  describe('EU method', () => {
    const cases = [
      { start: '2016-01-15', end: '2016-12-31', expected: 345 },
      { start: '2016-03-31', end: '2016-12-31', expected: 270 },
      { start: '2016-01-01', end: '2016-12-31', expected: 359 },
      { start: '2016-02-29', end: '2016-02-29', expected: 0 },
      { start: '2015-02-28', end: '2015-02-28', expected: 0 },
    ];

    it.each(cases)(
      'days360($start, $end, EU) = $expected',
      ({ start, end, expected }) => {
        const startDate = new Date(`${start}T00:00:00Z`);
        const endDate = new Date(`${end}T00:00:00Z`);
        expect(days360(startDate, endDate, 'EU')).toBe(expected);
        expect(days360(start, end, 'EU')).toBe(expected);
      },
    );
  });

  describe('timestamp input', () => {
    const cases = [
      { start: '2016-01-15', end: '2016-12-31', expected: 346 },
      { start: '2016-03-31', end: '2016-12-31', expected: 270 },
      { start: '2016-01-01', end: '2016-12-31', expected: 360 },
      { start: '2016-02-29', end: '2016-02-29', expected: -1 },
      { start: '2015-02-28', end: '2015-02-28', expected: -2 },
    ];

    it.each(cases)(
      'days360(ts($start), ts($end)) = $expected',
      ({ start, end, expected }) => {
        const startDate = new Date(`${start}T00:00:00Z`);
        const endDate = new Date(`${end}T00:00:00Z`);
        // timestamp as start
        expect(days360(startDate.valueOf(), endDate)).toBe(expected);
        // timestamp as end
        expect(days360(startDate, endDate.valueOf())).toBe(expected);
        // both timestamps
        expect(days360(startDate.valueOf(), endDate.valueOf())).toBe(expected);
      },
    );
  });

  describe('ISO string input', () => {
    it('should accept YYYY-MM-DD strings', () => {
      expect(days360('2016-01-01', '2016-12-31')).toBe(360);
      expect(days360('2016-01-01', '2016-12-31', 'EU')).toBe(359);
      expect(days360('2016-01-01', '2016-12-31', 'US_NASD')).toBe(360);
    });

    it('should produce the same results as Date objects', () => {
      const pairs = [
        ['2016-01-15', '2016-12-31'],
        ['2016-03-31', '2016-12-31'],
        ['2016-02-29', '2016-02-29'],
        ['2015-02-28', '2015-02-28'],
      ] as const;

      for (const [start, end] of pairs) {
        const startDate = new Date(`${start}T00:00:00Z`);
        const endDate = new Date(`${end}T00:00:00Z`);
        for (const method of ['US', 'EU', 'US_NASD'] as const) {
          expect(days360(start, end, method)).toBe(days360(startDate, endDate, method));
        }
      }
    });
  });
});
