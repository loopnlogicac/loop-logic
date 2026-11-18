// Lessons matched to Loop & Logic YouTube videos (titles and ids read from the
// channel playlists on 17 Nov 2026).
// STATUS: draft. Every version needs subject review, and the Bangla needs a
// native reviewer, before pilot use.

import type { Bi } from './pricing-pack.ts';
import type { Lesson, LessonBlock, PrereqCheck, Quiz, ReadLevel } from './lessons.ts';

const same = (en: string, bn: string): Record<ReadLevel, Bi> => ({ 1: { en, bn }, 2: { en, bn }, 3: { en, bn } });
const levels = (l1: [string, string], l2: [string, string], l3: [string, string]): Record<ReadLevel, Bi> => ({
  1: { en: l1[0], bn: l1[1] },
  2: { en: l2[0], bn: l2[1] },
  3: { en: l3[0], bn: l3[1] },
});
const quiz = (question: [string, string], options: [string, string][], explanation: [string, string]): Quiz => ({
  question: { en: question[0], bn: question[1] },
  options: options.map(([en, bn]) => ({ en, bn })),
  answer: 0, // the first option is always the correct one; the page shuffles nothing
  explanation: { en: explanation[0], bn: explanation[1] },
});
const block = (b: Omit<LessonBlock, 'anchors'> & { anchors?: string[] }): LessonBlock => ({ anchors: [], ...b });

export const MORE_LESSONS: Lesson[] = [
  // ── Operating Systems ────────────────────────────────────────────────
  {
    id: 'cpu-scheduling',
    subject: 'cs',
    title: { en: 'CPU scheduling: FCFS and SJF', bn: 'সিপিইউ শিডিউলিং: FCFS ও SJF' },
    summary: {
      en: 'How the order of processes changes waiting time, and why shortest-job-first waits less on average.',
      bn: 'প্রসেসের ক্রম বদলালে অপেক্ষার সময় কীভাবে বদলায়, আর কেন ছোট কাজ আগে করলে গড় অপেক্ষা কমে।',
    },
    videos: [
      { id: 'KysOSB4ZxYo', title: 'FCFS Scheduling Algorithm in OS', relation: 'covers' },
      { id: 'w5b8mQrpgwU', title: 'Shortest Job First (SJF) Scheduling Algorithm', relation: 'covers' },
    ],
    blocks: [
      block({
        id: 'cs-1', type: 'text', concepts: ['cpu_scheduling'], passages: ['lib-os-scheduling'], anchors: ['ready queue'],
        text: levels(
          [
            'A computer often has more programs ready to run than it has CPUs. The waiting programs (processes) stand in a line called the ready queue. CPU scheduling is how the operating system picks who goes next.',
            'কম্পিউটারে প্রায়ই সিপিইউর চেয়ে বেশি প্রোগ্রাম চলার জন্য তৈরি থাকে। অপেক্ষায় থাকা প্রোগ্রামগুলো (প্রসেস) একটা লাইনে থাকে, যার নাম রেডি কিউ। এরপর কে চলবে, অপারেটিং সিস্টেম যেভাবে তা ঠিক করে, সেটাই সিপিইউ শিডিউলিং।',
          ],
          [
            'When several processes are ready but there is one CPU, they wait in the ready queue. The CPU scheduler chooses which process runs next. A good choice keeps waiting time low; a poor one makes short jobs wait behind long ones.',
            'কয়েকটি প্রসেস তৈরি কিন্তু সিপিইউ একটি হলে, তারা রেডি কিউতে অপেক্ষা করে। সিপিইউ শিডিউলার ঠিক করে এরপর কোন প্রসেস চলবে। ভালো সিদ্ধান্তে অপেক্ষার সময় কম থাকে; খারাপ সিদ্ধান্তে ছোট কাজগুলো বড় কাজের পেছনে আটকে থাকে।',
          ],
          [
            'The short-term scheduler selects one process from the ready queue each time the CPU becomes free. Policies are compared on criteria such as average waiting time, turnaround time and response time; no single policy optimises all of them.',
            'সিপিইউ খালি হলেই শর্ট-টার্ম শিডিউলার রেডি কিউ থেকে একটি প্রসেস বেছে নেয়। নীতিগুলো তুলনা করা হয় গড় ওয়েটিং টাইম, টার্নঅ্যারাউন্ড টাইম ও রেসপন্স টাইমের মতো মানদণ্ডে; কোনো একটি নীতি সবগুলোতে সেরা নয়।',
          ],
        ),
        quiz: quiz(
          ['What does the CPU scheduler decide?', 'সিপিইউ শিডিউলার কী ঠিক করে?'],
          [['Which ready process runs next', 'তৈরি থাকা কোন প্রসেস এরপর চলবে'], ['How much RAM a program gets', 'একটি প্রোগ্রাম কতটুকু র‍্যাম পাবে'], ['Which file to open', 'কোন ফাইল খোলা হবে']],
          ['The scheduler picks one process from the ready queue to use the CPU next.', 'শিডিউলার রেডি কিউ থেকে একটি প্রসেস বেছে নেয়, যে এরপর সিপিইউ ব্যবহার করবে।'],
        ),
      }),
      block({
        id: 'cs-2', type: 'text', concepts: ['fcfs', 'waiting_time'], passages: ['lib-os-fcfs'], anchors: ['FCFS'],
        text: levels(
          [
            'FCFS means First Come, First Served: whoever arrives first runs first, like a ticket line. It is simple, and fair by arrival. But one long job at the front makes everyone behind it wait.',
            'FCFS মানে First Come, First Served: যে আগে আসে সে আগে চলে, টিকিটের লাইনের মতো। এটা সহজ, আর আসার ক্রমে ন্যায্য। কিন্তু সামনে একটা লম্বা কাজ থাকলে পেছনের সবাইকে অপেক্ষা করতে হয়।',
          ],
          [
            'First Come, First Served (FCFS) runs processes in arrival order and never interrupts a running process. It is easy to build with a simple queue. Its weakness is the convoy effect: short processes stuck behind a long one all wait a long time.',
            'First Come, First Served (FCFS) প্রসেসগুলোকে আসার ক্রমে চালায় এবং চলমান প্রসেসকে মাঝপথে থামায় না। সাধারণ একটি কিউ দিয়েই এটা বানানো যায়। এর দুর্বলতা কনভয় ইফেক্ট: লম্বা একটি প্রসেসের পেছনে আটকে থাকা ছোট প্রসেসগুলো সবাই অনেকক্ষণ অপেক্ষা করে।',
          ],
          [
            'FCFS is a non-preemptive policy implemented with a FIFO ready queue. Average waiting time depends heavily on arrival order; a long CPU burst at the head produces the convoy effect and poor response for short or I/O-bound processes.',
            'FCFS একটি নন-প্রিএম্পটিভ নীতি, যা FIFO রেডি কিউ দিয়ে বাস্তবায়ন করা হয়। গড় ওয়েটিং টাইম আসার ক্রমের ওপর অনেকটাই নির্ভর করে; সামনে লম্বা সিপিইউ বার্স্ট থাকলে কনভয় ইফেক্ট হয় এবং ছোট বা আই/ও-নির্ভর প্রসেসের রেসপন্স খারাপ হয়।',
          ],
        ),
        quiz: quiz(
          ['In FCFS, which process runs first?', 'FCFS-এ কোন প্রসেস আগে চলে?'],
          [['The one that arrived first', 'যে আগে এসেছে'], ['The shortest one', 'যেটা সবচেয়ে ছোট'], ['The most important one', 'যেটা সবচেয়ে গুরুত্বপূর্ণ']],
          ['FCFS only looks at arrival order. Burst time and importance play no part.', 'FCFS শুধু আসার ক্রম দেখে। বার্স্ট টাইম বা গুরুত্বের কোনো ভূমিকা নেই।'],
        ),
      }),
      block({
        id: 'cs-3', type: 'formula', concepts: ['waiting_time'], passages: ['lib-os-times'], anchors: ['Waiting time = Turnaround time − Burst time'],
        text: same('Waiting time = Turnaround time − Burst time', 'ওয়েটিং টাইম = টার্নঅ্যারাউন্ড টাইম − বার্স্ট টাইম'),
      }),
      block({
        id: 'cs-4', type: 'text', concepts: ['sjf', 'waiting_time'], passages: ['lib-os-sjf'], anchors: ['SJF'],
        text: levels(
          [
            'SJF means Shortest Job First: the process that needs the least CPU time runs first. Short jobs finish quickly, so the average wait goes down. The catch: a very long job may keep getting pushed back.',
            'SJF মানে Shortest Job First: যে প্রসেসের সবচেয়ে কম সিপিইউ সময় লাগবে, সে আগে চলে। ছোট কাজগুলো দ্রুত শেষ হয়, তাই গড় অপেক্ষা কমে। সমস্যা হলো: খুব লম্বা একটা কাজ বারবার পিছিয়ে যেতে পারে।',
          ],
          [
            'Shortest Job First (SJF) picks the ready process with the smallest CPU burst. When all processes are available together, it gives the lowest possible average waiting time. In practice the burst time must be estimated, and long processes can starve if short ones keep arriving.',
            'Shortest Job First (SJF) রেডি প্রসেসগুলোর মধ্যে যার সিপিইউ বার্স্ট সবচেয়ে ছোট, তাকে বেছে নেয়। সব প্রসেস একসঙ্গে উপস্থিত থাকলে এটি সম্ভাব্য সর্বনিম্ন গড় ওয়েটিং টাইম দেয়। বাস্তবে বার্স্ট টাইম অনুমান করতে হয়, আর ছোট প্রসেস আসতেই থাকলে লম্বা প্রসেস স্টারভেশনে পড়তে পারে।',
          ],
          [
            'Non-preemptive SJF is provably optimal for average waiting time when all processes arrive at the same instant, because moving a shorter burst ahead of a longer one always reduces the total wait. It requires burst prediction (for example exponential averaging) and admits starvation of long processes.',
            'সব প্রসেস একই মুহূর্তে এলে নন-প্রিএম্পটিভ SJF গড় ওয়েটিং টাইমের জন্য প্রমাণিতভাবে সর্বোত্তম, কারণ ছোট বার্স্টকে বড় বার্স্টের আগে আনলে মোট অপেক্ষা সবসময় কমে। এতে বার্স্ট অনুমান করতে হয় (যেমন এক্সপোনেনশিয়াল অ্যাভারেজিং), এবং লম্বা প্রসেসের স্টারভেশন হতে পারে।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: at a photocopy shop, one student has 200 pages and three students have 2 pages each. Serving the 2-page jobs first lets three people leave within a minute; serving the 200 pages first makes all three wait.',
          bn: 'রোজকার উদাহরণ: ফটোকপির দোকানে একজনের ২০০ পাতা, আর তিনজনের ২ পাতা করে। ২ পাতার কাজগুলো আগে করলে তিনজন এক মিনিটের মধ্যেই চলে যেতে পারে; ২০০ পাতা আগে করলে তিনজনকেই অপেক্ষা করতে হয়।',
        },
        quiz: quiz(
          ['Why does SJF lower the average waiting time?', 'SJF কেন গড় ওয়েটিং টাইম কমায়?'],
          [['Short jobs finish first, so fewer processes wait behind long ones', 'ছোট কাজ আগে শেষ হয়, তাই লম্বা কাজের পেছনে কম প্রসেস অপেক্ষা করে'], ['It runs two processes at the same time', 'এটি একসঙ্গে দুটি প্রসেস চালায়'], ['It skips long jobs completely', 'এটি লম্বা কাজ পুরোপুরি বাদ দেয়']],
          ['Every process waits for the bursts ahead of it. Putting short bursts first makes those waits small.', 'প্রতিটি প্রসেস তার আগের বার্স্টগুলোর জন্য অপেক্ষা করে। ছোট বার্স্ট আগে রাখলে সেই অপেক্ষা কম হয়।'],
        ),
      }),
      block({
        id: 'cs-5', type: 'example', concepts: ['fcfs', 'sjf', 'waiting_time'], passages: ['lib-os-sjf', 'lib-os-times'], anchors: ['10', '4', '2', '8', '2.67'],
        text: same(
          'Worked example. Three processes arrive at time 0 with burst times P1 = 10, P2 = 4 and P3 = 2. FCFS runs P1, P2, P3: waiting times 0, 10 and 14, average 8. SJF runs P3, P2, P1: waiting times 0, 2 and 6, average about 2.67. Same work, different order, one-third of the wait.',
          'সমাধানসহ উদাহরণ। তিনটি প্রসেস ০ সময়ে আসে, বার্স্ট টাইম P1 = ১০, P2 = ৪, P3 = ২। FCFS চালায় P1, P2, P3: ওয়েটিং টাইম ০, ১০ ও ১৪, গড় ৮। SJF চালায় P3, P2, P1: ওয়েটিং টাইম ০, ২ ও ৬, গড় প্রায় ২.৬৭। কাজ একই, ক্রম আলাদা, অপেক্ষা এক-তৃতীয়াংশ।',
        ),
      }),
    ],
  },

  // ── Data Structures ──────────────────────────────────────────────────
  {
    id: 'stack-queue',
    subject: 'cs',
    title: { en: 'Stack and queue: two rules for waiting', bn: 'স্ট্যাক ও কিউ: অপেক্ষার দুই নিয়ম' },
    summary: {
      en: 'LIFO versus FIFO, the four basic operations, and how both fit in a plain array.',
      bn: 'LIFO বনাম FIFO, চারটি মূল অপারেশন, আর কীভাবে দুটোই সাধারণ অ্যারেতে বানানো যায়।',
    },
    videos: [
      { id: 'PZL29a8CP8A', title: 'Stack Oneshot', relation: 'covers' },
      { id: '9fjsFDfgqgc', title: 'QUEUE one-shot class', relation: 'covers' },
      { id: 'wsHzdE1h3HE', title: 'Stack & Queue in Bangla | Previous Semester Questions Solved', relation: 'covers' },
    ],
    blocks: [
      block({
        id: 'sq-1', type: 'text', concepts: ['stack'], passages: ['lib-ds-stack'], anchors: ['LIFO', 'push', 'pop'],
        text: levels(
          [
            'A stack is like a pile of plates: you put a new plate on top and you take a plate from the top. The last one in is the first one out (LIFO). Adding is called push; removing is called pop.',
            'স্ট্যাক হলো থালার স্তূপের মতো: নতুন থালা ওপরে রাখো, আর নিতে হলে ওপর থেকেই নাও। যে সবার শেষে ঢোকে, সে সবার আগে বের হয় (LIFO)। ঢোকানোকে বলে push, বের করাকে বলে pop।',
          ],
          [
            'A stack stores items so that only the top is accessible. push adds an item on top and pop removes the top item, so the last item in is the first out (LIFO). Function calls, undo and bracket matching all use stacks.',
            'স্ট্যাকে আইটেমগুলো এমনভাবে থাকে যে শুধু ওপরেরটাই ধরা যায়। push ওপরে একটি আইটেম যোগ করে, pop ওপরের আইটেম সরিয়ে নেয়; তাই শেষে ঢোকা আইটেম আগে বের হয় (LIFO)। ফাংশন কল, আনডু আর ব্র্যাকেট মেলানো — সবখানেই স্ট্যাক ব্যবহার হয়।',
          ],
          [
            'A stack is a linear abstract data type restricted to one end, the top. push and pop both act on the top, giving LIFO order. The call stack, expression evaluation and depth-first search all rely on this discipline.',
            'স্ট্যাক একটি লিনিয়ার অ্যাবস্ট্র্যাক্ট ডেটা টাইপ, যেখানে কাজ হয় শুধু এক প্রান্তে — টপে। push ও pop দুটোই টপে কাজ করে, ফলে ক্রম হয় LIFO। কল স্ট্যাক, এক্সপ্রেশন ইভ্যালুয়েশন আর ডেপথ-ফার্স্ট সার্চ এই নিয়মের ওপরই দাঁড়িয়ে।',
          ],
        ),
        quiz: quiz(
          ['Push 5, push 8, push 3, then pop. Which value comes out?', 'push 5, push 8, push 3, তারপর pop। কোন মান বের হবে?'],
          [['3', '৩'], ['5', '৫'], ['8', '৮']],
          ['A stack is LIFO: the last value pushed (3) is the first one popped.', 'স্ট্যাক LIFO: শেষে push করা মান (৩) সবার আগে pop হয়।'],
        ),
      }),
      block({
        id: 'sq-2', type: 'text', concepts: ['queue'], passages: ['lib-ds-queue'], anchors: ['FIFO', 'enqueue', 'dequeue'],
        text: levels(
          [
            'A queue is like a line at a counter: you join at the back and the person at the front is served first. First in, first out (FIFO). Adding is called enqueue; removing is called dequeue.',
            'কিউ হলো কাউন্টারের লাইনের মতো: পেছনে গিয়ে দাঁড়াও, আর সামনের জন আগে সেবা পায়। যে আগে ঢোকে, সে আগে বের হয় (FIFO)। ঢোকানোকে বলে enqueue, বের করাকে বলে dequeue।',
          ],
          [
            'A queue adds items at the rear and removes them from the front, so the first item in is the first out (FIFO). enqueue adds and dequeue removes. Printers, CPU ready queues and breadth-first search use queues.',
            'কিউতে আইটেম যোগ হয় পেছনে (rear) আর বের হয় সামনে (front) থেকে; তাই আগে ঢোকা আইটেম আগে বের হয় (FIFO)। enqueue যোগ করে, dequeue সরায়। প্রিন্টার, সিপিইউ রেডি কিউ আর ব্রেডথ-ফার্স্ট সার্চে কিউ ব্যবহার হয়।',
          ],
          [
            'A queue is a linear abstract data type with insertion at the rear and deletion at the front, giving FIFO order. enqueue and dequeue are its primitives; buffering, scheduling and breadth-first search depend on it.',
            'কিউ একটি লিনিয়ার অ্যাবস্ট্র্যাক্ট ডেটা টাইপ, যেখানে ইনসার্শন হয় rear-এ আর ডিলিশন হয় front-এ; ফলে ক্রম হয় FIFO। enqueue ও dequeue এর মূল অপারেশন; বাফারিং, শিডিউলিং আর ব্রেডথ-ফার্স্ট সার্চ এর ওপর নির্ভর করে।',
          ],
        ),
        quiz: quiz(
          ['Enqueue 5, 8, 3, then dequeue. Which value comes out?', 'enqueue 5, 8, 3, তারপর dequeue। কোন মান বের হবে?'],
          [['5', '৫'], ['3', '৩'], ['8', '৮']],
          ['A queue is FIFO: the first value added (5) is the first one removed.', 'কিউ FIFO: প্রথমে যোগ করা মান (৫) সবার আগে বের হয়।'],
        ),
      }),
      block({
        id: 'sq-3', type: 'formula', concepts: ['stack', 'queue'], passages: ['lib-ds-stack', 'lib-ds-queue'], anchors: ['LIFO', 'FIFO'],
        text: same('Stack: last in, first out (LIFO) · Queue: first in, first out (FIFO)', 'স্ট্যাক: শেষে ঢোকে, আগে বের হয় (LIFO) · কিউ: আগে ঢোকে, আগে বের হয় (FIFO)'),
      }),
      block({
        id: 'sq-4', type: 'text', concepts: ['array_implementation', 'stack', 'queue'], passages: ['lib-ds-array'], anchors: ['top', 'overflow', 'underflow'],
        text: levels(
          [
            'Both can be built with a plain array. A stack keeps one number, top, that points to the last item. If the array is full and you push, that is overflow. If it is empty and you pop, that is underflow. Always check first.',
            'দুটোই সাধারণ অ্যারে দিয়ে বানানো যায়। স্ট্যাকে একটা সংখ্যা থাকে, top, যা শেষ আইটেমকে দেখায়। অ্যারে ভরা অবস্থায় push করলে হয় ওভারফ্লো। খালি অবস্থায় pop করলে হয় আন্ডারফ্লো। আগে সবসময় যাচাই করো।',
          ],
          [
            'In an array implementation, a stack tracks the index top, and a queue tracks front and rear. Pushing onto a full stack is overflow; popping from an empty one is underflow, so each operation checks first. All four operations take constant time.',
            'অ্যারে দিয়ে বানালে স্ট্যাক মনে রাখে top ইনডেক্স, আর কিউ মনে রাখে front ও rear। ভরা স্ট্যাকে push করলে ওভারফ্লো, খালি স্ট্যাকে pop করলে আন্ডারফ্লো; তাই প্রতিটি অপারেশন আগে যাচাই করে। চারটি অপারেশনই ধ্রুব সময়ে হয়।',
          ],
          [
            'With a fixed array, a stack needs only the index top; a queue needs front and rear, usually advanced modulo the capacity (a circular queue) so freed slots are reused. Overflow and underflow are checked before each operation; push, pop, enqueue and dequeue are all O(1).',
            'নির্দিষ্ট আকারের অ্যারেতে স্ট্যাকের জন্য শুধু top ইনডেক্সই যথেষ্ট; কিউয়ের লাগে front ও rear, যেগুলো সাধারণত ধারণক্ষমতার মডুলোতে এগোয় (সার্কুলার কিউ), যাতে খালি হওয়া ঘর আবার ব্যবহার হয়। প্রতিটি অপারেশনের আগে ওভারফ্লো ও আন্ডারফ্লো যাচাই করা হয়; push, pop, enqueue ও dequeue সবই O(1)।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: the Back button in a browser is a stack (the last page you opened is the first one you go back to). A printer is a queue (the first document sent is printed first).',
          bn: 'রোজকার উদাহরণ: ব্রাউজারের Back বোতাম একটি স্ট্যাক (শেষে যে পাতা খুলেছ, আগে সেখানেই ফিরে যাও)। প্রিন্টার একটি কিউ (যে ডকুমেন্ট আগে পাঠানো হয়, সেটাই আগে ছাপা হয়)।',
        },
        quiz: quiz(
          ['What is it called when you pop from an empty stack?', 'খালি স্ট্যাক থেকে pop করলে তাকে কী বলে?'],
          [['Underflow', 'আন্ডারফ্লো'], ['Overflow', 'ওভারফ্লো'], ['Enqueue', 'এনকিউ']],
          ['Underflow: there is nothing to remove. Overflow is the opposite, pushing onto a full stack.', 'আন্ডারফ্লো: সরানোর মতো কিছু নেই। ওভারফ্লো এর উল্টো — ভরা স্ট্যাকে push করা।'],
        ),
      }),
      block({
        id: 'sq-5', type: 'example', concepts: ['stack', 'queue'], passages: ['lib-ds-stack', 'lib-ds-queue'], anchors: ['5', '8', '3'],
        text: same(
          'Worked example. Start empty. Stack: push 5, push 8, push 3, then pop gives 3 and leaves 5, 8. Queue: enqueue 5, enqueue 8, enqueue 3, then dequeue gives 5 and leaves 8, 3. Same three numbers, opposite ends.',
          'সমাধানসহ উদাহরণ। শুরুতে খালি। স্ট্যাক: push 5, push 8, push 3, তারপর pop দিলে আসে ৩, থাকে ৫, ৮। কিউ: enqueue 5, enqueue 8, enqueue 3, তারপর dequeue দিলে আসে ৫, থাকে ৮, ৩। একই তিনটি সংখ্যা, উল্টো প্রান্ত।',
        ),
      }),
    ],
  },

  // ── Algorithms ───────────────────────────────────────────────────────
  {
    id: 'euclid-gcd',
    subject: 'cs',
    title: { en: 'Euclid’s algorithm: finding the GCD fast', bn: 'ইউক্লিডের অ্যালগরিদম: দ্রুত গসাগু বের করা' },
    summary: {
      en: 'Why gcd(a, b) = gcd(b, a mod b), and why it needs so few steps.',
      bn: 'কেন gcd(a, b) = gcd(b, a mod b), আর কেন এত কম ধাপ লাগে।',
    },
    videos: [{ id: 'LAX9dmwn0Tw', title: 'Euclidean Algorithm for GCD - Part 1 | Number Theory', relation: 'covers' }],
    blocks: [
      block({
        id: 'gc-1', type: 'text', concepts: ['gcd'], passages: ['lib-algo-gcd'], anchors: ['GCD'],
        text: levels(
          [
            'The GCD (greatest common divisor) of two numbers is the biggest number that divides both with nothing left over. For 48 and 18 it is 6: 48 = 6 × 8 and 18 = 6 × 3.',
            'দুটি সংখ্যার গসাগু (GCD) হলো সবচেয়ে বড় সংখ্যা, যা দিয়ে দুটোকেই নিঃশেষে ভাগ করা যায়। ৪৮ ও ১৮-এর গসাগু ৬: ৪৮ = ৬ × ৮ এবং ১৮ = ৬ × ৩।',
          ],
          [
            'The greatest common divisor (GCD) of two integers is the largest integer that divides both exactly. gcd(48, 18) = 6. We use it to reduce fractions, and it sits underneath modular arithmetic and cryptography.',
            'দুটি পূর্ণসংখ্যার গরিষ্ঠ সাধারণ গুণনীয়ক (গসাগু বা GCD) হলো সবচেয়ে বড় পূর্ণসংখ্যা, যা দুটোকেই নিঃশেষে ভাগ করে। gcd(৪৮, ১৮) = ৬। ভগ্নাংশ লঘিষ্ঠ আকারে আনতে এটা লাগে, আর মডুলার অ্যারিথমেটিক ও ক্রিপ্টোগ্রাফির ভিত্তিতেও এটা আছে।',
          ],
          [
            'For integers a and b, not both zero, the GCD is the largest positive integer dividing both; gcd(48, 18) = 6. It is the basis of fraction reduction, modular inverses and RSA key generation.',
            'a ও b পূর্ণসংখ্যা (দুটোই শূন্য নয়) হলে গসাগু (GCD) হলো সবচেয়ে বড় ধনাত্মক পূর্ণসংখ্যা, যা দুটোকেই ভাগ করে; gcd(৪৮, ১৮) = ৬। ভগ্নাংশ লঘুকরণ, মডুলার ইনভার্স আর RSA কি তৈরির ভিত্তি এটি।',
          ],
        ),
        quiz: quiz(
          ['What is gcd(48, 18)?', 'gcd(৪৮, ১৮) কত?'],
          [['6', '৬'], ['2', '২'], ['18', '১৮']],
          ['6 divides both (48 = 6 × 8, 18 = 6 × 3) and no larger number does.', '৬ দুটোকেই ভাগ করে (৪৮ = ৬ × ৮, ১৮ = ৬ × ৩), আর এর চেয়ে বড় কোনো সংখ্যা করে না।'],
        ),
      }),
      block({
        id: 'gc-2', type: 'text', concepts: ['euclid_algorithm', 'remainder'], passages: ['lib-algo-euclid'], anchors: ['remainder'],
        text: levels(
          [
            'Euclid’s trick: replace the bigger number with the remainder after dividing, and repeat. 48 ÷ 18 leaves 12, so now work with 18 and 12. Keep going until the remainder is 0. The last non-zero number is the GCD.',
            'ইউক্লিডের কৌশল: বড় সংখ্যাটাকে ভাগশেষ দিয়ে বদলে দাও, আর একই কাজ বারবার করো। ৪৮ ÷ ১৮ করলে ভাগশেষ ১২, তাই এবার কাজ ১৮ আর ১২ নিয়ে। ভাগশেষ ০ না হওয়া পর্যন্ত চালিয়ে যাও। শেষ অশূন্য সংখ্যাটাই গসাগু।',
          ],
          [
            'Euclid’s algorithm rests on one fact: any number that divides both a and b also divides the remainder a mod b. So gcd(a, b) = gcd(b, a mod b). Repeat the replacement until the remainder is 0; the other number is then the GCD.',
            'ইউক্লিডের অ্যালগরিদম একটি সত্যের ওপর দাঁড়িয়ে: যে সংখ্যা a ও b দুটোকেই ভাগ করে, সে ভাগশেষ a mod b-কেও ভাগ করে। তাই gcd(a, b) = gcd(b, a mod b)। ভাগশেষ ০ না হওয়া পর্যন্ত এই বদল চালিয়ে যাও; তখন অন্য সংখ্যাটিই গসাগু।',
          ],
          [
            'Writing a = qb + r with remainder 0 ≤ r < b, the common divisors of (a, b) and of (b, r) coincide, hence gcd(a, b) = gcd(b, a mod b). The second argument strictly decreases, so the iteration terminates with gcd(a, 0) = a.',
            'a = qb + r লিখলে (যেখানে ভাগশেষ 0 ≤ r < b), (a, b) ও (b, r)-এর সাধারণ গুণনীয়কগুলো একই; তাই gcd(a, b) = gcd(b, a mod b)। দ্বিতীয় সংখ্যাটি প্রতিবার কমে, ফলে প্রক্রিয়াটি gcd(a, 0) = a-তে গিয়ে শেষ হয়।',
          ],
        ),
        quiz: quiz(
          ['Euclid’s algorithm stops when…', 'ইউক্লিডের অ্যালগরিদম থামে যখন…'],
          [['the remainder becomes 0', 'ভাগশেষ ০ হয়'], ['both numbers become 1', 'দুটো সংখ্যাই ১ হয়'], ['the bigger number is even', 'বড় সংখ্যাটি জোড় হয়']],
          ['When the remainder is 0, the divisor at that step is the GCD.', 'ভাগশেষ ০ হলে সেই ধাপের ভাজকই গসাগু।'],
        ),
      }),
      block({
        id: 'gc-3', type: 'formula', concepts: ['euclid_algorithm'], passages: ['lib-algo-euclid'], anchors: ['gcd(a, b) = gcd(b, a mod b)'],
        text: same('gcd(a, b) = gcd(b, a mod b)   ·   gcd(a, 0) = a', 'gcd(a, b) = gcd(b, a mod b)   ·   gcd(a, 0) = a'),
      }),
      block({
        id: 'gc-4', type: 'text', concepts: ['algorithm_efficiency', 'euclid_algorithm'], passages: ['lib-algo-steps'], anchors: ['Euclid'],
        text: levels(
          [
            'Why is it fast? The slow way tries every number from 1 up to the smaller one. Euclid jumps: each division shrinks the numbers a lot. Even for numbers close to a million it needs only a few dozen steps.',
            'এটা দ্রুত কেন? ধীর পদ্ধতিতে ১ থেকে ছোট সংখ্যাটা পর্যন্ত প্রতিটি সংখ্যা পরীক্ষা করতে হয়। ইউক্লিড লাফ দিয়ে এগোয়: প্রতিটি ভাগে সংখ্যাগুলো অনেকটা ছোট হয়ে যায়। সংখ্যা দশ লাখের কাছাকাছি হলেও মাত্র কয়েক ডজন ধাপ লাগে।',
          ],
          [
            'Checking every candidate divisor takes time proportional to the smaller number. Euclid’s algorithm is far faster: after every two steps the larger number is at least halved, so the number of steps grows with the number of digits, not with the size of the numbers.',
            'প্রতিটি সম্ভাব্য গুণনীয়ক পরীক্ষা করলে সময় লাগে ছোট সংখ্যাটির সমানুপাতে। ইউক্লিডের অ্যালগরিদম অনেক দ্রুত: প্রতি দুই ধাপে বড় সংখ্যাটি অন্তত অর্ধেক হয়ে যায়, তাই ধাপের সংখ্যা বাড়ে সংখ্যার অঙ্কসংখ্যার সঙ্গে, সংখ্যার মানের সঙ্গে নয়।',
          ],
          [
            'Trial division is O(min(a, b)). In Euclid’s algorithm a mod b < a/2 whenever b ≤ a, so every two iterations at least halve the first argument, giving O(log min(a, b)) divisions. The worst case occurs for consecutive Fibonacci numbers.',
            'একে একে ভাগ করে দেখলে লাগে O(min(a, b)) সময়। ইউক্লিডের (Euclid) অ্যালগরিদমে b ≤ a হলে a mod b < a/2, তাই প্রতি দুই ধাপে প্রথম সংখ্যাটি অন্তত অর্ধেক হয় এবং ভাগ লাগে O(log min(a, b)) বার। সবচেয়ে খারাপ অবস্থা হয় পরপর দুটি ফিবোনাচ্চি সংখ্যার ক্ষেত্রে।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: you want to cover a 48 cm × 18 cm board with equal square tiles and no cutting. The biggest tile that works is 6 cm, the GCD. Euclid finds it by cutting off the biggest square that fits, again and again: 18 cm squares, then 12 cm, then 6 cm.',
          bn: 'রোজকার উদাহরণ: ৪৮ সেমি × ১৮ সেমি একটি বোর্ড সমান বর্গাকার টাইল দিয়ে ঢাকতে চাও, কোনো টাইল না কেটে। সবচেয়ে বড় যে টাইল চলবে তা ৬ সেমি — গসাগু। ইউক্লিড এটা পায় বারবার সবচেয়ে বড় বর্গ কেটে নিয়ে: আগে ১৮ সেমি, তারপর ১২ সেমি, তারপর ৬ সেমি।',
        },
        quiz: quiz(
          ['Why is Euclid’s algorithm faster than trying every divisor?', 'প্রতিটি গুণনীয়ক পরীক্ষার চেয়ে ইউক্লিডের অ্যালগরিদম দ্রুত কেন?'],
          [['The numbers shrink quickly at each step', 'প্রতি ধাপে সংখ্যাগুলো দ্রুত ছোট হয়'], ['It only works on small numbers', 'এটি শুধু ছোট সংখ্যায় কাজ করে'], ['It guesses the answer', 'এটি উত্তর অনুমান করে']],
          ['Every two steps at least halve the larger number, so few steps are needed.', 'প্রতি দুই ধাপে বড় সংখ্যাটি অন্তত অর্ধেক হয়, তাই অল্প ধাপেই কাজ শেষ।'],
        ),
      }),
      block({
        id: 'gc-5', type: 'example', concepts: ['euclid_algorithm', 'gcd'], passages: ['lib-algo-euclid', 'lib-algo-steps'], anchors: ['48', '18', '12', '6'],
        text: same(
          'Worked example. gcd(48, 18): 48 mod 18 = 12, so continue with gcd(18, 12). 18 mod 12 = 6, so continue with gcd(12, 6). 12 mod 6 = 0, so the answer is 6. Three divisions. Trying every number from 1 to 18 would take 18 checks.',
          'সমাধানসহ উদাহরণ। gcd(৪৮, ১৮): ৪৮ mod ১৮ = ১২, তাই এবার gcd(১৮, ১২)। ১৮ mod ১২ = ৬, তাই এবার gcd(১২, ৬)। ১২ mod ৬ = ০, তাই উত্তর ৬। তিনটি ভাগ। ১ থেকে ১৮ পর্যন্ত প্রতিটি সংখ্যা পরীক্ষা করলে লাগত ১৮টি যাচাই।',
        ),
      }),
    ],
  },

  // ── Discrete Mathematics ─────────────────────────────────────────────
  {
    id: 'propositional-logic',
    subject: 'cs',
    title: { en: 'Propositional logic: truth tables and “if… then”', bn: 'প্রপোজিশনাল লজিক: ট্রুথ টেবিল ও “যদি… তবে”' },
    summary: {
      en: 'Propositions, the connectives AND, OR and NOT, and why an implication with a false start is true.',
      bn: 'প্রপোজিশন, AND, OR ও NOT সংযোজক, আর কেন শুরুটা মিথ্যা হলে ইমপ্লিকেশন সত্য হয়।',
    },
    videos: [
      { id: 'DvVkmkXiD0g', title: 'Propositional Logic - Lecture 1 | Discrete Mathematics Bangla Tutorial', relation: 'covers' },
      { id: 'O8mxDRL6JlQ', title: 'Propositional Logic | Discrete Mathematics Bangla | CSE212', relation: 'covers' },
    ],
    blocks: [
      block({
        id: 'pl-1', type: 'text', concepts: ['proposition'], passages: ['lib-dm-proposition'], anchors: ['proposition'],
        text: levels(
          [
            'A proposition is a sentence that is either true or false, never both. “Dhaka is in Bangladesh” is a proposition (true). “Close the door” is not, because a command is neither true nor false.',
            'প্রপোজিশন হলো এমন বাক্য, যা হয় সত্য নয় মিথ্যা — দুটো একসঙ্গে নয়। “ঢাকা বাংলাদেশে অবস্থিত” একটি প্রপোজিশন (সত্য)। “দরজা বন্ধ করো” প্রপোজিশন নয়, কারণ আদেশ সত্যও নয়, মিথ্যাও নয়।',
          ],
          [
            'A proposition is a declarative statement with exactly one truth value: true or false. “2 + 3 = 5” and “Dhaka is in Bangladesh” are propositions; questions, commands and statements like “x + 1 = 5” (where x is unknown) are not. We name propositions with letters such as p and q.',
            'প্রপোজিশন হলো এমন বিবৃতিমূলক বাক্য, যার ঠিক একটি ট্রুথ ভ্যালু আছে: সত্য বা মিথ্যা। “২ + ৩ = ৫” এবং “ঢাকা বাংলাদেশে অবস্থিত” প্রপোজিশন; প্রশ্ন, আদেশ, কিংবা “x + 1 = 5”-এর মতো বাক্য (যেখানে x অজানা) প্রপোজিশন নয়। প্রপোজিশনের নাম দিই p, q-এর মতো অক্ষর দিয়ে।',
          ],
          [
            'A proposition is a declarative sentence that is true or false but not both. Open sentences such as “x + 1 = 5” become propositions only once the variable is bound or assigned. Propositional variables p, q, r stand for arbitrary propositions.',
            'প্রপোজিশন হলো এমন বিবৃতিমূলক বাক্য, যা সত্য অথবা মিথ্যা, কিন্তু দুটোই নয়। “x + 1 = 5”-এর মতো ওপেন সেন্টেন্স প্রপোজিশন হয় কেবল তখন, যখন চলকটি বাউন্ড হয় বা মান পায়। প্রপোজিশনাল চলক p, q, r যেকোনো প্রপোজিশনের প্রতিনিধি।',
          ],
        ),
        quiz: quiz(
          ['Which of these is a proposition?', 'নিচের কোনটি প্রপোজিশন?'],
          [['“7 is an even number.”', '“৭ একটি জোড় সংখ্যা।”'], ['“Please sit down.”', '“অনুগ্রহ করে বসো।”'], ['“What time is it?”', '“কয়টা বাজে?”']],
          ['It is false, but it has a definite truth value, so it is a proposition. Commands and questions have none.', 'এটি মিথ্যা, কিন্তু এর নির্দিষ্ট ট্রুথ ভ্যালু আছে, তাই এটি প্রপোজিশন। আদেশ ও প্রশ্নের তা নেই।'],
        ),
      }),
      block({
        id: 'pl-2', type: 'text', concepts: ['logical_connective'], passages: ['lib-dm-connectives'], anchors: ['∧', '∨', '¬'],
        text: levels(
          [
            'We join propositions with connectives. NOT p (¬p) flips the value. p AND q (p ∧ q) is true only when both are true. p OR q (p ∨ q) is true when at least one is true, including when both are.',
            'প্রপোজিশনগুলোকে আমরা সংযোজক দিয়ে জুড়ি। NOT p (¬p) মানটা উল্টে দেয়। p AND q (p ∧ q) সত্য হয় শুধু দুটোই সত্য হলে। p OR q (p ∨ q) সত্য হয় অন্তত একটি সত্য হলে — দুটোই সত্য হলেও।',
          ],
          [
            'Connectives build compound propositions. Negation ¬p reverses the truth value. Conjunction p ∧ q is true only when both parts are true. Disjunction p ∨ q is inclusive: it is false only when both parts are false.',
            'সংযোজক দিয়ে যৌগিক প্রপোজিশন তৈরি হয়। নেগেশন ¬p ট্রুথ ভ্যালু উল্টে দেয়। কনজাংশন p ∧ q সত্য হয় শুধু দুটি অংশই সত্য হলে। ডিসজাংশন p ∨ q ইনক্লুসিভ: এটি মিথ্যা হয় শুধু দুটি অংশই মিথ্যা হলে।',
          ],
          [
            'The connectives ¬, ∧ and ∨ are truth-functional: the value of the compound depends only on the values of its parts. ∨ denotes inclusive disjunction; exclusive or (⊕) is true when exactly one operand is true. The set {¬, ∧, ∨} is functionally complete.',
            'সংযোজক ¬, ∧ ও ∨ ট্রুথ-ফাংশনাল: যৌগিক বাক্যের মান নির্ভর করে শুধু তার অংশগুলোর মানের ওপর। ∨ বোঝায় ইনক্লুসিভ ডিসজাংশন; এক্সক্লুসিভ অর (⊕) সত্য হয় যখন ঠিক একটি অপারেন্ড সত্য। {¬, ∧, ∨} সেটটি ফাংশনালি কমপ্লিট।',
          ],
        ),
        quiz: quiz(
          ['p is true and q is false. What is p ∨ q?', 'p সত্য আর q মিথ্যা। p ∨ q কী?'],
          [['True', 'সত্য'], ['False', 'মিথ্যা'], ['Cannot say', 'বলা যায় না']],
          ['OR is true when at least one part is true. Here p is true.', 'অন্তত একটি অংশ সত্য হলেই OR সত্য। এখানে p সত্য।'],
        ),
      }),
      block({
        id: 'pl-3', type: 'formula', concepts: ['implication'], passages: ['lib-dm-implication'], anchors: ['p → q'],
        text: same('p → q is false only when p is true and q is false', 'p → q মিথ্যা হয় শুধু তখন, যখন p সত্য আর q মিথ্যা'),
      }),
      block({
        id: 'pl-4', type: 'text', concepts: ['implication'], passages: ['lib-dm-implication'], anchors: ['p → q'],
        text: levels(
          [
            'p → q reads “if p then q”. Think of a promise: “If you score 80, I will buy you a book.” The promise is broken only if you score 80 and get no book. If you do not score 80, the promise is not broken, so the statement counts as true.',
            'p → q পড়া হয় “যদি p তবে q”। একটা প্রতিশ্রুতির কথা ভাবো: “তুমি ৮০ পেলে আমি তোমাকে একটা বই কিনে দেব।” প্রতিশ্রুতি ভাঙে শুধু তখন, যখন তুমি ৮০ পেলে কিন্তু বই পেলে না। ৮০ না পেলে প্রতিশ্রুতি ভাঙেনি, তাই বাক্যটি সত্য ধরা হয়।',
          ],
          [
            'The implication p → q (“if p then q”) is false in exactly one case: p true and q false. When p is false the implication is true whatever q is; this is sometimes called vacuous truth. It is logically equivalent to ¬p ∨ q.',
            'ইমপ্লিকেশন p → q (“যদি p তবে q”) মিথ্যা হয় ঠিক একটি ক্ষেত্রে: p সত্য আর q মিথ্যা। p মিথ্যা হলে q যা-ই হোক, ইমপ্লিকেশন সত্য; একে কখনো কখনো ভ্যাকিউয়াস ট্রুথ বলা হয়। এটি ¬p ∨ q-এর লজিক্যালি সমতুল্য।',
          ],
          [
            'Material implication p → q is defined truth-functionally as ¬p ∨ q; it asserts no causal link between p and q. It is equivalent to its contrapositive ¬q → ¬p but not to its converse q → p, a distinction that underlies proof by contraposition.',
            'ম্যাটেরিয়াল ইমপ্লিকেশন p → q-কে ট্রুথ-ফাংশনালভাবে ¬p ∨ q হিসেবে সংজ্ঞায়িত করা হয়; এটি p ও q-এর মধ্যে কোনো কার্যকারণ সম্পর্ক দাবি করে না। এটি তার কন্ট্রাপজিটিভ ¬q → ¬p-এর সমতুল্য, কিন্তু কনভার্স q → p-এর নয়; কন্ট্রাপজিশন দিয়ে প্রমাণের ভিত্তি এই পার্থক্য।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: “If it rains, the match is cancelled.” On a dry day the match may or may not happen; either way nobody lied. The sentence is false only on a rainy day when the match still goes ahead.',
          bn: 'রোজকার উদাহরণ: “বৃষ্টি হলে ম্যাচ বাতিল।” শুকনো দিনে ম্যাচ হতেও পারে, না-ও হতে পারে; দুই ক্ষেত্রেই কেউ মিথ্যা বলেনি। বাক্যটি মিথ্যা হয় শুধু সেই বৃষ্টির দিনে, যেদিন ম্যাচ তবুও হয়।',
        },
        quiz: quiz(
          ['p is false and q is false. What is p → q?', 'p মিথ্যা আর q মিথ্যা। p → q কী?'],
          [['True', 'সত্য'], ['False', 'মিথ্যা'], ['Cannot say', 'বলা যায় না']],
          ['An implication is false only when p is true and q is false. Here p is false, so it is true.', 'ইমপ্লিকেশন মিথ্যা হয় শুধু p সত্য ও q মিথ্যা হলে। এখানে p মিথ্যা, তাই এটি সত্য।'],
        ),
      }),
      block({
        id: 'pl-5', type: 'example', concepts: ['truth_table', 'implication'], passages: ['lib-dm-implication', 'lib-dm-table'], anchors: ['4'],
        text: same(
          'Worked example. Truth table for p → q. p true, q true: true. p true, q false: false. p false, q true: true. p false, q false: true. The column matches ¬p ∨ q in all 4 rows, so the two are equivalent.',
          'সমাধানসহ উদাহরণ। p → q-এর ট্রুথ টেবিল। p সত্য, q সত্য: সত্য। p সত্য, q মিথ্যা: মিথ্যা। p মিথ্যা, q সত্য: সত্য। p মিথ্যা, q মিথ্যা: সত্য। ৪টি সারিতেই কলামটি ¬p ∨ q-এর সঙ্গে মেলে, তাই দুটো সমতুল্য।',
        ),
      }),
    ],
  },

  // ── Digital Logic Design ─────────────────────────────────────────────
  {
    id: 'logic-gates',
    subject: 'cs',
    title: { en: 'Logic gates: from AND, OR, NOT to XOR', bn: 'লজিক গেট: AND, OR, NOT থেকে XOR' },
    summary: {
      en: 'What each gate outputs, and how to build XOR from the basic gates.',
      bn: 'কোন গেট কী আউটপুট দেয়, আর মৌলিক গেট দিয়ে কীভাবে XOR বানানো যায়।',
    },
    videos: [
      { id: 'f3-Y_57GOqs', title: 'Number Systems, Boolean Algebra & Logic Gates | DLD Bangla', relation: 'covers' },
      { id: 'y8BzRpCKnLo', title: 'Introduction to All Logic Gates | AND, OR, NOT, NAND, NOR, XOR, XNOR Explained', relation: 'covers' },
    ],
    blocks: [
      block({
        id: 'lg-1', type: 'text', concepts: ['logic_gate'], passages: ['lib-dld-basic'], anchors: ['AND', 'OR', 'NOT'],
        text: levels(
          [
            'A logic gate is a tiny circuit with inputs and one output, each either 0 or 1. AND gives 1 only if all inputs are 1. OR gives 1 if at least one input is 1. NOT has one input and flips it.',
            'লজিক গেট হলো ছোট্ট একটি সার্কিট, যার ইনপুট আর একটি আউটপুট থাকে — প্রতিটি হয় ০ নয় ১। AND ১ দেয় শুধু সব ইনপুট ১ হলে। OR ১ দেয় অন্তত একটি ইনপুট ১ হলে। NOT-এর ইনপুট একটি, আর সে সেটা উল্টে দেয়।',
          ],
          [
            'Logic gates are the building blocks of digital circuits. Signals are 0 or 1. An AND gate outputs 1 only when every input is 1; an OR gate outputs 1 when any input is 1; a NOT gate (inverter) outputs the opposite of its single input. A truth table lists the output for every input combination.',
            'লজিক গেট ডিজিটাল সার্কিটের মূল উপাদান। সিগন্যাল হয় ০ নয় ১। AND গেট ১ দেয় শুধু সব ইনপুট ১ হলে; OR গেট ১ দেয় যেকোনো একটি ইনপুট ১ হলে; NOT গেট (ইনভার্টার) তার একমাত্র ইনপুটের উল্টোটা দেয়। ট্রুথ টেবিলে প্রতিটি ইনপুট সমন্বয়ের আউটপুট লেখা থাকে।',
          ],
          [
            'Gates implement Boolean functions on binary signals. AND, OR and NOT realise the product A·B, the sum A + B and the complement A′; together they form a functionally complete set, so any truth table can be realised as a sum of products.',
            'গেটগুলো বাইনারি সিগন্যালের ওপর বুলিয়ান ফাংশন বাস্তবায়ন করে। AND, OR ও NOT যথাক্রমে গুণফল A·B, যোগফল A + B ও কমপ্লিমেন্ট A′ বাস্তবায়ন করে; এই তিনটি মিলে ফাংশনালি কমপ্লিট সেট, তাই যেকোনো ট্রুথ টেবিলকে সাম অব প্রোডাক্টস আকারে বানানো যায়।',
          ],
        ),
        quiz: quiz(
          ['An AND gate has inputs 1 and 0. What is the output?', 'একটি AND গেটের ইনপুট ১ ও ০। আউটপুট কত?'],
          [['0', '০'], ['1', '১'], ['It depends', 'নির্ভর করে']],
          ['AND outputs 1 only when every input is 1. One input is 0, so the output is 0.', 'সব ইনপুট ১ হলেই কেবল AND ১ দেয়। একটি ইনপুট ০, তাই আউটপুট ০।'],
        ),
      }),
      block({
        id: 'lg-2', type: 'text', concepts: ['xor_gate', 'logic_gate'], passages: ['lib-dld-xor'], anchors: ['XOR'],
        text: levels(
          [
            'XOR means “exclusive OR”. It gives 1 when the two inputs are different, and 0 when they are the same. So inputs 0 and 1 give 1, but inputs 1 and 1 give 0. That last row is where XOR differs from OR.',
            'XOR মানে “এক্সক্লুসিভ অর”। দুটি ইনপুট আলাদা হলে এটি ১ দেয়, একই হলে ০ দেয়। তাই ইনপুট ০ ও ১ হলে আউটপুট ১, কিন্তু ইনপুট ১ ও ১ হলে আউটপুট ০। এই শেষ সারিতেই XOR আর OR-এর পার্থক্য।',
          ],
          [
            'The XOR (exclusive OR) gate outputs 1 exactly when its two inputs differ. It matches OR except when both inputs are 1, where XOR gives 0. XOR is the heart of binary addition: the sum bit of two bits is their XOR. NAND and NOR are simply AND and OR followed by NOT.',
            'XOR (এক্সক্লুসিভ অর) গেট ১ দেয় ঠিক তখন, যখন তার দুটি ইনপুট আলাদা। দুটি ইনপুটই ১ হওয়া ছাড়া বাকি সবখানে এটি OR-এর মতো; সেখানে XOR দেয় ০। বাইনারি যোগের কেন্দ্রে আছে XOR: দুটি বিটের যোগফল বিট হলো তাদের XOR। NAND ও NOR হলো AND ও OR-এর পরে একটি NOT।',
          ],
          [
            'XOR computes addition modulo 2: A ⊕ B = 1 if and only if A ≠ B. It is the sum output of a half adder (the carry is A·B) and the basis of parity generation. NAND and NOR are each universal: any Boolean function can be built from one of them alone.',
            'XOR মডুলো ২ যোগ হিসাব করে: A ⊕ B = 1 যদি এবং কেবল যদি A ≠ B। এটি হাফ অ্যাডারের সাম আউটপুট (ক্যারি হলো A·B) এবং প্যারিটি তৈরির ভিত্তি। NAND ও NOR প্রত্যেকে ইউনিভার্সাল: শুধু একটি দিয়েই যেকোনো বুলিয়ান ফাংশন বানানো যায়।',
          ],
        ),
        quiz: quiz(
          ['An XOR gate has inputs 1 and 1. What is the output?', 'একটি XOR গেটের ইনপুট ১ ও ১। আউটপুট কত?'],
          [['0', '০'], ['1', '১'], ['2', '২']],
          ['XOR outputs 1 only when the inputs differ. They are the same, so the output is 0.', 'ইনপুট আলাদা হলেই কেবল XOR ১ দেয়। এখানে দুটো একই, তাই আউটপুট ০।'],
        ),
      }),
      block({
        id: 'lg-3', type: 'formula', concepts: ['xor_gate', 'boolean_expression'], passages: ['lib-dld-build'], anchors: ['A·B′ + A′·B'],
        text: same('A XOR B = A·B′ + A′·B', 'A XOR B = A·B′ + A′·B'),
      }),
      block({
        id: 'lg-4', type: 'text', concepts: ['boolean_expression', 'xor_gate'], passages: ['lib-dld-build'], anchors: ['NOT', 'AND', 'OR'],
        text: levels(
          [
            'You can build XOR from the basic gates. Read the formula: (A and not B) or (not A and B). That needs 2 NOT gates, 2 AND gates and 1 OR gate. Draw it left to right: inputs, NOT gates, AND gates, then the OR gate.',
            'মৌলিক গেট দিয়েই XOR বানানো যায়। সূত্রটা পড়ো: (A এবং B নয়) অথবা (A নয় এবং B)। এতে লাগে ২টি NOT, ২টি AND আর ১টি OR গেট। বাঁ থেকে ডানে আঁকো: ইনপুট, NOT গেট, AND গেট, তারপর OR গেট।',
          ],
          [
            'Any Boolean expression maps directly to a circuit: each operator becomes a gate. A·B′ + A′·B needs 2 NOT gates for the complements, 2 AND gates for the products and 1 OR gate for the sum. Checking all four input rows against the truth table confirms the circuit.',
            'যেকোনো বুলিয়ান এক্সপ্রেশন সরাসরি সার্কিটে রূপ নেয়: প্রতিটি অপারেটর হয় একটি গেট। A·B′ + A′·B-এর জন্য কমপ্লিমেন্টে লাগে ২টি NOT গেট, গুণফলে ২টি AND গেট আর যোগফলে ১টি OR গেট। চারটি ইনপুট সারি ট্রুথ টেবিলের সঙ্গে মিলিয়ে দেখলে সার্কিটটি নিশ্চিত হয়।',
          ],
          [
            'The sum-of-products form A·B′ + A′·B is a two-level AND–OR realisation: 2 NOT, 2 AND and 1 OR gate. Applying De Morgan’s theorem converts it to NAND-only logic; XOR can be realised with four 2-input NAND gates.',
            'সাম-অব-প্রোডাক্টস রূপ A·B′ + A′·B একটি দুই-স্তরের AND–OR বাস্তবায়ন: ২টি NOT, ২টি AND ও ১টি OR গেট। ডি মরগ্যানের উপপাদ্য প্রয়োগ করলে এটি শুধু NAND দিয়ে বানানো যায়; চারটি ২-ইনপুট NAND গেট দিয়ে XOR তৈরি করা সম্ভব।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: a staircase light with one switch downstairs and one upstairs. Flipping either switch changes the light. The light is on when the two switches are in different positions: that is XOR.',
          bn: 'রোজকার উদাহরণ: সিঁড়ির বাতি, যার একটি সুইচ নিচে আর একটি ওপরে। যেকোনো একটি সুইচ টিপলেই বাতির অবস্থা বদলায়। দুটি সুইচ ভিন্ন অবস্থানে থাকলে বাতি জ্বলে: এটাই XOR।',
        },
        quiz: quiz(
          ['How many NOT gates does A·B′ + A′·B need?', 'A·B′ + A′·B বানাতে কয়টি NOT গেট লাগে?'],
          [['2', '২'], ['1', '১'], ['4', '৪']],
          ['One NOT gate makes B′ and another makes A′.', 'একটি NOT গেট B′ বানায়, আরেকটি বানায় A′।'],
        ),
      }),
      block({
        id: 'lg-5', type: 'example', concepts: ['xor_gate', 'truth_table'], passages: ['lib-dld-xor', 'lib-dld-build'], anchors: ['0', '1'],
        text: same(
          'Worked example. XOR truth table: A = 0, B = 0 gives 0. A = 0, B = 1 gives 1. A = 1, B = 0 gives 1. A = 1, B = 1 gives 0. Check the formula on the row A = 1, B = 0: A·B′ = 1·1 = 1 and A′·B = 0·0 = 0, so the output is 1 + 0 = 1.',
          'সমাধানসহ উদাহরণ। XOR-এর ট্রুথ টেবিল: A = ০, B = ০ হলে ০। A = ০, B = ১ হলে ১। A = ১, B = ০ হলে ১। A = ১, B = ১ হলে ০। A = ১, B = ০ সারিতে সূত্রটি মিলিয়ে দেখো: A·B′ = ১·১ = ১ এবং A′·B = ০·০ = ০, তাই আউটপুট ১ + ০ = ১।',
        ),
      }),
    ],
  },

  // ── Electric Circuits ────────────────────────────────────────────────
  {
    id: 'ohms-law',
    subject: 'ee',
    title: { en: 'Ohm’s law, series and parallel circuits', bn: 'ওহমের সূত্র, সিরিজ ও প্যারালাল সার্কিট' },
    summary: {
      en: 'V = IR, and how resistors share voltage in series and current in parallel.',
      bn: 'V = IR, আর রেজিস্টর কীভাবে সিরিজে ভোল্টেজ ও প্যারালালে কারেন্ট ভাগ করে নেয়।',
    },
    videos: [
      { id: 'qme4-SC_gu4', title: 'Electrical Circuit Basics in Bangla | Charge, Current, Voltage, Resistance & Ohm’s Law', relation: 'covers' },
      { id: 'TcqIacoRyB4', title: 'Series & Parallel DC Circuits | Step-by-Step Problem Solving in Bangla', relation: 'covers' },
    ],
    blocks: [
      block({
        id: 'oh-1', type: 'text', concepts: ['ohms_law'], passages: ['lib-ec-ohm'], anchors: ['Ohm’s law'],
        text: levels(
          [
            'Voltage (V) is the push, current (I) is the flow, and resistance (R) is how hard it is to flow. Ohm’s law links them: voltage = current × resistance. More push gives more flow; more resistance gives less.',
            'ভোল্টেজ (V) হলো ঠেলা, কারেন্ট (I) হলো প্রবাহ, আর রেজিস্ট্যান্স (R) হলো প্রবাহে বাধা। ওহমের সূত্র এদের জুড়ে দেয়: ভোল্টেজ = কারেন্ট × রেজিস্ট্যান্স। ঠেলা বাড়লে প্রবাহ বাড়ে; বাধা বাড়লে প্রবাহ কমে।',
          ],
          [
            'Voltage, measured in volts (V), drives charge through a circuit; current, in amperes (A), is the rate of flow; resistance, in ohms (Ω), opposes it. Ohm’s law states that the voltage across a resistor equals the current through it times its resistance.',
            'ভোল্টেজ, যার একক ভোল্ট (V), সার্কিটে চার্জকে চালিত করে; কারেন্ট, একক অ্যাম্পিয়ার (A), হলো প্রবাহের হার; রেজিস্ট্যান্স, একক ওহম (Ω), প্রবাহে বাধা দেয়। ওহমের সূত্র বলে: কোনো রেজিস্টরের দুই প্রান্তের ভোল্টেজ সমান তার মধ্য দিয়ে যাওয়া কারেন্ট গুণ তার রেজিস্ট্যান্স।',
          ],
          [
            'For an ohmic element the voltage–current characteristic is linear, which is Ohm’s law: V = IR, with R constant at fixed temperature. Power dissipated is P = VI = I²R. Non-ohmic devices such as diodes do not obey this proportionality.',
            'ওহমিক উপাদানের ভোল্টেজ–কারেন্ট সম্পর্ক রৈখিক, এটাই ওহমের সূত্র: V = IR, নির্দিষ্ট তাপমাত্রায় R ধ্রুব। ব্যয়িত ক্ষমতা P = VI = I²R। ডায়োডের মতো নন-ওহমিক ডিভাইস এই সমানুপাত মানে না।',
          ],
        ),
        quiz: quiz(
          ['A 12 V battery is connected across a 4 Ω resistor. What current flows?', '১২ V ব্যাটারি একটি ৪ Ω রেজিস্টরের দুই প্রান্তে যুক্ত। কত কারেন্ট প্রবাহিত হবে?'],
          [['3 A', '৩ A'], ['48 A', '৪৮ A'], ['8 A', '৮ A']],
          ['I = V ÷ R = 12 ÷ 4 = 3 A.', 'I = V ÷ R = ১২ ÷ ৪ = ৩ A।'],
        ),
      }),
      block({
        id: 'oh-2', type: 'formula', concepts: ['ohms_law'], passages: ['lib-ec-ohm'], anchors: ['V = I × R'],
        text: same('V = I × R', 'V = I × R'),
      }),
      block({
        id: 'oh-3', type: 'text', concepts: ['series_circuit'], passages: ['lib-ec-series'], anchors: ['series', 'R1 + R2'],
        text: levels(
          [
            'In a series circuit the parts are in one line, so the same current goes through each. The resistances add up: total R = R1 + R2. The battery voltage is shared, and the bigger resistor takes the bigger share.',
            'সিরিজ সার্কিটে উপাদানগুলো এক লাইনে থাকে, তাই প্রতিটির মধ্য দিয়ে একই কারেন্ট যায়। রেজিস্ট্যান্সগুলো যোগ হয়: মোট R = R1 + R2। ব্যাটারির ভোল্টেজ ভাগ হয়ে যায়, আর বড় রেজিস্টর বড় ভাগ পায়।',
          ],
          [
            'Resistors in series carry the same current because there is only one path. Their resistances add: R = R1 + R2. The source voltage divides between them in proportion to their resistances, which is the voltage divider rule.',
            'সিরিজে থাকা রেজিস্টরগুলোর মধ্য দিয়ে একই কারেন্ট যায়, কারণ পথ একটাই। তাদের রেজিস্ট্যান্স যোগ হয়: R = R1 + R2। উৎসের ভোল্টেজ তাদের রেজিস্ট্যান্সের অনুপাতে ভাগ হয় — এটাই ভোল্টেজ ডিভাইডার রুল।',
          ],
          [
            'Elements in series share one current by Kirchhoff’s current law, and by Kirchhoff’s voltage law the element voltages sum to the source voltage. Hence R = R1 + R2 and V1 = V·R1 ÷ (R1 + R2), the voltage divider rule.',
            'কির্শফের কারেন্ট সূত্র অনুযায়ী সিরিজের উপাদানগুলোতে কারেন্ট একই, আর কির্শফের ভোল্টেজ সূত্র অনুযায়ী উপাদানগুলোর ভোল্টেজের যোগফল উৎসের ভোল্টেজের সমান। তাই R = R1 + R2 এবং V1 = V·R1 ÷ (R1 + R2) — ভোল্টেজ ডিভাইডার রুল।',
          ],
        ),
        quiz: quiz(
          ['Two resistors in series always have the same…', 'সিরিজে থাকা দুটি রেজিস্টরে সবসময় একই থাকে…'],
          [['current', 'কারেন্ট'], ['voltage', 'ভোল্টেজ'], ['power', 'ক্ষমতা']],
          ['There is only one path, so the same current passes through both.', 'পথ একটাই, তাই দুটির মধ্য দিয়ে একই কারেন্ট যায়।'],
        ),
      }),
      block({
        id: 'oh-4', type: 'text', concepts: ['parallel_circuit'], passages: ['lib-ec-parallel'], anchors: ['parallel'],
        text: levels(
          [
            'In a parallel circuit each resistor has its own branch across the battery, so each gets the full voltage. The currents add up. Adding another branch gives the current one more path, so the total resistance goes down.',
            'প্যারালাল সার্কিটে প্রতিটি রেজিস্টরের নিজস্ব শাখা থাকে ব্যাটারির দুই প্রান্তে, তাই প্রতিটি পুরো ভোল্টেজ পায়। কারেন্টগুলো যোগ হয়। নতুন শাখা যোগ করলে কারেন্ট আরেকটা পথ পায়, তাই মোট রেজিস্ট্যান্স কমে।',
          ],
          [
            'Resistors in parallel have the same voltage across them, and the total current is the sum of the branch currents. The combined resistance follows 1/R = 1/R1 + 1/R2 and is always smaller than the smallest branch resistance.',
            'প্যারালালে থাকা রেজিস্টরগুলোর দুই প্রান্তে ভোল্টেজ একই, আর মোট কারেন্ট শাখা কারেন্টগুলোর যোগফল। মিলিত রেজিস্ট্যান্স 1/R = 1/R1 + 1/R2 মেনে চলে এবং সবসময় সবচেয়ে ছোট শাখা রেজিস্ট্যান্সের চেয়েও ছোট হয়।',
          ],
          [
            'Branches in parallel share one voltage; conductances add, so 1/R = 1/R1 + 1/R2, or R = R1·R2 ÷ (R1 + R2) for two resistors. Branch currents divide inversely with resistance (the current divider rule), and the equivalent resistance is below the smallest branch value.',
            'প্যারালাল শাখাগুলোতে ভোল্টেজ একই; কন্ডাক্ট্যান্স যোগ হয়, তাই 1/R = 1/R1 + 1/R2, অথবা দুটি রেজিস্টরের জন্য R = R1·R2 ÷ (R1 + R2)। শাখা কারেন্ট রেজিস্ট্যান্সের ব্যস্তানুপাতে ভাগ হয় (কারেন্ট ডিভাইডার রুল), আর সমতুল্য রেজিস্ট্যান্স সবচেয়ে ছোট শাখার মানের চেয়েও কম।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: the sockets in your home are wired in parallel. Every device gets the full mains voltage, and switching one off does not turn the others off. Each extra device adds to the total current.',
          bn: 'রোজকার উদাহরণ: তোমার বাসার সকেটগুলো প্যারালালে যুক্ত। প্রতিটি যন্ত্র লাইনের পুরো ভোল্টেজ পায়, আর একটি বন্ধ করলে অন্যগুলো বন্ধ হয় না। প্রতিটি বাড়তি যন্ত্র মোট কারেন্ট বাড়ায়।',
        },
        quiz: quiz(
          ['Adding another resistor in parallel makes the total resistance…', 'প্যারালালে আরেকটি রেজিস্টর যোগ করলে মোট রেজিস্ট্যান্স…'],
          [['smaller', 'কমে'], ['bigger', 'বাড়ে'], ['stay the same', 'একই থাকে']],
          ['A new branch is one more path for current, so the combined resistance drops.', 'নতুন শাখা মানে কারেন্টের আরেকটি পথ, তাই মিলিত রেজিস্ট্যান্স কমে।'],
        ),
      }),
      block({
        id: 'oh-5', type: 'example', concepts: ['series_circuit', 'parallel_circuit', 'ohms_law'], passages: ['lib-ec-series', 'lib-ec-parallel'],
        anchors: ['12 V', '4 Ω', '12 Ω', '16 Ω', '0.75 A', '3 V', '9 V', '4 A', '3 Ω'],
        text: same(
          'Worked example. A 12 V battery with R1 = 4 Ω and R2 = 12 Ω. In series: R = 16 Ω, I = 12 ÷ 16 = 0.75 A, V1 = 3 V and V2 = 9 V. In parallel: I1 = 12 ÷ 4 = 3 A and I2 = 12 ÷ 12 = 1 A, total 4 A, so R = 12 ÷ 4 = 3 Ω.',
          'সমাধানসহ উদাহরণ। একটি ১২ V ব্যাটারি, R1 = ৪ Ω এবং R2 = ১২ Ω। সিরিজে: R = ১৬ Ω, I = ১২ ÷ ১৬ = ০.৭৫ A, V1 = ৩ V এবং V2 = ৯ V। প্যারালালে: I1 = ১২ ÷ ৪ = ৩ A এবং I2 = ১২ ÷ ১২ = ১ A, মোট ৪ A, তাই R = ১২ ÷ ৪ = ৩ Ω।',
        ),
      }),
    ],
  },

  // ── Machine Learning ─────────────────────────────────────────────────
  {
    id: 'confusion-matrix',
    subject: 'ml',
    title: { en: 'Confusion matrix: precision and recall', bn: 'কনফিউশন ম্যাট্রিক্স: প্রিসিশন ও রিকল' },
    summary: {
      en: 'Count the four outcomes, then see why accuracy alone can mislead.',
      bn: 'চার ধরনের ফল গুনে দেখো, তারপর বোঝো কেন শুধু অ্যাকুরেসি বিভ্রান্ত করতে পারে।',
    },
    videos: [{ id: 'sdFe96Fhpq8', title: 'Confusion Matrix, Precision, Recall & F1 Score Explained | Machine Learning Bangla Tutorial', relation: 'covers' }],
    blocks: [
      block({
        id: 'cm-1', type: 'text', concepts: ['confusion_matrix', 'false_positive', 'false_negative'], passages: ['lib-ml-cm'], anchors: ['TP', 'FP', 'FN', 'TN'],
        text: levels(
          [
            'After a spam filter decides, each email lands in one of four boxes. Spam caught: true positive (TP). Good email flagged by mistake: false positive (FP). Spam missed: false negative (FN). Good email left alone: true negative (TN). The table of these four counts is the confusion matrix.',
            'স্প্যাম ফিল্টার সিদ্ধান্ত নেওয়ার পর প্রতিটি ইমেইল চারটি ঘরের একটিতে পড়ে। ধরা পড়া স্প্যাম: ট্রু পজিটিভ (TP)। ভুল করে চিহ্নিত ভালো ইমেইল: ফলস পজিটিভ (FP)। ফসকে যাওয়া স্প্যাম: ফলস নেগেটিভ (FN)। ঠিকভাবে ছেড়ে দেওয়া ভালো ইমেইল: ট্রু নেগেটিভ (TN)। এই চার সংখ্যার টেবিলই কনফিউশন ম্যাট্রিক্স।',
          ],
          [
            'A confusion matrix compares predictions with the truth. For a spam filter: true positives (TP) are spam correctly flagged, false positives (FP) are legitimate emails flagged, false negatives (FN) are spam missed and true negatives (TN) are legitimate emails passed. Every evaluation metric is built from these four counts.',
            'কনফিউশন ম্যাট্রিক্স মডেলের অনুমানকে আসল উত্তরের সঙ্গে তুলনা করে। স্প্যাম ফিল্টারের ক্ষেত্রে: ট্রু পজিটিভ (TP) হলো ঠিকভাবে চিহ্নিত স্প্যাম, ফলস পজিটিভ (FP) হলো চিহ্নিত হওয়া আসল ইমেইল, ফলস নেগেটিভ (FN) হলো ফসকে যাওয়া স্প্যাম, আর ট্রু নেগেটিভ (TN) হলো ঠিকভাবে পার হওয়া আসল ইমেইল। মূল্যায়নের প্রতিটি মেট্রিক এই চারটি সংখ্যা থেকেই তৈরি।',
          ],
          [
            'For a binary classifier at a fixed threshold, the confusion matrix cross-tabulates actual against predicted class into TP, FP, FN and TN. Accuracy, precision, recall, specificity and F1 are all functions of these counts, and every threshold yields a different matrix.',
            'নির্দিষ্ট থ্রেশহোল্ডে একটি বাইনারি ক্লাসিফায়ারের জন্য কনফিউশন ম্যাট্রিক্স আসল ও অনুমিত ক্লাসকে TP, FP, FN ও TN-এ সাজায়। অ্যাকুরেসি, প্রিসিশন, রিকল, স্পেসিফিসিটি ও F1 — সবই এই সংখ্যাগুলোর ফাংশন, আর প্রতিটি থ্রেশহোল্ডে ম্যাট্রিক্স আলাদা হয়।',
          ],
        ),
        quiz: quiz(
          ['A real (non-spam) email is flagged as spam. This is a…', 'একটি আসল (স্প্যাম নয়) ইমেইল স্প্যাম হিসেবে চিহ্নিত হলো। এটি একটি…'],
          [['false positive', 'ফলস পজিটিভ'], ['false negative', 'ফলস নেগেটিভ'], ['true positive', 'ট্রু পজিটিভ']],
          ['It was flagged (positive) but the flag was wrong (false).', 'এটি চিহ্নিত হয়েছে (পজিটিভ), কিন্তু চিহ্নিত করাটা ভুল (ফলস)।'],
        ),
      }),
      block({
        id: 'cm-2', type: 'formula', concepts: ['precision', 'recall'], passages: ['lib-ml-pr'], anchors: ['TP ÷ (TP + FP)', 'TP ÷ (TP + FN)'],
        text: same('Precision = TP ÷ (TP + FP)   ·   Recall = TP ÷ (TP + FN)', 'প্রিসিশন = TP ÷ (TP + FP)   ·   রিকল = TP ÷ (TP + FN)'),
      }),
      block({
        id: 'cm-3', type: 'text', concepts: ['precision', 'recall'], passages: ['lib-ml-pr'], anchors: ['Precision', 'Recall'],
        text: levels(
          [
            'Precision asks: of the emails we flagged, how many really were spam? Recall asks: of all the real spam, how many did we catch? A filter can be good at one and bad at the other.',
            'প্রিসিশন জিজ্ঞেস করে: যেসব ইমেইল আমরা চিহ্নিত করেছি, তার কতগুলো সত্যিই স্প্যাম? রিকল জিজ্ঞেস করে: যত আসল স্প্যাম ছিল, তার কতগুলো আমরা ধরেছি? একটা ফিল্টার একটায় ভালো আর অন্যটায় খারাপ হতে পারে।',
          ],
          [
            'Precision is the share of flagged emails that are truly spam: TP ÷ (TP + FP). Recall is the share of all spam that was flagged: TP ÷ (TP + FN). Raising the threshold usually raises precision and lowers recall, so the two are reported together.',
            'প্রিসিশন হলো চিহ্নিত ইমেইলের মধ্যে আসল স্প্যামের অংশ: TP ÷ (TP + FP)। রিকল হলো মোট স্প্যামের মধ্যে চিহ্নিত অংশ: TP ÷ (TP + FN)। থ্রেশহোল্ড বাড়ালে সাধারণত প্রিসিশন বাড়ে আর রিকল কমে, তাই দুটো একসঙ্গে জানানো হয়।',
          ],
          [
            'Precision (positive predictive value) is TP ÷ (TP + FP). Recall (sensitivity, true positive rate) is TP ÷ (TP + FN). They trade off along the precision–recall curve as the threshold moves; F1, their harmonic mean, summarises one operating point.',
            'প্রিসিশন (পজিটিভ প্রেডিক্টিভ ভ্যালু) হলো TP ÷ (TP + FP)। রিকল (সেনসিটিভিটি, ট্রু পজিটিভ রেট) হলো TP ÷ (TP + FN)। থ্রেশহোল্ড সরালে প্রিসিশন–রিকল কার্ভ বরাবর একটির বদলে অন্যটি পাওয়া যায়; এদের হারমোনিক গড় F1 একটি অপারেটিং পয়েন্টকে এক সংখ্যায় প্রকাশ করে।',
          ],
        ),
        extraExample: {
          en: 'Everyday example: fishing with a net. Precision: of everything in the net, how much is fish and not rubbish? Recall: of all the fish in the pond, how many did the net catch? A tiny net used carefully has high precision and low recall.',
          bn: 'রোজকার উদাহরণ: জাল দিয়ে মাছ ধরা। প্রিসিশন: জালে যা উঠেছে তার কতটা মাছ, আর কতটা আবর্জনা? রিকল: পুকুরের সব মাছের মধ্যে জালে কতগুলো ধরা পড়েছে? ছোট জাল সাবধানে ফেললে প্রিসিশন বেশি, রিকল কম।',
        },
        quiz: quiz(
          ['Recall measures…', 'রিকল মাপে…'],
          [['how much of the real spam was caught', 'আসল স্প্যামের কতটা ধরা পড়েছে'], ['how many flagged emails were really spam', 'চিহ্নিত ইমেইলের কতগুলো সত্যিই স্প্যাম'], ['how fast the filter runs', 'ফিল্টার কত দ্রুত চলে']],
          ['Recall = TP ÷ (TP + FN): caught spam out of all spam. The second option describes precision.', 'রিকল = TP ÷ (TP + FN): মোট স্প্যামের মধ্যে ধরা পড়া স্প্যাম। দ্বিতীয় বিকল্পটি প্রিসিশনের বর্ণনা।'],
        ),
      }),
      block({
        id: 'cm-4', type: 'text', concepts: ['accuracy', 'recall'], passages: ['lib-ml-accuracy'], anchors: ['Accuracy'],
        text: levels(
          [
            'Accuracy is the share of all emails the filter got right. It can fool you. If only 5 of 100 emails are spam, a filter that never flags anything is right 95 times, so it is 95% accurate, yet it catches no spam at all.',
            'অ্যাকুরেসি হলো সব ইমেইলের মধ্যে ফিল্টার যতগুলো ঠিক করেছে তার অংশ। এটা ধোঁকা দিতে পারে। ১০০টির মধ্যে মাত্র ৫টি স্প্যাম হলে, যে ফিল্টার কখনো কিছুই চিহ্নিত করে না, সে ৯৫ বার ঠিক — অর্থাৎ ৯৫% অ্যাকুরেট — অথচ একটা স্প্যামও ধরে না।',
          ],
          [
            'Accuracy is (TP + TN) ÷ all examples. With imbalanced classes it misleads: if 5 of 100 emails are spam, predicting “not spam” every time scores 95% accuracy with a recall of 0. That is why precision and recall are checked alongside accuracy.',
            'অ্যাকুরেসি = (TP + TN) ÷ মোট উদাহরণ। ক্লাস অসম হলে এটা বিভ্রান্ত করে: ১০০টির মধ্যে ৫টি স্প্যাম হলে, প্রতিবার “স্প্যাম নয়” বললেই অ্যাকুরেসি ৯৫%, অথচ রিকল ০। এজন্যই অ্যাকুরেসির পাশাপাশি প্রিসিশন ও রিকল দেখা হয়।',
          ],
          [
            'Accuracy, (TP + TN) ÷ N, is dominated by the majority class under imbalance: with 5 positives in 100, the trivial all-negative classifier attains 95% accuracy and a recall of 0. Class-sensitive metrics such as precision, recall or balanced accuracy are therefore preferred.',
            'অ্যাকুরেসি, অর্থাৎ (TP + TN) ÷ N, ক্লাস অসম হলে সংখ্যাগরিষ্ঠ ক্লাসের দখলে চলে যায়: ১০০টির মধ্যে ৫টি পজিটিভ থাকলে, সবকিছুকে নেগেটিভ বলা তুচ্ছ ক্লাসিফায়ারও ৯৫% অ্যাকুরেসি পায়, রিকল ০। তাই প্রিসিশন, রিকল বা ব্যালান্সড অ্যাকুরেসির মতো ক্লাস-সংবেদী মেট্রিক বেশি পছন্দ করা হয়।',
          ],
        ),
        quiz: quiz(
          ['Only 5 of 100 emails are spam. A filter flags nothing, so its accuracy is 95%. What is its recall?', '১০০টির মধ্যে মাত্র ৫টি স্প্যাম। একটি ফিল্টার কিছুই চিহ্নিত করে না, তাই অ্যাকুরেসি ৯৫%। এর রিকল কত?'],
          [['0%', '০%'], ['95%', '৯৫%'], ['5%', '৫%']],
          ['It caught none of the 5 spam emails: TP = 0, so recall = 0 ÷ 5 = 0%.', '৫টি স্প্যামের একটিও ধরেনি: TP = ০, তাই রিকল = ০ ÷ ৫ = ০%।'],
        ),
      }),
      block({
        id: 'cm-5', type: 'example', concepts: ['confusion_matrix', 'precision', 'recall', 'accuracy'], passages: ['lib-ml-pr', 'lib-ml-accuracy'],
        anchors: ['100', '30', '10', '20', '40', '75%', '60%', '70%'],
        text: same(
          'Worked example. 100 emails: TP = 30, FP = 10, FN = 20, TN = 40. Precision = 30 ÷ 40 = 75%. Recall = 30 ÷ 50 = 60%. Accuracy = 70 ÷ 100 = 70%. The filter is fairly trustworthy when it flags, but it misses 20 of the 50 spam emails.',
          'সমাধানসহ উদাহরণ। ১০০টি ইমেইল: TP = ৩০, FP = ১০, FN = ২০, TN = ৪০। প্রিসিশন = ৩০ ÷ ৪০ = ৭৫%। রিকল = ৩০ ÷ ৫০ = ৬০%। অ্যাকুরেসি = ৭০ ÷ ১০০ = ৭০%। ফিল্টার যখন চিহ্নিত করে তখন মোটামুটি ভরসা করা যায়, কিন্তু ৫০টি স্প্যামের ২০টিই সে ধরতে পারে না।',
        ),
      }),
    ],
  },
];

const check = (prerequisite: string, question: [string, string], options: [string, string][], refresher: [string, string]): PrereqCheck => ({
  prerequisite,
  question: { en: question[0], bn: question[1] },
  options: [...options.map(([en, bn]) => ({ en, bn })), { en: 'Not sure', bn: 'নিশ্চিত নই' }],
  answer: 0,
  refresher: { en: refresher[0], bn: refresher[1] },
});

/** One-tap prior-knowledge checks for the new lessons (asked once, skippable). */
export const MORE_PREREQ_CHECKS: Record<string, PrereqCheck> = {
  sjf: check('fcfs', ['Quick check: processes arrive in the order P1, P2, P3. Under FCFS, which runs first?', 'ছোট্ট যাচাই: প্রসেসগুলো P1, P2, P3 ক্রমে আসে। FCFS-এ কোনটি আগে চলবে?'], [['P1', 'P1'], ['P3', 'P3']], ['FCFS runs processes in the order they arrive.', 'FCFS প্রসেসগুলোকে আসার ক্রমে চালায়।']),
  array_implementation: check('stack', ['Quick check: push 1, push 2, then pop. What comes out?', 'ছোট্ট যাচাই: push 1, push 2, তারপর pop। কী বের হবে?'], [['2', '২'], ['1', '১']], ['A stack returns the last item that was pushed.', 'স্ট্যাক শেষে push করা আইটেমটিই ফেরত দেয়।']),
  euclid_algorithm: check('remainder', ['Quick check: what is 17 mod 5 (the remainder of 17 ÷ 5)?', 'ছোট্ট যাচাই: 17 mod 5 কত (১৭ ÷ ৫-এর ভাগশেষ)?'], [['2', '২'], ['3', '৩']], ['a mod b is what is left after dividing a by b: 17 = 3 × 5 + 2.', 'a-কে b দিয়ে ভাগ করার পর যা বাকি থাকে, সেটাই a mod b: ১৭ = ৩ × ৫ + ২।']),
  implication: check('logical_connective', ['Quick check: p is true and q is false. What is p ∧ q?', 'ছোট্ট যাচাই: p সত্য আর q মিথ্যা। p ∧ q কী?'], [['False', 'মিথ্যা'], ['True', 'সত্য']], ['p ∧ q (AND) is true only when both parts are true.', 'p ∧ q (AND) সত্য হয় শুধু দুটি অংশই সত্য হলে।']),
  xor_gate: check('logic_gate', ['Quick check: an OR gate has inputs 0 and 1. What is the output?', 'ছোট্ট যাচাই: একটি OR গেটের ইনপুট ০ ও ১। আউটপুট কত?'], [['1', '১'], ['0', '০']], ['OR outputs 1 when at least one input is 1.', 'অন্তত একটি ইনপুট ১ হলে OR ১ দেয়।']),
  parallel_circuit: check('ohms_law', ['Quick check: 12 V across a 6 Ω resistor. What is the current?', 'ছোট্ট যাচাই: ৬ Ω রেজিস্টরের দুই প্রান্তে ১২ V। কারেন্ট কত?'], [['2 A', '২ A'], ['72 A', '৭২ A']], ['Ohm’s law: current = voltage ÷ resistance.', 'ওহমের সূত্র: কারেন্ট = ভোল্টেজ ÷ রেজিস্ট্যান্স।']),
  precision: check('false_positive', ['Quick check: a real email is flagged as spam. What is that called?', 'ছোট্ট যাচাই: একটি আসল ইমেইল স্প্যাম হিসেবে চিহ্নিত হলো। একে কী বলে?'], [['A false positive', 'ফলস পজিটিভ'], ['A false negative', 'ফলস নেগেটিভ']], ['A false positive is a negative example wrongly flagged as positive.', 'ফলস পজিটিভ হলো নেগেটিভ উদাহরণকে ভুল করে পজিটিভ বলা।']),
};
