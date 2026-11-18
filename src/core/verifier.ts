// Deterministic verifier: the only authority for numbers and policy.
// The language model never calculates or decides correctness.

import {
  type Bps,
  type Paisa,
  type Ratio,
  MoneyError,
  assertBps,
  assertPaisa,
  bpsRatio,
  compareRatio,
  divCeil,
  divRoundHalfUp,
  ratioToPercent,
} from './money.ts';

export const VERIFIER_VERSION = 'pricing-verifier@1.0.0';

export interface PricingInput {
  cost: Paisa; // unit cost of goods
  listPrice: Paisa; // price before discount
  discountBps: Bps; // proposed discount, e.g. 1000 = 10%
  requiredMarginBps: Bps; // store policy minimum margin
  feePaisa?: Paisa; // extra cost per unit borne by the seller (e.g. delivery)
  roundingIncrement?: Paisa; // currency increment for prices (default 1 taka)
}

export interface PricingFacts {
  version: string;
  totalCost: Paisa;
  salePrice: Paisa;
  profit: Paisa;
  markup: Ratio; // profit / total cost
  margin: Ratio; // profit / sale price
  markupPct: number; // display, 2 dp
  marginPct: number; // display, 2 dp
  requiredMarginPct: number;
  meetsPolicy: boolean; // exact comparison, before display rounding
  minimumPrice: Paisa; // smallest price that meets the margin, rounded UP to the increment
  correctDecision: 'accept' | 'reject';
}

export class VerifierError extends MoneyError {}

function validate(input: PricingInput): Required<PricingInput> {
  const cost = assertPaisa(input.cost, 'cost');
  const listPrice = assertPaisa(input.listPrice, 'listPrice');
  const discountBps = assertBps(input.discountBps, 'discount');
  const requiredMarginBps = assertBps(input.requiredMarginBps, 'requiredMargin');
  const feePaisa = assertPaisa(input.feePaisa ?? 0, 'fee');
  const roundingIncrement = assertPaisa(input.roundingIncrement ?? 100, 'roundingIncrement');

  if (cost < 0 || feePaisa < 0) throw new VerifierError('negative_cost', 'Costs cannot be negative');
  if (listPrice <= 0) throw new VerifierError('non_positive_price', 'List price must be above zero');
  if (discountBps < 0 || discountBps >= 10_000) throw new VerifierError('invalid_discount', 'Discount must be at least 0% and below 100%');
  if (requiredMarginBps < 0 || requiredMarginBps >= 10_000) throw new VerifierError('invalid_margin_target', 'Required margin must be at least 0% and below 100%');
  if (roundingIncrement <= 0) throw new VerifierError('invalid_increment', 'Rounding increment must be positive');

  return { cost, listPrice, discountBps, requiredMarginBps, feePaisa, roundingIncrement };
}

/** discounted price = list × (1 − discount), rounded half-up to the paisa. */
export function discountedPrice(listPrice: Paisa, discountBps: Bps): Paisa {
  return Number(divRoundHalfUp(BigInt(listPrice) * BigInt(10_000 - discountBps), 10_000n));
}

/** minimum price for margin m = cost / (1 − m), rounded UP to the increment. */
export function minimumPriceForMargin(totalCost: Paisa, marginBps: Bps, increment: Paisa = 100): Paisa {
  if (marginBps < 0 || marginBps >= 10_000) throw new VerifierError('invalid_margin_target', 'Required margin must be at least 0% and below 100%');
  const exactPaisa = divCeil(BigInt(totalCost) * 10_000n, BigInt(10_000 - marginBps));
  const steps = divCeil(exactPaisa, BigInt(increment));
  return Number(steps * BigInt(increment));
}

export function verifyPricing(raw: PricingInput): PricingFacts {
  const input = validate(raw);
  const totalCost = input.cost + input.feePaisa;
  const salePrice = discountedPrice(input.listPrice, input.discountBps);
  const profit = salePrice - totalCost;

  if (totalCost === 0) throw new VerifierError('zero_cost', 'Markup is undefined when total cost is zero');

  const markup: Ratio = { num: BigInt(profit), den: BigInt(totalCost) };
  const margin: Ratio = { num: BigInt(profit), den: BigInt(salePrice) };
  // Boundary equality counts as meeting the policy (margin >= required).
  const meetsPolicy = compareRatio(margin, bpsRatio(input.requiredMarginBps)) >= 0;

  return {
    version: VERIFIER_VERSION,
    totalCost,
    salePrice,
    profit,
    markup,
    margin,
    markupPct: ratioToPercent(markup),
    marginPct: ratioToPercent(margin),
    requiredMarginPct: input.requiredMarginBps / 100,
    meetsPolicy,
    minimumPrice: minimumPriceForMargin(totalCost, input.requiredMarginBps, input.roundingIncrement),
    correctDecision: meetsPolicy ? 'accept' : 'reject',
  };
}

/**
 * Tolerance for a learner's percentage answer: within 0.05 percentage points of
 * the exact value, so 11.1 and 11.11 both count for 11.111…%.
 */
export const PERCENT_TOLERANCE = 0.05;

export function percentMatches(answer: number, exact: Ratio): boolean {
  const exactPct = Number(exact.num * 1_000_000n / exact.den) / 10_000; // 4 dp, enough for tolerance check
  return Math.abs(answer - exactPct) <= PERCENT_TOLERANCE + 1e-9;
}

/** Money answers must match to the paisa (learners type taka; we compare in paisa). */
export function moneyMatches(answerTaka: number, exact: Paisa): boolean {
  return Math.round(answerTaka * 100) === exact;
}
