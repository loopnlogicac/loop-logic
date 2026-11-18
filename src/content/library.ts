// Trusted library: reviewed passages (snapshot) + approved websites (live search).
// STATUS: passages are the team's draft notes. Replace or extend with licensed
// sources (e.g. OpenStax, CC BY) and mark `reviewed: true` after sign-off.

import type { Bi } from './pricing-pack.ts';
import type { Subject } from './subjects.ts';
import { MORE_PASSAGES, MORE_GLOSSARY } from './library-more.ts';

export interface Passage {
  id: string;
  sourceTitle: string;
  location: string;
  licence: string;
  reviewed: boolean;
  subject: Subject;
  concepts: string[];
  text: Bi;
}

export const PASSAGES: Passage[] = [
  {
    id: 'lib-profit', sourceTitle: 'Loop & Logic pricing notes', location: '§1.1 Profit', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['profit'],
    text: { en: 'Profit per item is the selling price minus the total cost of that item. If the seller pays extra per-item costs such as delivery, they are part of the total cost.', bn: 'প্রতি পণ্যের লাভ = বিক্রয়মূল্য − সেই পণ্যের মোট খরচ। বিক্রেতা যদি ডেলিভারির মতো প্রতি-পণ্য বাড়তি খরচ দেয়, সেটাও মোট খরচের অংশ।' },
  },
  {
    id: 'lib-markup', sourceTitle: 'Loop & Logic pricing notes', location: '§2.1 Markup', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['markup'],
    text: { en: 'Markup is profit divided by cost, written as a percentage. With cost ৳800 and profit ৳100, markup is 100 ÷ 800 = 12.5%.', bn: 'মার্কআপ = লাভ ÷ খরচ, শতাংশে লেখা। খরচ ৳৮০০ ও লাভ ৳১০০ হলে মার্কআপ ১০০ ÷ ৮০০ = ১২.৫%।' },
  },
  {
    id: 'lib-margin', sourceTitle: 'Loop & Logic pricing notes', location: '§2.2 Margin', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['margin'],
    text: { en: 'Margin is profit divided by the selling price, written as a percentage. With price ৳900 and profit ৳100, margin is 100 ÷ 900, about 11.1%.', bn: 'মার্জিন = লাভ ÷ বিক্রয়মূল্য, শতাংশে লেখা। দাম ৳৯০০ ও লাভ ৳১০০ হলে মার্জিন ১০০ ÷ ৯০০, প্রায় ১১.১%।' },
  },
  {
    id: 'lib-contrast', sourceTitle: 'Loop & Logic pricing notes', location: '§2.3 Markup vs margin', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['margin', 'markup'],
    text: { en: 'Markup and margin start from the same profit but use different bases: cost for markup, selling price for margin. For the same item, margin is always smaller than markup when there is a profit.', bn: 'মার্কআপ ও মার্জিন একই লাভ থেকে শুরু হয়, কিন্তু ভিত্তি আলাদা: মার্কআপে খরচ, মার্জিনে বিক্রয়মূল্য। লাভ থাকলে একই পণ্যে মার্জিন সবসময় মার্কআপের চেয়ে কম।' },
  },
  {
    id: 'lib-discount', sourceTitle: 'Loop & Logic pricing notes', location: '§1.2 Discounted price', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['discount_price'],
    text: { en: 'The price after a discount is the list price times (1 − discount rate). A 10% discount on ৳1,000 gives 1,000 × 0.9 = ৳900.', bn: 'ছাড়ের পরে দাম = তালিকা মূল্য × (১ − ছাড়ের হার)। ৳১,০০০-এ ১০% ছাড় দিলে ১,০০০ × ০.৯ = ৳৯০০।' },
  },
  {
    id: 'lib-policy', sourceTitle: 'Loop & Logic pricing notes', location: '§3.1 Margin rules', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['policy_decision', 'margin'],
    text: { en: 'A minimum-margin rule turns a calculation into a decision: if the margin after the discount is below the minimum, the discount breaks the rule. A margin equal to the minimum meets it.', bn: 'ন্যূনতম মার্জিনের নিয়ম হিসাবকে সিদ্ধান্তে পরিণত করে: ছাড়ের পরে মার্জিন ন্যূনতম সীমার নিচে হলে ছাড়টা নিয়ম ভাঙে। মার্জিন সীমার সমান হলে নিয়ম মানা হয়।' },
  },
  {
    id: 'lib-ai-check', sourceTitle: 'Loop & Logic pricing notes', location: '§4.1 Checking advice', licence: 'Own work', reviewed: false, subject: 'business', concepts: ['ai_verification'],
    text: { en: 'Before acting on pricing advice from a person or an AI, recompute the price after discount, the profit and the margin, and compare the margin with the rule. Your checked numbers decide, not the confidence of the advice.', bn: 'কোনো মানুষ বা এআই-এর দামের পরামর্শ মানার আগে ছাড়ের পরের দাম, লাভ ও মার্জিন আবার হিসাব করো, তারপর মার্জিনকে নিয়মের সঙ্গে মেলাও। সিদ্ধান্ত নেবে তোমার যাচাই করা হিসাব, পরামর্শের আত্মবিশ্বাস নয়।' },
  },
  {
    id: 'lib-score', sourceTitle: 'Loop & Logic ML notes', location: '§1 Scores', licence: 'Own work', reviewed: false, subject: 'ml', concepts: ['classifier_score'],
    text: { en: 'A classifier assigns each example a score; higher scores mean stronger evidence for the positive class. Scores are not automatically calibrated probabilities.', bn: 'ক্লাসিফায়ার প্রতিটি উদাহরণকে একটি স্কোর দেয়; স্কোর বেশি মানে পজিটিভ শ্রেণির পক্ষে প্রমাণ বেশি। স্কোর আপনা-আপনি নির্ভরযোগ্য সম্ভাবনা নয়।' },
  },
  {
    id: 'lib-threshold', sourceTitle: 'Loop & Logic ML notes', location: '§2 Thresholds', licence: 'Own work', reviewed: false, subject: 'ml', concepts: ['threshold'],
    text: { en: 'A threshold turns scores into decisions: flag an example when its score is at or above the threshold. With fixed scores, a higher threshold flags the same number of examples or fewer.', bn: 'থ্রেশহোল্ড স্কোরকে সিদ্ধান্তে পরিণত করে: স্কোর থ্রেশহোল্ডের সমান বা বেশি হলে চিহ্নিত করো। স্কোর অপরিবর্তিত থাকলে থ্রেশহোল্ড বাড়ালে চিহ্নিত উদাহরণ সমান থাকে বা কমে।' },
  },
  {
    id: 'lib-errors', sourceTitle: 'Loop & Logic ML notes', location: '§3 Two kinds of mistakes', licence: 'Own work', reviewed: false, subject: 'ml', concepts: ['false_positive', 'false_negative', 'threshold'],
    text: { en: 'A false positive is a negative example flagged as positive; a false negative is a positive example that is missed. Raising the threshold usually reduces false positives and increases false negatives. With scores 0.90, 0.65, 0.55, 0.40, 0.20, a threshold of 0.50 flags three and 0.80 flags one.', bn: 'ফলস পজিটিভ হলো নেগেটিভ উদাহরণকে পজিটিভ বলা; ফলস নেগেটিভ হলো পজিটিভ উদাহরণ বাদ পড়া। থ্রেশহোল্ড বাড়ালে সাধারণত ফলস পজিটিভ কমে, ফলস নেগেটিভ বাড়ে। স্কোর ০.৯০, ০.৬৫, ০.৫৫, ০.৪০, ০.২০ হলে থ্রেশহোল্ড ০.৫০-এ তিনটি, ০.৮০-তে একটি চিহ্নিত হয়।' },
  },
  ...MORE_PASSAGES,
];

/** Approved websites per subject. Live search never leaves these. Edit with reviewer approval. */
export const APPROVED_SITES: Record<Subject, { domain: string; label: string }[]> = {
  business: [
    { domain: 'openstax.org', label: 'OpenStax' },
    { domain: 'nbr.gov.bd', label: 'National Board of Revenue' },
    { domain: 'bb.org.bd', label: 'Bangladesh Bank' },
  ],
  ml: [
    { domain: 'scikit-learn.org', label: 'scikit-learn documentation' },
    { domain: 'developers.google.com', label: 'Google for Developers' },
  ],
  cs: [
    { domain: 'docs.python.org', label: 'Python documentation' },
    { domain: 'en.cppreference.com', label: 'cppreference (C and C++ reference)' },
    { domain: 'ocw.mit.edu', label: 'MIT OpenCourseWare' },
    { domain: 'openstax.org', label: 'OpenStax' },
  ],
  ee: [
    { domain: 'openstax.org', label: 'OpenStax' },
    { domain: 'ocw.mit.edu', label: 'MIT OpenCourseWare' },
    { domain: 'phet.colorado.edu', label: 'PhET simulations' },
  ],
};

export interface GlossaryEntry {
  id: string;
  term: Bi;
  aliases: string[]; // lowercase; English, Bangla and romanised Bangla
  definition: Bi;
  concept: string;
  passage: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { id: 'g-profit', term: { en: 'Profit', bn: 'লাভ' }, aliases: ['profit', 'profits', 'লাভ', 'labh'], definition: { en: 'Selling price minus total cost.', bn: 'বিক্রয়মূল্য থেকে মোট খরচ বাদ দিলে যা থাকে।' }, concept: 'profit', passage: 'lib-profit' },
  { id: 'g-markup', term: { en: 'Markup', bn: 'মার্কআপ' }, aliases: ['markup', 'mark-up', 'মার্কআপ'], definition: { en: 'Profit as a share of the cost.', bn: 'খরচের তুলনায় লাভের অংশ।' }, concept: 'markup', passage: 'lib-markup' },
  { id: 'g-margin', term: { en: 'Margin', bn: 'মার্জিন' }, aliases: ['margin', 'profit margin', 'মার্জিন', 'margin ki', 'লাভের হার'], definition: { en: 'Profit as a share of the selling price.', bn: 'বিক্রয়মূল্যের তুলনায় লাভের অংশ।' }, concept: 'margin', passage: 'lib-margin' },
  { id: 'g-selling-price', term: { en: 'Selling price', bn: 'বিক্রয়মূল্য' }, aliases: ['selling price', 'sale price', 'বিক্রয়মূল্য'], definition: { en: 'What the customer actually pays, after any discount.', bn: 'ছাড়ের পরে ক্রেতা আসলে যা দেয়।' }, concept: 'discount_price', passage: 'lib-discount' },
  { id: 'g-cost', term: { en: 'Cost', bn: 'খরচ' }, aliases: ['cost', 'খরচ', 'kroy mullo', 'ক্রয়মূল্য'], definition: { en: 'What the seller pays for the item, plus per-item costs it bears.', bn: 'পণ্যের জন্য বিক্রেতা যা দেয়, সঙ্গে তার বহন করা প্রতি-পণ্য খরচ।' }, concept: 'profit', passage: 'lib-profit' },
  { id: 'g-discount', term: { en: 'Discount', bn: 'ছাড়' }, aliases: ['discount', 'ছাড়', 'char'], definition: { en: 'A reduction from the list price, usually a percentage.', bn: 'তালিকা মূল্য থেকে কমানো অংশ, সাধারণত শতাংশে।' }, concept: 'discount_price', passage: 'lib-discount' },
  { id: 'g-score', term: { en: 'Score', bn: 'স্কোর' }, aliases: ['score', 'স্কোর'], definition: { en: 'A number a classifier gives each example; higher means stronger evidence.', bn: 'ক্লাসিফায়ার প্রতিটি উদাহরণকে যে সংখ্যা দেয়; বেশি মানে প্রমাণ বেশি।' }, concept: 'classifier_score', passage: 'lib-score' },
  { id: 'g-threshold', term: { en: 'Threshold', bn: 'থ্রেশহোল্ড' }, aliases: ['threshold', 'থ্রেশহোল্ড', 'সীমা'], definition: { en: 'The score at or above which an example is flagged.', bn: 'যে স্কোর বা তার বেশি হলে উদাহরণ চিহ্নিত হয়।' }, concept: 'threshold', passage: 'lib-threshold' },
  { id: 'g-fp', term: { en: 'False positive', bn: 'ফলস পজিটিভ' }, aliases: ['false positive', 'false positives', 'ফলস পজিটিভ'], definition: { en: 'A negative example wrongly flagged as positive.', bn: 'নেগেটিভ উদাহরণকে ভুল করে পজিটিভ বলা।' }, concept: 'false_positive', passage: 'lib-errors' },
  { id: 'g-fn', term: { en: 'False negative', bn: 'ফলস নেগেটিভ' }, aliases: ['false negative', 'false negatives', 'ফলস নেগেটিভ'], definition: { en: 'A positive example that is missed.', bn: 'পজিটিভ উদাহরণ বাদ পড়া।' }, concept: 'false_negative', passage: 'lib-errors' },
  ...MORE_GLOSSARY,
];

export function getPassage(id: string): Passage | undefined {
  return PASSAGES.find((p) => p.id === id);
}

/** The subject a glossary term belongs to (through its passage). */
export function glossarySubject(g: GlossaryEntry): Subject | undefined {
  return getPassage(g.passage)?.subject;
}
