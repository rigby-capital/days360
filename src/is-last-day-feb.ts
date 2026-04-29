/**
 * Check if a date (given as UTC year/month/day) falls on the last day of February.
 *
 * - Feb 28 in non-leap years
 * - Feb 29 in leap years
 */
export function isLastDayOfFeb(year: number, month: number, day: number): boolean {
  if (month !== 2) {
    return false;
  }
  const lastDay = isLeapYear(year) ? 29 : 28;
  return day === lastDay;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
