// One hands-on lab per lesson: what you need, how to set it up, starter
// material, tasks, the expected result and questions that check your result.
// Labs are the same for every learner (never personalised).
//
// Every code starter here was run before it was written down; the expected
// outputs are the real outputs (Python 3.12, GCC 13, scikit-learn 1.x).
// STATUS: draft. The Bangla needs a native reviewer. Simulator menu names
// were checked against the tools' own guides in Nov 2026 and can change.

import type { Bi } from './pricing-pack.ts';

export interface LabTool {
  name: string;
  url: string | null;
  kind: 'online' | 'install';
  note: Bi;
}

export interface LabCheck {
  id: string;
  question: Bi;
  options: Bi[]; // the first option is the correct one; the server shuffles before sending
  explanation: Bi;
}

export interface Lab {
  lessonId: string;
  title: Bi;
  goal: Bi;
  minutes: number;
  kind: 'code' | 'simulator' | 'spreadsheet';
  tools: LabTool[];
  setup: Bi[];
  starter: { language: 'python' | 'c' | 'formulas'; filename: string; code: string; note: Bi } | null;
  tasks: Bi[];
  expected: { caption: Bi; output: string } | null;
  checks: LabCheck[];
  troubleshooting: { problem: Bi; fix: Bi }[];
  extension: Bi;
}

const b = (en: string, bn: string): Bi => ({ en, bn });
const ck = (id: string, question: Bi, options: Bi[], explanation: Bi): LabCheck => ({ id, question, options, explanation });

// ── tools ───────────────────────────────────────────────────────────────
const COLAB: LabTool = {
  name: 'Google Colab', url: 'https://colab.research.google.com/', kind: 'online',
  note: b('Runs Python in your browser, including on a phone. Needs a Google account.', 'ব্রাউজারেই পাইথন চালায়, ফোনেও চলে। একটি গুগল অ্যাকাউন্ট লাগে।'),
};
const ONLINEGDB_PY: LabTool = {
  name: 'OnlineGDB', url: 'https://www.onlinegdb.com/', kind: 'online',
  note: b('Runs Python in your browser. Choose “Python 3” in the Language menu. Nothing to install.', 'ব্রাউজারেই পাইথন চালায়। Language মেনু থেকে “Python 3” বেছে নাও। কিছু ইনস্টল করতে হয় না।'),
};
const ONLINEGDB_C: LabTool = {
  name: 'OnlineGDB', url: 'https://www.onlinegdb.com/', kind: 'online',
  note: b('Compiles and runs C in your browser. Choose “C” in the Language menu. Nothing to install.', 'ব্রাউজারেই সি কম্পাইল করে চালায়। Language মেনু থেকে “C” বেছে নাও। কিছু ইনস্টল করতে হয় না।'),
};
const PYTHON = (file: string): LabTool => ({
  name: 'Python 3 on your computer', url: 'https://www.python.org/downloads/', kind: 'install',
  note: b(`Save the code as ${file}, open a terminal in that folder and run: python ${file}`, `কোডটি ${file} নামে সেভ করো, ওই ফোল্ডারে টার্মিনাল খুলে চালাও: python ${file}`),
});
const GCC: LabTool = {
  name: 'Code::Blocks (with MinGW) or GCC', url: 'https://www.codeblocks.org/downloads/', kind: 'install',
  note: b('In Code::Blocks press Build and run (F9). With GCC in a terminal: gcc stack.c -o stack, then ./stack', 'Code::Blocks-এ Build and run (F9) চাপো। টার্মিনালে GCC দিয়ে: gcc stack.c -o stack, তারপর ./stack'),
};
const SHEETS: LabTool = {
  name: 'Google Sheets', url: 'https://docs.google.com/spreadsheets/', kind: 'online',
  note: b('Free in the browser and in the phone app. Excel or LibreOffice Calc work the same way.', 'ব্রাউজারে ও ফোনের অ্যাপে বিনামূল্যে। Excel বা LibreOffice Calc-এও একইভাবে করা যায়।'),
};
const CIRCUITVERSE: LabTool = {
  name: 'CircuitVerse simulator', url: 'https://circuitverse.org/simulator', kind: 'online',
  note: b('Free digital-logic simulator in the browser. You can use it without an account; sign in only if you want to save.', 'ব্রাউজারে বিনামূল্যের ডিজিটাল লজিক সিমুলেটর। অ্যাকাউন্ট ছাড়াই ব্যবহার করা যায়; সেভ করতে চাইলে তবেই সাইন ইন করো।'),
};
const FALSTAD: LabTool = {
  name: 'Falstad circuit simulator', url: 'https://www.falstad.com/circuit/', kind: 'online',
  note: b('Free analogue circuit simulator in the browser. Works best on a computer with a mouse.', 'ব্রাউজারে বিনামূল্যের অ্যানালগ সার্কিট সিমুলেটর। মাউসসহ কম্পিউটারে সবচেয়ে ভালো চলে।'),
};

const COLAB_SETUP: Bi[] = [
  b('Open Google Colab and sign in with your Google account.', 'গুগল কোল্যাব খোলো এবং তোমার গুগল অ্যাকাউন্ট দিয়ে সাইন ইন করো।'),
  b('Click “New notebook”.', '“New notebook”-এ ক্লিক করো।'),
  b('Copy the starter code below and paste it into the first cell.', 'নিচের স্টার্টার কোড কপি করে প্রথম সেলে পেস্ট করো।'),
  b('Press the Run button (▶) at the left of the cell, or Shift + Enter.', 'সেলের বাঁ পাশের Run বোতাম (▶) চাপো, অথবা Shift + Enter।'),
  b('Compare what you see with the expected output further down this page.', 'যা দেখছ, তা এই পাতার নিচের প্রত্যাশিত আউটপুটের সঙ্গে মিলিয়ে নাও।'),
];

const NO_OUTPUT: { problem: Bi; fix: Bi } = {
  problem: b('Nothing is printed, or you see “IndentationError”.', 'কিছুই প্রিন্ট হয় না, অথবা “IndentationError” দেখায়।'),
  fix: b('Python cares about spaces at the start of a line. Copy the code again with the Copy button instead of typing it, and do not add spaces before the first line.', 'পাইথনে লাইনের শুরুর স্পেস গুরুত্বপূর্ণ। হাতে না লিখে Copy বোতাম দিয়ে কোডটি আবার কপি করো, আর প্রথম লাইনের আগে কোনো স্পেস দিয়ো না।'),
};

export const LABS: Lab[] = [
  // ── Machine learning: thresholds ─────────────────────────────────────
  {
    lessonId: 'classification-threshold',
    title: b('Lab: move the threshold, count the mistakes', 'ল্যাব: থ্রেশহোল্ড সরাও, ভুল গোনো'),
    goal: b('Write a few lines of Python that count false positives and false negatives at any threshold, then find the thresholds with the fewest mistakes.', 'কয়েক লাইন পাইথন লিখে যেকোনো থ্রেশহোল্ডে ফলস পজিটিভ ও ফলস নেগেটিভ গোনো, তারপর সবচেয়ে কম ভুলের থ্রেশহোল্ডগুলো খুঁজে বের করো।'),
    minutes: 20,
    kind: 'code',
    tools: [COLAB, ONLINEGDB_PY, PYTHON('threshold.py')],
    setup: COLAB_SETUP,
    starter: {
      language: 'python', filename: 'threshold.py',
      note: b('The five emails are the same ones as in the lesson’s worked example.', 'পাঁচটি ইমেইল পাঠের সমাধানসহ উদাহরণের ইমেইলগুলোই।'),
      code: String.raw`# Lab: move the threshold, count the mistakes
emails = [(0.90, "spam"), (0.65, "spam"), (0.55, "not spam"), (0.40, "spam"), (0.20, "not spam")]

def count_mistakes(threshold):
    false_pos = sum(1 for score, label in emails if score >= threshold and label == "not spam")
    false_neg = sum(1 for score, label in emails if score < threshold and label == "spam")
    return false_pos, false_neg

for threshold in [0.50, 0.80]:
    fp, fn = count_mistakes(threshold)
    print(f"threshold {threshold:.2f}: false positives = {fp}, false negatives = {fn}")

# TODO 1: test every threshold in this list instead of only two:
#         [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90]
# TODO 2: also print fp + fn. Which thresholds make the fewest mistakes?
`,
    },
    tasks: [
      b('Run the starter code and check that it matches the expected output.', 'স্টার্টার কোড চালাও এবং প্রত্যাশিত আউটপুটের সঙ্গে মেলে কি না দেখো।'),
      b('TODO 1: replace the list [0.50, 0.80] with the nine thresholds from 0.10 to 0.90.', 'TODO 1: [0.50, 0.80] তালিকার জায়গায় ০.১০ থেকে ০.৯০ পর্যন্ত নয়টি থ্রেশহোল্ড বসাও।'),
      b('TODO 2: print fp + fn on each line and find the thresholds with the smallest total.', 'TODO 2: প্রতিটি লাইনে fp + fn প্রিন্ট করো এবং যেসব থ্রেশহোল্ডে মোট ভুল সবচেয়ে কম সেগুলো খুঁজে বের করো।'),
      b('Explain in one sentence why the false positives never go up as the threshold rises.', 'এক বাক্যে ব্যাখ্যা করো: থ্রেশহোল্ড বাড়লে ফলস পজিটিভ কেন কখনো বাড়ে না।'),
    ],
    expected: {
      caption: b('Output of the starter code, before your changes', 'তোমার পরিবর্তনের আগে স্টার্টার কোডের আউটপুট'),
      output: 'threshold 0.50: false positives = 1, false negatives = 1\nthreshold 0.80: false positives = 0, false negatives = 2',
    },
    checks: [
      ck('c1', b('At threshold 0.60, what mistakes does your program report?', 'থ্রেশহোল্ড ০.৬০-এ তোমার প্রোগ্রাম কী কী ভুল দেখায়?'),
        [b('0 false positives, 1 false negative', '০টি ফলস পজিটিভ, ১টি ফলস নেগেটিভ'), b('1 false positive, 1 false negative', '১টি ফলস পজিটিভ, ১টি ফলস নেগেটিভ'), b('0 false positives, 2 false negatives', '০টি ফলস পজিটিভ, ২টি ফলস নেগেটিভ')],
        b('At 0.60 only the 0.90 and 0.65 emails are flagged, both spam. The spam at 0.40 is missed.', '০.৬০-এ শুধু ০.৯০ ও ০.৬৫ স্কোরের ইমেইল চিহ্নিত হয়, দুটোই স্প্যাম। ০.৪০ স্কোরের স্প্যামটি বাদ পড়ে।')),
      ck('c2', b('Which thresholds in the list give the fewest total mistakes?', 'তালিকার কোন থ্রেশহোল্ডগুলোতে মোট ভুল সবচেয়ে কম?'),
        [b('0.30, 0.40 and 0.60 (one mistake each)', '০.৩০, ০.৪০ ও ০.৬০ (প্রতিটিতে একটি ভুল)'), b('0.50 only', 'শুধু ০.৫০'), b('0.90 only', 'শুধু ০.৯০')],
        b('0.30 and 0.40 leave one false positive; 0.60 leaves one false negative. Which is better depends on which mistake costs more.', '০.৩০ ও ০.৪০-এ থাকে একটি ফলস পজিটিভ; ০.৬০-এ থাকে একটি ফলস নেগেটিভ। কোনটা ভালো, তা নির্ভর করে কোন ভুলের ক্ষতি বেশি তার ওপর।')),
      ck('c3', b('At threshold 0.20, how many false negatives are there?', 'থ্রেশহোল্ড ০.২০-এ ফলস নেগেটিভ কয়টি?'),
        [b('0', '০'), b('1', '১'), b('2', '২')],
        b('Every email scores 0.20 or more, so all are flagged and no spam is missed.', 'প্রতিটি ইমেইলের স্কোর ০.২০ বা তার বেশি, তাই সবই চিহ্নিত হয় এবং কোনো স্প্যাম বাদ পড়ে না।')),
    ],
    troubleshooting: [
      NO_OUTPUT,
      { problem: b('Your numbers at 0.50 differ from the expected output.', '০.৫০-এ তোমার সংখ্যা প্রত্যাশিত আউটপুটের সঙ্গে মেলে না।'), fix: b('Check the comparison signs: flagged means score >= threshold; missed means score < threshold.', 'তুলনার চিহ্নগুলো দেখো: চিহ্নিত মানে score >= threshold; বাদ পড়া মানে score < threshold।') },
    ],
    extension: b('Stretch: suppose a false negative costs 5 times as much as a false positive. Print fp + 5 × fn and find the best threshold now.', 'আরেক ধাপ: ধরো একটি ফলস নেগেটিভের ক্ষতি একটি ফলস পজিটিভের ৫ গুণ। fp + 5 × fn প্রিন্ট করে এবার সেরা থ্রেশহোল্ড বের করো।'),
  },

  // ── Machine learning: confusion matrix ───────────────────────────────
  {
    lessonId: 'confusion-matrix',
    title: b('Lab: precision and recall with scikit-learn', 'ল্যাব: scikit-learn দিয়ে প্রিসিশন ও রিকল'),
    goal: b('Use scikit-learn to build a confusion matrix for ten emails and watch precision and recall trade places as the threshold moves.', 'scikit-learn দিয়ে দশটি ইমেইলের কনফিউশন ম্যাট্রিক্স বানাও, আর থ্রেশহোল্ড সরালে প্রিসিশন ও রিকল কীভাবে জায়গা বদলায় তা দেখো।'),
    minutes: 25,
    kind: 'code',
    tools: [
      { ...COLAB, note: b('Recommended: scikit-learn is already installed in Colab.', 'সুপারিশ: কোল্যাবে scikit-learn আগে থেকেই ইনস্টল করা থাকে।') },
      { ...PYTHON('confusion.py'), note: b('First install the library: pip install scikit-learn. Then run: python confusion.py', 'আগে লাইব্রেরি ইনস্টল করো: pip install scikit-learn। তারপর চালাও: python confusion.py') },
    ],
    setup: COLAB_SETUP,
    starter: {
      language: 'python', filename: 'confusion.py',
      note: b('1 means spam, 0 means not spam. y_score is the filter’s score for each email.', '১ মানে স্প্যাম, ০ মানে স্প্যাম নয়। y_score হলো প্রতিটি ইমেইলে ফিল্টারের দেওয়া স্কোর।'),
      code: String.raw`# Lab: confusion matrix, precision and recall with scikit-learn
from sklearn.metrics import confusion_matrix, precision_score, recall_score, accuracy_score

# 1 = spam, 0 = not spam. The filter gave each email a score.
y_true  = [1,    1,    1,    0,    1,    0,    0,    1,    0,    0]
y_score = [0.95, 0.90, 0.85, 0.70, 0.60, 0.55, 0.40, 0.30, 0.25, 0.10]

def evaluate(threshold):
    y_pred = [1 if s >= threshold else 0 for s in y_score]
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    print(f"threshold {threshold:.2f}: TP={tp} FP={fp} FN={fn} TN={tn}"
          f"  precision={precision_score(y_true, y_pred):.2f}"
          f"  recall={recall_score(y_true, y_pred):.2f}"
          f"  accuracy={accuracy_score(y_true, y_pred):.2f}")

evaluate(0.50)
# TODO 1: also call evaluate(0.80) and evaluate(0.20).
`,
    },
    tasks: [
      b('Run the starter code and check the line for threshold 0.50.', 'স্টার্টার কোড চালাও এবং থ্রেশহোল্ড ০.৫০-এর লাইনটি মিলিয়ে দেখো।'),
      b('Work out TP, FP, FN and TN at 0.50 by hand from the two lists and confirm they match.', 'দুটি তালিকা থেকে হাতে হিসাব করে ০.৫০-এ TP, FP, FN ও TN বের করো এবং মিলছে কি না নিশ্চিত হও।'),
      b('TODO 1: add evaluate(0.80) and evaluate(0.20) and run again.', 'TODO 1: evaluate(0.80) ও evaluate(0.20) যোগ করে আবার চালাও।'),
      b('Write one sentence: what happened to precision and to recall as the threshold went up?', 'এক বাক্যে লেখো: থ্রেশহোল্ড বাড়ার সঙ্গে প্রিসিশন ও রিকলের কী হলো?'),
    ],
    expected: {
      caption: b('Output of the starter code, before your changes', 'তোমার পরিবর্তনের আগে স্টার্টার কোডের আউটপুট'),
      output: 'threshold 0.50: TP=4 FP=2 FN=1 TN=3  precision=0.67  recall=0.80  accuracy=0.70',
    },
    checks: [
      ck('c1', b('At threshold 0.80, what recall does the program print?', 'থ্রেশহোল্ড ০.৮০-এ প্রোগ্রাম কত রিকল প্রিন্ট করে?'),
        [b('0.60', '০.৬০'), b('1.00', '১.০০'), b('0.80', '০.৮০')],
        b('Three of the five spam emails score 0.80 or more: recall = 3 ÷ 5 = 0.60.', 'পাঁচটি স্প্যামের তিনটির স্কোর ০.৮০ বা তার বেশি: রিকল = ৩ ÷ ৫ = ০.৬০।')),
      ck('c2', b('At threshold 0.20, what precision does it print?', 'থ্রেশহোল্ড ০.২০-এ কত প্রিসিশন প্রিন্ট হয়?'),
        [b('0.56', '০.৫৬'), b('1.00', '১.০০'), b('0.67', '০.৬৭')],
        b('Nine emails are flagged and five of them are spam: precision = 5 ÷ 9 ≈ 0.56.', 'নয়টি ইমেইল চিহ্নিত হয়, তার পাঁচটি স্প্যাম: প্রিসিশন = ৫ ÷ ৯ ≈ ০.৫৬।')),
      ck('c3', b('Which of the three thresholds gives no false positives?', 'তিনটি থ্রেশহোল্ডের কোনটিতে কোনো ফলস পজিটিভ নেই?'),
        [b('0.80', '০.৮০'), b('0.50', '০.৫০'), b('0.20', '০.২০')],
        b('At 0.80 only the three highest-scoring emails are flagged, and all three are spam (FP = 0, precision = 1.00).', '০.৮০-এ শুধু সবচেয়ে বেশি স্কোরের তিনটি ইমেইল চিহ্নিত হয়, তিনটিই স্প্যাম (FP = ০, প্রিসিশন = ১.০০)।')),
    ],
    troubleshooting: [
      { problem: b('“ModuleNotFoundError: No module named sklearn”.', '“ModuleNotFoundError: No module named sklearn” দেখায়।'), fix: b('On your own computer run pip install scikit-learn first. In Colab it is already installed, so use Colab if the install fails.', 'নিজের কম্পিউটারে আগে pip install scikit-learn চালাও। কোল্যাবে এটি আগে থেকেই আছে, তাই ইনস্টল না হলে কোল্যাব ব্যবহার করো।') },
      NO_OUTPUT,
    ],
    extension: b('Stretch: import f1_score from sklearn.metrics and print it too. Which threshold has the best F1?', 'আরেক ধাপ: sklearn.metrics থেকে f1_score ইমপোর্ট করে সেটাও প্রিন্ট করো। কোন থ্রেশহোল্ডে F1 সবচেয়ে ভালো?'),
  },

  // ── Business: margin checker ─────────────────────────────────────────
  {
    lessonId: 'margin-basics',
    title: b('Lab: build a discount checker in a spreadsheet', 'ল্যাব: স্প্রেডশিটে ছাড় যাচাইয়ের টুল বানাও'),
    goal: b('Build a small sheet that takes cost, list price and discount, then calculates margin and markup and says whether the discount meets the shop’s rule.', 'ছোট একটি শিট বানাও, যা খরচ, তালিকা মূল্য ও ছাড় নিয়ে মার্জিন ও মার্কআপ হিসাব করে এবং বলে দেয় ছাড়টি দোকানের নিয়ম মানে কি না।'),
    minutes: 20,
    kind: 'spreadsheet',
    tools: [SHEETS],
    setup: [
      b('Open Google Sheets and create a blank spreadsheet.', 'গুগল শিটস খুলে একটি ফাঁকা স্প্রেডশিট তৈরি করো।'),
      b('Type the labels from the starter table into column A, rows 1 to 9.', 'স্টার্টার টেবিলের লেবেলগুলো A কলামে, ১ থেকে ৯ নম্বর সারিতে লেখো।'),
      b('Type the four input numbers into B1 to B4.', 'চারটি ইনপুট সংখ্যা B1 থেকে B4-এ লেখো।'),
      b('Type the five formulas into B5 to B9 exactly as shown, each starting with =.', 'পাঁচটি সূত্র B5 থেকে B9-এ হুবহু লেখো; প্রতিটি শুরু হবে = দিয়ে।'),
      b('Compare B5 to B9 with the expected result further down this page.', 'B5 থেকে B9-এর মান এই পাতার নিচের প্রত্যাশিত ফলের সঙ্গে মিলিয়ে নাও।'),
    ],
    starter: {
      language: 'formulas', filename: 'discount-checker',
      note: b('Column A holds labels, column B holds numbers and formulas.', 'A কলামে লেবেল, B কলামে সংখ্যা ও সূত্র।'),
      code: String.raw`A1  Cost                   B1  800
A2  List price             B2  1000
A3  Discount %             B3  10
A4  Minimum margin %       B4  15
A5  Price after discount   B5  =B2*(1-B3/100)
A6  Profit                 B6  =B5-B1
A7  Margin %               B7  =B6/B5*100
A8  Markup %               B8  =B6/B1*100
A9  Decision               B9  =IF(B7>=B4,"Accept","Reject")
`,
    },
    tasks: [
      b('Build the sheet and confirm it shows the lesson’s worked example.', 'শিটটি বানাও এবং নিশ্চিত হও যে এটি পাঠের সমাধানসহ উদাহরণটিই দেখাচ্ছে।'),
      b('Change the discount in B3 to 15, then to 5. Watch the margin and the decision.', 'B3-তে ছাড় বদলে ১৫ করো, তারপর ৫। মার্জিন ও সিদ্ধান্ত খেয়াল করো।'),
      b('Find the largest whole-number discount that is still accepted.', 'সবচেয়ে বড় কোন পূর্ণসংখ্যার ছাড় এখনো গ্রহণযোগ্য, তা খুঁজে বের করো।'),
      b('An AI coworker says “margin is 20%, accept a 10% discount”. Use your sheet to find which number it got wrong.', 'এআই সহকর্মী বলছে “মার্জিন ২০%, ১০% ছাড় দিয়ে দাও”। তোমার শিট দিয়ে বের করো সে কোন সংখ্যাটি ভুল ধরেছে।'),
    ],
    expected: {
      caption: b('Values with the starter inputs', 'স্টার্টার ইনপুটে যে মান আসবে'),
      output: 'B5  900\nB6  100\nB7  11.11 (rounded)\nB8  12.5\nB9  Reject',
    },
    checks: [
      ck('c1', b('Change the discount to 15. What margin does the sheet show?', 'ছাড় বদলে ১৫ করো। শিটে মার্জিন কত দেখায়?'),
        [b('About 5.88%', 'প্রায় ৫.৮৮%'), b('15%', '১৫%'), b('About 11.11%', 'প্রায় ১১.১১%')],
        b('Price 850, profit 50, margin = 50 ÷ 850 ≈ 5.88%.', 'দাম ৮৫০, লাভ ৫০, মার্জিন = ৫০ ÷ ৮৫০ ≈ ৫.৮৮%।')),
      ck('c2', b('What is the largest whole-number discount that the sheet still accepts?', 'সবচেয়ে বড় কোন পূর্ণসংখ্যার ছাড় শিট এখনো গ্রহণ করে?'),
        [b('5%', '৫%'), b('10%', '১০%'), b('6%', '৬%')],
        b('At 5% the margin is 150 ÷ 950 ≈ 15.79%. At 6% it is 140 ÷ 940 ≈ 14.89%, below the 15% rule.', '৫%-এ মার্জিন ১৫০ ÷ ৯৫০ ≈ ১৫.৭৯%। ৬%-এ ১৪০ ÷ ৯৪০ ≈ ১৪.৮৯%, যা ১৫% নিয়মের নিচে।')),
      ck('c3', b('Set the discount to 0. Which is larger, markup or margin?', 'ছাড় ০ করো। কোনটি বড় — মার্কআপ না মার্জিন?'),
        [b('Markup (25%) is larger than margin (20%)', 'মার্কআপ (২৫%) মার্জিনের (২০%) চেয়ে বড়'), b('Margin (25%) is larger than markup (20%)', 'মার্জিন (২৫%) মার্কআপের (২০%) চেয়ে বড়'), b('They are equal', 'দুটো সমান')],
        b('Profit is 200. Markup = 200 ÷ 800 = 25%; margin = 200 ÷ 1000 = 20%. This 20% is the number the AI coworker quoted, before the discount.', 'লাভ ২০০। মার্কআপ = ২০০ ÷ ৮০০ = ২৫%; মার্জিন = ২০০ ÷ ১০০০ = ২০%। এআই সহকর্মী এই ২০%-ই বলেছিল — ছাড়ের আগের হিসাব।')),
    ],
    troubleshooting: [
      { problem: b('A cell shows the formula as text instead of a number.', 'সেলে সংখ্যার বদলে সূত্রটিই লেখা হিসেবে দেখায়।'), fix: b('The cell must start with =, with no space or apostrophe before it.', 'সেলটি = দিয়ে শুরু হতে হবে; তার আগে কোনো স্পেস বা অ্যাপস্ট্রফি থাকবে না।') },
      { problem: b('B9 shows an error such as #ERROR! or #NAME?.', 'B9-এ #ERROR! বা #NAME?-এর মতো এরর দেখায়।'), fix: b('Use straight double quotes around Accept and Reject. If your sheet uses a comma as the decimal mark, separate the IF parts with semicolons.', 'Accept ও Reject-এর দুই পাশে সোজা ডাবল কোট দাও। তোমার শিটে দশমিক চিহ্ন হিসেবে কমা ব্যবহার হলে IF-এর অংশগুলো সেমিকোলন দিয়ে আলাদা করো।') },
    ],
    extension: b('Stretch: add a row “Lowest allowed price” with the formula =B1/(1-B4/100). Why does it give about 941.18?', 'আরেক ধাপ: “সর্বনিম্ন অনুমোদিত দাম” নামে একটি সারি যোগ করো, সূত্র =B1/(1-B4/100)। এটি কেন প্রায় ৯৪১.১৮ দেয়?'),
  },

  // ── Operating systems ────────────────────────────────────────────────
  {
    lessonId: 'cpu-scheduling',
    title: b('Lab: simulate FCFS and SJF', 'ল্যাব: FCFS ও SJF সিমুলেট করো'),
    goal: b('Run a small scheduler simulation, add SJF yourself with one line, and measure how much the average waiting time drops.', 'ছোট একটি শিডিউলার সিমুলেশন চালাও, এক লাইনে নিজে SJF যোগ করো, আর মেপে দেখো গড় ওয়েটিং টাইম কতটা কমে।'),
    minutes: 20,
    kind: 'code',
    tools: [COLAB, ONLINEGDB_PY, PYTHON('scheduling.py')],
    setup: COLAB_SETUP,
    starter: {
      language: 'python', filename: 'scheduling.py',
      note: b('All three processes arrive at time 0, as in the lesson’s worked example.', 'পাঠের সমাধানসহ উদাহরণের মতোই তিনটি প্রসেস ০ সময়ে আসে।'),
      code: String.raw`# Lab: FCFS vs SJF waiting time
# Every process arrives at time 0. "burst" is the CPU time it needs.
processes = [("P1", 10), ("P2", 4), ("P3", 2)]

def waiting_times(order):
    """Run the processes in the given order. Return {name: waiting time}."""
    clock = 0
    waits = {}
    for name, burst in order:
        waits[name] = clock      # it waited until the CPU was free
        clock += burst           # then it ran for its whole burst
    return waits

def report(title, order):
    waits = waiting_times(order)
    average = sum(waits.values()) / len(waits)
    print(title)
    for name, burst in order:
        print(f"  {name}  burst={burst:>2}  waited={waits[name]:>2}")
    print(f"  average waiting time = {average:.2f}")

report("FCFS (arrival order)", processes)

# TODO 1: SJF runs the shortest burst first.
# Change the next line so that sjf_order is sorted by burst time.
sjf_order = processes
report("SJF (shortest job first)", sjf_order)
`,
    },
    tasks: [
      b('Run the starter code. Both reports are the same because SJF is not written yet.', 'স্টার্টার কোড চালাও। দুটি রিপোর্টই একই, কারণ SJF এখনো লেখা হয়নি।'),
      b('TODO 1: make sjf_order the processes sorted by burst time. Hint: sorted(processes, key=lambda p: p[1]).', 'TODO 1: sjf_order-কে বার্স্ট টাইম অনুযায়ী সাজানো প্রসেস বানাও। ইঙ্গিত: sorted(processes, key=lambda p: p[1])।'),
      b('Add a fourth process ("P4", 1) at the end of the list and run again.', 'তালিকার শেষে চতুর্থ প্রসেস ("P4", 1) যোগ করে আবার চালাও।'),
      b('Write down which process waits longest under each policy, and why.', 'লিখে রাখো: প্রতিটি নীতিতে কোন প্রসেস সবচেয়ে বেশি অপেক্ষা করে, এবং কেন।'),
    ],
    expected: {
      caption: b('Output of the starter code, before your changes', 'তোমার পরিবর্তনের আগে স্টার্টার কোডের আউটপুট'),
      output: 'FCFS (arrival order)\n  P1  burst=10  waited= 0\n  P2  burst= 4  waited=10\n  P3  burst= 2  waited=14\n  average waiting time = 8.00\nSJF (shortest job first)\n  P1  burst=10  waited= 0\n  P2  burst= 4  waited=10\n  P3  burst= 2  waited=14\n  average waiting time = 8.00',
    },
    checks: [
      ck('c1', b('After you finish TODO 1, what average waiting time does SJF print?', 'TODO 1 শেষ করার পর SJF কত গড় ওয়েটিং টাইম প্রিন্ট করে?'),
        [b('2.67', '২.৬৭'), b('8.00', '৮.০০'), b('5.33', '৫.৩৩')],
        b('SJF runs P3, P2, P1 with waits 0, 2 and 6: 8 ÷ 3 ≈ 2.67.', 'SJF চালায় P3, P2, P1; অপেক্ষা ০, ২ ও ৬: ৮ ÷ ৩ ≈ ২.৬৭।')),
      ck('c2', b('With P4 (burst 1) added at the end, what is the FCFS average?', 'শেষে P4 (বার্স্ট ১) যোগ করলে FCFS-এর গড় কত?'),
        [b('10.00', '১০.০০'), b('8.00', '৮.০০'), b('2.75', '২.৭৫')],
        b('The waits are 0, 10, 14 and 16: 40 ÷ 4 = 10. The shortest job waits longest.', 'অপেক্ষা ০, ১০, ১৪ ও ১৬: ৪০ ÷ ৪ = ১০। সবচেয়ে ছোট কাজটিই সবচেয়ে বেশি অপেক্ষা করে।')),
      ck('c3', b('With P4 added, which process waits longest under SJF?', 'P4 যোগ করার পর SJF-এ কোন প্রসেস সবচেয়ে বেশি অপেক্ষা করে?'),
        [b('P1, the longest job', 'P1, সবচেয়ে লম্বা কাজ'), b('P4, the shortest job', 'P4, সবচেয়ে ছোট কাজ'), b('They all wait the same', 'সবাই সমান অপেক্ষা করে')],
        b('P1 runs last and waits 7. If short jobs kept arriving it could wait forever: that is starvation.', 'P1 সবার শেষে চলে এবং ৭ একক অপেক্ষা করে। ছোট কাজ আসতেই থাকলে এটি অনন্তকাল অপেক্ষা করতে পারত: এটাই স্টারভেশন।')),
    ],
    troubleshooting: [
      NO_OUTPUT,
      { problem: b('SJF still prints the same order as FCFS.', 'SJF এখনো FCFS-এর মতো একই ক্রম প্রিন্ট করে।'), fix: b('sorted() returns a new list; it does not change processes. Assign the result: sjf_order = sorted(processes, key=lambda p: p[1]).', 'sorted() নতুন একটি তালিকা ফেরত দেয়; processes-কে বদলায় না। ফলটি অ্যাসাইন করো: sjf_order = sorted(processes, key=lambda p: p[1])।') },
    ],
    extension: b('Stretch: also print the average turnaround time (waiting time + burst) for both policies.', 'আরেক ধাপ: দুটি নীতির জন্যই গড় টার্নঅ্যারাউন্ড টাইম (ওয়েটিং টাইম + বার্স্ট) প্রিন্ট করো।'),
  },

  // ── Data structures ──────────────────────────────────────────────────
  {
    lessonId: 'stack-queue',
    title: b('Lab: an array stack in C, then your own queue', 'ল্যাব: সি-তে অ্যারে স্ট্যাক, তারপর নিজের কিউ'),
    goal: b('Compile and run an array stack in C, protect it against underflow, then write a queue with front and rear yourself.', 'সি-তে একটি অ্যারে স্ট্যাক কম্পাইল করে চালাও, আন্ডারফ্লো থেকে সুরক্ষিত করো, তারপর front ও rear দিয়ে নিজে একটি কিউ লেখো।'),
    minutes: 30,
    kind: 'code',
    tools: [ONLINEGDB_C, GCC],
    setup: [
      b('Open OnlineGDB (or Code::Blocks on your computer).', 'OnlineGDB খোলো (অথবা তোমার কম্পিউটারে Code::Blocks)।'),
      b('In OnlineGDB, choose “C” in the Language menu at the top right.', 'OnlineGDB-তে ওপরের ডান দিকের Language মেনু থেকে “C” বেছে নাও।'),
      b('Delete the sample program and paste the starter code.', 'নমুনা প্রোগ্রামটি মুছে স্টার্টার কোড পেস্ট করো।'),
      b('Press Run. In Code::Blocks press Build and run (F9).', 'Run চাপো। Code::Blocks-এ Build and run (F9) চাপো।'),
      b('Compare the output with the expected output further down this page.', 'আউটপুট এই পাতার নিচের প্রত্যাশিত আউটপুটের সঙ্গে মিলিয়ে নাও।'),
    ],
    starter: {
      language: 'c', filename: 'stack.c',
      note: b('top = -1 means the stack is empty. MAX is the size of the array.', 'top = -1 মানে স্ট্যাক খালি। MAX হলো অ্যারের আকার।'),
      code: String.raw`#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;                 /* -1 means the stack is empty */

void push(int value) {
    if (top == MAX - 1) { printf("Overflow: cannot push %d\n", value); return; }
    stack[++top] = value;
    printf("push %d\n", value);
}

int pop(void) {
    /* TODO 1: if the stack is empty, print "Underflow" and return -1 */
    int value = stack[top--];
    printf("pop  -> %d\n", value);
    return value;
}

void show(void) {
    printf("stack (bottom to top):");
    for (int i = 0; i <= top; i++) printf(" %d", stack[i]);
    printf("\n");
}

int main(void) {
    push(10); push(20); push(30);
    show();
    pop();
    push(40);
    show();
    pop(); pop();
    show();
    return 0;
}
`,
    },
    tasks: [
      b('Run the starter program. Before you look, predict what the last two pops print.', 'স্টার্টার প্রোগ্রাম চালাও। দেখার আগে অনুমান করো শেষ দুটি pop কী প্রিন্ট করবে।'),
      b('TODO 1: add the underflow check to pop(). Test it by calling pop() two more times at the end of main.', 'TODO 1: pop()-এ আন্ডারফ্লো যাচাই যোগ করো। main-এর শেষে আরও দুবার pop() ডেকে পরীক্ষা করো।'),
      b('Push six values in a row and confirm the sixth prints “Overflow”.', 'পরপর ছয়টি মান push করো এবং নিশ্চিত হও ষষ্ঠটিতে “Overflow” প্রিন্ট হয়।'),
      b('Write enqueue(int) and dequeue(void) with an array, front and rear. Enqueue 10, 20, 30, then dequeue once.', 'একটি অ্যারে, front ও rear দিয়ে enqueue(int) ও dequeue(void) লেখো। 10, 20, 30 enqueue করে একবার dequeue করো।'),
    ],
    expected: {
      caption: b('Output of the starter program, before your changes', 'তোমার পরিবর্তনের আগে স্টার্টার প্রোগ্রামের আউটপুট'),
      output: 'push 10\npush 20\npush 30\nstack (bottom to top): 10 20 30\npop  -> 30\npush 40\nstack (bottom to top): 10 20 40\npop  -> 40\npop  -> 20\nstack (bottom to top): 10',
    },
    checks: [
      ck('c1', b('In the starter program, what do the last two pops print?', 'স্টার্টার প্রোগ্রামে শেষ দুটি pop কী প্রিন্ট করে?'),
        [b('40, then 20', '৪০, তারপর ২০'), b('30, then 20', '৩০, তারপর ২০'), b('10, then 20', '১০, তারপর ২০')],
        b('30 was already popped. 40 was pushed last, so it comes out first, then 20.', '৩০ আগেই pop হয়ে গেছে। ৪০ শেষে push হয়েছে, তাই সে আগে বের হয়, তারপর ২০।')),
      ck('c2', b('Which value of top means the stack is empty?', 'top-এর কোন মান বোঝায় স্ট্যাক খালি?'),
        [b('-1', '-১'), b('0', '০'), b('MAX', 'MAX')],
        b('top is the index of the last item. Index 0 is a real slot, so empty has to be -1.', 'top হলো শেষ আইটেমের ইনডেক্স। ইনডেক্স ০ একটি আসল ঘর, তাই খালি বোঝাতে -১ লাগে।')),
      ck('c3', b('Your queue: enqueue 10, 20, 30, then dequeue once. What comes out?', 'তোমার কিউ: 10, 20, 30 enqueue করে একবার dequeue। কী বের হয়?'),
        [b('10', '১০'), b('30', '৩০'), b('20', '২০')],
        b('A queue is FIFO: the first value in, 10, is the first out.', 'কিউ FIFO: প্রথমে ঢোকা মান ১০-ই আগে বের হয়।')),
    ],
    troubleshooting: [
      { problem: b('Compile error: “expected ‘;’ before…”.', 'কম্পাইল এরর: “expected ‘;’ before…”।'), fix: b('A semicolon is missing on the line above the one named in the error. Every statement in C ends with ;.', 'এররে যে লাইনের নাম আছে তার আগের লাইনে সেমিকোলন বাদ পড়েছে। সি-তে প্রতিটি স্টেটমেন্ট ; দিয়ে শেষ হয়।') },
      { problem: b('After too many pops you see a strange number or a crash.', 'বেশি pop করার পর অদ্ভুত সংখ্যা দেখায় বা প্রোগ্রাম ক্র্যাশ করে।'), fix: b('That is underflow reading outside the array. Finish TODO 1: check top == -1 before using stack[top].', 'এটা আন্ডারফ্লো — অ্যারের বাইরে পড়া হচ্ছে। TODO 1 শেষ করো: stack[top] ব্যবহারের আগে top == -1 যাচাই করো।') },
    ],
    extension: b('Stretch: make the queue circular, so that rear wraps to index 0 with (rear + 1) % MAX and freed slots are reused.', 'আরেক ধাপ: কিউটিকে সার্কুলার করো, যাতে (rear + 1) % MAX দিয়ে rear আবার ইনডেক্স ০-তে ফেরে এবং খালি হওয়া ঘর আবার ব্যবহার হয়।'),
  },

  // ── Algorithms ───────────────────────────────────────────────────────
  {
    lessonId: 'euclid-gcd',
    title: b('Lab: race Euclid against brute force', 'ল্যাব: ইউক্লিড বনাম একে একে পরীক্ষা'),
    goal: b('Count the steps of two GCD methods on the same numbers and see the gap grow as the numbers get bigger.', 'একই সংখ্যার ওপর গসাগু বের করার দুটি পদ্ধতির ধাপ গোনো, আর সংখ্যা বড় হলে পার্থক্য কীভাবে বাড়ে তা দেখো।'),
    minutes: 20,
    kind: 'code',
    tools: [COLAB, ONLINEGDB_PY, PYTHON('gcd.py')],
    setup: COLAB_SETUP,
    starter: {
      language: 'python', filename: 'gcd.py',
      note: b('gcd_slow tries every divisor; gcd_euclid uses gcd(a, b) = gcd(b, a mod b).', 'gcd_slow প্রতিটি গুণনীয়ক পরীক্ষা করে; gcd_euclid ব্যবহার করে gcd(a, b) = gcd(b, a mod b)।'),
      code: String.raw`# Lab: Euclid's algorithm vs trying every divisor

def gcd_slow(a, b):
    """Try every number from 1 up to the smaller one. Count the checks."""
    best, checks = 1, 0
    for d in range(1, min(a, b) + 1):
        checks += 1
        if a % d == 0 and b % d == 0:
            best = d
    return best, checks

def gcd_euclid(a, b):
    """gcd(a, b) = gcd(b, a mod b). Count the divisions."""
    steps = 0
    while b != 0:
        a, b = b, a % b
        steps += 1
    return a, steps

pairs = [(48, 18), (1071, 462), (123456, 7890)]
# TODO 1: add the pair (832040, 514229) to the list. They are neighbours
#         in the Fibonacci sequence: the hardest kind of input for Euclid.

for a, b in pairs:
    g_slow, checks = gcd_slow(a, b)
    g_fast, steps = gcd_euclid(a, b)
    print(f"gcd({a}, {b}) = {g_fast}  slow: {checks} checks  Euclid: {steps} divisions  same: {g_slow == g_fast}")
`,
    },
    tasks: [
      b('Run the starter code and check the three lines against the expected output.', 'স্টার্টার কোড চালাও এবং তিনটি লাইন প্রত্যাশিত আউটপুটের সঙ্গে মিলিয়ে দেখো।'),
      b('Trace gcd(1071, 462) by hand: write each remainder until you reach 0.', 'gcd(1071, 462) হাতে হিসাব করো: ০ না পাওয়া পর্যন্ত প্রতিটি ভাগশেষ লেখো।'),
      b('TODO 1: add the Fibonacci pair (832040, 514229) and run again.', 'TODO 1: ফিবোনাচ্চি জোড়া (832040, 514229) যোগ করে আবার চালাও।'),
      b('Compare: how many checks did the slow method need for that pair, and how many divisions did Euclid need?', 'তুলনা করো: ওই জোড়ার জন্য ধীর পদ্ধতিতে কয়টি যাচাই লাগল, আর ইউক্লিডে কয়টি ভাগ?'),
    ],
    expected: {
      caption: b('Output of the starter code, before your changes', 'তোমার পরিবর্তনের আগে স্টার্টার কোডের আউটপুট'),
      output: 'gcd(48, 18) = 6  slow: 18 checks  Euclid: 3 divisions  same: True\ngcd(1071, 462) = 21  slow: 462 checks  Euclid: 3 divisions  same: True\ngcd(123456, 7890) = 6  slow: 7890 checks  Euclid: 7 divisions  same: True',
    },
    checks: [
      ck('c1', b('What does the program print for gcd(1071, 462)?', 'gcd(1071, 462)-এর জন্য প্রোগ্রাম কী প্রিন্ট করে?'),
        [b('21', '২১'), b('3', '৩'), b('462', '৪৬২')],
        b('1071 mod 462 = 147, 462 mod 147 = 21, 147 mod 21 = 0, so the GCD is 21.', '1071 mod 462 = 147, 462 mod 147 = 21, 147 mod 21 = 0, তাই গসাগু ২১।')),
      ck('c2', b('For gcd(123456, 7890), how do the two methods compare?', 'gcd(123456, 7890)-এর জন্য দুটি পদ্ধতির তুলনা কেমন?'),
        [b('7890 checks against 7 divisions', '৭৮৯০টি যাচাই বনাম ৭টি ভাগ'), b('7 checks against 7890 divisions', '৭টি যাচাই বনাম ৭৮৯০টি ভাগ'), b('Both need 6 steps', 'দুটোতেই ৬ ধাপ লাগে')],
        b('The slow method checks every number up to 7890. Euclid needs 7 divisions.', 'ধীর পদ্ধতি ৭৮৯০ পর্যন্ত প্রতিটি সংখ্যা পরীক্ষা করে। ইউক্লিডে লাগে ৭টি ভাগ।')),
      ck('c3', b('After TODO 1: how many divisions does Euclid need for (832040, 514229)?', 'TODO 1-এর পর: (832040, 514229)-এর জন্য ইউক্লিডে কয়টি ভাগ লাগে?'),
        [b('28', '২৮'), b('3', '৩'), b('514229', '৫১৪২২৯')],
        b('28 divisions, against 514229 checks for the slow method. Neighbouring Fibonacci numbers are Euclid’s worst case, and it is still tiny.', '২৮টি ভাগ, যেখানে ধীর পদ্ধতিতে লাগে ৫১৪২২৯টি যাচাই। পাশাপাশি ফিবোনাচ্চি সংখ্যা ইউক্লিডের সবচেয়ে খারাপ ক্ষেত্র, তবু ধাপ খুবই কম।')),
    ],
    troubleshooting: [
      NO_OUTPUT,
      { problem: b('After adding the big pair, the program seems to hang for a moment.', 'বড় জোড়াটি যোগ করার পর প্রোগ্রাম কিছুক্ষণ আটকে আছে মনে হয়।'), fix: b('That is gcd_slow doing half a million checks. Wait a second or two; this delay is the point of the lab.', 'gcd_slow তখন পাঁচ লাখের বেশি যাচাই করছে। এক-দুই সেকেন্ড অপেক্ষা করো; এই দেরিটাই ল্যাবের মূল শিক্ষা।') },
    ],
    extension: b('Stretch: write a recursive version, def gcd(a, b): return a if b == 0 else gcd(b, a % b), and check it gives the same answers.', 'আরেক ধাপ: একটি রিকার্সিভ সংস্করণ লেখো, def gcd(a, b): return a if b == 0 else gcd(b, a % b), এবং দেখো একই উত্তর দেয় কি না।'),
  },

  // ── Discrete mathematics ─────────────────────────────────────────────
  {
    lessonId: 'propositional-logic',
    title: b('Lab: a truth-table machine', 'ল্যাব: ট্রুথ টেবিল তৈরির যন্ত্র'),
    goal: b('Use Python to print truth tables and to test whether two formulas are logically equivalent.', 'পাইথন দিয়ে ট্রুথ টেবিল প্রিন্ট করো এবং দুটি সূত্র লজিক্যালি সমতুল্য কি না পরীক্ষা করো।'),
    minutes: 25,
    kind: 'code',
    tools: [COLAB, ONLINEGDB_PY, PYTHON('truth_table.py')],
    setup: COLAB_SETUP,
    starter: {
      language: 'python', filename: 'truth_table.py',
      note: b('In Python, write ∧ as “and”, ∨ as “or” and ¬ as “not”.', 'পাইথনে ∧-কে লেখো “and”, ∨-কে “or” আর ¬-কে “not”।'),
      code: String.raw`# Lab: build truth tables and test equivalences
from itertools import product

def implies(p, q):
    """p -> q is false only when p is true and q is false."""
    return not (p and not q)

def table(names, formula):
    """Print the truth table of formula for the variables in names."""
    print(" ".join(names), "| result")
    for values in product([True, False], repeat=len(names)):
        row = " ".join("T" if v else "F" for v in values)
        print(row, "|", "T" if formula(*values) else "F")

def equivalent(n, f, g):
    """True if f and g agree on every row (n variables)."""
    return all(f(*v) == g(*v) for v in product([True, False], repeat=n))

print("p -> q")
table(["p", "q"], implies)
print()
print("p -> q  same as  (not p) or q ?", equivalent(2, implies, lambda p, q: (not p) or q))
print("p -> q  same as  q -> p ?      ", equivalent(2, implies, lambda p, q: implies(q, p)))

# TODO 1: De Morgan. Is  not (p and q)  the same as  (not p) or (not q) ?
# TODO 2: Print the table of  (p and q) -> p . Is it true on every row?
# TODO 3: Print a table with three variables p, q, r. How many rows does it have?
`,
    },
    tasks: [
      b('Run the starter code and compare the table with the lesson’s worked example.', 'স্টার্টার কোড চালাও এবং টেবিলটি পাঠের সমাধানসহ উদাহরণের সঙ্গে মিলিয়ে দেখো।'),
      b('TODO 1: use equivalent() to test De Morgan’s law.', 'TODO 1: equivalent() দিয়ে ডি মরগ্যানের সূত্র পরীক্ষা করো।'),
      b('TODO 2: print the table of (p and q) → p with table(["p", "q"], lambda p, q: implies(p and q, p)).', 'TODO 2: table(["p", "q"], lambda p, q: implies(p and q, p)) দিয়ে (p and q) → p-এর টেবিল প্রিন্ট করো।'),
      b('TODO 3: print any formula with three variables, for example (p and q) or r, and count the rows.', 'TODO 3: তিন চলকের যেকোনো সূত্র, যেমন (p and q) or r, প্রিন্ট করো এবং সারি গোনো।'),
    ],
    expected: {
      caption: b('Output of the starter code, before your changes', 'তোমার পরিবর্তনের আগে স্টার্টার কোডের আউটপুট'),
      output: 'p -> q\np q | result\nT T | T\nT F | F\nF T | T\nF F | T\n\np -> q  same as  (not p) or q ? True\np -> q  same as  q -> p ?       False',
    },
    checks: [
      ck('c1', b('Is p → q logically equivalent to q → p?', 'p → q কি q → p-এর লজিক্যালি সমতুল্য?'),
        [b('No, they differ on some rows', 'না, কিছু সারিতে আলাদা'), b('Yes, on every row', 'হ্যাঁ, প্রতিটি সারিতে'), b('Only when p is true', 'শুধু p সত্য হলে')],
        b('With p true and q false, p → q is false but q → p is true. A statement and its converse are different.', 'p সত্য ও q মিথ্যা হলে p → q মিথ্যা, কিন্তু q → p সত্য। একটি বাক্য আর তার কনভার্স আলাদা জিনিস।')),
      ck('c2', b('TODO 1: is not (p and q) equivalent to (not p) or (not q)?', 'TODO 1: not (p and q) কি (not p) or (not q)-এর সমতুল্য?'),
        [b('Yes — this is De Morgan’s law', 'হ্যাঁ — এটাই ডি মরগ্যানের সূত্র'), b('No', 'না'), b('Only on two rows', 'শুধু দুটি সারিতে')],
        b('The two columns agree on all four rows.', 'চারটি সারিতেই দুটি কলাম মেলে।')),
      ck('c3', b('TODO 3: how many rows does a truth table with three variables have?', 'TODO 3: তিন চলকের ট্রুথ টেবিলে কয়টি সারি থাকে?'),
        [b('8', '৮'), b('6', '৬'), b('9', '৯')],
        b('Each variable doubles the rows: 2 × 2 × 2 = 8.', 'প্রতিটি চলক সারির সংখ্যা দ্বিগুণ করে: ২ × ২ × ২ = ৮।')),
    ],
    troubleshooting: [
      NO_OUTPUT,
      { problem: b('“TypeError: <lambda>() takes 2 positional arguments but 3 were given”.', '“TypeError: <lambda>() takes 2 positional arguments but 3 were given” দেখায়।'), fix: b('The number of names must match the lambda: three names need lambda p, q, r: …', 'নামের সংখ্যা lambda-র সঙ্গে মিলতে হবে: তিনটি নামের জন্য লাগবে lambda p, q, r: …') },
    ],
    extension: b('Stretch: test whether p → q is equivalent to its contrapositive (not q) → (not p).', 'আরেক ধাপ: পরীক্ষা করো p → q তার কন্ট্রাপজিটিভ (not q) → (not p)-এর সমতুল্য কি না।'),
  },

  // ── Digital logic ────────────────────────────────────────────────────
  {
    lessonId: 'logic-gates',
    title: b('Lab: build XOR from basic gates', 'ল্যাব: মৌলিক গেট দিয়ে XOR বানাও'),
    goal: b('Build A·B′ + A′·B in a logic simulator, fill in its truth table, check it against a real XOR gate, then rebuild it with NAND gates only.', 'লজিক সিমুলেটরে A·B′ + A′·B বানাও, তার ট্রুথ টেবিল পূরণ করো, আসল XOR গেটের সঙ্গে মিলিয়ে দেখো, তারপর শুধু NAND গেট দিয়ে আবার বানাও।'),
    minutes: 30,
    kind: 'simulator',
    tools: [
      CIRCUITVERSE,
      { name: 'Logisim Evolution', url: 'https://github.com/logisim-evolution/logisim-evolution', kind: 'install', note: b('Works offline on a computer. The same gates and steps apply.', 'কম্পিউটারে অফলাইনে চলে। একই গেট ও একই ধাপ প্রযোজ্য।') },
    ],
    setup: [
      b('Open the CircuitVerse simulator. A blank canvas appears with a panel of circuit elements.', 'CircuitVerse সিমুলেটর খোলো। সার্কিট এলিমেন্টের প্যানেলসহ একটি ফাঁকা ক্যানভাস আসবে।'),
      b('From the Input group, place two Input elements on the left. Label them A and B in the Properties panel.', 'Input গ্রুপ থেকে বাঁ দিকে দুটি Input এলিমেন্ট বসাও। Properties প্যানেলে এদের নাম দাও A ও B।'),
      b('From the Gates group, place 2 NOT gates, 2 AND gates and 1 OR gate. From the Output group, place one Output on the right.', 'Gates গ্রুপ থেকে ২টি NOT, ২টি AND ও ১টি OR গেট বসাও। Output গ্রুপ থেকে ডান দিকে একটি Output বসাও।'),
      b('Wire the top AND gate: A directly, and B through a NOT gate. This is A·B′. Drag from one pin to another to draw a wire.', 'ওপরের AND গেটে তার দাও: A সরাসরি, আর B একটি NOT গেটের মধ্য দিয়ে। এটাই A·B′। এক পিন থেকে আরেক পিনে টেনে তার আঁকো।'),
      b('Wire the bottom AND gate: A through the other NOT gate, and B directly. This is A′·B.', 'নিচের AND গেটে তার দাও: A অন্য NOT গেটের মধ্য দিয়ে, আর B সরাসরি। এটাই A′·B।'),
      b('Connect both AND outputs to the OR gate, and the OR gate to the Output. Click an input to switch it between 0 and 1.', 'দুটি AND-এর আউটপুট OR গেটে, আর OR গেটকে Output-এ যুক্ত করো। ইনপুটে ক্লিক করলে তা ০ ও ১-এর মধ্যে বদলায়।'),
    ],
    starter: {
      language: 'python', filename: 'xor_check.py',
      note: b('Optional: this short program prints the truth table your circuit should match. The lab itself needs no code.', 'ঐচ্ছিক: এই ছোট প্রোগ্রামটি সেই ট্রুথ টেবিল প্রিন্ট করে, যার সঙ্গে তোমার সার্কিট মিলতে হবে। ল্যাবের জন্য কোড লাগে না।'),
      code: String.raw`# Optional: compare your circuit with the formula and with real XOR
print("A B | A.B' + A'.B | A XOR B")
for A in (0, 1):
    for B in (0, 1):
        built = (A and not B) or (not A and B)
        print(A, B, "|     ", int(built), "     |   ", A ^ B)
`,
    },
    tasks: [
      b('Try all four input combinations and write down the output for each: your truth table.', 'চারটি ইনপুট সমন্বয়ই চেষ্টা করো এবং প্রতিটির আউটপুট লিখে রাখো: এটাই তোমার ট্রুথ টেবিল।'),
      b('Add a real XOR gate fed by the same A and B, with its own Output. Confirm both outputs agree on every row.', 'একই A ও B দিয়ে একটি আসল XOR গেট যোগ করো, তার নিজস্ব Output-সহ। নিশ্চিত হও প্রতিটি সারিতে দুটি আউটপুট মেলে।'),
      b('Add a plain OR gate fed by A and B, with a third Output. Find the one row where OR and XOR differ.', 'A ও B দিয়ে একটি সাধারণ OR গেট যোগ করো, তৃতীয় একটি Output-সহ। যে একটি সারিতে OR ও XOR আলাদা, সেটি খুঁজে বের করো।'),
      b('Rebuild XOR using only 2-input NAND gates. Use as few as you can.', 'শুধু ২-ইনপুট NAND গেট দিয়ে XOR আবার বানাও। যত কম গেটে পারো।'),
    ],
    expected: {
      caption: b('The truth table your circuit should produce', 'তোমার সার্কিটে যে ট্রুথ টেবিল আসা উচিত'),
      output: "A B | A.B' + A'.B | A XOR B\n0 0 |      0      |    0\n0 1 |      1      |    1\n1 0 |      1      |    1\n1 1 |      0      |    0",
    },
    checks: [
      ck('c1', b('In your circuit, set A = 1 and B = 1. What is the output?', 'তোমার সার্কিটে A = ১ ও B = ১ দাও। আউটপুট কত?'),
        [b('0', '০'), b('1', '১'), b('It keeps changing', 'বারবার বদলায়')],
        b('A·B′ = 1·0 = 0 and A′·B = 0·1 = 0, so the OR gate outputs 0.', 'A·B′ = ১·০ = ০ এবং A′·B = ০·১ = ০, তাই OR গেট দেয় ০।')),
      ck('c2', b('On which input row do OR and XOR give different outputs?', 'কোন ইনপুট সারিতে OR ও XOR আলাদা আউটপুট দেয়?'),
        [b('A = 1, B = 1', 'A = ১, B = ১'), b('A = 0, B = 0', 'A = ০, B = ০'), b('A = 0, B = 1', 'A = ০, B = ১')],
        b('With both inputs 1, OR gives 1 but XOR gives 0. On the other three rows they agree.', 'দুটি ইনপুটই ১ হলে OR দেয় ১, কিন্তু XOR দেয় ০। বাকি তিন সারিতে তারা একই।')),
      ck('c3', b('What is the smallest number of 2-input NAND gates that can make XOR?', 'সবচেয়ে কম কয়টি ২-ইনপুট NAND গেট দিয়ে XOR বানানো যায়?'),
        [b('4', '৪'), b('2', '২'), b('3', '৩')],
        b('Four: N1 = NAND(A, B); N2 = NAND(A, N1); N3 = NAND(B, N1); output = NAND(N2, N3).', 'চারটি: N1 = NAND(A, B); N2 = NAND(A, N1); N3 = NAND(B, N1); আউটপুট = NAND(N2, N3)।')),
    ],
    troubleshooting: [
      { problem: b('The output never changes, or shows an undefined value.', 'আউটপুট কখনো বদলায় না, অথবা অনির্ধারিত মান দেখায়।'), fix: b('A wire is not attached. Every gate input needs a wire that ends exactly on the pin; drag again from pin to pin.', 'কোনো তার ঠিকমতো লাগেনি। প্রতিটি গেটের ইনপুটে এমন তার লাগবে যা ঠিক পিনের ওপর শেষ হয়; পিন থেকে পিনে আবার টেনে দাও।') },
      { problem: b('Your table matches OR instead of XOR.', 'তোমার টেবিল XOR-এর বদলে OR-এর সঙ্গে মেলে।'), fix: b('The NOT gates are probably missing or on the wrong inputs. The top AND needs B inverted; the bottom AND needs A inverted.', 'সম্ভবত NOT গেটগুলো নেই বা ভুল ইনপুটে বসেছে। ওপরের AND-এ B উল্টানো লাগবে; নিচের AND-এ A উল্টানো লাগবে।') },
      { problem: b('The menus look different from these steps.', 'মেনুগুলো এই ধাপগুলোর চেয়ে আলাদা দেখায়।'), fix: b('The simulator is updated from time to time. Look for the same element names (Input, Output, AND, OR, NOT) in the elements panel or its search box.', 'সিমুলেটর মাঝে মাঝে আপডেট হয়। এলিমেন্ট প্যানেলে বা তার সার্চ বক্সে একই নামগুলো (Input, Output, AND, OR, NOT) খোঁজো।') },
    ],
    extension: b('Stretch: add an AND gate fed by A and B next to your XOR. Together they form a half adder: XOR is the sum bit, AND is the carry.', 'আরেক ধাপ: তোমার XOR-এর পাশে A ও B দিয়ে একটি AND গেট যোগ করো। দুটো মিলে হাফ অ্যাডার: XOR হলো সাম বিট, AND হলো ক্যারি।'),
  },

  // ── Electric circuits ────────────────────────────────────────────────
  {
    lessonId: 'ohms-law',
    title: b('Lab: measure series and parallel circuits', 'ল্যাব: সিরিজ ও প্যারালাল সার্কিট মেপে দেখো'),
    goal: b('Build the lesson’s two circuits in a simulator, read the currents and voltages, and check them against Ohm’s law.', 'পাঠের দুটি সার্কিট সিমুলেটরে বানাও, কারেন্ট ও ভোল্টেজ পড়ো, আর ওহমের সূত্র দিয়ে মিলিয়ে দেখো।'),
    minutes: 30,
    kind: 'simulator',
    tools: [
      FALSTAD,
      { name: 'Tinkercad Circuits', url: 'https://www.tinkercad.com/circuits', kind: 'online', note: b('An alternative with a breadboard view and a multimeter. Needs a free account.', 'ব্রেডবোর্ড ভিউ ও মাল্টিমিটারসহ একটি বিকল্প। বিনামূল্যের অ্যাকাউন্ট লাগে।') },
    ],
    setup: [
      b('Open the Falstad circuit simulator. An example circuit loads; clear it with Circuits → Blank Circuit.', 'Falstad সার্কিট সিমুলেটর খোলো। একটি উদাহরণ সার্কিট লোড হয়; Circuits → Blank Circuit দিয়ে তা মুছে ফেলো।'),
      b('Add the battery: Draw → Inputs and Sources → Add Voltage Source (2-terminal), then drag on the canvas.', 'ব্যাটারি যোগ করো: Draw → Inputs and Sources → Add Voltage Source (2-terminal), তারপর ক্যানভাসে টেনে আঁকো।'),
      b('Add two resistors with Draw → Add Resistor, and join everything into one loop with Draw → Add Wire.', 'Draw → Add Resistor দিয়ে দুটি রেজিস্টর যোগ করো, আর Draw → Add Wire দিয়ে সবকিছু একটি লুপে জুড়ে দাও।'),
      b('Right-click each part and choose Edit. Set the source to 12 V, one resistor to 4 Ω and the other to 12 Ω.', 'প্রতিটি অংশে রাইট-ক্লিক করে Edit বেছে নাও। উৎস ১২ V, একটি রেজিস্টর ৪ Ω আর অন্যটি ১২ Ω করো।'),
      b('Hover the mouse over a part to read its current (I) and voltage (Vd) in the info area at the bottom right.', 'কোনো অংশের ওপর মাউস রাখলে নিচের ডান কোণের তথ্য অংশে তার কারেন্ট (I) ও ভোল্টেজ (Vd) দেখা যায়।'),
    ],
    starter: {
      language: 'python', filename: 'circuit_check.py',
      note: b('Optional: this short program calculates the values your simulator should show. The lab itself needs no code.', 'ঐচ্ছিক: এই ছোট প্রোগ্রামটি সেই মানগুলো হিসাব করে, যা তোমার সিমুলেটরে দেখানো উচিত। ল্যাবের জন্য কোড লাগে না।'),
      code: String.raw`# Optional: check your simulator readings with Ohm's law
V, R1, R2 = 12, 4, 12

series_R = R1 + R2
series_I = V / series_R
print(f"series:   R = {series_R} ohm  I = {series_I} A  V1 = {series_I * R1} V  V2 = {series_I * R2} V")

parallel_R = 1 / (1 / R1 + 1 / R2)
print(f"parallel: R = {parallel_R} ohm  I = {V / parallel_R} A  I1 = {V / R1} A  I2 = {V / R2} A")
`,
    },
    tasks: [
      b('Series: with both resistors in one loop, read the current and the voltage across each resistor.', 'সিরিজ: দুটি রেজিস্টর একই লুপে রেখে কারেন্ট এবং প্রতিটি রেজিস্টরের দুই প্রান্তের ভোল্টেজ পড়ো।'),
      b('Check that the two voltages add up to 12 V, and that the 12 Ω resistor takes three times the voltage of the 4 Ω one.', 'দেখো দুটি ভোল্টেজের যোগফল ১২ V হয় কি না, আর ১২ Ω রেজিস্টর ৪ Ω-এর তিন গুণ ভোল্টেজ পায় কি না।'),
      b('Parallel: rewire so each resistor connects straight across the battery. Read each branch current and the battery current.', 'প্যারালাল: তার এমনভাবে বদলাও যাতে প্রতিটি রেজিস্টর সরাসরি ব্যাটারির দুই প্রান্তে যুক্ত হয়। প্রতিটি শাখার কারেন্ট ও ব্যাটারির কারেন্ট পড়ো।'),
      b('Add a third resistor of 6 Ω in parallel and read the battery current again.', 'প্যারালালে ৬ Ω-এর তৃতীয় একটি রেজিস্টর যোগ করে আবার ব্যাটারির কারেন্ট পড়ো।'),
    ],
    expected: {
      caption: b('Values your simulator should show (from the optional check program)', 'তোমার সিমুলেটরে যে মান আসা উচিত (ঐচ্ছিক যাচাই প্রোগ্রাম থেকে)'),
      output: 'series:   R = 16 ohm  I = 0.75 A  V1 = 3.0 V  V2 = 9.0 V\nparallel: R = 3.0 ohm  I = 4.0 A  I1 = 3.0 A  I2 = 1.0 A',
    },
    checks: [
      ck('c1', b('Series circuit (12 V, 4 Ω and 12 Ω): what current does the simulator show?', 'সিরিজ সার্কিট (১২ V, ৪ Ω ও ১২ Ω): সিমুলেটরে কারেন্ট কত দেখায়?'),
        [b('0.75 A (750 mA)', '০.৭৫ A (৭৫০ mA)'), b('4 A', '৪ A'), b('3 A', '৩ A')],
        b('R = 4 + 12 = 16 Ω, so I = 12 ÷ 16 = 0.75 A.', 'R = ৪ + ১২ = ১৬ Ω, তাই I = ১২ ÷ ১৬ = ০.৭৫ A।')),
      ck('c2', b('Parallel circuit: what is the total current from the battery?', 'প্যারালাল সার্কিট: ব্যাটারি থেকে মোট কারেন্ট কত?'),
        [b('4 A', '৪ A'), b('0.75 A', '০.৭৫ A'), b('1 A', '১ A')],
        b('The branch currents are 12 ÷ 4 = 3 A and 12 ÷ 12 = 1 A, and they add: 4 A.', 'শাখা কারেন্ট ১২ ÷ ৪ = ৩ A ও ১২ ÷ ১২ = ১ A, আর এরা যোগ হয়: ৪ A।')),
      ck('c3', b('After adding a 6 Ω resistor in parallel, what is the battery current?', 'প্যারালালে ৬ Ω রেজিস্টর যোগ করার পর ব্যাটারির কারেন্ট কত?'),
        [b('6 A', '৬ A'), b('4 A', '৪ A'), b('2 A', '২ A')],
        b('The new branch carries 12 ÷ 6 = 2 A, so the total is 3 + 1 + 2 = 6 A. More branches, more current, less total resistance (2 Ω).', 'নতুন শাখায় যায় ১২ ÷ ৬ = ২ A, তাই মোট ৩ + ১ + ২ = ৬ A। শাখা বাড়লে কারেন্ট বাড়ে, মোট রেজিস্ট্যান্স কমে (২ Ω)।')),
    ],
    troubleshooting: [
      { problem: b('The simulator shows “Voltage source loop with no resistance!”.', 'সিমুলেটরে “Voltage source loop with no resistance!” দেখায়।'), fix: b('A wire connects the two ends of the battery directly (a short circuit). Make sure every path between the battery ends passes through a resistor.', 'একটি তার ব্যাটারির দুই প্রান্তকে সরাসরি জুড়ে দিয়েছে (শর্ট সার্কিট)। নিশ্চিত হও ব্যাটারির দুই প্রান্তের মধ্যে প্রতিটি পথ একটি রেজিস্টরের মধ্য দিয়ে যায়।') },
      { problem: b('The current shows 0.', 'কারেন্ট ০ দেখায়।'), fix: b('The loop is open. Each wire must end exactly on the end of a part; drag the wire end until it snaps onto it.', 'লুপটি খোলা। প্রতিটি তার ঠিক উপাদানের প্রান্তে গিয়ে শেষ হতে হবে; তারের প্রান্ত টেনে ঠিক জায়গায় বসাও।') },
      { problem: b('The menus look different from these steps.', 'মেনুগুলো এই ধাপগুলোর চেয়ে আলাদা দেখায়।'), fix: b('You can also right-click an empty area of the canvas to get the same “Add…” options.', 'ক্যানভাসের ফাঁকা জায়গায় রাইট-ক্লিক করলেও একই “Add…” অপশনগুলো পাওয়া যায়।') },
    ],
    extension: b('Stretch: build a mixed circuit with 4 Ω in series with a parallel pair of 12 Ω and 6 Ω. Predict the battery current first (the pair is 4 Ω, so 12 ÷ 8 = 1.5 A), then measure.', 'আরেক ধাপ: একটি মিশ্র সার্কিট বানাও — ৪ Ω-এর সঙ্গে সিরিজে ১২ Ω ও ৬ Ω-এর একটি প্যারালাল জোড়া। আগে ব্যাটারির কারেন্ট অনুমান করো (জোড়াটি ৪ Ω, তাই ১২ ÷ ৮ = ১.৫ A), তারপর মেপে দেখো।'),
  },
];

export const getLab = (lessonId: string) => LABS.find((l) => l.lessonId === lessonId);
