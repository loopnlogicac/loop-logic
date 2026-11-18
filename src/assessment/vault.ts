// Assessment vault: sealed transfer tasks and their answer keys.
//
// Isolation rules (enforced here and tested in tests/service.test.ts):
// - Keys are derived from the session's private seed inside this module and
//   never leave it. Nothing here is stored, so restarts and multiple servers
//   give the same item; "submitted" is enforced by the session phase.
// - The only exports are: open a transfer (public fields), grade a submission
//   (per-field correctness, no expected values), and a status check.
// - Teaching code (tutor, retrieval, AI gateway) must never import this file.
//   In the Supabase version this becomes a separate schema with its own role.

import { type Bi, type Lang, CONTEXTS, fill } from '../content/pricing-pack.ts';
import { type Paisa, formatPercent, formatTaka, parseLearnerNumber, taka, percent } from '../core/money.ts';
import { createRng } from '../core/rng.ts';
import { type PricingFacts, moneyMatches, percentMatches, verifyPricing } from '../core/verifier.ts';

export const TRANSFER_BANK_VERSION = 'transfer-bank@1.0.0-draft';

type TransferCase = 'ignores_fee' | 'correct_accept' | 'correct_reject';

export type TransferField = 'totalCost' | 'salePrice' | 'marginPct' | 'decision' | 'minimumPrice';

export interface PublicTransfer {
  itemId: string;
  bankVersion: string;
  prompt: string;
  givens: { label: string; value: string }[];
  coworker: { name: string; message: string };
  fields: { id: TransferField; label: Bi; type: 'money' | 'percent' | 'choice'; options?: { value: string; label: Bi }[] }[];
  note: Bi;
}

export interface TransferResult {
  itemId: string;
  correct: boolean;
  fields: Record<TransferField, boolean>;
  conceptsShown: string[];
  conceptsMissed: string[];
}

const COSTS = [700, 900, 1100, 1300].map(taka);
const FEES = [40, 60, 80, 100].map(taka);
const MULTIPLIERS = [1.3, 1.35, 1.4, 1.5];
const DISCOUNTS = [5, 8, 10, 12].map(percent);
const MARGINS = [10, 12, 15].map(percent);

const MESSAGES: Record<TransferCase, Bi> = {
  ignores_fee: {
    en: 'Good news: after the {discount} discount our margin is {marginNoFeePct}, above the {required} rule. Accept it.',
    bn: 'ভালো খবর: {discount} ছাড়ের পরেও আমাদের মার্জিন {marginNoFeePct}, যা {required} নিয়মের উপরে। ছাড়টা দিয়ে দাও।',
  },
  correct_accept: {
    en: 'Including the delivery fee, the margin after the {discount} discount is {marginPct}. That meets the {required} rule, so we can accept.',
    bn: 'ডেলিভারি ফি ধরে {discount} ছাড়ের পরে মার্জিন {marginPct}। এটা {required} নিয়ম পূরণ করে, তাই ছাড় দেওয়া যায়।',
  },
  correct_reject: {
    en: 'Including the delivery fee, the margin after the {discount} discount is {marginPct}, below the {required} rule. We should reject.',
    bn: 'ডেলিভারি ফি ধরে {discount} ছাড়ের পরে মার্জিন {marginPct}, যা {required} নিয়মের নিচে। ছাড় দেওয়া উচিত হবে না।',
  },
};

function marginPctWithoutFee(cost: Paisa, salePrice: Paisa): number {
  return Math.round(((salePrice - cost) / salePrice) * 10_000) / 100;
}

function generate(seed: number): { params: Parameters<typeof verifyPricing>[0]; coworkerCase: TransferCase; facts: PricingFacts; contextId: string } {
  const rng = createRng(seed ^ 0x51ed270b);
  const cases: TransferCase[] = ['ignores_fee', 'correct_accept', 'correct_reject'];
  const wanted = rng.pick(cases);
  for (let i = 0; i < 500; i++) {
    const cost = rng.pick(COSTS);
    const params = {
      cost,
      feePaisa: rng.pick(FEES),
      listPrice: Math.round((cost * rng.pick(MULTIPLIERS)) / 1000) * 1000,
      discountBps: rng.pick(DISCOUNTS),
      requiredMarginBps: rng.pick(MARGINS),
    };
    const facts = verifyPricing(params);
    if (facts.profit <= 0 || facts.marginPct < 3) continue;
    const noFee = marginPctWithoutFee(params.cost, facts.salePrice);
    const holds =
      wanted === 'ignores_fee' ? !facts.meetsPolicy && noFee >= facts.requiredMarginPct : wanted === 'correct_accept' ? facts.meetsPolicy : !facts.meetsPolicy;
    if (holds) return { params, coworkerCase: wanted, facts, contextId: rng.pick(CONTEXTS).id };
  }
  throw new Error('transfer generation failed');
}

/** Returns only the public fields of the sealed transfer for this seed. */
export function openTransfer(seed: number, lang: Lang): PublicTransfer {
  const gen = generate(seed);
  const itemId = `transfer-${seed}`;
  const ctx = CONTEXTS.find((c) => c.id === gen.contextId) ?? CONTEXTS[0]!;
  const money = (p: Paisa) => formatTaka(p, lang);
  const pct = (v: number, dp = 0) => formatPercent(v, lang, dp);
  const values = {
    discount: pct(gen.params.discountBps / 100),
    required: pct(gen.params.requiredMarginBps / 100),
    marginPct: pct(gen.facts.marginPct, 1),
    marginNoFeePct: pct(marginPctWithoutFee(gen.params.cost, gen.facts.salePrice), 1),
  };
  const t = (b: Bi) => b[lang];
  return {
    itemId,
    bankVersion: TRANSFER_BANK_VERSION,
    prompt:
      lang === 'en'
        ? `${t(ctx.store)} now ships each ${t(ctx.product)} to the customer and pays a delivery fee itself. Decide on a proposed discount, and find the lowest price that still meets the margin rule.`
        : `${t(ctx.store)} এখন প্রতিটি ${t(ctx.product)} ক্রেতার কাছে পাঠায় এবং ডেলিভারি ফি নিজেই দেয়। প্রস্তাবিত ছাড়ের ব্যাপারে সিদ্ধান্ত নাও, এবং নিয়ম মেনে সর্বনিম্ন কত দামে বিক্রি করা যায় তা বের করো।`,
    givens: [
      { label: lang === 'en' ? 'Cost' : 'খরচ', value: money(gen.params.cost) },
      { label: lang === 'en' ? 'Delivery fee (paid by the store)' : 'ডেলিভারি ফি (দোকান দেয়)', value: money(gen.params.feePaisa ?? 0) },
      { label: lang === 'en' ? 'List price' : 'তালিকা মূল্য', value: money(gen.params.listPrice) },
      { label: lang === 'en' ? 'Proposed discount' : 'প্রস্তাবিত ছাড়', value: values.discount },
      { label: lang === 'en' ? 'Minimum margin rule' : 'ন্যূনতম মার্জিনের নিয়ম', value: values.required },
    ],
    coworker: { name: lang === 'en' ? 'Mitu (AI coworker)' : 'মিতু (এআই সহকর্মী)', message: fill(t(MESSAGES[gen.coworkerCase]), values) },
    fields: [
      { id: 'totalCost', label: { en: 'Total cost per item, including delivery (৳)', bn: 'ডেলিভারিসহ প্রতি পণ্যের মোট খরচ (৳)' }, type: 'money' },
      { id: 'salePrice', label: { en: 'Price after discount (৳)', bn: 'ছাড়ের পরে দাম (৳)' }, type: 'money' },
      { id: 'marginPct', label: { en: 'Margin after discount (%)', bn: 'ছাড়ের পরে মার্জিন (%)' }, type: 'percent' },
      {
        id: 'decision',
        label: { en: 'Your decision on the discount', bn: 'ছাড়ের ব্যাপারে তোমার সিদ্ধান্ত' },
        type: 'choice',
        options: [
          { value: 'accept', label: { en: 'Accept the discount', bn: 'ছাড় দেওয়া হবে' } },
          { value: 'reject', label: { en: 'Reject the discount', bn: 'ছাড় দেওয়া হবে না' } },
        ],
      },
      { id: 'minimumPrice', label: { en: 'Lowest price that meets the rule, rounded up to the taka (৳)', bn: 'নিয়ম মেনে সর্বনিম্ন দাম, পূর্ণ টাকায় উপরের দিকে (৳)' }, type: 'money' },
    ],
    note: {
      en: 'Sealed check: no hints, no tutor and no notebook until you submit.',
      bn: 'বন্ধ যাচাই: জমা দেওয়ার আগ পর্যন্ত কোনো ইঙ্গিত, টিউটর বা নোটবুক নেই।',
    },
  };
}

/** Grades a submission on the server. Returns correctness only, never expected values. */
export function gradeTransfer(seed: number, raw: Record<string, unknown>): TransferResult {
  const f: PricingFacts = generate(seed).facts;
  const itemId = `transfer-${seed}`;
  const n = (k: string) => parseLearnerNumber(raw[k]);
  const fields: Record<TransferField, boolean> = {
    totalCost: n('totalCost') !== null && moneyMatches(n('totalCost')!, f.totalCost),
    salePrice: n('salePrice') !== null && moneyMatches(n('salePrice')!, f.salePrice),
    marginPct: n('marginPct') !== null && percentMatches(n('marginPct')!, f.margin),
    decision: raw['decision'] === f.correctDecision,
    minimumPrice: n('minimumPrice') !== null && moneyMatches(n('minimumPrice')!, f.minimumPrice),
  };
  const conceptOf: Record<TransferField, string> = {
    totalCost: 'total_cost',
    salePrice: 'discount_price',
    marginPct: 'margin',
    decision: 'ai_verification',
    minimumPrice: 'minimum_price',
  };
  const shown = (Object.keys(fields) as TransferField[]).filter((k) => fields[k]).map((k) => conceptOf[k]);
  const missed = (Object.keys(fields) as TransferField[]).filter((k) => !fields[k]).map((k) => conceptOf[k]);
  return { itemId, correct: missed.length === 0, fields, conceptsShown: shown, conceptsMissed: missed };
}
