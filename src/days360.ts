import { parseDate, type DateInput } from './parse-date.js';
import { isLastDayOfFeb } from './is-last-day-feb.js';

/**
 * Calculation method for the 360-day year.
 *
 * - `'US'` — US/NASD method with Excel compatibility (default).
 *   Excel has a known incorrect implementation where same-day February dates
 *   can return negative values.
 * - `'EU'` — European method (30E/360).
 * - `'US_NASD'` — True US/NASD method (30US/360), mathematically correct.
 *
 * @see https://en.wikipedia.org/wiki/360-day_calendar
 * @see https://wiki.openoffice.org/wiki/Documentation/How_Tos/Calc:_Date_%26_Time_functions#Financial_date_systems
 */
export type Method = 'US' | 'EU' | 'US_NASD';

/**
 * Calculate the number of days between two dates based on a 360-day year,
 * using the US/NASD method (30US/360) or European method (30E/360).
 *
 * @param startDate — Start date (Date, ms timestamp, or `'YYYY-MM-DD'` string)
 * @param endDate   — End date (Date, ms timestamp, or `'YYYY-MM-DD'` string)
 * @param method    — Calculation method (default: `'US'`)
 * @returns Number of days between the two dates on a 360-day calendar
 *
 * @throws {TypeError} if either date is invalid
 *
 * @example
 * ```ts
 * import { days360 } from '@rcsf/days360';
 *
 * days360('2016-01-01', '2016-12-31');            // 360
 * days360('2016-01-01', '2016-12-31', 'EU');      // 359
 * days360('2016-01-01', '2016-12-31', 'US_NASD'); // 360
 * ```
 */
export function days360(
  startDate: DateInput,
  endDate: DateInput,
  method: Method = 'US',
): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  let startDay = start.day;
  let endDay = end.day;

  if (method === 'EU') {
    // European: if either date falls on the 31st, change it to the 30th.
    startDay = Math.min(startDay, 30);
    endDay = Math.min(endDay, 30);
  } else {
    // US methods (US and US_NASD)

    /**
     * If both dates fall on the last day of February, then the end date
     * will be changed to the 30th (unless preserving Excel compatibility).
     */
    const isStartLastFeb = isLastDayOfFeb(start.year, start.month, start.day);

    if (method === 'US_NASD' && isStartLastFeb && isLastDayOfFeb(end.year, end.month, end.day)) {
      endDay = 30;
    }

    /**
     * If the start date falls on the 31st of a month or last day of February,
     * change it to the 30th.
     */
    if (isStartLastFeb || startDay === 31) {
      startDay = 30;
    }

    /**
     * If the start date falls on the 30th (after adjustment above) and
     * the end date falls on the 31st, change the end date to the 30th.
     */
    if (startDay === 30 && endDay === 31) {
      endDay = 30;
    }
  }

  return (
    (end.year - start.year) * 360 +
    (end.month - start.month) * 30 +
    (endDay - startDay)
  );
}
