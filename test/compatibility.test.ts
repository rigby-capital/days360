import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { days360, type Method } from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
const TOTAL = 36 * 36;

interface Dataset {
  name: string;
  filename: string;
  method: Method;
}

const DATASETS: Dataset[] = [
  { name: 'Google Sheets (EU)', filename: 'google-sheets-eu.csv', method: 'EU' },
  { name: 'Google Sheets (US)', filename: 'google-sheets-us.csv', method: 'US' },
  { name: 'LibreOffice Calc (EU)', filename: 'libreoffice-calc-eu.csv', method: 'EU' },
  { name: 'LibreOffice Calc (US)', filename: 'libreoffice-calc-us.csv', method: 'US' },
  { name: 'Microsoft Excel (EU)', filename: 'microsoft-excel-eu.csv', method: 'EU' },
  { name: 'Microsoft Excel (US)', filename: 'microsoft-excel-us.csv', method: 'US' },
  { name: 'US/NASD', filename: 'nasd.csv', method: 'US_NASD' },
  { name: 'OpenOffice Calc (EU)', filename: 'openoffice-calc-eu.csv', method: 'EU' },
  { name: 'OpenOffice Calc (US)', filename: 'openoffice-calc-us.csv', method: 'US' },
];

function parseCSV(filename: string): string[][] {
  const content = readFileSync(join(DATA_DIR, filename), 'utf8');
  return content
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(','));
}

/**
 * Parse a date string from a CSV cell into an ISO 'YYYY-MM-DD' string.
 *
 * The CSV files use varying formats:
 * - ISO: '2007-01-01'
 * - US short: '1/1/07', '2/29/08'
 *
 * We parse both into a canonical YYYY-MM-DD string to feed into days360()
 * as an ISO string, which avoids all timezone issues that arise when
 * constructing Date objects from ambiguous date strings.
 */
function parseCSVDate(value: string): string {
  // Try ISO format first: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // US short format: M/D/YY
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(value);
  if (match) {
    let year = parseInt(match[3]!, 10);
    if (year < 100) {
      // 2-digit year: 00-99 → 2000-2099 (matches the dataset range 2006-2008)
      year += 2000;
    }
    const month = parseInt(match[1]!, 10);
    const day = parseInt(match[2]!, 10);
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  throw new Error(`Cannot parse CSV date: '${value}'`);
}

describe('Compatibility', () => {
  for (const dataset of DATASETS) {
    it(`should match ${dataset.name} (${TOTAL} cases)`, () => {
      const rows = parseCSV(dataset.filename);
      expect(rows.length).toBeGreaterThan(0);

      // First row contains column header dates, first column of each row is the row header date
      const columnDates = rows[0]!.map((v) => (v ? parseCSVDate(v) : null));
      const rowDates = rows.map((row) => (row[0] ? parseCSVDate(row[0]!) : null));

      let total = 0;

      for (let colIdx = 1; colIdx < columnDates.length; colIdx++) {
        const colDate = columnDates[colIdx];
        if (!colDate) continue;

        for (let rowIdx = 1; rowIdx < rowDates.length; rowIdx++) {
          const rowDate = rowDates[rowIdx];
          if (!rowDate) continue;

          const result = days360(rowDate, colDate, dataset.method);
          const rawValue = rows[rowIdx]![colIdx];
          // Normalize -0 to 0: some spreadsheets produce -0 for the EU method
          // (e.g., days360(Jan 31, Jan 30) = 30-30 = 0, but stored as -0).
          const expected = (rawValue ? parseInt(rawValue, 10) : 0) || 0;

          expect(result, `Row ${rowIdx} (${rowDate}), Col ${colIdx} (${colDate})`).toBe(expected);
          total++;
        }
      }

      expect(total).toBe(TOTAL);
    });
  }
});
