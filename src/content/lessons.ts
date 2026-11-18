// Lessons ("blogs") as ordered blocks. Only `text` blocks are personalised;
// headings, formulas, interactive blocks and fact anchors never change.
//
// Each text block has reviewed versions at three levels (L1 simple, L2 standard,
// L3 technical) in English and Bangla. L2 is the original.
// STATUS: draft. Every version needs reviewer sign-off before pilot use.

import type { Bi } from './pricing-pack.ts';
import type { Subject } from './subjects.ts';
import { MORE_LESSONS, MORE_PREREQ_CHECKS } from './lessons-more.ts';

export type BlockType = 'heading' | 'text' | 'formula' | 'example' | 'interactive';
export type ReadLevel = 1 | 2 | 3;

export interface Quiz {
  question: Bi;
  options: Bi[];
  answer: number;
  explanation: Bi;
}

export interface LessonBlock {
  id: string;
  type: BlockType;
  concepts: string[];
  passages: string[]; // library passages this block is based on
  anchors: string[]; // locked facts: must appear unchanged in every version
  text: Record<ReadLevel, Bi>; // for heading/formula/interactive, all levels are the same
  extraExample?: Bi; // shown for weak concepts
  quiz?: Quiz;
  interactive?: 'margin_calculator' | 'threshold_slider';
}

/** A Loop & Logic YouTube video for this lesson. `covers` = the same topic; `related` = nearby topic. */
export interface LessonVideo {
  id: string;
  title: string;
  relation: 'covers' | 'related';
}

export interface Lesson {
  id: string;
  subject: Subject;
  title: Bi;
  summary: Bi;
  videos?: LessonVideo[];
  blocks: LessonBlock[];
}

export interface PrereqCheck {
  prerequisite: string;
  question: Bi;
  options: Bi[];
  answer: number;
  refresher: Bi;
}

const same = (b: Bi): Record<ReadLevel, Bi> => ({ 1: b, 2: b, 3: b });

export const LESSONS: Lesson[] = [
  {
    id: 'margin-basics',
    subject: 'business',
    videos: [{ id: 'BbUeOP_-AiA', title: 'Basic Accounting: Cost-Volume-Profit (CVP) Analysis Explained', relation: 'related' }],
    title: { en: 'Markup and margin: two ways to measure profit', bn: 'মার্কআপ ও মার্জিন: লাভ মাপার দুই উপায়' },
    summary: { en: 'Why a 12.5% markup can be an 11.1% margin, and how to check an AI coworker’s pricing advice.', bn: 'কেন ১২.৫% মার্কআপ মানে ১১.১% মার্জিন হতে পারে, আর কীভাবে এআই সহকর্মীর দামের পরামর্শ যাচাই করবে।' },
    blocks: [
      {
        id: 'mb-1',
        type: 'text',
        concepts: ['profit'],
        passages: ['lib-profit'],
        anchors: ['selling price', 'cost'],
        text: {
          1: {
            en: 'Profit is the money you keep. If you buy something for ৳800 and sell it for ৳900, you keep ৳100. Profit = selling price − cost.',
            bn: 'লাভ হলো যে টাকাটা তোমার হাতে থাকে। ৳৮০০ দিয়ে কিনে ৳৯০০-তে বেচলে তোমার থাকে ৳১০০। লাভ = বিক্রয়মূল্য − খরচ।',
          },
          2: {
            en: 'Every pricing decision starts with profit: the selling price minus the cost of the item. A speaker bought for ৳800 and sold for ৳900 earns ৳100 of profit.',
            bn: 'দাম নিয়ে প্রতিটি সিদ্ধান্ত শুরু হয় লাভ দিয়ে: বিক্রয়মূল্য থেকে পণ্যের খরচ বাদ দিলে লাভ। ৳৮০০-তে কেনা একটি স্পিকার ৳৯০০-তে বিক্রি হলে লাভ ৳১০০।',
          },
          3: {
            en: 'Unit profit is selling price minus total unit cost (purchase cost plus any per-unit costs the seller bears). For a unit cost of ৳800 and a realised price of ৳900, unit profit is ৳100.',
            bn: 'একক লাভ = বিক্রয়মূল্য − মোট একক খরচ (কেনার দাম ও বিক্রেতার বহন করা প্রতি-একক খরচ)। একক খরচ ৳৮০০ ও বাস্তব বিক্রয়মূল্য ৳৯০০ হলে একক লাভ ৳১০০।',
          },
        },
        quiz: {
          question: { en: 'Cost ৳800, selling price ৳900. What is the profit?', bn: 'খরচ ৳৮০০, বিক্রয়মূল্য ৳৯০০। লাভ কত?' },
          options: [{ en: '৳100', bn: '৳১০০' }, { en: '৳900', bn: '৳৯০০' }, { en: '৳1,700', bn: '৳১,৭০০' }],
          answer: 0,
          explanation: { en: 'Profit = selling price − cost = 900 − 800 = ৳100.', bn: 'লাভ = বিক্রয়মূল্য − খরচ = ৯০০ − ৮০০ = ৳১০০।' },
        },
      },
      {
        id: 'mb-2',
        type: 'text',
        concepts: ['markup'],
        passages: ['lib-markup'],
        anchors: ['markup', 'cost'],
        text: {
          1: {
            en: 'Markup compares the profit with what you paid. ৳100 profit on a ৳800 item: 100 ÷ 800 = 12.5% markup.',
            bn: 'মার্কআপে লাভকে তুলনা করা হয় কেনার দামের সঙ্গে। ৳৮০০-র পণ্যে ৳১০০ লাভ: ১০০ ÷ ৮০০ = ১২.৫% মার্কআপ।',
          },
          2: {
            en: 'Markup expresses profit as a percentage of cost. With ৳100 profit on a ৳800 cost, the markup is 100 ÷ 800 = 12.5%. Shops often set prices this way: cost plus a markup.',
            bn: 'মার্কআপ হলো খরচের শতাংশ হিসেবে লাভ। ৳৮০০ খরচে ৳১০০ লাভ হলে মার্কআপ ১০০ ÷ ৮০০ = ১২.৫%। দোকানগুলো প্রায়ই এভাবে দাম ঠিক করে: খরচ যোগ মার্কআপ।',
          },
          3: {
            en: 'Markup is profit divided by cost, expressed as a percentage: 100 ÷ 800 = 12.5% in our example. It is a cost-based measure, convenient for cost-plus pricing but not comparable with revenue-based ratios.',
            bn: 'মার্কআপ = লাভ ÷ খরচ, শতাংশে: আমাদের উদাহরণে ১০০ ÷ ৮০০ = ১২.৫%। এটি খরচভিত্তিক মাপ; খরচ-যোগ পদ্ধতিতে দাম ঠিক করতে সুবিধাজনক, কিন্তু আয়ভিত্তিক অনুপাতের সঙ্গে তুলনীয় নয়।',
          },
        },
        quiz: {
          question: { en: 'Markup divides profit by…', bn: 'মার্কআপে লাভকে ভাগ করা হয়…' },
          options: [{ en: 'the cost', bn: 'খরচ দিয়ে' }, { en: 'the selling price', bn: 'বিক্রয়মূল্য দিয়ে' }, { en: 'the discount', bn: 'ছাড় দিয়ে' }],
          answer: 0,
          explanation: { en: 'Markup is profit ÷ cost. Margin is the one that uses the selling price.', bn: 'মার্কআপ = লাভ ÷ খরচ। বিক্রয়মূল্য ব্যবহার হয় মার্জিনে।' },
        },
      },
      {
        id: 'mb-3',
        type: 'formula',
        concepts: ['margin'],
        passages: ['lib-margin'],
        anchors: ['Margin = Profit ÷ Selling price × 100'],
        text: same({ en: 'Margin = Profit ÷ Selling price × 100', bn: 'মার্জিন = লাভ ÷ বিক্রয়মূল্য × ১০০' }),
      },
      {
        id: 'mb-4',
        type: 'text',
        concepts: ['margin', 'markup'],
        passages: ['lib-margin', 'lib-contrast'],
        anchors: ['margin', 'selling price'],
        text: {
          1: {
            en: 'Margin compares the profit with what the customer pays. Same ৳100 profit, but now divide by ৳900: about 11.1%. Same profit, different base, smaller number.',
            bn: 'মার্জিনে লাভকে তুলনা করা হয় ক্রেতা যা দেয় তার সঙ্গে। একই ৳১০০ লাভ, কিন্তু এবার ভাগ হবে ৳৯০০ দিয়ে: প্রায় ১১.১%। লাভ একই, ভিত্তি আলাদা, সংখ্যা ছোট।',
          },
          2: {
            en: 'Margin expresses the same profit as a share of the selling price. ৳100 out of ৳900 is about 11.1%. Because the selling price is larger than the cost, margin is always smaller than markup for the same item.',
            bn: 'মার্জিন একই লাভকে বিক্রয়মূল্যের অংশ হিসেবে দেখায়। ৳৯০০-র মধ্যে ৳১০০ মানে প্রায় ১১.১%। বিক্রয়মূল্য খরচের চেয়ে বড় বলে একই পণ্যে মার্জিন সবসময় মার্কআপের চেয়ে কম।',
          },
          3: {
            en: 'Margin is profit divided by selling price: 100 ÷ 900 ≈ 11.1%. With a positive profit the denominator exceeds cost, so margin is strictly below markup. Store policies are usually written as minimum margins, so the base matters.',
            bn: 'মার্জিন = লাভ ÷ বিক্রয়মূল্য: ১০০ ÷ ৯০০ ≈ ১১.১%। লাভ ধনাত্মক হলে হর খরচের চেয়ে বড়, তাই মার্জিন মার্কআপের চেয়ে কঠোরভাবে কম। দোকানের নিয়ম সাধারণত ন্যূনতম মার্জিন হিসেবে লেখা হয়, তাই ভিত্তিটা গুরুত্বপূর্ণ।',
          },
        },
        extraExample: {
          en: 'Everyday example: a tea stall buys a cup’s ingredients for ৳8 and sells the tea for ৳10. Profit ৳2. Markup 2 ÷ 8 = 25%. Margin 2 ÷ 10 = 20%.',
          bn: 'রোজকার উদাহরণ: চায়ের দোকানে এক কাপের উপকরণ ৳৮, চা বিক্রি ৳১০। লাভ ৳২। মার্কআপ ২ ÷ ৮ = ২৫%। মার্জিন ২ ÷ ১০ = ২০%।',
        },
        quiz: {
          question: { en: 'Cost ৳800, price ৳900. What is the margin?', bn: 'খরচ ৳৮০০, দাম ৳৯০০। মার্জিন কত?' },
          options: [{ en: 'About 11.1%', bn: 'প্রায় ১১.১%' }, { en: '12.5%', bn: '১২.৫%' }, { en: '100%', bn: '১০০%' }],
          answer: 0,
          explanation: { en: 'Margin = 100 ÷ 900 ≈ 11.1%. 12.5% is the markup (100 ÷ 800).', bn: 'মার্জিন = ১০০ ÷ ৯০০ ≈ ১১.১%। ১২.৫% হলো মার্কআপ (১০০ ÷ ৮০০)।' },
        },
      },
      {
        id: 'mb-5',
        type: 'example',
        concepts: ['discount_price', 'margin', 'policy_decision'],
        passages: ['lib-discount', 'lib-policy'],
        anchors: ['৳800', '৳1,000', '10%', '15%', '৳900', '11.1%'],
        text: same({
          en: 'Worked example. Cost ৳800, list price ৳1,000, proposed discount 10%, store rule: margin at least 15%. Price after discount = 1,000 × 0.9 = ৳900. Profit = ৳100. Margin = 100 ÷ 900 ≈ 11.1%, which is below 15%, so the discount breaks the rule.',
          bn: 'সমাধানসহ উদাহরণ। খরচ ৳৮০০, তালিকা মূল্য ৳১,০০০, প্রস্তাবিত ছাড় ১০%, দোকানের নিয়ম: মার্জিন কমপক্ষে ১৫%। ছাড়ের পরে দাম = ১,০০০ × ০.৯ = ৳৯০০। লাভ = ৳১০০। মার্জিন = ১০০ ÷ ৯০০ ≈ ১১.১%, যা ১৫%-এর নিচে, তাই ছাড়টা নিয়ম ভাঙে।',
        }),
      },
      {
        id: 'mb-6',
        type: 'interactive',
        concepts: ['margin', 'discount_price'],
        passages: [],
        anchors: [],
        text: same({ en: 'Try it: move the discount and watch the margin.', bn: 'চেষ্টা করো: ছাড় বাড়াও-কমাও, মার্জিন কীভাবে বদলায় দেখো।' }),
        interactive: 'margin_calculator',
      },
      {
        id: 'mb-7',
        type: 'text',
        concepts: ['ai_verification', 'policy_decision'],
        passages: ['lib-ai-check'],
        anchors: ['margin', 'rule'],
        text: {
          1: {
            en: 'An AI coworker might say “our margin is 20%, accept the discount.” Check it yourself: did it use the price after the discount? Did it divide by the selling price? Your own numbers decide.',
            bn: 'এআই সহকর্মী বলতে পারে “আমাদের মার্জিন ২০%, ছাড় দিয়ে দাও।” নিজে যাচাই করো: ছাড়ের পরের দাম ধরেছে কি? বিক্রয়মূল্য দিয়ে ভাগ করেছে কি? সিদ্ধান্ত নেবে তোমার নিজের হিসাব।',
          },
          2: {
            en: 'AI tools can sound confident and still be wrong. A coworker that reports a 20% margin may have ignored the discount or divided by the cost. Before accepting advice, recompute the margin from the discounted price and compare it with the rule.',
            bn: 'এআই টুল আত্মবিশ্বাসী শোনালেও ভুল হতে পারে। যে সহকর্মী ২০% মার্জিনের কথা বলছে, সে হয়তো ছাড় বাদ দিয়েছে বা খরচ দিয়ে ভাগ করেছে। পরামর্শ মানার আগে ছাড়ের পরের দাম থেকে মার্জিন আবার হিসাব করো এবং নিয়মের সঙ্গে মেলাও।',
          },
          3: {
            en: 'Treat AI advice as a hypothesis. Typical failure modes are using the pre-discount price, using cost as the base, or omitting per-unit fees. Verify each input, recompute the margin, and let the policy threshold, not the advice, determine the decision.',
            bn: 'এআই-এর পরামর্শকে একটি অনুমান হিসেবে দেখো। সাধারণ ভুলগুলো হলো ছাড়ের আগের দাম ধরা, খরচকে ভিত্তি ধরা, বা প্রতি-একক ফি বাদ দেওয়া। প্রতিটি ইনপুট যাচাই করো, মার্জিন আবার হিসাব করো, আর সিদ্ধান্ত নিতে দাও নিয়মের সীমাকে, পরামর্শকে নয়।',
          },
        },
        quiz: {
          question: { en: 'The AI says the margin is 20%. Your recomputed margin is 11.1% and the rule is 15%. What do you do?', bn: 'এআই বলছে মার্জিন ২০%। তোমার হিসাবে ১১.১%, নিয়ম ১৫%। কী করবে?' },
          options: [
            { en: 'Reject the discount: my checked number is below the rule', bn: 'ছাড় দেব না: আমার যাচাই করা হিসাব নিয়মের নিচে' },
            { en: 'Accept: the AI is usually right', bn: 'ছাড় দেব: এআই সাধারণত ঠিক বলে' },
            { en: 'Average the two numbers', bn: 'দুটো সংখ্যার গড় নেব' },
          ],
          answer: 0,
          explanation: { en: 'Your verified margin (11.1%) is below 15%, so the discount breaks the rule, whatever the advice says.', bn: 'তোমার যাচাই করা মার্জিন (১১.১%) ১৫%-এর নিচে, তাই পরামর্শ যা-ই বলুক, ছাড়টা নিয়ম ভাঙে।' },
        },
      },
    ],
  },
  {
    id: 'classification-threshold',
    subject: 'ml',
    videos: [{ id: 'vix-k6UC_Uc', title: 'Logistic Regression Bangla | 3 Solved Numerical Examples', relation: 'related' }],
    title: { en: 'Classification thresholds: from scores to decisions', bn: 'ক্লাসিফিকেশন থ্রেশহোল্ড: স্কোর থেকে সিদ্ধান্ত' },
    summary: { en: 'How moving a threshold trades false positives for false negatives.', bn: 'থ্রেশহোল্ড সরালে কীভাবে ফলস পজিটিভ আর ফলস নেগেটিভের মধ্যে টানাপোড়েন হয়।' },
    blocks: [
      {
        id: 'ct-1',
        type: 'text',
        concepts: ['classifier_score'],
        passages: ['lib-score'],
        anchors: ['score'],
        text: {
          1: {
            en: 'A spam filter gives each email a score. A higher score means “more likely spam”. The score alone is not a yes or no.',
            bn: 'স্প্যাম ফিল্টার প্রতিটি ইমেইলকে একটি স্কোর দেয়। স্কোর বেশি মানে “স্প্যাম হওয়ার সম্ভাবনা বেশি”। শুধু স্কোর দিয়ে হ্যাঁ বা না বোঝা যায় না।',
          },
          2: {
            en: 'A classifier gives each email a score, for example 0.65. A higher score means stronger evidence for spam. The score is not automatically a calibrated probability, and it is not yet a decision.',
            bn: 'ক্লাসিফায়ার প্রতিটি ইমেইলকে একটি স্কোর দেয়, যেমন ০.৬৫। স্কোর বেশি মানে স্প্যামের পক্ষে প্রমাণ বেশি। স্কোর আপনা-আপনি একটি নির্ভরযোগ্য সম্ভাবনা নয়, আর এটা এখনো সিদ্ধান্তও নয়।',
          },
          3: {
            en: 'A probabilistic classifier outputs a score such as 0.65 per instance. Unless calibrated, scores rank instances but should not be read as probabilities. A decision rule is still needed to turn scores into labels.',
            bn: 'একটি সম্ভাব্যতাভিত্তিক ক্লাসিফায়ার প্রতিটি নমুনার জন্য ০.৬৫-এর মতো স্কোর দেয়। ক্যালিব্রেট করা না থাকলে স্কোর শুধু ক্রম ঠিক করে, সম্ভাবনা হিসেবে পড়া উচিত নয়। স্কোরকে লেবেলে পরিণত করতে একটি সিদ্ধান্ত-নিয়ম লাগে।',
          },
        },
        quiz: {
          question: { en: 'A score of 0.65 means…', bn: '০.৬৫ স্কোর মানে…' },
          options: [{ en: 'Stronger evidence for spam than a lower score', bn: 'কম স্কোরের তুলনায় স্প্যামের পক্ষে বেশি প্রমাণ' }, { en: 'Exactly 65% chance of spam', bn: 'ঠিক ৬৫% স্প্যামের সম্ভাবনা' }, { en: 'The email is spam', bn: 'ইমেইলটি স্প্যাম' }],
          answer: 0,
          explanation: { en: 'Scores rank evidence; they are not automatically probabilities or decisions.', bn: 'স্কোর প্রমাণের ক্রম দেখায়; এটা আপনা-আপনি সম্ভাবনা বা সিদ্ধান্ত নয়।' },
        },
      },
      {
        id: 'ct-2',
        type: 'formula',
        concepts: ['threshold'],
        passages: ['lib-threshold'],
        anchors: ['score ≥ threshold'],
        text: same({ en: 'Flag as spam when score ≥ threshold', bn: 'স্কোর ≥ থ্রেশহোল্ড হলে স্প্যাম হিসেবে চিহ্নিত করো' }),
      },
      {
        id: 'ct-3',
        type: 'text',
        concepts: ['threshold', 'false_positive', 'false_negative'],
        passages: ['lib-threshold', 'lib-errors'],
        anchors: ['false positive', 'false negative'],
        text: {
          1: {
            en: 'Raise the threshold and fewer emails get flagged. That means fewer good emails wrongly flagged (false positives), but more spam slipping through (false negatives).',
            bn: 'থ্রেশহোল্ড বাড়ালে কম ইমেইল চিহ্নিত হয়। তাতে ভালো ইমেইল ভুল করে চিহ্নিত হওয়া (ফলস পজিটিভ) কমে, কিন্তু স্প্যাম ফসকে যাওয়া (ফলস নেগেটিভ) বাড়ে।',
          },
          2: {
            en: 'With the scores fixed, raising the threshold can only reduce the number of flagged emails. A false positive is a legitimate email flagged as spam; a false negative is spam that passes. Raising the threshold tends to reduce false positives and increase false negatives.',
            bn: 'স্কোর অপরিবর্তিত থাকলে থ্রেশহোল্ড বাড়ালে চিহ্নিত ইমেইলের সংখ্যা কেবল কমতে পারে। ফলস পজিটিভ হলো বৈধ ইমেইলকে স্প্যাম বলা; ফলস নেগেটিভ হলো স্প্যাম পার পেয়ে যাওয়া। থ্রেশহোল্ড বাড়ালে সাধারণত ফলস পজিটিভ কমে, ফলস নেগেটিভ বাড়ে।',
          },
          3: {
            en: 'For fixed scores, the set of flagged instances is monotonically non-increasing in the threshold. Raising it trades false positives (legitimate mail flagged) for false negatives (spam missed), moving the operating point along the precision–recall curve.',
            bn: 'স্কোর অপরিবর্তিত থাকলে থ্রেশহোল্ড বাড়ার সঙ্গে চিহ্নিত নমুনার সেট কখনো বাড়ে না। থ্রেশহোল্ড বাড়ালে ফলস পজিটিভের (বৈধ মেইল চিহ্নিত) বদলে ফলস নেগেটিভ (স্প্যাম বাদ পড়া) বাড়ে, অর্থাৎ প্রিসিশন–রিকল বক্ররেখা বরাবর অবস্থান সরে।',
          },
        },
        extraExample: {
          en: 'Everyday example: a strict school guard who only stops people with no ID card rarely stops students by mistake, but may let some outsiders in.',
          bn: 'রোজকার উদাহরণ: যে দারোয়ান শুধু আইডি কার্ড ছাড়া মানুষকে আটকায়, সে ভুল করে ছাত্রদের খুব কম আটকায়, কিন্তু কিছু বাইরের লোক ঢুকে পড়তে পারে।',
        },
        quiz: {
          question: { en: 'Raising the threshold usually…', bn: 'থ্রেশহোল্ড বাড়ালে সাধারণত…' },
          options: [{ en: 'reduces false positives, increases false negatives', bn: 'ফলস পজিটিভ কমে, ফলস নেগেটিভ বাড়ে' }, { en: 'catches more spam', bn: 'বেশি স্প্যাম ধরা পড়ে' }, { en: 'changes the scores', bn: 'স্কোর বদলে যায়' }],
          answer: 0,
          explanation: { en: 'Fewer emails are flagged, so fewer good emails are wrongly flagged and more spam passes.', bn: 'কম ইমেইল চিহ্নিত হয়, তাই ভালো ইমেইল ভুল করে কম চিহ্নিত হয়, আর বেশি স্প্যাম পার পায়।' },
        },
      },
      {
        id: 'ct-4',
        type: 'example',
        concepts: ['threshold', 'false_positive', 'false_negative'],
        passages: ['lib-errors'],
        anchors: ['0.50', '0.80'],
        text: same({
          en: 'Worked example. Five emails with scores 0.90 (spam), 0.65 (spam), 0.55 (not spam), 0.40 (spam) and 0.20 (not spam). At threshold 0.50, three are flagged: one false positive (0.55) and one false negative (0.40). At 0.80, only one is flagged: no false positives, two false negatives (0.65 and 0.40).',
          bn: 'সমাধানসহ উদাহরণ। পাঁচটি ইমেইলের স্কোর ০.৯০ (স্প্যাম), ০.৬৫ (স্প্যাম), ০.৫৫ (স্প্যাম নয়), ০.৪০ (স্প্যাম) ও ০.২০ (স্প্যাম নয়)। থ্রেশহোল্ড ০.৫০ হলে তিনটি চিহ্নিত হয়: একটি ফলস পজিটিভ (০.৫৫) ও একটি ফলস নেগেটিভ (০.৪০)। ০.৮০ হলে শুধু একটি চিহ্নিত হয়: ফলস পজিটিভ নেই, ফলস নেগেটিভ দুটি (০.৬৫ ও ০.৪০)।',
        }),
      },
      {
        id: 'ct-5',
        type: 'interactive',
        concepts: ['threshold'],
        passages: [],
        anchors: [],
        text: same({ en: 'Try it: move the threshold and count the mistakes.', bn: 'চেষ্টা করো: থ্রেশহোল্ড সরিয়ে ভুলগুলো গুনে দেখো।' }),
        interactive: 'threshold_slider',
      },
    ],
  },
  ...MORE_LESSONS,
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

/** Prerequisite check per concept: one tap, asked once, skippable. */
export const PREREQ_CHECKS: Record<string, PrereqCheck> = {
  ...MORE_PREREQ_CHECKS,
  margin: {
    prerequisite: 'profit',
    question: { en: 'Quick check: cost ৳800, price ৳1,000. What is the profit?', bn: 'ছোট্ট যাচাই: খরচ ৳৮০০, দাম ৳১,০০০। লাভ কত?' },
    options: [{ en: '৳200', bn: '৳২০০' }, { en: '৳1,800', bn: '৳১,৮০০' }, { en: 'Not sure', bn: 'নিশ্চিত নই' }],
    answer: 0,
    refresher: { en: 'Profit is the selling price minus the cost.', bn: 'লাভ = বিক্রয়মূল্য − খরচ।' },
  },
  markup: {
    prerequisite: 'profit',
    question: { en: 'Quick check: cost ৳800, price ৳1,000. What is the profit?', bn: 'ছোট্ট যাচাই: খরচ ৳৮০০, দাম ৳১,০০০। লাভ কত?' },
    options: [{ en: '৳200', bn: '৳২০০' }, { en: '৳1,800', bn: '৳১,৮০০' }, { en: 'Not sure', bn: 'নিশ্চিত নই' }],
    answer: 0,
    refresher: { en: 'Profit is the selling price minus the cost.', bn: 'লাভ = বিক্রয়মূল্য − খরচ।' },
  },
  false_positive: {
    prerequisite: 'threshold',
    question: { en: 'Quick check: threshold 0.50. Is an email with score 0.55 flagged?', bn: 'ছোট্ট যাচাই: থ্রেশহোল্ড ০.৫০। ০.৫৫ স্কোরের ইমেইল কি চিহ্নিত হবে?' },
    options: [{ en: 'Yes', bn: 'হ্যাঁ' }, { en: 'No', bn: 'না' }, { en: 'Not sure', bn: 'নিশ্চিত নই' }],
    answer: 0,
    refresher: { en: 'An email is flagged when its score is at or above the threshold.', bn: 'স্কোর থ্রেশহোল্ডের সমান বা বেশি হলে ইমেইল চিহ্নিত হয়।' },
  },
};
