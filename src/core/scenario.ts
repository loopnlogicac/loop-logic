// Scenario engine: turns a template + seed into a concrete, replayable task,
// and renders the public (learner-facing) view. Owns valid task shapes;
// the language model never creates or changes tasks.

import { type Paisa, type Bps, formatPercent, formatTaka } from './money.ts';
import { createRng } from './rng.ts';
import { type PricingFacts, verifyPricing } from './verifier.ts';
import {
  type Bi,
  type ConceptId,
  type CoworkerCase,
  type Lang,
  type Level,
  CONTEXTS,
  COWORKER_MESSAGES,
  DEMO_FIXTURE,
  LEVELS,
  PACK_VERSION,
  RANGES,
  UI_TEXT,
  fill,
} from '../content/pricing-pack.ts';

export type TaskKind = 'l2_margin' | 'l4_coworker';

export interface PricingParams {
  cost: Paisa;
  listPrice: Paisa;
  discountBps: Bps;
  requiredMarginBps: Bps;
}

export interface TaskInstance {
  id: string;
  kind: TaskKind;
  level: Level;
  seed: number;
  packVersion: string;
  contextId: string;
  params: PricingParams;
  coworkerCase: CoworkerCase | null;
  concepts: ConceptId[];
}

export type FieldId = 'salePrice' | 'profit' | 'marginPct' | 'decision';

export interface FieldSpec {
  id: FieldId;
  label: Bi;
  type: 'money' | 'percent' | 'choice';
  options?: { value: string; label: Bi }[];
}

export interface PublicTask {
  id: string;
  kind: TaskKind;
  level: Level;
  levelLabel: Bi;
  bloom: Bi;
  prompt: string;
  givens: { label: string; value: string }[];
  coworker: { name: string; message: string } | null;
  fields: FieldSpec[];
}

const FIELD_SPECS: Record<FieldId, FieldSpec> = {
  salePrice: { id: 'salePrice', label: { en: 'Price after discount (৳)', bn: 'ছাড়ের পরে দাম (৳)' }, type: 'money' },
  profit: { id: 'profit', label: { en: 'Profit per item (৳)', bn: 'প্রতি পণ্যে লাভ (৳)' }, type: 'money' },
  marginPct: { id: 'marginPct', label: { en: 'Margin (%)', bn: 'মার্জিন (%)' }, type: 'percent' },
  decision: {
    id: 'decision',
    label: { en: 'Your decision on the discount', bn: 'ছাড়ের ব্যাপারে তোমার সিদ্ধান্ত' },
    type: 'choice',
    options: [
      { value: 'accept', label: { en: 'Accept the discount', bn: 'ছাড় দেওয়া হবে' } },
      { value: 'reject', label: { en: 'Reject the discount', bn: 'ছাড় দেওয়া হবে না' } },
    ],
  },
};

export function fieldsFor(kind: TaskKind): FieldId[] {
  return kind === 'l2_margin' ? ['profit', 'marginPct'] : ['salePrice', 'profit', 'marginPct', 'decision'];
}

export function factsFor(task: TaskInstance): PricingFacts {
  return verifyPricing(task.params);
}

/** Margin if the discount were (wrongly) ignored: (list − cost) / list, display %. */
export function listMarginPct(params: PricingParams): number {
  return Math.round(((params.listPrice - params.cost) / params.listPrice) * 10_000) / 100;
}

function caseHolds(c: CoworkerCase, facts: PricingFacts, params: PricingParams): boolean {
  // Keep variants realistic: a real profit and a margin a store might plausibly debate.
  if (facts.profit <= 0 || facts.marginPct < 3) return false;
  switch (c) {
    case 'ignores_discount':
      // Plausibly wrong: margin before the discount clears the bar, after it does not.
      return !facts.meetsPolicy && listMarginPct(params) >= facts.requiredMarginPct;
    case 'markup_error':
      // The advice must be plausibly wrong: markup clears the bar, margin does not.
      return !facts.meetsPolicy && facts.markupPct >= facts.requiredMarginPct;
    case 'correct_reject':
      return !facts.meetsPolicy;
    case 'correct_accept':
      return facts.meetsPolicy;
  }
}

function roundToTenTaka(p: Paisa): Paisa {
  return Math.round(p / 1000) * 1000;
}

export function generateL4(seed: number, coworkerCase: CoworkerCase, options: { demo?: boolean; avoidContext?: string } = {}): TaskInstance {
  if (options.demo) {
    return {
      id: `l4-demo-${seed}`,
      kind: 'l4_coworker',
      level: 4,
      seed,
      packVersion: PACK_VERSION,
      contextId: DEMO_FIXTURE.contextId,
      params: {
        cost: DEMO_FIXTURE.cost,
        listPrice: DEMO_FIXTURE.listPrice,
        discountBps: DEMO_FIXTURE.discountBps,
        requiredMarginBps: DEMO_FIXTURE.requiredMarginBps,
      },
      coworkerCase: DEMO_FIXTURE.coworkerCase,
      concepts: ['discount_price', 'profit', 'margin', 'policy_decision', 'ai_verification'],
    };
  }
  const rng = createRng(seed);
  const contexts = CONTEXTS.filter((c) => c.id !== options.avoidContext);
  for (let attempt = 0; attempt < 500; attempt++) {
    const cost = rng.pick(RANGES.costs);
    const listPrice = roundToTenTaka(Math.round(cost * rng.pick(RANGES.listMultipliers)));
    const params: PricingParams = {
      cost,
      listPrice,
      discountBps: rng.pick(RANGES.discounts),
      requiredMarginBps: rng.pick(RANGES.requiredMargins),
    };
    const facts = verifyPricing(params);
    if (caseHolds(coworkerCase, facts, params)) {
      return {
        id: `l4-${seed}-${coworkerCase}`,
        kind: 'l4_coworker',
        level: 4,
        seed,
        packVersion: PACK_VERSION,
        contextId: rng.pick(contexts).id,
        params,
        coworkerCase,
        concepts: ['discount_price', 'profit', 'margin', 'policy_decision', 'ai_verification'],
      };
    }
  }
  throw new Error(`No L4 variant satisfies case ${coworkerCase} for seed ${seed}`);
}

export function generateL2(seed: number, options: { avoidContext?: string } = {}): TaskInstance {
  const rng = createRng(seed ^ 0x9e3779b9);
  const contexts = CONTEXTS.filter((c) => c.id !== options.avoidContext);
  const cost = rng.pick(RANGES.costs);
  const listPrice = roundToTenTaka(Math.round(cost * rng.pick(RANGES.listMultipliers)));
  return {
    id: `l2-${seed}`,
    kind: 'l2_margin',
    level: 2,
    seed,
    packVersion: PACK_VERSION,
    contextId: rng.pick(contexts).id,
    params: { cost, listPrice, discountBps: 0, requiredMarginBps: 0 },
    coworkerCase: null,
    concepts: ['profit', 'margin'],
  };
}

export function toPublicTask(task: TaskInstance, lang: Lang): PublicTask {
  const ctx = CONTEXTS.find((c) => c.id === task.contextId) ?? CONTEXTS[0]!;
  const facts = factsFor(task);
  const t = (b: Bi) => b[lang];
  const money = (p: Paisa) => formatTaka(p, lang);
  const pct = (bps: Bps) => formatPercent(bps / 100, lang, bps % 100 === 0 ? 0 : 2);
  const level = LEVELS[task.level];

  if (task.kind === 'l2_margin') {
    return {
      id: task.id,
      kind: task.kind,
      level: task.level,
      levelLabel: level.label,
      bloom: level.bloom,
      prompt: fill(t(UI_TEXT.l2Prompt), { store: t(ctx.store), product: t(ctx.product), cost: money(task.params.cost), salePrice: money(facts.salePrice) }),
      givens: [
        { label: lang === 'en' ? 'Cost' : 'খরচ', value: money(task.params.cost) },
        { label: lang === 'en' ? 'Selling price' : 'বিক্রয়মূল্য', value: money(facts.salePrice) },
      ],
      coworker: null,
      fields: fieldsFor(task.kind).map((f) => FIELD_SPECS[f]),
    };
  }

  const values = {
    store: t(ctx.store),
    product: t(ctx.product),
    cost: money(task.params.cost),
    listPrice: money(task.params.listPrice),
    discount: pct(task.params.discountBps),
    required: pct(task.params.requiredMarginBps),
    markupPct: formatPercent(facts.markupPct, lang, facts.markupPct % 1 === 0 ? 0 : 1),
    marginPct: formatPercent(facts.marginPct, lang, 1),
    listMarginPct: formatPercent(listMarginPct(task.params), lang, listMarginPct(task.params) % 1 === 0 ? 0 : 1),
  };
  const coworkerCase = task.coworkerCase ?? 'correct_reject';
  return {
    id: task.id,
    kind: task.kind,
    level: task.level,
    levelLabel: level.label,
    bloom: level.bloom,
    prompt: fill(t(UI_TEXT.l4Prompt), values),
    givens: [
      { label: lang === 'en' ? 'Cost' : 'খরচ', value: values.cost },
      { label: lang === 'en' ? 'List price' : 'তালিকা মূল্য', value: values.listPrice },
      { label: lang === 'en' ? 'Proposed discount' : 'প্রস্তাবিত ছাড়', value: values.discount },
      { label: lang === 'en' ? 'Minimum margin rule' : 'ন্যূনতম মার্জিনের নিয়ম', value: values.required },
    ],
    coworker: { name: lang === 'en' ? 'Mitu (AI coworker)' : 'মিতু (এআই সহকর্মী)', message: fill(t(COWORKER_MESSAGES[coworkerCase]), values) },
    fields: fieldsFor(task.kind).map((f) => FIELD_SPECS[f]),
  };
}

/** What the coworker recommended, for over-reliance detection. */
export function coworkerRecommendation(task: TaskInstance): 'accept' | 'reject' | null {
  if (!task.coworkerCase) return null;
  return task.coworkerCase === 'correct_reject' ? 'reject' : 'accept';
}

/** Whether the coworker's advice in this task is correct (by construction of the case). */
export function coworkerIsCorrect(task: TaskInstance): boolean | null {
  if (!task.coworkerCase) return null;
  return task.coworkerCase === 'correct_reject' || task.coworkerCase === 'correct_accept';
}
