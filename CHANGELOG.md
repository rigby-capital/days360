# Changelog

## 3.0.0 (2026-04-14)

Successor release, published as `@rcsf/days360`.

### Breaking changes

- **ESM only** — no CommonJS support
- **Package name** — `@rcsf/days360` (was `days360`)
- **Method parameter** — string literals `'US'` | `'EU'` | `'US_NASD'` replace numeric constants `0` | `1` | `2`
- **Error handling** — throws `TypeError` on invalid input instead of returning `undefined`
- **Node.js** — requires >= 20 (was >= 8)

### New features

- TypeScript 5.9 with full type declarations
- ISO date string input (`'YYYY-MM-DD'`) accepted alongside `Date` and timestamps
- Exported types: `Method`, `DateInput`, `DateParts`

### Internal

- Rewritten in TypeScript with strict mode
- Mocha/Istanbul replaced with Vitest
- CircleCI replaced with GitHub Actions
- All 11,664 spreadsheet compatibility tests preserved

## 2.0.0 (2018-08-28)

- Updated minimum Node.js version to 8
- Switch to CircleCI 2.0

## 1.0.0 (2016-10-06)

- Initial release
