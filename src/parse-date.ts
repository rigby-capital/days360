/**
 * Parsed UTC date parts used internally by the days360 algorithm.
 */
export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

/**
 * A date input accepted by `days360`.
 *
 * - `Date` object (must not be invalid)
 * - `number` — milliseconds since Unix epoch (must be >= 0)
 * - `string` — ISO date in `YYYY-MM-DD` format
 */
export type DateInput = Date | number | string;

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parse a `DateInput` into UTC year/month/day parts.
 *
 * @throws {TypeError} if the input is not a valid date
 */
export function parseDate(value: DateInput): DateParts {
  if (typeof value === 'string') {
    return parseISOString(value);
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`Invalid date: expected a non-negative timestamp, got ${String(value)}`);
    }
    return extractUTCParts(new Date(value));
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError('Invalid date: received an invalid Date object');
    }
    return extractUTCParts(value);
  }

  throw new TypeError(
    `Invalid date: expected a Date, number, or 'YYYY-MM-DD' string, got ${typeof value}`,
  );
}

function parseISOString(iso: string): DateParts {
  const match = ISO_DATE_RE.exec(iso);
  if (!match) {
    throw new TypeError(
      `Invalid date: expected 'YYYY-MM-DD' format, got '${iso}'`,
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Validate ranges by round-tripping through Date
  const d = new Date(Date.UTC(year, month - 1, day));
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    throw new TypeError(`Invalid date: '${iso}' is not a valid calendar date`);
  }

  return { year, month, day };
}

function extractUTCParts(d: Date): DateParts {
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}
