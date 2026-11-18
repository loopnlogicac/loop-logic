// Retail pricing pack, version 1.0.0.
// Practice content only. Transfer (assessment) items live in src/assessment/vault.ts
// and are never imported by teaching code.
//
// STATUS: draft. Every string, number range and intervention needs reviewer
// sign-off (subject, numerical and Bangla/English parity) before pilot use.

import { type Paisa, type Bps, taka, percent } from '../core/money.ts';

export const PACK_ID = 'retail_pricing';
export const PACK_VERSION = '1.0.0-draft';

export type Lang = 'en' | 'bn';
export interface Bi {
  en: string;
  bn: string;
}

export type ConceptId =
  | 'percentage'
  | 'profit'
  | 'markup'
  | 'margin'
  | 'discount_price'
  | 'policy_decision'
  | 'ai_verification'
  | 'total_cost'
  | 'minimum_price';

export const CONCEPTS: Record<ConceptId, { name: Bi; prerequisites: ConceptId[] }> = {
  percentage: { name: { en: 'Percentages', bn: 'শতাংশ' }, prerequisites: [] },
  profit: { name: { en: 'Profit', bn: 'লাভ' }, prerequisites: [] },
  discount_price: { name: { en: 'Discounted price', bn: 'ছাড়ের পরে দাম' }, prerequisites: ['percentage'] },
  markup: { name: { en: 'Markup', bn: 'মার্কআপ' }, prerequisites: ['profit', 'percentage'] },
  margin: { name: { en: 'Margin', bn: 'মার্জিন' }, prerequisites: ['profit', 'percentage'] },
  policy_decision: { name: { en: 'Deciding against a policy', bn: 'নীতিমালা মেনে সিদ্ধান্ত' }, prerequisites: ['margin'] },
  ai_verification: { name: { en: 'Checking AI advice', bn: 'এআই-এর পরামর্শ যাচাই' }, prerequisites: ['margin', 'policy_decision'] },
  total_cost: { name: { en: 'Total cost with fees', bn: 'ফিসহ মোট খরচ' }, prerequisites: ['profit'] },
  minimum_price: { name: { en: 'Minimum price for a margin', bn: 'কাঙ্ক্ষিত মার্জিনের ন্যূনতম দাম' }, prerequisites: ['margin'] },
};

export type Level = 1 | 2 | 3 | 4 | 5;
export const LEVELS: Record<Level, { bloom: Bi; label: Bi }> = {
  1: { bloom: { en: 'Understand', bn: 'বোঝা' }, label: { en: 'Identify the base', bn: 'ভিত্তি চেনা' } },
  2: { bloom: { en: 'Apply', bn: 'প্রয়োগ' }, label: { en: 'Calculate margin', bn: 'মার্জিন হিসাব' } },
  3: { bloom: { en: 'Analyse', bn: 'বিশ্লেষণ' }, label: { en: 'Spot the wrong formula', bn: 'ভুল সূত্র খোঁজা' } },
  4: { bloom: { en: 'Evaluate', bn: 'মূল্যায়ন' }, label: { en: 'Judge the AI coworker', bn: 'এআই সহকর্মীর পরামর্শ যাচাই' } },
  5: { bloom: { en: 'Create / defend', bn: 'নতুন পরিস্থিতিতে সিদ্ধান্ত' }, label: { en: 'Decide with a new constraint', bn: 'নতুন শর্তে সিদ্ধান্ত' } },
};

export interface StoreContext {
  id: string;
  store: Bi;
  product: Bi;
}

export const CONTEXTS: StoreContext[] = [
  { id: 'gadget', store: { en: 'Dhaka Gadget House', bn: 'ঢাকা গ্যাজেট হাউস' }, product: { en: 'Bluetooth speaker', bn: 'ব্লুটুথ স্পিকার' } },
  { id: 'fashion', store: { en: 'Nakshi Online', bn: 'নকশী অনলাইন' }, product: { en: 'cotton kurta', bn: 'সুতি কুর্তা' } },
  { id: 'books', store: { en: 'Campus Book Corner', bn: 'ক্যাম্পাস বুক কর্নার' }, product: { en: 'exam guide', bn: 'পরীক্ষার গাইড বই' } },
  { id: 'kitchen', store: { en: 'Ghor Kitchen Mart', bn: 'ঘর কিচেন মার্ট' }, product: { en: 'rice cooker', bn: 'রাইস কুকার' } },
];

// Number ranges used to generate practice variants (taka / percent).
export const RANGES = {
  costs: [600, 800, 1200, 1500, 2400].map(taka) as Paisa[],
  listMultipliers: [1.2, 1.25, 1.3, 1.4],
  discounts: [5, 10, 15, 20].map(percent) as Bps[],
  requiredMargins: [10, 12, 15, 20].map(percent) as Bps[],
};

// The demo fixture from the product specification. Seed 0 of the first L4 task.
export const DEMO_FIXTURE = {
  contextId: 'gadget',
  cost: taka(800),
  listPrice: taka(1000),
  discountBps: percent(10),
  requiredMarginBps: percent(15),
  coworkerCase: 'ignores_discount' as const,
};

export type CoworkerCase = 'ignores_discount' | 'markup_error' | 'correct_reject' | 'correct_accept';

/** Reviewed coworker message templates. {margin} etc. are filled from verifier facts. */
export const COWORKER_MESSAGES: Record<CoworkerCase, Bi> = {
  ignores_discount: {
    en: 'I checked it: our margin on this item is {listMarginPct}, well above our {required} minimum. The {discount} discount is fine. Let’s accept it.',
    bn: 'আমি দেখেছি: এই পণ্যে আমাদের মার্জিন {listMarginPct}, যা ন্যূনতম {required}-এর অনেক উপরে। {discount} ছাড়ে সমস্যা নেই। দিয়ে দিই।',
  },
  markup_error: {
    en: 'I checked it: after the {discount} discount we still make {markupPct} on this item, which is above our {required} minimum. Let’s accept the discount.',
    bn: 'আমি দেখেছি: {discount} ছাড় দেওয়ার পরও এই পণ্যে আমাদের {markupPct} থাকে, যা আমাদের ন্যূনতম {required}-এর চেয়ে বেশি। ছাড়টা দিয়ে দিই।',
  },
  correct_reject: {
    en: 'After the {discount} discount the margin drops to {marginPct}, below our {required} rule. I would reject this discount.',
    bn: '{discount} ছাড়ের পরে মার্জিন নেমে {marginPct} হয়, যা আমাদের {required} নিয়মের নিচে। আমি এই ছাড় না দেওয়ার পক্ষে।',
  },
  correct_accept: {
    en: 'After the {discount} discount the margin is {marginPct}, still at or above our {required} rule. We can accept it.',
    bn: '{discount} ছাড়ের পরেও মার্জিন {marginPct}, যা আমাদের {required} নিয়মের সমান বা বেশি। ছাড়টা দেওয়া যায়।',
  },
};

export const UI_TEXT = {
  l4Prompt: {
    en: '{store} sells a {product}. It costs {cost} to buy and is listed at {listPrice}. A {discount} discount is proposed. Store policy: margin must stay at least {required}. Your AI coworker says:',
    bn: '{store} একটি {product} বিক্রি করে। কেনার দাম {cost}, তালিকা মূল্য {listPrice}। {discount} ছাড়ের প্রস্তাব এসেছে। দোকানের নিয়ম: মার্জিন কমপক্ষে {required} থাকতে হবে। তোমার এআই সহকর্মী বলছে:',
  },
  l2Prompt: {
    en: '{store} buys a {product} for {cost} and sells it for {salePrice}. Work out the profit and the margin.',
    bn: '{store} একটি {product} {cost} দিয়ে কিনে {salePrice}-এ বিক্রি করে। লাভ এবং মার্জিন বের করো।',
  },
} satisfies Record<string, Bi>;

export type DiagnosisCode =
  | 'correct'
  | 'margin_markup_confusion'
  | 'arithmetic_slip'
  | 'missed_constraint'
  | 'ai_over_reliance'
  | 'uncertain';

export interface Source {
  id: string;
  title: string;
  location: string;
  reviewed: boolean;
}

export const SOURCES: Record<string, Source> = {
  notes_margin: { id: 'notes_margin', title: 'Loop & Logic pricing notes v1', location: '§2 Margin and markup', reviewed: false },
  notes_discount: { id: 'notes_discount', title: 'Loop & Logic pricing notes v1', location: '§1 Discounted price', reviewed: false },
  notes_policy: { id: 'notes_policy', title: 'Loop & Logic pricing notes v1', location: '§3 Pricing policies', reviewed: false },
  notes_ai: { id: 'notes_ai', title: 'Loop & Logic pricing notes v1', location: '§4 Checking advice', reviewed: false },
};

export interface Intervention {
  diagnosis: Exclude<DiagnosisCode, 'correct'>;
  title: Bi;
  socraticQuestion: Bi;
  explanation: Bi;
  sources: string[];
}

/** Reviewed fallback interventions, one per diagnosis. Used before (and instead of) any AI output. */
export const INTERVENTIONS: Record<Intervention['diagnosis'], Intervention> = {
  margin_markup_confusion: {
    diagnosis: 'margin_markup_confusion',
    title: { en: 'Markup and margin use different bases', bn: 'মার্কআপ আর মার্জিনের ভিত্তি আলাদা' },
    socraticQuestion: {
      en: 'For margin, which amount is the whole: what you paid, or what the customer pays?',
      bn: 'মার্জিনের ক্ষেত্রে পুরোটা কোনটা: তুমি যা দিয়ে কিনেছ, নাকি ক্রেতা যা দেয়?',
    },
    explanation: {
      en: 'Both start from the same profit. Markup divides profit by cost. Margin divides profit by the selling price. With cost ৳800 and price ৳900, profit is ৳100: markup is 100 ÷ 800 = 12.5%, margin is 100 ÷ 900 ≈ 11.1%. Store policies about margin need the selling price as the base.',
      bn: 'দুটোই একই লাভ থেকে শুরু হয়। মার্কআপে লাভকে খরচ দিয়ে ভাগ করা হয়। মার্জিনে লাভকে বিক্রয়মূল্য দিয়ে ভাগ করা হয়। খরচ ৳৮০০ আর দাম ৳৯০০ হলে লাভ ৳১০০: মার্কআপ ১০০ ÷ ৮০০ = ১২.৫%, মার্জিন ১০০ ÷ ৯০০ ≈ ১১.১%। মার্জিন নিয়ে নিয়ম থাকলে ভিত্তি হবে বিক্রয়মূল্য।',
    },
    sources: ['notes_margin'],
  },
  arithmetic_slip: {
    diagnosis: 'arithmetic_slip',
    title: { en: 'The method is right; check one step', bn: 'পদ্ধতি ঠিক আছে; একটা ধাপ মিলিয়ে দেখো' },
    socraticQuestion: {
      en: 'What is the price after the discount, before you work out profit?',
      bn: 'লাভ বের করার আগে, ছাড়ের পরে দাম কত হয়?',
    },
    explanation: {
      en: 'Go step by step: discounted price = list price × (1 − discount). Profit = discounted price − cost. Margin = profit ÷ discounted price × 100. Write each result before using it in the next step.',
      bn: 'ধাপে ধাপে যাও: ছাড়ের পরে দাম = তালিকা মূল্য × (১ − ছাড়)। লাভ = ছাড়ের পরে দাম − খরচ। মার্জিন = লাভ ÷ ছাড়ের পরে দাম × ১০০। প্রতিটি ফল লিখে তারপর পরের ধাপে যাও।',
    },
    sources: ['notes_discount'],
  },
  missed_constraint: {
    diagnosis: 'missed_constraint',
    title: { en: 'Your numbers are right; compare them with the rule', bn: 'হিসাব ঠিক; এবার নিয়মের সঙ্গে মেলাও' },
    socraticQuestion: {
      en: 'Is your margin at least the minimum the store allows?',
      bn: 'তোমার মার্জিন কি দোকানের ন্যূনতম সীমার সমান বা বেশি?',
    },
    explanation: {
      en: 'A policy turns a calculation into a decision. If the margin after the discount is below the minimum, the discount breaks the rule, even when the store still makes some profit. If it is at or above the minimum, the discount is allowed, and rejecting it only loses the sale.',
      bn: 'নিয়ম হিসাবকে সিদ্ধান্তে পরিণত করে। ছাড়ের পরে মার্জিন যদি ন্যূনতম সীমার নিচে নামে, তাহলে লাভ থাকলেও ছাড়টা নিয়ম ভাঙে। আর মার্জিন যদি সীমার সমান বা বেশি থাকে, তাহলে ছাড় দেওয়া যায়; বাতিল করলে শুধু বিক্রিটাই হারাবে।',
    },
    sources: ['notes_policy'],
  },
  ai_over_reliance: {
    diagnosis: 'ai_over_reliance',
    title: { en: 'Your evidence disagreed with the advice', bn: 'তোমার নিজের হিসাব পরামর্শের সঙ্গে মেলেনি' },
    socraticQuestion: {
      en: 'Your own margin was below the rule. Which should decide: your checked numbers or the coworker’s claim?',
      bn: 'তোমার নিজের হিসাবে মার্জিন নিয়মের নিচে ছিল। সিদ্ধান্ত কিসে হবে: তোমার যাচাই করা হিসাব, নাকি সহকর্মীর দাবি?',
    },
    explanation: {
      en: 'An AI coworker can sound confident and still use the wrong base or skip a rule. When your checked numbers contradict the advice, your evidence governs. Next you will see a case where the coworker is right, so rejecting everything will not work either.',
      bn: 'এআই সহকর্মী আত্মবিশ্বাসী শোনালেও ভুল ভিত্তি ব্যবহার করতে পারে বা নিয়ম বাদ দিতে পারে। তোমার যাচাই করা হিসাব যদি পরামর্শের বিপরীতে যায়, তাহলে তোমার প্রমাণই সিদ্ধান্ত নেবে। পরের কেসে সহকর্মী সঠিক, তাই সবকিছু বাতিল করলেও হবে না।',
    },
    sources: ['notes_ai'],
  },
  uncertain: {
    diagnosis: 'uncertain',
    title: { en: 'Let’s pin down where it went off track', bn: 'কোথায় গোলমাল হলো, চলো খুঁজে দেখি' },
    socraticQuestion: {
      en: 'Which number did you divide the profit by?',
      bn: 'লাভকে তুমি কোন সংখ্যা দিয়ে ভাগ করেছ?',
    },
    explanation: {
      en: 'The answers do not point to one clear cause yet. Work through price after discount, then profit, then margin, and compare the margin with the rule before deciding.',
      bn: 'উত্তরগুলো এখনো একটা নির্দিষ্ট কারণ দেখাচ্ছে না। আগে ছাড়ের পরে দাম, তারপর লাভ, তারপর মার্জিন বের করো, এবং সিদ্ধান্তের আগে মার্জিনকে নিয়মের সঙ্গে মেলাও।',
    },
    sources: ['notes_margin', 'notes_policy'],
  },
};

export const GLOSSARY: Record<string, { term: Bi; definition: Bi; concept: ConceptId }> = {
  margin: {
    term: { en: 'Margin', bn: 'মার্জিন' },
    definition: { en: 'Profit as a share of the selling price.', bn: 'বিক্রয়মূল্যের তুলনায় লাভের অংশ।' },
    concept: 'margin',
  },
  markup: {
    term: { en: 'Markup', bn: 'মার্কআপ' },
    definition: { en: 'Profit as a share of the cost.', bn: 'খরচের তুলনায় লাভের অংশ।' },
    concept: 'markup',
  },
  profit: {
    term: { en: 'Profit', bn: 'লাভ' },
    definition: { en: 'Selling price minus total cost.', bn: 'বিক্রয়মূল্য থেকে মোট খরচ বাদ দিলে যা থাকে।' },
    concept: 'profit',
  },
};

export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}
