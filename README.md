# @rcsf/days360

Calculate the difference between two dates based on the [360-day financial year](https://en.wikipedia.org/wiki/360-day_calendar), using the US/NASD method (30US/360) or European method (30E/360).

This is a TypeScript ESM successor to [`spacecraftinc/days360`](https://github.com/spacecraftinc/days360) (v2), which is no longer maintained.

## Install

```
npm install @rcsf/days360
```

## Usage

```ts
import { days360 } from '@rcsf/days360';

// ISO date strings
days360('2016-01-01', '2016-12-31');            // 360
days360('2016-01-01', '2016-12-31', 'EU');      // 359
days360('2016-01-01', '2016-12-31', 'US_NASD'); // 360

// Date objects
days360(new Date('2016-01-01'), new Date('2016-12-31')); // 360

// Millisecond timestamps
days360(Date.UTC(2016, 0, 1), Date.UTC(2016, 11, 31));  // 360
```

## API

### `days360(startDate, endDate, method?)`

Returns the number of days between two dates on a 360-day calendar.

#### Parameters

| Parameter   | Type                          | Description                                      |
|-------------|-------------------------------|--------------------------------------------------|
| `startDate` | `Date \| number \| string`    | Start date                                       |
| `endDate`   | `Date \| number \| string`    | End date                                         |
| `method`    | `'US' \| 'EU' \| 'US_NASD'`  | Calculation method (default: `'US'`)             |

- **`Date`** — a valid `Date` object
- **`number`** — milliseconds since Unix epoch (>= 0)
- **`string`** — ISO date in `YYYY-MM-DD` format

Throws `TypeError` if either date is invalid.

#### Methods

| Method     | Description                                                              |
|------------|--------------------------------------------------------------------------|
| `'US'`     | US/NASD method with [Excel compatibility](https://wiki.openoffice.org/wiki/Documentation/How_Tos/Calc:_Date_%26_Time_functions#Financial_date_systems) (default) |
| `'EU'`     | European method (30E/360)                                                |
| `'US_NASD'`| True US/NASD method (30US/360)                                           |

Excel's implementation of the US/NASD method has a [known incorrect implementation](https://wiki.openoffice.org/wiki/Documentation/How_Tos/Calc:_Date_%26_Time_functions#Financial_date_systems). The default `'US'` method reproduces this behavior for compatibility. Use `'US_NASD'` for the mathematically correct calculation.

## Migrating from v2

```diff
- const days360 = require('days360');
+ import { days360 } from '@rcsf/days360';

- days360(start, end, days360.US);      // numeric constants
+ days360(start, end, 'US');            // string literals

- days360(start, end, days360.EU);
+ days360(start, end, 'EU');

- days360(start, end, days360.US_NASD);
+ days360(start, end, 'US_NASD');

// ISO strings now accepted directly
+ days360('2016-01-01', '2016-12-31');

// Invalid input now throws TypeError instead of returning undefined
- if (days360(start, end) === undefined) { ... }
+ try { days360(start, end); } catch (e) { ... }
```

### Breaking changes in v3

- **ESM only** — no CommonJS `require()` support
- **Package name** — published as `@rcsf/days360`
- **Method parameter** — string literals (`'US'`, `'EU'`, `'US_NASD'`) replace numeric constants (`0`, `1`, `2`)
- **Error handling** — throws `TypeError` on invalid input instead of returning `undefined`
- **Node.js** — requires Node.js >= 20

## Testing

```
npm test
```

The test suite includes 11,664 compatibility assertions validated against reference data from Google Sheets, Apple Numbers, Microsoft Excel, LibreOffice Calc, and OpenOffice Calc.

## License

[MIT](LICENSE) — Copyright (c) 2026 Rigby Capital, (c) 2016 SpaceCraft, Inc.
