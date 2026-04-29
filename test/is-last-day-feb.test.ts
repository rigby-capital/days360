import { describe, it, expect } from 'vitest';
import { isLastDayOfFeb } from '../src/is-last-day-feb.js';

describe('isLastDayOfFeb(year, month, day)', () => {
  it('should return false for dates not in February', () => {
    expect(isLastDayOfFeb(2016, 1, 31)).toBe(false);
    expect(isLastDayOfFeb(2016, 3, 31)).toBe(false);
    expect(isLastDayOfFeb(2016, 4, 30)).toBe(false);
    expect(isLastDayOfFeb(2016, 12, 31)).toBe(false);
  });

  it('should return false for Feb dates that are not the last day', () => {
    expect(isLastDayOfFeb(2016, 2, 1)).toBe(false);
    expect(isLastDayOfFeb(2016, 2, 28)).toBe(false); // leap year, 29 is last
    expect(isLastDayOfFeb(2015, 2, 27)).toBe(false);
  });

  it('should return true for the last day of Feb in a non-leap year', () => {
    expect(isLastDayOfFeb(2015, 2, 28)).toBe(true);
    expect(isLastDayOfFeb(2023, 2, 28)).toBe(true);
    expect(isLastDayOfFeb(1900, 2, 28)).toBe(true); // not a leap year (divisible by 100)
  });

  it('should return true for the last day of Feb in a leap year', () => {
    expect(isLastDayOfFeb(2016, 2, 29)).toBe(true);
    expect(isLastDayOfFeb(2024, 2, 29)).toBe(true);
    expect(isLastDayOfFeb(2000, 2, 29)).toBe(true); // leap year (divisible by 400)
  });
});
