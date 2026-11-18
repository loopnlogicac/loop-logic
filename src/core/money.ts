// Fixed-point money and rates. No floating point is used for any value that
// decides correctness.
//
//   Money  = integer paisa (1 taka = 100 paisa)
//   Rate   = integer basis points (1% = 100 bps, 100% = 10_000 bps)
//
// Comparisons against policy happen on exact rationals (cross-multiplication),
// never on rounded display values.

export type Paisa = number;
export type Bps = number;

export class MoneyError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'MoneyError';
  }
}

export function assertPaisa(value: number, label: string): Paisa {
  if (!Number.isSafeInteger(value)) {
    throw new MoneyError('invalid_amount', `${label} must be a whole number of paisa`);
  }
  return value;
}

export function assertBps(value: number, label: string): Bps {
  if (!Number.isSafeInteger(value)) {
    throw new MoneyError('invalid_rate', `${label} must be a whole number of basis points`);
  }
  return value;
}

export const taka = (amount: number): Paisa => assertPaisa(Math.round(amount * 100), 'amount');
export const percent = (value: number): Bps => assertBps(Math.round(value * 100), 'rate');

/** Integer division rounded half away from zero. */
export function divRoundHalfUp(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) throw new MoneyError('division_by_zero', 'denominator is zero');
  const negative = (numerator < 0n) !== (denominator < 0n);
  const n = numerator < 0n ? -numerator : numerator;
  const d = denominator < 0n ? -denominator : denominator;
  const q = (2n * n + d) / (2n * d);
  return negative ? -q : q;
}

/** Integer division rounded up (towards +infinity) for non-negative inputs. */
export function divCeil(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new MoneyError('division_by_zero', 'denominator must be positive');
  if (numerator <= 0n) return numerator / denominator;
  return (numerator + denominator - 1n) / denominator;
}

/** A ratio kept exact until display. value = num / den. */
export interface Ratio {
  num: bigint;
  den: bigint;
}

/** Ratio as a percentage rounded to `dp` decimals (display only). */
export function ratioToPercent(r: Ratio, dp = 2): number {
  const scale = 10n ** BigInt(dp);
  const scaled = divRoundHalfUp(r.num * 100n * scale, r.den);
  return Number(scaled) / Number(scale);
}

/** Exact ratio of a rate in bps. */
export const bpsRatio = (bps: Bps): Ratio => ({ num: BigInt(bps), den: 10_000n });

/** Compare two ratios exactly: -1, 0 or 1. */
export function compareRatio(a: Ratio, b: Ratio): -1 | 0 | 1 {
  const left = a.num * b.den;
  const right = b.num * a.den;
  return left < right ? -1 : left > right ? 1 : 0;
}

export function formatTaka(p: Paisa, locale: 'en' | 'bn' = 'en'): string {
  const whole = p % 100 === 0;
  const amount = whole ? (p / 100).toLocaleString('en-US') : (p / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const text = `৳${amount}`;
  return locale === 'bn' ? toBanglaDigits(text) : text;
}

export function formatPercent(value: number, locale: 'en' | 'bn' = 'en', dp = 2): string {
  const text = `${value.toFixed(dp)}%`;
  return locale === 'bn' ? toBanglaDigits(text) : text;
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export function toBanglaDigits(text: string): string {
  return text.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

/** Accepts learner input in Latin or Bangla digits, with optional ৳, %, commas. */
export function parseLearnerNumber(input: unknown): number | null {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (typeof input !== 'string') return null;
  const latin = input.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
  const cleaned = latin.replace(/[৳,%\s]/g, '').replace(/^tk\.?/i, '');
  if (cleaned === '' || !/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}
