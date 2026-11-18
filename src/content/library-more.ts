// Trusted library for the lessons in lessons-more.ts.
// STATUS: the team's own draft notes. Mark `reviewed: true` after sign-off.

import type { GlossaryEntry, Passage } from './library.ts';
import type { Subject } from './subjects.ts';

const p = (id: string, subject: Subject, sourceTitle: string, location: string, concepts: string[], en: string, bn: string): Passage => ({
  id, sourceTitle, location, licence: 'Own work', reviewed: false, subject, concepts, text: { en, bn },
});
const g = (id: string, term: [string, string], aliases: string[], definition: [string, string], concept: string, passage: string): GlossaryEntry => ({
  id, term: { en: term[0], bn: term[1] }, aliases, definition: { en: definition[0], bn: definition[1] }, concept, passage,
});

const OS = 'Loop & Logic OS notes';
const DS = 'Loop & Logic data structures notes';
const AL = 'Loop & Logic algorithms notes';
const DM = 'Loop & Logic discrete mathematics notes';
const DL = 'Loop & Logic digital logic notes';
const EC = 'Loop & Logic electric circuits notes';
const ML = 'Loop & Logic ML notes';

export const MORE_PASSAGES: Passage[] = [
  // Operating systems
  p('lib-os-scheduling', 'cs', OS, '§1 CPU scheduling', ['cpu_scheduling'],
    'When more processes are ready than there are CPUs, the ready processes wait in the ready queue and the CPU scheduler chooses which one runs next. Scheduling policies are compared by average waiting time, turnaround time and response time.',
    'সিপিইউর চেয়ে বেশি প্রসেস তৈরি থাকলে, সেগুলো রেডি কিউতে অপেক্ষা করে আর সিপিইউ শিডিউলার ঠিক করে এরপর কোনটি চলবে। শিডিউলিং নীতিগুলো তুলনা করা হয় গড় ওয়েটিং টাইম, টার্নঅ্যারাউন্ড টাইম ও রেসপন্স টাইম দিয়ে।'),
  p('lib-os-fcfs', 'cs', OS, '§2 First Come, First Served', ['fcfs'],
    'First Come, First Served (FCFS) runs processes in the order they arrive and does not interrupt a running process. A long process at the front makes the short ones behind it wait; this is called the convoy effect.',
    'First Come, First Served (FCFS) প্রসেসগুলোকে আসার ক্রমে চালায় এবং চলমান প্রসেসকে থামায় না। সামনে একটি লম্বা প্রসেস থাকলে পেছনের ছোটগুলোকে অপেক্ষা করতে হয়; একে বলে কনভয় ইফেক্ট।'),
  p('lib-os-times', 'cs', OS, '§3 Waiting and turnaround time', ['waiting_time'],
    'Turnaround time is completion time minus arrival time. Waiting time is turnaround time minus burst time: the time a process spends in the ready queue. Burst time is how long the process needs the CPU.',
    'টার্নঅ্যারাউন্ড টাইম = শেষ হওয়ার সময় − আসার সময়। ওয়েটিং টাইম = টার্নঅ্যারাউন্ড টাইম − বার্স্ট টাইম: অর্থাৎ প্রসেস রেডি কিউতে যতক্ষণ থাকে। বার্স্ট টাইম হলো প্রসেসের যতক্ষণ সিপিইউ লাগে।'),
  p('lib-os-sjf', 'cs', OS, '§4 Shortest Job First', ['sjf', 'waiting_time'],
    'Shortest Job First (SJF) runs the ready process with the smallest CPU burst. If all processes arrive together it gives the minimum average waiting time. With bursts 10, 4 and 2 arriving at time 0, FCFS gives waits of 0, 10 and 14 (average 8) and SJF gives 0, 2 and 6 (average about 2.67). Long processes may starve.',
    'Shortest Job First (SJF) রেডি প্রসেসগুলোর মধ্যে সবচেয়ে ছোট সিপিইউ বার্স্টের প্রসেসটি চালায়। সব প্রসেস একসঙ্গে এলে এটি সর্বনিম্ন গড় ওয়েটিং টাইম দেয়। ০ সময়ে আসা ১০, ৪ ও ২ বার্স্টের ক্ষেত্রে FCFS-এ অপেক্ষা ০, ১০ ও ১৪ (গড় ৮), আর SJF-এ ০, ২ ও ৬ (গড় প্রায় ২.৬৭)। লম্বা প্রসেস স্টারভেশনে পড়তে পারে।'),

  // Data structures
  p('lib-ds-stack', 'cs', DS, '§1 Stack', ['stack'],
    'A stack allows insertion and removal only at the top. push adds an item on top; pop removes the top item. The last item in is the first out (LIFO). After push 5, push 8, push 3, a pop returns 3.',
    'স্ট্যাকে যোগ করা ও সরানো হয় শুধু টপে। push ওপরে একটি আইটেম যোগ করে; pop ওপরের আইটেম সরায়। শেষে ঢোকা আইটেম আগে বের হয় (LIFO)। push 5, push 8, push 3-এর পর pop দিলে আসে ৩।'),
  p('lib-ds-queue', 'cs', DS, '§2 Queue', ['queue'],
    'A queue adds items at the rear (enqueue) and removes them from the front (dequeue). The first item in is the first out (FIFO). After enqueue 5, 8, 3, a dequeue returns 5.',
    'কিউতে আইটেম যোগ হয় পেছনে (enqueue) আর বের হয় সামনে থেকে (dequeue)। আগে ঢোকা আইটেম আগে বের হয় (FIFO)। enqueue 5, 8, 3-এর পর dequeue দিলে আসে ৫।'),
  p('lib-ds-array', 'cs', DS, '§3 Array implementation', ['array_implementation', 'stack', 'queue'],
    'In an array, a stack keeps the index top of its last item and a queue keeps front and rear. Pushing onto a full stack is overflow; popping from an empty stack is underflow. Each operation checks for these first, and each takes constant time.',
    'অ্যারেতে স্ট্যাক তার শেষ আইটেমের ইনডেক্স top মনে রাখে, আর কিউ মনে রাখে front ও rear। ভরা স্ট্যাকে push করলে ওভারফ্লো; খালি স্ট্যাকে pop করলে আন্ডারফ্লো। প্রতিটি অপারেশন আগে এগুলো যাচাই করে, আর প্রতিটি ধ্রুব সময়ে হয়।'),

  // Algorithms
  p('lib-algo-gcd', 'cs', AL, '§1 Greatest common divisor', ['gcd'],
    'The greatest common divisor (GCD) of two integers is the largest integer that divides both exactly. gcd(48, 18) = 6 because 48 = 6 × 8 and 18 = 6 × 3, and no larger number divides both.',
    'দুটি পূর্ণসংখ্যার গরিষ্ঠ সাধারণ গুণনীয়ক (গসাগু, GCD) হলো সবচেয়ে বড় পূর্ণসংখ্যা, যা দুটোকেই নিঃশেষে ভাগ করে। gcd(৪৮, ১৮) = ৬, কারণ ৪৮ = ৬ × ৮ ও ১৮ = ৬ × ৩, আর এর চেয়ে বড় কোনো সংখ্যা দুটোকেই ভাগ করে না।'),
  p('lib-algo-euclid', 'cs', AL, '§2 Euclid’s algorithm', ['euclid_algorithm', 'remainder'],
    'Euclid’s algorithm uses gcd(a, b) = gcd(b, a mod b), where a mod b is the remainder of a divided by b, and stops when the remainder is 0: gcd(a, 0) = a. For gcd(48, 18): 48 mod 18 = 12, 18 mod 12 = 6, 12 mod 6 = 0, so the GCD is 6.',
    'ইউক্লিডের অ্যালগরিদম gcd(a, b) = gcd(b, a mod b) ব্যবহার করে, যেখানে a mod b হলো a-কে b দিয়ে ভাগ করার ভাগশেষ; ভাগশেষ ০ হলে থামে: gcd(a, 0) = a। gcd(৪৮, ১৮)-এর জন্য: ৪৮ mod ১৮ = ১২, ১৮ mod ১২ = ৬, ১২ mod ৬ = ০, তাই গসাগু ৬।'),
  p('lib-algo-steps', 'cs', AL, '§3 Why Euclid is fast', ['algorithm_efficiency', 'euclid_algorithm'],
    'Trying every divisor takes a number of checks proportional to the smaller number: 18 checks for gcd(48, 18). Euclid’s algorithm needs 3 divisions there. After every two steps the larger number is at least halved, so the number of divisions grows with the number of digits. Neighbouring Fibonacci numbers are the worst case.',
    'প্রতিটি গুণনীয়ক পরীক্ষা করলে যাচাইয়ের সংখ্যা ছোট সংখ্যাটির সমানুপাতে বাড়ে: gcd(৪৮, ১৮)-এর জন্য ১৮টি যাচাই। ইউক্লিডের অ্যালগরিদমে সেখানে লাগে ৩টি ভাগ। প্রতি দুই ধাপে বড় সংখ্যাটি অন্তত অর্ধেক হয়, তাই ভাগের সংখ্যা বাড়ে অঙ্কসংখ্যার সঙ্গে। পাশাপাশি দুটি ফিবোনাচ্চি সংখ্যা সবচেয়ে খারাপ ক্ষেত্র।'),

  // Discrete mathematics
  p('lib-dm-proposition', 'cs', DM, '§1 Propositions', ['proposition'],
    'A proposition is a declarative sentence that is either true or false, but not both. Questions, commands and sentences with an unknown variable are not propositions. Propositions are named with letters such as p and q.',
    'প্রপোজিশন হলো এমন বিবৃতিমূলক বাক্য, যা হয় সত্য নয় মিথ্যা, কিন্তু দুটোই নয়। প্রশ্ন, আদেশ এবং অজানা চলকযুক্ত বাক্য প্রপোজিশন নয়। প্রপোজিশনের নাম দেওয়া হয় p, q-এর মতো অক্ষর দিয়ে।'),
  p('lib-dm-connectives', 'cs', DM, '§2 Connectives', ['logical_connective'],
    'Negation ¬p reverses the truth value of p. Conjunction p ∧ q is true only when both p and q are true. Disjunction p ∨ q is false only when both are false; it is inclusive, so it is true when both are true.',
    'নেগেশন ¬p p-এর ট্রুথ ভ্যালু উল্টে দেয়। কনজাংশন p ∧ q সত্য হয় শুধু p ও q দুটোই সত্য হলে। ডিসজাংশন p ∨ q মিথ্যা হয় শুধু দুটোই মিথ্যা হলে; এটি ইনক্লুসিভ, তাই দুটোই সত্য হলেও সত্য।'),
  p('lib-dm-implication', 'cs', DM, '§3 Implication', ['implication'],
    'The implication p → q, read “if p then q”, is false only when p is true and q is false. When p is false, p → q is true whatever q is. It is logically equivalent to ¬p ∨ q and to its contrapositive ¬q → ¬p, but not to its converse q → p.',
    'ইমপ্লিকেশন p → q, পড়া হয় “যদি p তবে q”, মিথ্যা হয় শুধু p সত্য ও q মিথ্যা হলে। p মিথ্যা হলে q যা-ই হোক p → q সত্য। এটি ¬p ∨ q এবং এর কন্ট্রাপজিটিভ ¬q → ¬p-এর লজিক্যালি সমতুল্য, কিন্তু কনভার্স q → p-এর নয়।'),
  p('lib-dm-table', 'cs', DM, '§4 Truth tables', ['truth_table'],
    'A truth table lists the truth value of a compound proposition for every combination of values of its variables. With n variables it has 2ⁿ rows: 4 rows for two variables. Two propositions are logically equivalent when their columns agree in every row.',
    'ট্রুথ টেবিলে চলকগুলোর প্রতিটি মান-সমন্বয়ের জন্য যৌগিক প্রপোজিশনের ট্রুথ ভ্যালু লেখা থাকে। n-টি চলক থাকলে সারি হয় 2ⁿ-টি: দুটি চলকে ৪টি সারি। দুটি প্রপোজিশনের কলাম প্রতিটি সারিতে মিললে তারা লজিক্যালি সমতুল্য।'),

  // Digital logic
  p('lib-dld-basic', 'cs', DL, '§1 Basic gates', ['logic_gate'],
    'A logic gate has binary inputs and one binary output. An AND gate outputs 1 only when all inputs are 1. An OR gate outputs 1 when at least one input is 1. A NOT gate outputs the opposite of its input. NAND and NOR are AND and OR followed by NOT.',
    'লজিক গেটের ইনপুট বাইনারি, আউটপুট একটি বাইনারি মান। AND গেট ১ দেয় শুধু সব ইনপুট ১ হলে। OR গেট ১ দেয় অন্তত একটি ইনপুট ১ হলে। NOT গেট ইনপুটের উল্টোটা দেয়। NAND ও NOR হলো AND ও OR-এর পরে একটি NOT।'),
  p('lib-dld-xor', 'cs', DL, '§2 XOR', ['xor_gate'],
    'An XOR (exclusive OR) gate outputs 1 exactly when its two inputs differ: inputs 0,0 give 0; 0,1 give 1; 1,0 give 1; 1,1 give 0. It differs from OR only when both inputs are 1. The sum bit of two bits is their XOR.',
    'XOR (এক্সক্লুসিভ অর) গেট ১ দেয় ঠিক তখন, যখন দুটি ইনপুট আলাদা: ইনপুট ০,০-তে ০; ০,১-এ ১; ১,০-তে ১; ১,১-এ ০। OR-এর সঙ্গে এর পার্থক্য শুধু দুটি ইনপুটই ১ হলে। দুটি বিটের যোগফল বিট হলো তাদের XOR।'),
  p('lib-dld-build', 'cs', DL, '§3 Building XOR', ['boolean_expression', 'xor_gate'],
    'XOR can be written as A·B′ + A′·B. Built from basic gates this needs 2 NOT gates, 2 AND gates and 1 OR gate. The same function can be built from 4 two-input NAND gates, because NAND is a universal gate.',
    'XOR-কে লেখা যায় A·B′ + A′·B হিসেবে। মৌলিক গেট দিয়ে বানাতে লাগে ২টি NOT গেট, ২টি AND গেট ও ১টি OR গেট। একই ফাংশন ৪টি দুই-ইনপুট NAND গেট দিয়েও বানানো যায়, কারণ NAND একটি ইউনিভার্সাল গেট।'),

  // Electric circuits
  p('lib-ec-ohm', 'ee', EC, '§1 Ohm’s law', ['ohms_law'],
    'Ohm’s law: the voltage across a resistor equals the current through it times its resistance, V = I × R. Voltage is measured in volts (V), current in amperes (A) and resistance in ohms (Ω). A 12 V source across 4 Ω drives 3 A.',
    'ওহমের সূত্র: রেজিস্টরের দুই প্রান্তের ভোল্টেজ সমান তার মধ্য দিয়ে যাওয়া কারেন্ট গুণ রেজিস্ট্যান্স, V = I × R। ভোল্টেজের একক ভোল্ট (V), কারেন্টের অ্যাম্পিয়ার (A), রেজিস্ট্যান্সের ওহম (Ω)। ৪ Ω-এর দুই প্রান্তে ১২ V উৎস ৩ A কারেন্ট চালায়।'),
  p('lib-ec-series', 'ee', EC, '§2 Series circuits', ['series_circuit'],
    'Resistors in series carry the same current and their resistances add: R = R1 + R2. The source voltage divides in proportion to the resistances. With 12 V across 4 Ω and 12 Ω in series: R = 16 Ω, I = 0.75 A, and the voltages are 3 V and 9 V.',
    'সিরিজে থাকা রেজিস্টরগুলোতে কারেন্ট একই, আর রেজিস্ট্যান্স যোগ হয়: R = R1 + R2। উৎসের ভোল্টেজ রেজিস্ট্যান্সের অনুপাতে ভাগ হয়। সিরিজে ৪ Ω ও ১২ Ω-এ ১২ V দিলে: R = ১৬ Ω, I = ০.৭৫ A, আর ভোল্টেজ ৩ V ও ৯ V।'),
  p('lib-ec-parallel', 'ee', EC, '§3 Parallel circuits', ['parallel_circuit'],
    'Resistors in parallel have the same voltage and their currents add. The combined resistance follows 1/R = 1/R1 + 1/R2 and is smaller than the smallest branch. With 12 V across 4 Ω and 12 Ω in parallel: the branch currents are 3 A and 1 A, the total is 4 A and R = 3 Ω.',
    'প্যারালালে থাকা রেজিস্টরগুলোতে ভোল্টেজ একই, আর কারেন্ট যোগ হয়। মিলিত রেজিস্ট্যান্স 1/R = 1/R1 + 1/R2 মেনে চলে এবং সবচেয়ে ছোট শাখার চেয়েও ছোট হয়। প্যারালালে ৪ Ω ও ১২ Ω-এ ১২ V দিলে: শাখা কারেন্ট ৩ A ও ১ A, মোট ৪ A এবং R = ৩ Ω।'),

  // Machine learning: evaluation
  p('lib-ml-cm', 'ml', ML, '§4 Confusion matrix', ['confusion_matrix', 'false_positive', 'false_negative'],
    'A confusion matrix counts four outcomes: true positives (TP, positives correctly flagged), false positives (FP, negatives wrongly flagged), false negatives (FN, positives missed) and true negatives (TN, negatives correctly passed). Every threshold gives its own matrix.',
    'কনফিউশন ম্যাট্রিক্স চার ধরনের ফল গোনে: ট্রু পজিটিভ (TP, ঠিকভাবে চিহ্নিত পজিটিভ), ফলস পজিটিভ (FP, ভুল করে চিহ্নিত নেগেটিভ), ফলস নেগেটিভ (FN, বাদ পড়া পজিটিভ) ও ট্রু নেগেটিভ (TN, ঠিকভাবে ছেড়ে দেওয়া নেগেটিভ)। প্রতিটি থ্রেশহোল্ডে আলাদা ম্যাট্রিক্স হয়।'),
  p('lib-ml-pr', 'ml', ML, '§5 Precision and recall', ['precision', 'recall'],
    'Precision = TP ÷ (TP + FP): the share of flagged examples that are truly positive. Recall = TP ÷ (TP + FN): the share of all positives that were flagged. With TP = 30, FP = 10 and FN = 20, precision is 30 ÷ 40 = 75% and recall is 30 ÷ 50 = 60%. Raising the threshold usually raises precision and lowers recall.',
    'প্রিসিশন = TP ÷ (TP + FP): চিহ্নিত উদাহরণের মধ্যে আসল পজিটিভের অংশ। রিকল = TP ÷ (TP + FN): মোট পজিটিভের মধ্যে চিহ্নিত অংশ। TP = ৩০, FP = ১০ ও FN = ২০ হলে প্রিসিশন ৩০ ÷ ৪০ = ৭৫% এবং রিকল ৩০ ÷ ৫০ = ৬০%। থ্রেশহোল্ড বাড়ালে সাধারণত প্রিসিশন বাড়ে, রিকল কমে।'),
  p('lib-ml-accuracy', 'ml', ML, '§6 Accuracy and imbalance', ['accuracy'],
    'Accuracy = (TP + TN) ÷ all examples. With TP = 30, TN = 40 and 100 examples it is 70%. Accuracy misleads when classes are imbalanced: if 5 of 100 emails are spam, a filter that flags nothing has 95% accuracy and a recall of 0.',
    'অ্যাকুরেসি = (TP + TN) ÷ মোট উদাহরণ। TP = ৩০, TN = ৪০ ও ১০০টি উদাহরণ হলে তা ৭০%। ক্লাস অসম হলে অ্যাকুরেসি বিভ্রান্ত করে: ১০০টির মধ্যে ৫টি স্প্যাম হলে, যে ফিল্টার কিছুই চিহ্নিত করে না তার অ্যাকুরেসি ৯৫%, রিকল ০।'),
];

export const MORE_GLOSSARY: GlossaryEntry[] = [
  g('g-ready-queue', ['Ready queue', 'রেডি কিউ'], ['ready queue', 'রেডি কিউ'], ['The line of processes that are ready to run and waiting for the CPU.', 'চলার জন্য তৈরি, সিপিইউর অপেক্ষায় থাকা প্রসেসগুলোর লাইন।'], 'cpu_scheduling', 'lib-os-scheduling'),
  g('g-fcfs', ['FCFS', 'FCFS'], ['fcfs', 'first come first served', 'first come, first served'], ['First Come, First Served: run processes in the order they arrive.', 'First Come, First Served: প্রসেসগুলোকে আসার ক্রমে চালানো।'], 'fcfs', 'lib-os-fcfs'),
  g('g-sjf', ['SJF', 'SJF'], ['sjf', 'shortest job first'], ['Shortest Job First: run the process with the smallest CPU burst first.', 'Shortest Job First: সবচেয়ে ছোট সিপিইউ বার্স্টের প্রসেস আগে চালানো।'], 'sjf', 'lib-os-sjf'),
  g('g-burst', ['Burst time', 'বার্স্ট টাইম'], ['burst time', 'cpu burst', 'বার্স্ট টাইম', 'burst'], ['How long a process needs the CPU.', 'একটি প্রসেসের যতক্ষণ সিপিইউ লাগে।'], 'waiting_time', 'lib-os-times'),
  g('g-waiting', ['Waiting time', 'ওয়েটিং টাইম'], ['waiting time', 'ওয়েটিং টাইম', 'অপেক্ষার সময়'], ['The time a process spends in the ready queue before it runs.', 'চলার আগে প্রসেস রেডি কিউতে যতক্ষণ থাকে।'], 'waiting_time', 'lib-os-times'),

  g('g-stack', ['Stack', 'স্ট্যাক'], ['stack', 'স্ট্যাক', 'lifo'], ['A list where you add and remove only at the top: last in, first out.', 'এমন তালিকা, যেখানে যোগ ও সরানো হয় শুধু ওপরে: শেষে ঢোকে, আগে বের হয়।'], 'stack', 'lib-ds-stack'),
  g('g-queue', ['Queue', 'কিউ'], ['queue', 'কিউ', 'fifo'], ['A list where you add at the rear and remove from the front: first in, first out.', 'এমন তালিকা, যেখানে যোগ হয় পেছনে আর বের হয় সামনে থেকে: আগে ঢোকে, আগে বের হয়।'], 'queue', 'lib-ds-queue'),
  g('g-overflow', ['Overflow', 'ওভারফ্লো'], ['overflow', 'ওভারফ্লো'], ['Trying to add to a structure that is already full.', 'আগে থেকেই ভরা কাঠামোতে যোগ করার চেষ্টা।'], 'array_implementation', 'lib-ds-array'),
  g('g-underflow', ['Underflow', 'আন্ডারফ্লো'], ['underflow', 'আন্ডারফ্লো'], ['Trying to remove from a structure that is empty.', 'খালি কাঠামো থেকে সরানোর চেষ্টা।'], 'array_implementation', 'lib-ds-array'),

  g('g-gcd', ['GCD', 'গসাগু'], ['gcd', 'greatest common divisor', 'গসাগু', 'hcf'], ['The largest number that divides two numbers exactly.', 'সবচেয়ে বড় সংখ্যা, যা দুটি সংখ্যাকেই নিঃশেষে ভাগ করে।'], 'gcd', 'lib-algo-gcd'),
  g('g-remainder', ['Remainder', 'ভাগশেষ'], ['remainder', 'a mod b', 'ভাগশেষ', 'modulo'], ['What is left after dividing one number by another; written a mod b.', 'একটি সংখ্যাকে আরেকটি দিয়ে ভাগ করার পর যা বাকি থাকে; লেখা হয় a mod b।'], 'remainder', 'lib-algo-euclid'),

  g('g-proposition', ['Proposition', 'প্রপোজিশন'], ['proposition', 'propositions', 'প্রপোজিশন'], ['A sentence that is either true or false, not both.', 'এমন বাক্য, যা হয় সত্য নয় মিথ্যা — দুটোই নয়।'], 'proposition', 'lib-dm-proposition'),
  g('g-implication', ['Implication', 'ইমপ্লিকেশন'], ['implication', 'if then', 'if p then q', 'ইমপ্লিকেশন', 'conditional'], ['“If p then q”; false only when p is true and q is false.', '“যদি p তবে q”; মিথ্যা হয় শুধু p সত্য ও q মিথ্যা হলে।'], 'implication', 'lib-dm-implication'),
  g('g-truth-table', ['Truth table', 'ট্রুথ টেবিল'], ['truth table', 'truth tables', 'ট্রুথ টেবিল'], ['A table showing the result for every combination of inputs.', 'ইনপুটের প্রতিটি সমন্বয়ের ফল দেখানো টেবিল।'], 'truth_table', 'lib-dm-table'),

  g('g-logic-gate', ['Logic gate', 'লজিক গেট'], ['logic gate', 'logic gates', 'লজিক গেট'], ['A small circuit that turns binary inputs into one binary output.', 'ছোট সার্কিট, যা বাইনারি ইনপুট থেকে একটি বাইনারি আউটপুট দেয়।'], 'logic_gate', 'lib-dld-basic'),
  g('g-xor', ['XOR', 'XOR'], ['xor', 'exclusive or', 'এক্সক্লুসিভ অর'], ['Exclusive OR: outputs 1 when the two inputs are different.', 'এক্সক্লুসিভ অর: দুটি ইনপুট আলাদা হলে ১ দেয়।'], 'xor_gate', 'lib-dld-xor'),
  g('g-nand', ['NAND', 'NAND'], ['nand'], ['AND followed by NOT. Any circuit can be built from NAND gates alone.', 'AND-এর পরে NOT। শুধু NAND গেট দিয়েই যেকোনো সার্কিট বানানো যায়।'], 'boolean_expression', 'lib-dld-build'),

  g('g-voltage', ['Voltage', 'ভোল্টেজ'], ['voltage', 'ভোল্টেজ', 'volt', 'volts'], ['The push that drives charge through a circuit, in volts (V).', 'যে ঠেলা সার্কিটে চার্জ চালায়; একক ভোল্ট (V)।'], 'ohms_law', 'lib-ec-ohm'),
  g('g-current', ['Current', 'কারেন্ট'], ['current', 'কারেন্ট', 'ampere', 'amperes'], ['The rate at which charge flows, in amperes (A).', 'চার্জ প্রবাহের হার; একক অ্যাম্পিয়ার (A)।'], 'ohms_law', 'lib-ec-ohm'),
  g('g-resistance', ['Resistance', 'রেজিস্ট্যান্স'], ['resistance', 'রেজিস্ট্যান্স', 'রোধ', 'resistor'], ['How strongly a component opposes current, in ohms (Ω).', 'কোনো উপাদান কারেন্টকে কতটা বাধা দেয়; একক ওহম (Ω)।'], 'ohms_law', 'lib-ec-ohm'),
  g('g-series', ['Series', 'সিরিজ'], ['series', 'series circuit', 'in series', 'সিরিজ'], ['Components connected one after another on a single path.', 'একটিমাত্র পথে একটির পর একটি যুক্ত উপাদান।'], 'series_circuit', 'lib-ec-series'),
  g('g-parallel', ['Parallel', 'প্যারালাল'], ['parallel', 'parallel circuit', 'in parallel', 'প্যারালাল'], ['Components connected across the same two points, each on its own branch.', 'একই দুই বিন্দুর মধ্যে, প্রতিটি নিজস্ব শাখায় যুক্ত উপাদান।'], 'parallel_circuit', 'lib-ec-parallel'),

  g('g-confusion', ['Confusion matrix', 'কনফিউশন ম্যাট্রিক্স'], ['confusion matrix', 'কনফিউশন ম্যাট্রিক্স'], ['A table counting true and false positives and negatives.', 'ট্রু ও ফলস পজিটিভ-নেগেটিভ গোনার টেবিল।'], 'confusion_matrix', 'lib-ml-cm'),
  g('g-precision', ['Precision', 'প্রিসিশন'], ['precision', 'প্রিসিশন'], ['Of the examples flagged, the share that are truly positive.', 'চিহ্নিত উদাহরণের মধ্যে আসল পজিটিভের অংশ।'], 'precision', 'lib-ml-pr'),
  g('g-recall', ['Recall', 'রিকল'], ['recall', 'রিকল', 'sensitivity'], ['Of all the real positives, the share that were flagged.', 'সব আসল পজিটিভের মধ্যে চিহ্নিত অংশ।'], 'recall', 'lib-ml-pr'),
  g('g-accuracy', ['Accuracy', 'অ্যাকুরেসি'], ['accuracy', 'অ্যাকুরেসি'], ['The share of all examples the model got right.', 'সব উদাহরণের মধ্যে মডেল যতগুলো ঠিক করেছে তার অংশ।'], 'accuracy', 'lib-ml-accuracy'),
];

/** Display names for concepts (used on the dashboard and profile). */
export const CONCEPT_NAMES: Record<string, { en: string; bn: string }> = {
  cpu_scheduling: { en: 'CPU scheduling', bn: 'সিপিইউ শিডিউলিং' },
  fcfs: { en: 'FCFS scheduling', bn: 'FCFS শিডিউলিং' },
  sjf: { en: 'SJF scheduling', bn: 'SJF শিডিউলিং' },
  waiting_time: { en: 'Waiting time', bn: 'ওয়েটিং টাইম' },
  stack: { en: 'Stack', bn: 'স্ট্যাক' },
  queue: { en: 'Queue', bn: 'কিউ' },
  array_implementation: { en: 'Array implementation', bn: 'অ্যারে দিয়ে বাস্তবায়ন' },
  gcd: { en: 'GCD', bn: 'গসাগু' },
  euclid_algorithm: { en: 'Euclid’s algorithm', bn: 'ইউক্লিডের অ্যালগরিদম' },
  remainder: { en: 'Remainder (mod)', bn: 'ভাগশেষ (mod)' },
  algorithm_efficiency: { en: 'Algorithm efficiency', bn: 'অ্যালগরিদমের দক্ষতা' },
  proposition: { en: 'Propositions', bn: 'প্রপোজিশন' },
  logical_connective: { en: 'Logical connectives', bn: 'লজিক্যাল সংযোজক' },
  implication: { en: 'Implication', bn: 'ইমপ্লিকেশন' },
  truth_table: { en: 'Truth tables', bn: 'ট্রুথ টেবিল' },
  logic_gate: { en: 'Logic gates', bn: 'লজিক গেট' },
  xor_gate: { en: 'XOR gate', bn: 'XOR গেট' },
  boolean_expression: { en: 'Boolean expressions', bn: 'বুলিয়ান এক্সপ্রেশন' },
  ohms_law: { en: 'Ohm’s law', bn: 'ওহমের সূত্র' },
  series_circuit: { en: 'Series circuits', bn: 'সিরিজ সার্কিট' },
  parallel_circuit: { en: 'Parallel circuits', bn: 'প্যারালাল সার্কিট' },
  confusion_matrix: { en: 'Confusion matrix', bn: 'কনফিউশন ম্যাট্রিক্স' },
  precision: { en: 'Precision', bn: 'প্রিসিশন' },
  recall: { en: 'Recall', bn: 'রিকল' },
  accuracy: { en: 'Accuracy', bn: 'অ্যাকুরেসি' },
};
