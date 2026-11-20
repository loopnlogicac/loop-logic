// Virtual Office: scripted internship projects. The intern works in a pretend
// software company, reads role-based messages (team lead, colleagues, product
// manager) and uses an AI assistant. Some messages are incomplete or conflict,
// and the AI's answers carry planted mistakes. Every trap is written down here,
// so the server can grade fairly and explain it in the debrief.
// Names and companies are fictional.

export type Bi = { en: string; bn: string };
export type Skill = 'clarify' | 'conflict' | 'verify' | 'quality' | 'communicate';
export type RoleId = 'farhana' | 'tanvir' | 'mitu' | 'imran' | 'ai';

export interface Msg { from: RoleId; at: string; text: Bi; code?: string; codeLang?: 'python' | 'sql' }
export interface Option {
  id: string;
  text: Bi;
  /** choose steps: points per skill (2 = best practice, 1 = partly, 0 = poor). */
  score?: Partial<Record<Skill, number>>;
  /** multi steps: whether this option should be selected. */
  correct?: boolean;
  feedback: Bi;
  /** What happens next in the chat because of this choice (choose steps). */
  replies?: Msg[];
}
export interface Step {
  id: string;
  kind: 'choose' | 'multi';
  title: Bi;
  /** Messages that arrive when the step opens. */
  messages: Msg[];
  /** For AI steps: what the intern asked the assistant (shown in the AI panel). */
  aiAsk?: Bi;
  prompt: Bi;
  options: Option[];
  skills: Skill[];
  /** Messages after a multi step is answered, whatever was picked. */
  after?: Msg[];
  /** Debrief: what the trap was, and the habit it trains. */
  trap: { kind: 'incomplete' | 'conflict' | 'ai' | 'quality' | 'update'; text: Bi };
  lesson: Bi;
}
export interface Project {
  id: string;
  free: boolean;
  track: Bi;
  title: Bi;
  role: Bi;
  company: string;
  minutes: number;
  summary: Bi;
  team: RoleId[];
  steps: Step[];
}

const b = (en: string, bn: string): Bi => ({ en, bn });

export const SKILLS: Record<Skill, { title: Bi; blurb: Bi }> = {
  clarify: { title: b('Clarifying requirements', 'চাহিদা পরিষ্কার করা'), blurb: b('Spotting what a request leaves out and asking specific questions before building.', 'কাজের অনুরোধে কী বাদ পড়েছে তা ধরা, আর কাজ শুরুর আগে নির্দিষ্ট প্রশ্ন করা।') },
  conflict: { title: b('Handling conflicting input', 'পরস্পরবিরোধী কথা সামলানো'), blurb: b('Bringing the right people together and getting one written decision.', 'সঠিক মানুষদের এক জায়গায় এনে একটা লিখিত সিদ্ধান্ত নেওয়া।') },
  verify: { title: b('Checking AI output', 'এআই-এর কাজ যাচাই'), blurb: b('Reviewing AI suggestions line by line instead of trusting them.', 'এআই-এর পরামর্শ চোখ বুজে না মেনে লাইন ধরে ধরে যাচাই করা।') },
  quality: { title: b('Quality and testing', 'মান ও টেস্টিং'), blurb: b('Testing edge cases and checking results against an independent source.', 'এজ কেস টেস্ট করা আর ফলাফল আলাদা একটা উৎসের সঙ্গে মিলিয়ে দেখা।') },
  communicate: { title: b('Professional updates', 'পেশাদার আপডেট'), blurb: b('Short, specific updates that state decisions, evidence and open questions.', 'ছোট, নির্দিষ্ট আপডেট, যেখানে সিদ্ধান্ত, প্রমাণ আর খোলা প্রশ্ন স্পষ্ট থাকে।') },
};

export const ROLES: Record<RoleId, { name: string; title: Bi; kind: 'supervisor' | 'colleague' | 'manager' | 'ai'; initials: string }> = {
  farhana: { name: 'Farhana Rahman', title: b('Team lead (your supervisor)', 'টিম লিড (তোমার সুপারভাইজার)'), kind: 'supervisor', initials: 'FR' },
  tanvir: { name: 'Tanvir Hasan', title: b('Senior developer', 'সিনিয়র ডেভেলপার'), kind: 'colleague', initials: 'TH' },
  mitu: { name: 'Mitu Akter', title: b('QA engineer and data analyst', 'কিউএ ইঞ্জিনিয়ার ও ডেটা অ্যানালিস্ট'), kind: 'colleague', initials: 'MA' },
  imran: { name: 'Imran Chowdhury', title: b('Product manager', 'প্রোডাক্ট ম্যানেজার'), kind: 'manager', initials: 'IC' },
  ai: { name: 'Office AI', title: b('AI assistant · can be wrong', 'এআই সহকারী · ভুল করতে পারে'), kind: 'ai', initials: 'AI' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Project 1 (free sample): Python, a CGPA function for a student portal.
// ─────────────────────────────────────────────────────────────────────────────
const cgpa: Project = {
  id: 'cgpa-portal',
  free: true,
  track: b('Programming · Python', 'প্রোগ্রামিং · Python'),
  title: b('The CGPA calculator', 'সিজিপিএ ক্যালকুলেটর'),
  role: b('Junior developer intern', 'জুনিয়র ডেভেলপার ইন্টার্ন'),
  company: 'Nodi Labs',
  minutes: 15,
  summary: b(
    'Write the CGPA function for a university student portal. The brief leaves out the hard cases, two seniors disagree about retaken courses, and the AI assistant’s code looks right but is not.',
    'একটা বিশ্ববিদ্যালয়ের স্টুডেন্ট পোর্টালের জন্য সিজিপিএ ফাংশন লেখো। ব্রিফে কঠিন কেসগুলো নেই, রিটেক নিয়ে দুই সিনিয়র দুই রকম কথা বলেন, আর এআই সহকারীর কোড দেখতে ঠিক মনে হলেও আসলে ঠিক না।'),
  team: ['farhana', 'tanvir', 'mitu', 'ai'],
  steps: [
    {
      id: 'brief', kind: 'choose', skills: ['clarify'],
      title: b('The brief', 'কাজের ব্রিফ'),
      messages: [
        { from: 'farhana', at: '09:05', text: b('Welcome to the team! First task: please write `cgpa(courses)` for the student portal. Each course has credits and a grade point. Should be ready by Thursday.', 'টিমে স্বাগতম! প্রথম কাজ: স্টুডেন্ট পোর্টালের জন্য `cgpa(courses)` লিখে ফেলো। প্রতিটা কোর্সের credit আর grade point আছে। বৃহস্পতিবারের মধ্যে রেডি থাকলে ভালো হয়।') },
      ],
      prompt: b('The brief is short. What do you do first?', 'ব্রিফটা খুব ছোট। প্রথমে কী করবে?'),
      options: [
        { id: 'code', text: b('Start coding now and decide the details yourself. It’s a small function.', 'এখনই কোড শুরু করো, খুঁটিনাটি নিজেই ঠিক করে নাও। ছোট্ট একটা ফাংশন।'), score: { clarify: 0 },
          feedback: b('Small functions still hide decisions: withdrawn (W) courses, retakes, rounding. Guessing them means rework later, and nobody knows what you assumed.', 'ছোট ফাংশনেও সিদ্ধান্ত লুকিয়ে থাকে: W (withdrawn) কোর্স, রিটেক, রাউন্ডিং। আন্দাজে করলে পরে আবার করতে হয়, আর তুমি কী ধরে নিয়েছিলে তা কেউ জানে না।'),
          replies: [{ from: 'farhana', at: '11:40', text: b('Oh, forgot to mention: W grades must not count, retakes keep one attempt only, and show 2 decimals.', 'আরে, বলতে ভুলে গিয়েছিলাম: W গ্রেড গোনা যাবে না, রিটেক হলে একটা attempt-ই থাকবে, আর দুই ঘর দশমিক দেখাবে।') }] },
        { id: 'ask', text: b('Reply with specific questions: How are W (withdrawn) courses treated? Which attempt counts for a retaken course? How many decimals?', 'নির্দিষ্ট প্রশ্ন করে উত্তর দাও: W (withdrawn) কোর্স কীভাবে ধরা হবে? রিটেক কোর্সে কোন attempt গোনা হবে? দশমিকের পর কয় ঘর?'), score: { clarify: 2 },
          feedback: b('Specific, answerable questions. You found the three places where the brief was silent before writing a line.', 'নির্দিষ্ট, উত্তর দেওয়া যায় এমন প্রশ্ন। এক লাইন লেখার আগেই ব্রিফের তিনটা ফাঁক তুমি ধরে ফেলেছ।'),
          replies: [{ from: 'farhana', at: '09:20', text: b('Good questions. W doesn’t count at all. For retakes keep the higher grade. Round to 2 decimals.', 'ভালো প্রশ্ন। W একদমই গোনা হবে না। রিটেকে বেশি গ্রেডটা রাখবে। দুই ঘর দশমিকে রাউন্ড করবে।') }] },
        { id: 'vague', text: b('Reply “Can you explain a bit more?”', 'উত্তর দাও “আরেকটু বুঝিয়ে বলবেন?”'), score: { clarify: 1 },
          feedback: b('Asking is right, but a vague question gets a vague answer. Name the cases you are unsure about.', 'প্রশ্ন করাটা ঠিক, কিন্তু অস্পষ্ট প্রশ্নের উত্তরও অস্পষ্ট আসে। ঠিক কোন কেসগুলো নিয়ে সন্দেহ, সেগুলোর নাম বলো।'),
          replies: [{ from: 'farhana', at: '09:31', text: b('It’s the usual CGPA. Credits times grade points… Also W doesn’t count, and keep the higher grade for retakes.', 'সাধারণ সিজিপিএ-ই। credit গুণ grade point… আর W গোনা হবে না, রিটেকে বেশি গ্রেডটা রাখবে।') }] },
        { id: 'tanvir', text: b('Ask Tanvir (senior developer) to tell you how to do it.', 'তানভীরকে (সিনিয়র ডেভেলপার) জিজ্ঞেস করো কীভাবে করবে।'), score: { clarify: 1 },
          feedback: b('Tanvir can help with code, but the requirement belongs to Farhana, who owns the task. Ask the person who decides.', 'কোডে তানভীর সাহায্য করতে পারেন, কিন্তু চাহিদা ঠিক করেন ফারহানা, কাজটা তাঁর। যিনি সিদ্ধান্ত নেন, তাঁকেই জিজ্ঞেস করো।'),
          replies: [{ from: 'tanvir', at: '09:40', text: b('Ask Farhana about the rules, but I think W doesn’t count and retakes keep the higher grade.', 'নিয়মগুলো ফারহানাকে জিজ্ঞেস করো, তবে আমার মনে হয় W গোনা হয় না আর রিটেকে বেশি গ্রেডটা থাকে।') }] },
      ],
      trap: { kind: 'incomplete', text: b('The brief said nothing about withdrawn courses, retakes or rounding.', 'ব্রিফে withdrawn কোর্স, রিটেক বা রাউন্ডিং নিয়ে কিছুই ছিল না।') },
      lesson: b('Before building, list what the request leaves out and ask the task owner specific questions.', 'কাজ শুরুর আগে অনুরোধে কী বাদ পড়েছে তার তালিকা করো, আর কাজের মালিককে নির্দিষ্ট প্রশ্ন করো।'),
    },
    {
      id: 'retake', kind: 'choose', skills: ['conflict', 'communicate'],
      title: b('Two answers about retakes', 'রিটেক নিয়ে দুই রকম উত্তর'),
      messages: [
        { from: 'tanvir', at: '10:15', text: b('Heads up: for retakes use the LATEST attempt, not the higher one. That’s what the registrar office does.', 'একটা কথা: রিটেকে বেশি গ্রেড না, সবচেয়ে শেষের attempt নেবে। রেজিস্ট্রার অফিস তাই করে।') },
      ],
      prompt: b('Farhana said “keep the higher grade”. Tanvir says “use the latest attempt”. What do you do?', 'ফারহানা বলেছেন “বেশি গ্রেডটা রাখো”। তানভীর বলছেন “শেষ attempt নাও”। কী করবে?'),
      options: [
        { id: 'senior', text: b('Follow Tanvir. He is senior and has been here longer.', 'তানভীরের কথা মানো। উনি সিনিয়র, অনেক দিন ধরে আছেন।'), score: { conflict: 0, communicate: 0 },
          feedback: b('Seniority doesn’t settle a requirement. Farhana owns the task and may not know about this change, so the conflict stays hidden.', 'সিনিয়রিটি দিয়ে চাহিদা ঠিক হয় না। কাজটা ফারহানার, আর তিনি হয়তো এই পার্থক্যটা জানেনই না। ফলে বিরোধটা চাপা থেকে যায়।'),
          replies: [{ from: 'farhana', at: '16:10', text: b('Why does the code use the latest attempt? I asked for the higher grade. Let’s discuss.', 'কোডে শেষ attempt কেন? আমি তো বেশি গ্রেড বলেছিলাম। কথা বলি চলো।') }, { from: 'farhana', at: '16:25', text: b('Checked with the registrar: latest attempt is actually right. Please flag these things earlier next time.', 'রেজিস্ট্রারকে জিজ্ঞেস করলাম: আসলে শেষ attempt-ই ঠিক। এরপর এমন কিছু হলে আগেই জানিও।') }] },
        { id: 'lead', text: b('Follow Farhana. She is the team lead. Ignore Tanvir’s message.', 'ফারহানার কথা মানো। উনি টিম লিড। তানভীরের মেসেজ উপেক্ষা করো।'), score: { conflict: 0, communicate: 0 },
          feedback: b('Tanvir pointed to an official source. Ignoring it risks shipping the wrong rule; the lead needs to hear about the conflict.', 'তানভীর একটা অফিসিয়াল উৎসের কথা বলেছেন। উপেক্ষা করলে ভুল নিয়ম চলে যেতে পারে; বিরোধের কথা লিডকে জানানো দরকার।'),
          replies: [{ from: 'mitu', at: '17:05', text: b('QA note: a student with a retake shows a different CGPA than the registrar’s transcript.', 'কিউএ নোট: রিটেক আছে এমন এক স্টুডেন্টের সিজিপিএ রেজিস্ট্রারের ট্রান্সক্রিপ্টের সঙ্গে মিলছে না।') }, { from: 'farhana', at: '17:20', text: b('Registrar uses the latest attempt. Please switch to that.', 'রেজিস্ট্রার শেষ attempt নেয়। ওটাতে বদলে দাও।') }] },
        { id: 'thread', text: b('Post in the team thread, tag both, quote both rules and ask Farhana for one decision, mentioning the registrar policy.', 'টিম থ্রেডে দুজনকেই ট্যাগ করো, দুটো নিয়মই উদ্ধৃত করো, রেজিস্ট্রারের নিয়মের কথা বলে ফারহানার কাছে একটা সিদ্ধান্ত চাও।'), score: { conflict: 2, communicate: 2 },
          feedback: b('You made the conflict visible to the person who decides, with both sources quoted, and got one written answer.', 'যিনি সিদ্ধান্ত নেন, তাঁর সামনে দুটো উৎস উদ্ধৃত করে বিরোধটা স্পষ্ট করেছ, আর একটা লিখিত উত্তর পেয়েছ।'),
          replies: [{ from: 'farhana', at: '10:30', text: b('Good catch. The registrar policy wins: use the latest attempt. I’ll update the ticket.', 'ভালো ধরেছ। রেজিস্ট্রারের নিয়মই চলবে: শেষ attempt নাও। টিকিট আপডেট করে দিচ্ছি।') }] },
        { id: 'both', text: b('Support both with a hidden setting, so either rule works. No need to bother anyone.', 'একটা লুকানো সেটিং দিয়ে দুটোই রাখো, যেকোনো নিয়ম চলবে। কাউকে বিরক্ত করার দরকার নেই।'), score: { conflict: 1, communicate: 0 },
          feedback: b('Clever code doesn’t replace a decision. A hidden setting means nobody knows which rule is live.', 'চালাক কোড সিদ্ধান্তের বিকল্প না। লুকানো সেটিং মানে কোন নিয়ম চালু আছে, কেউ জানে না।'),
          replies: [{ from: 'tanvir', at: '15:00', text: b('Why is there a `retake_mode` flag? Which one is on in production?', '`retake_mode` ফ্ল্যাগ কেন? প্রোডাকশনে কোনটা চালু?') }, { from: 'farhana', at: '15:20', text: b('Let’s keep it simple: latest attempt, as the registrar does. Remove the flag.', 'সহজ রাখি: রেজিস্ট্রারের মতো শেষ attempt। ফ্ল্যাগটা সরিয়ে দাও।') }] },
      ],
      trap: { kind: 'conflict', text: b('Your lead and a senior colleague gave opposite rules for retakes.', 'তোমার লিড আর এক সিনিয়র সহকর্মী রিটেক নিয়ে উল্টো দুটো নিয়ম দিয়েছিলেন।') },
      lesson: b('When instructions conflict, quote both, include the evidence, and ask the decision owner for one written answer.', 'নির্দেশনা পরস্পরবিরোধী হলে দুটোই উদ্ধৃত করো, প্রমাণ দাও, আর যিনি সিদ্ধান্ত নেন তাঁর কাছে একটা লিখিত উত্তর চাও।'),
    },
    {
      id: 'ai-code', kind: 'multi', skills: ['verify'],
      title: b('The AI assistant’s code', 'এআই সহকারীর কোড'),
      aiAsk: b('Write a Python function cgpa(courses) for a student portal.', 'স্টুডেন্ট পোর্টালের জন্য একটা Python ফাংশন cgpa(courses) লিখে দাও।'),
      messages: [
        { from: 'ai', at: '11:02', text: b('Here is a clean implementation. It is efficient and handles all cases.', 'এই নাও একটা পরিষ্কার সমাধান। দ্রুত চলে আর সব কেস সামলায়।'), codeLang: 'python',
          code: 'def cgpa(courses):\n    # courses: list of dicts {"code", "credits", "grade", "point"}\n    total = 0\n    for c in courses:\n        total += c["point"]\n    return round(total / len(courses), 2)' },
      ],
      prompt: b('Review the AI’s code against the rules you now know. Which problems are really there? Select all that apply.', 'এখন যে নিয়মগুলো জানো, সেগুলোর সঙ্গে এআই-এর কোড মিলিয়ে দেখো। আসলেই কোন সমস্যাগুলো আছে? যতগুলো খাটে, সব বেছে নাও।'),
      options: [
        { id: 'credits', correct: true, text: b('It averages grade points per course, ignoring credits.', 'credit বাদ দিয়ে প্রতি কোর্সের grade point-এর গড় করছে।'), feedback: b('Right: CGPA is Σ(credits × point) ÷ Σ credits. A 1-credit lab counts the same as a 3-credit course here.', 'ঠিক: সিজিপিএ = Σ(credit × point) ÷ Σ credit। এখানে ১ credit-এর ল্যাব আর ৩ credit-এর কোর্স সমান গোনা হচ্ছে।') },
        { id: 'w', correct: true, text: b('Withdrawn (W) courses are still counted.', 'Withdrawn (W) কোর্সও গোনা হচ্ছে।'), feedback: b('Right: nothing skips grade "W", so it pulls the average down.', 'ঠিক: grade "W" বাদ দেওয়ার কিছু নেই, তাই গড় কমে যায়।') },
        { id: 'retake', correct: true, text: b('Every attempt of a retaken course is counted, not just the latest.', 'রিটেক কোর্সের সব attempt গোনা হচ্ছে, শুধু শেষেরটা না।'), feedback: b('Right: there is no grouping by course code.', 'ঠিক: course code ধরে কোনো গ্রুপিং নেই।') },
        { id: 'zero', correct: true, text: b('An empty list (or only W courses after a fix) would crash with division by zero.', 'খালি লিস্ট (বা ঠিক করার পর শুধু W কোর্স) হলে শূন্য দিয়ে ভাগে ক্র্যাশ করবে।'), feedback: b('Right: `len(courses)` can be 0.', 'ঠিক: `len(courses)` শূন্য হতে পারে।') },
        { id: 'syntax', correct: false, text: b('It has a syntax error and will not run.', 'সিনট্যাক্স ভুল আছে, চলবেই না।'), feedback: b('No: it runs fine. That is what makes it dangerous; it gives confident wrong numbers.', 'না: কোডটা ঠিকঠাক চলে। সেটাই বিপদ; আত্মবিশ্বাসের সঙ্গে ভুল সংখ্যা দেয়।') },
        { id: 'round', correct: false, text: b('round() is the wrong function for 2 decimals.', 'দুই ঘর দশমিকের জন্য round() ভুল ফাংশন।'), feedback: b('No: round(x, 2) is fine for display here.', 'না: এখানে দেখানোর জন্য round(x, 2) ঠিক আছে।') },
      ],
      after: [{ from: 'tanvir', at: '11:30', text: b('Nice review. Rule of thumb: AI code that “handles all cases” rarely does. Test it.', 'ভালো রিভিউ। একটা নিয়ম মনে রাখো: যে এআই কোড “সব কেস সামলায়” বলে, সেটা খুব কমই সামলায়। টেস্ট করো।') }],
      trap: { kind: 'ai', text: b('The AI’s code ran without errors but ignored credits, W grades and retakes.', 'এআই-এর কোড কোনো এরর ছাড়াই চলেছে, কিন্তু credit, W গ্রেড আর রিটেক উপেক্ষা করেছে।') },
      lesson: b('Check AI output against the actual requirements, not against whether it runs. Confident wording is not evidence.', 'এআই-এর কাজ চলে কি না তা দিয়ে না, আসল চাহিদার সঙ্গে মিলিয়ে যাচাই করো। আত্মবিশ্বাসী ভাষা কোনো প্রমাণ না।'),
    },
    {
      id: 'tests', kind: 'multi', skills: ['quality'],
      title: b('Choosing test cases', 'টেস্ট কেস বাছাই'),
      messages: [
        { from: 'mitu', at: '13:10', text: b('Before you send it for review, add unit tests. Which cases will you cover?', 'রিভিউতে পাঠানোর আগে unit test যোগ করো। কোন কোন কেস কভার করবে?') },
      ],
      prompt: b('Pick the tests that are worth writing. Select all that apply.', 'যে টেস্টগুলো লেখার মতো, সেগুলো বেছে নাও। যতগুলো খাটে, সব।'),
      options: [
        { id: 'mixed', correct: true, text: b('Courses with different credits (3, 1.5, 0.75) with a hand-computed answer.', 'ভিন্ন ভিন্ন credit-এর কোর্স (৩, ১.৫, ০.৭৫), হাতে হিসাব করা উত্তরসহ।'), feedback: b('Yes: this is the test that catches the credit-weighting bug.', 'হ্যাঁ: credit-এর ওজন বাদ পড়ার বাগটা এই টেস্টেই ধরা পড়ে।') },
        { id: 'retake', correct: true, text: b('A retaken course where the latest attempt is lower than the first.', 'রিটেক কোর্স, যেখানে শেষ attempt প্রথমটার চেয়ে কম।'), feedback: b('Yes: it proves the latest-attempt rule, not the higher-grade rule.', 'হ্যাঁ: এটা প্রমাণ করে নিয়মটা শেষ attempt, বেশি গ্রেড না।') },
        { id: 'w', correct: true, text: b('A transcript with one W course.', 'একটা W কোর্সসহ ট্রান্সক্রিপ্ট।'), feedback: b('Yes: W must not change the result.', 'হ্যাঁ: W থাকলে ফলাফল বদলানো যাবে না।') },
        { id: 'allw', correct: true, text: b('A student whose only course is W (zero graded credits).', 'এমন স্টুডেন্ট, যার একমাত্র কোর্স W (গ্রেড পাওয়া credit শূন্য)।'), feedback: b('Yes: the division-by-zero edge case.', 'হ্যাঁ: শূন্য দিয়ে ভাগের এজ কেস।') },
        { id: 'print', correct: false, text: b('A test that just prints the result so you can look at it.', 'এমন টেস্ট, যা শুধু ফলাফল প্রিন্ট করে, যাতে চোখে দেখা যায়।'), feedback: b('No: a test must assert an expected value, or it never fails.', 'না: টেস্টে প্রত্যাশিত মান assert করতে হয়, নইলে সেটা কখনো fail করে না।') },
        { id: 'ai', correct: false, text: b('Ask Office AI whether the function is correct, and use its answer as the test.', 'ফাংশন ঠিক কি না Office AI-কে জিজ্ঞেস করো, আর ওর উত্তরকেই টেস্ট ধরো।'), feedback: b('No: the AI wrote the buggy version. Expected values must come from the rules, worked by hand.', 'না: ভুল কোডটা এআই-ই লিখেছিল। প্রত্যাশিত মান আসবে নিয়ম থেকে, হাতে হিসাব করে।') },
      ],
      after: [{ from: 'mitu', at: '14:00', text: b('Your “only W” test fails: ZeroDivisionError. The ticket doesn’t say what to show in that case.', 'তোমার “শুধু W” টেস্ট fail করছে: ZeroDivisionError। এই কেসে কী দেখাবে, টিকিটে লেখা নেই।') }],
      trap: { kind: 'quality', text: b('Happy-path tests would have passed while the real bugs stayed hidden.', 'শুধু সহজ কেসের টেস্ট pass করত, আর আসল বাগগুলো লুকিয়েই থাকত।') },
      lesson: b('Write tests from the rules and edge cases, with expected values worked out independently.', 'নিয়ম আর এজ কেস থেকে টেস্ট লেখো, আর প্রত্যাশিত মান আলাদাভাবে হিসাব করে বের করো।'),
    },
    {
      id: 'edge', kind: 'choose', skills: ['clarify', 'communicate'],
      title: b('A case nobody decided', 'যে কেসের সিদ্ধান্ত কেউ নেয়নি'),
      messages: [],
      prompt: b('A student with no graded credits makes the function crash, and the ticket is silent. What do you do?', 'গ্রেড পাওয়া credit নেই এমন স্টুডেন্টে ফাংশন ক্র্যাশ করে, আর টিকিটে কিছু লেখা নেই। কী করবে?'),
      options: [
        { id: 'zero', text: b('Return 0.00 quietly. It’s an edge case.', 'চুপচাপ 0.00 ফেরত দাও। এটা তো এজ কেস।'), score: { clarify: 0, communicate: 0 },
          feedback: b('A CGPA of 0.00 on a portal looks like a real (terrible) result to a student. Silent guesses become bugs.', 'পোর্টালে 0.00 সিজিপিএ দেখলে স্টুডেন্ট ভাববে এটাই তার আসল (ভয়াবহ) ফল। চুপচাপ আন্দাজ বাগে পরিণত হয়।'),
          replies: [{ from: 'mitu', at: '16:40', text: b('A first-semester student who withdrew sees “CGPA 0.00” and has emailed support in panic.', 'প্রথম সেমিস্টারের এক স্টুডেন্ট, যে withdraw করেছিল, “CGPA 0.00” দেখে আতঙ্কে সাপোর্টে ইমেইল করেছে।') }] },
        { id: 'propose', text: b('Message Farhana: “No graded credits → return None and show ‘No graded courses yet’. OK, or do you prefer something else?”', 'ফারহানাকে লেখো: “গ্রেড পাওয়া credit না থাকলে → None ফেরত দেব আর ‘এখনো কোনো গ্রেড পাওয়া কোর্স নেই’ দেখাব। ঠিক আছে, নাকি অন্য কিছু?”'), score: { clarify: 2, communicate: 2 },
          feedback: b('You asked a closed question with a concrete proposal, which is quick to answer and leaves a written decision.', 'তুমি একটা নির্দিষ্ট প্রস্তাবসহ হ্যাঁ-না প্রশ্ন করেছ, উত্তর দেওয়াও সহজ, আর সিদ্ধান্তটা লেখা থাকে।'),
          replies: [{ from: 'farhana', at: '14:12', text: b('Yes, do exactly that. Thanks for proposing a solution.', 'হ্যাঁ, ঠিক এটাই করো। সমাধানসহ প্রস্তাব দেওয়ার জন্য ধন্যবাদ।') }] },
        { id: 'raise', text: b('Let it raise an error. The frontend team can deal with it.', 'এরর ছুড়ে দিক। ফ্রন্টএন্ড টিম সামলে নেবে।'), score: { clarify: 0, communicate: 0 },
          feedback: b('Passing an undecided case to another team without telling them just moves the bug.', 'অনির্ধারিত কেস অন্য টিমকে না জানিয়ে ঠেলে দিলে বাগটা শুধু জায়গা বদলায়।'),
          replies: [{ from: 'tanvir', at: '16:00', text: b('The profile page now shows “500 Internal Server Error” for some students. Is that from cgpa()?', 'কিছু স্টুডেন্টের প্রোফাইল পেজে এখন “500 Internal Server Error” দেখাচ্ছে। এটা কি cgpa() থেকে?') }] },
        { id: 'mitu', text: b('Ask Mitu (QA) what the function should return.', 'মিতুকে (কিউএ) জিজ্ঞেস করো ফাংশনটা কী ফেরত দেবে।'), score: { clarify: 1, communicate: 1 },
          feedback: b('Mitu found the case and can advise, but what students see is a product decision for Farhana.', 'কেসটা মিতু ধরেছেন আর পরামর্শও দিতে পারেন, কিন্তু স্টুডেন্টরা কী দেখবে, সেটা ফারহানার প্রোডাক্ট সিদ্ধান্ত।'),
          replies: [{ from: 'mitu', at: '14:30', text: b('I’d show a message instead of a number, but check with Farhana; it’s her call.', 'আমি সংখ্যার বদলে একটা মেসেজ দেখাতাম, তবে ফারহানার সঙ্গে কথা বলো; সিদ্ধান্ত ওনার।') }] },
      ],
      trap: { kind: 'incomplete', text: b('Testing found a case the requirements never covered.', 'টেস্ট করতে গিয়ে এমন একটা কেস পাওয়া গেল, যা চাহিদায় কখনো ছিল না।') },
      lesson: b('When you hit an undecided case, propose a concrete answer and ask the owner to confirm it.', 'অনির্ধারিত কেসে আটকালে একটা নির্দিষ্ট সমাধান প্রস্তাব করো, আর মালিককে নিশ্চিত করতে বলো।'),
    },
    {
      id: 'update', kind: 'choose', skills: ['communicate'],
      title: b('Your status update', 'তোমার স্ট্যাটাস আপডেট'),
      messages: [{ from: 'farhana', at: '17:00', text: b('Can you send me a quick update before you leave?', 'যাওয়ার আগে একটা ছোট আপডেট পাঠাতে পারবে?') }],
      prompt: b('Which update do you send?', 'কোন আপডেটটা পাঠাবে?'),
      options: [
        { id: 'done', text: b('“Done ✅”', '“হয়ে গেছে ✅”'), score: { communicate: 0 },
          feedback: b('Too short: Farhana can’t see what was decided or how you know it works.', 'খুব ছোট: কী সিদ্ধান্ত হলো বা কীভাবে বুঝলে যে কাজ করছে, ফারহানা কিছুই জানতে পারছেন না।') },
        { id: 'clear', text: b('“cgpa() is ready for review (PR #42). Rules: credit-weighted, W excluded, latest attempt for retakes (registrar policy, your OK at 10:30), 2 decimals; no graded credits → None + message. 6 unit tests incl. edge cases, all pass. The AI draft ignored credits and W; I rewrote it. Open: nothing.”', '“cgpa() রিভিউয়ের জন্য রেডি (PR #42)। নিয়ম: credit অনুযায়ী ওজন, W বাদ, রিটেকে শেষ attempt (রেজিস্ট্রারের নিয়ম, ১০:৩০-এ আপনার সম্মতি), দুই ঘর দশমিক; গ্রেড পাওয়া credit না থাকলে → None আর মেসেজ। এজ কেসসহ ৬টা unit test, সব pass। এআই-এর খসড়ায় credit আর W বাদ পড়েছিল; আমি নতুন করে লিখেছি। খোলা প্রশ্ন: নেই।”'), score: { communicate: 2 },
          feedback: b('Specific and checkable: what is ready, which rules and who approved them, the evidence, and open questions.', 'নির্দিষ্ট আর যাচাই করা যায়: কী রেডি, কোন নিয়ম আর কে অনুমোদন দিয়েছেন, প্রমাণ, আর খোলা প্রশ্ন।') },
        { id: 'ai', text: b('“Finished it with Office AI’s help, so it should be fine. Let me know if anything breaks.”', '“Office AI-এর সাহায্যে শেষ করেছি, তাই ঠিক থাকার কথা। কিছু ভাঙলে জানাবেন।”'), score: { communicate: 0 },
          feedback: b('“The AI did it” is not evidence, and “let me know if it breaks” hands your testing to others.', '“এআই করেছে” কোনো প্রমাণ না, আর “ভাঙলে জানাবেন” মানে নিজের টেস্টিং অন্যের ঘাড়ে চাপানো।') },
        { id: 'long', text: b('A long message apologising for taking all day, describing every attempt you made, with no clear status.', 'সারা দিন লাগার জন্য ক্ষমা চেয়ে লম্বা মেসেজ, প্রতিটা চেষ্টার বর্ণনা, কিন্তু স্ট্যাটাস স্পষ্ট না।'), score: { communicate: 1 },
          feedback: b('Honest, but the reader has to dig for the status. Lead with what is done, then decisions and evidence.', 'সৎ, কিন্তু স্ট্যাটাস খুঁজে বের করতে পাঠককে খাটতে হয়। আগে কী শেষ, তারপর সিদ্ধান্ত আর প্রমাণ।') },
      ],
      trap: { kind: 'update', text: b('The work is only useful if the lead can see what was decided and how it was checked.', 'লিড যদি দেখতে না পান কী সিদ্ধান্ত হলো আর কীভাবে যাচাই হলো, তাহলে কাজটার দাম কমে যায়।') },
      lesson: b('Lead with the status, then the decisions (and who made them), the evidence, and what is still open.', 'আগে স্ট্যাটাস, তারপর সিদ্ধান্ত (আর কে নিয়েছেন), প্রমাণ, আর কী এখনো খোলা।'),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Project 2: SQL, a monthly revenue report for an online shop.
// ─────────────────────────────────────────────────────────────────────────────
const revenue: Project = {
  id: 'sales-report',
  free: false,
  track: b('Database · SQL', 'ডেটাবেস · SQL'),
  title: b('The monthly revenue report', 'মাসিক আয়ের রিপোর্ট'),
  role: b('Data intern', 'ডেটা ইন্টার্ন'),
  company: 'Nodi Labs',
  minutes: 18,
  summary: b(
    'Build the revenue-per-month query for an online shop’s dashboard. “Revenue” means different things to product and finance, the AI’s query double-counts, and your lead’s feedback is just “numbers look off”.',
    'একটা অনলাইন দোকানের ড্যাশবোর্ডের জন্য মাসভিত্তিক আয়ের কোয়েরি বানাও। প্রোডাক্ট আর ফিন্যান্সের কাছে “আয়” মানে আলাদা, এআই-এর কোয়েরি দুবার গোনে, আর লিডের ফিডব্যাক শুধু “সংখ্যাগুলো ঠিক লাগছে না”।'),
  team: ['imran', 'mitu', 'farhana', 'ai'],
  steps: [
    {
      id: 'ask', kind: 'choose', skills: ['clarify'],
      title: b('“Revenue per month”', '“মাসভিত্তিক আয়”'),
      messages: [
        { from: 'imran', at: '09:10', text: b('Hi! For the shop dashboard I need total revenue per month for 2026. Tables: `orders`, `order_items`, `payments`. Thanks!', 'হাই! দোকানের ড্যাশবোর্ডের জন্য ২০২৬-এর মাসভিত্তিক মোট আয় লাগবে। টেবিল: `orders`, `order_items`, `payments`। ধন্যবাদ!') },
      ],
      prompt: b('What do you reply?', 'কী উত্তর দেবে?'),
      options: [
        { id: 'go', text: b('“On it!” and start writing the query.', '“করছি!” বলে কোয়েরি লেখা শুরু করো।'), score: { clarify: 0 },
          feedback: b('“Revenue” hides several decisions: cancelled and refunded orders, gross or after discount, and which timezone decides the month.', '“আয়” কথাটার ভেতরে কয়েকটা সিদ্ধান্ত লুকিয়ে আছে: বাতিল আর রিফান্ড হওয়া অর্ডার, ডিসকাউন্টের আগে না পরে, আর কোন টাইমজোনে মাস ধরা হবে।'),
          replies: [{ from: 'imran', at: '12:30', text: b('Oh, and exclude cancelled orders, use qty × unit price, and Dhaka time. Sorry, should have said.', 'আর হ্যাঁ, বাতিল অর্ডার বাদ, qty × unit price ধরবে, আর ঢাকার সময়। দুঃখিত, আগেই বলা উচিত ছিল।') }] },
        { id: 'specific', text: b('Ask: include cancelled or refunded orders? Revenue = qty × unit price, or after discounts? Months in Dhaka time or UTC?', 'জিজ্ঞেস করো: বাতিল বা রিফান্ড হওয়া অর্ডার থাকবে? আয় = qty × unit price, নাকি ডিসকাউন্টের পরে? মাস ঢাকার সময়ে না UTC-তে?'), score: { clarify: 2 },
          feedback: b('Three precise questions that each change the numbers.', 'তিনটা নির্দিষ্ট প্রশ্ন, যার প্রতিটা সংখ্যা বদলে দেয়।'),
          replies: [{ from: 'imran', at: '09:25', text: b('Exclude cancelled. Revenue = qty × unit price. Use Dhaka time (UTC+6).', 'বাতিল বাদ। আয় = qty × unit price। ঢাকার সময় (UTC+6) ধরবে।') }] },
        { id: 'deadline', text: b('Ask only: “When do you need it?”', 'শুধু জিজ্ঞেস করো: “কবে লাগবে?”'), score: { clarify: 1 },
          feedback: b('Deadlines matter, but the definition of revenue matters more: a fast wrong number is still wrong.', 'ডেডলাইন জরুরি, কিন্তু আয়ের সংজ্ঞা আরও জরুরি: দ্রুত দেওয়া ভুল সংখ্যা তবুও ভুল।'),
          replies: [{ from: 'imran', at: '09:30', text: b('Tomorrow is fine. Exclude cancelled orders, use qty × unit price and Dhaka time.', 'কাল দিলেই হবে। বাতিল অর্ডার বাদ, qty × unit price আর ঢাকার সময়।') }] },
      ],
      trap: { kind: 'incomplete', text: b('“Revenue per month” did not define which orders count or which timezone sets the month.', '“মাসভিত্তিক আয়” বললেও কোন অর্ডার গোনা হবে বা কোন টাইমজোনে মাস ধরা হবে, তা বলা ছিল না।') },
      lesson: b('For any metric, pin down the definition (what is included, the formula, the time boundary) before writing a query.', 'যেকোনো মেট্রিকের কোয়েরি লেখার আগে সংজ্ঞাটা ঠিক করো: কী থাকবে, সূত্র কী, আর সময়ের সীমা কোথায়।'),
    },
    {
      id: 'finance', kind: 'choose', skills: ['conflict', 'communicate'],
      title: b('Finance counts it differently', 'ফিন্যান্স অন্যভাবে গোনে'),
      messages: [
        { from: 'mitu', at: '10:05', text: b('FYI, finance only counts orders with status = ‘delivered’ as revenue. Refunded and pending orders don’t count.', 'জানিয়ে রাখি, ফিন্যান্স শুধু status = ‘delivered’ অর্ডারকেই আয় ধরে। রিফান্ড আর pending অর্ডার গোনা হয় না।') },
      ],
      prompt: b('Imran said “exclude cancelled”. Mitu says finance counts “delivered only”. What do you do?', 'ইমরান বলেছেন “বাতিল বাদ”। মিতু বলছেন ফিন্যান্স “শুধু delivered” গোনে। কী করবে?'),
      options: [
        { id: 'imran', text: b('Use Imran’s rule. He asked for the report.', 'ইমরানের নিয়মই নাও। রিপোর্ট তো উনিই চেয়েছেন।'), score: { conflict: 0, communicate: 0 },
          feedback: b('The dashboard will disagree with finance’s numbers, and someone will lose trust in both.', 'ড্যাশবোর্ডের সংখ্যা ফিন্যান্সের সঙ্গে মিলবে না, আর মানুষ দুটোর ওপরই আস্থা হারাবে।'),
          replies: [{ from: 'farhana', at: '18:00', text: b('Finance says the dashboard is 9% higher than their books. Which definition did you use?', 'ফিন্যান্স বলছে ড্যাশবোর্ড ওদের হিসাবের চেয়ে ৯% বেশি দেখাচ্ছে। কোন সংজ্ঞা ধরেছিলে?') }, { from: 'imran', at: '18:20', text: b('Let’s match finance: delivered only.', 'ফিন্যান্সের সঙ্গে মিলাই: শুধু delivered।') }] },
        { id: 'both', text: b('Message Imran and Mitu together: show both definitions with a quick count for one month, and ask Imran which the dashboard should use.', 'ইমরান আর মিতুকে একসঙ্গে লেখো: এক মাসের একটা দ্রুত হিসাবসহ দুটো সংজ্ঞাই দেখাও, আর ড্যাশবোর্ডে কোনটা যাবে, ইমরানকে জিজ্ঞেস করো।'), score: { conflict: 2, communicate: 2 },
          feedback: b('You turned an opinion clash into a decision with numbers attached.', 'মতের লড়াইকে তুমি সংখ্যাসহ একটা সিদ্ধান্তে পরিণত করেছ।'),
          replies: [{ from: 'imran', at: '10:40', text: b('Thanks for showing the gap (about 9% in January). Match finance: delivered only.', 'পার্থক্যটা দেখানোর জন্য ধন্যবাদ (জানুয়ারিতে প্রায় ৯%)। ফিন্যান্সের সঙ্গে মেলাও: শুধু delivered।') }] },
        { id: 'mitu', text: b('Quietly switch to Mitu’s rule. Finance is always right.', 'চুপচাপ মিতুর নিয়মে বদলে দাও। ফিন্যান্সই সবসময় ঠিক।'), score: { conflict: 1, communicate: 0 },
          feedback: b('Probably the right number, but Imran asked for something else and doesn’t know you changed it.', 'সংখ্যাটা সম্ভবত ঠিক, কিন্তু ইমরান অন্য কিছু চেয়েছিলেন, আর তুমি যে বদলেছ তা তিনি জানেন না।'),
          replies: [{ from: 'imran', at: '17:30', text: b('Why are pending orders missing? I said only exclude cancelled. …OK, finance’s rule is fine, but tell me next time.', 'pending অর্ডার নেই কেন? আমি তো শুধু বাতিল বাদ দিতে বলেছিলাম। …আচ্ছা, ফিন্যান্সের নিয়মই ঠিক আছে, কিন্তু পরের বার আমাকে জানিও।') }] },
      ],
      trap: { kind: 'conflict', text: b('Product and finance used different definitions of revenue.', 'প্রোডাক্ট আর ফিন্যান্স আয়ের আলাদা সংজ্ঞা ধরছিল।') },
      lesson: b('Show the size of the disagreement with real numbers, and let the owner choose one definition in writing.', 'বাস্তব সংখ্যা দিয়ে মতভেদের আকারটা দেখাও, আর মালিককে লিখিতভাবে একটা সংজ্ঞা বেছে নিতে দাও।'),
    },
    {
      id: 'ai-sql', kind: 'multi', skills: ['verify'],
      title: b('The AI assistant’s query', 'এআই সহকারীর কোয়েরি'),
      aiAsk: b('Write a MySQL query for revenue per month in 2026 from orders, order_items and payments.', 'orders, order_items আর payments থেকে ২০২৬-এর মাসভিত্তিক আয়ের একটা MySQL কোয়েরি লিখে দাও।'),
      messages: [
        { from: 'ai', at: '11:05', text: b('Here is an optimised query. Joining payments ensures only paid orders are counted.', 'এই নাও একটা অপ্টিমাইজড কোয়েরি। payments জয়েন করায় শুধু টাকা দেওয়া অর্ডার গোনা হবে।'), codeLang: 'sql',
          code: "SELECT DATE_FORMAT(o.created_at, '%Y-%m') AS month,\n       SUM(oi.qty * oi.unit_price) AS revenue\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.id\nJOIN payments p ON p.order_id = o.id\nWHERE o.status <> 'cancelled'\n  AND YEAR(o.created_at) = 2026\nGROUP BY 1\nORDER BY 1;" },
      ],
      prompt: b('Some orders are paid in two parts (two rows in payments). Which problems does this query really have? Select all that apply.', 'কিছু অর্ডারের টাকা দুই ভাগে দেওয়া হয় (payments-এ দুটো সারি)। এই কোয়েরিতে আসলেই কোন সমস্যাগুলো আছে? যতগুলো খাটে, সব বেছে নাও।'),
      options: [
        { id: 'dup', correct: true, text: b('Joining payments repeats each item row once per payment, so split payments double the revenue.', 'payments জয়েন করায় প্রতিটা item-এর সারি প্রতিটা payment-এর জন্য একবার করে আসে, তাই ভাগে টাকা দিলে আয় দ্বিগুণ হয়।'), feedback: b('Right: a one-to-many join before SUM inflates totals. Use EXISTS, or aggregate payments first.', 'ঠিক: SUM-এর আগে one-to-many জয়েন যোগফল ফুলিয়ে দেয়। EXISTS ব্যবহার করো, বা payments আগে aggregate করো।') },
        { id: 'status', correct: true, text: b('It still uses “not cancelled” instead of the agreed “delivered only”.', 'ঠিক হওয়া “শুধু delivered”-এর বদলে এখনো “বাতিল নয়” ব্যবহার করছে।'), feedback: b('Right: the AI doesn’t know about the decision you made with Imran.', 'ঠিক: ইমরানের সঙ্গে তুমি যে সিদ্ধান্ত নিয়েছ, এআই তা জানে না।') },
        { id: 'tz', correct: true, text: b('Months are cut in UTC; orders between 18:00 and 24:00 UTC on the last day land in the wrong month in Dhaka time.', 'মাস কাটা হচ্ছে UTC-তে; শেষ দিনের UTC ১৮:০০ থেকে ২৪:০০-এর অর্ডার ঢাকার সময়ে ভুল মাসে পড়ে।'), feedback: b('Right: convert first, e.g. CONVERT_TZ(o.created_at, \'+00:00\', \'+06:00\').', 'ঠিক: আগে সময় বদলাও, যেমন CONVERT_TZ(o.created_at, \'+00:00\', \'+06:00\')।') },
        { id: 'group', correct: false, text: b('GROUP BY 1 is not allowed in MySQL.', 'MySQL-এ GROUP BY 1 চলে না।'), feedback: b('No: MySQL accepts GROUP BY by column position.', 'না: MySQL-এ কলামের অবস্থান দিয়ে GROUP BY চলে।') },
        { id: 'count', correct: false, text: b('It should use COUNT instead of SUM.', 'SUM-এর বদলে COUNT লাগবে।'), feedback: b('No: COUNT would give the number of rows, not money.', 'না: COUNT দিলে সারির সংখ্যা আসবে, টাকা না।') },
      ],
      after: [{ from: 'mitu', at: '11:40', text: b('Good eye on the payments join. Split payments are about 7% of orders.', 'payments জয়েনটা ভালো ধরেছ। প্রায় ৭% অর্ডারের টাকা ভাগে দেওয়া হয়।') }],
      trap: { kind: 'ai', text: b('The AI’s “optimised” query double-counted split payments, used the old rule and the wrong timezone.', 'এআই-এর “অপ্টিমাইজড” কোয়েরি ভাগে দেওয়া টাকা দুবার গুনেছে, পুরোনো নিয়ম আর ভুল টাইমজোন ধরেছে।') },
      lesson: b('Check every join for one-to-many duplication, and re-check AI output against decisions made after you asked it.', 'প্রতিটা জয়েনে one-to-many ডুপ্লিকেশন আছে কি না দেখো, আর এআই-কে জিজ্ঞেস করার পরে হওয়া সিদ্ধান্তগুলোর সঙ্গে ওর কাজ আবার মিলিয়ে নাও।'),
    },
    {
      id: 'checks', kind: 'multi', skills: ['quality'],
      title: b('Checking the numbers', 'সংখ্যা যাচাই'),
      messages: [{ from: 'imran', at: '14:00', text: b('Looks great. Can I put it on the dashboard?', 'দারুণ দেখাচ্ছে। ড্যাশবোর্ডে দিয়ে দিই?') }],
      prompt: b('Before you say yes, which checks are worth doing? Select all that apply.', '“হ্যাঁ” বলার আগে কোন যাচাইগুলো করা উচিত? যতগুলো খাটে, সব।'),
      options: [
        { id: 'ledger', correct: true, text: b('Compare one month with finance’s own total for that month.', 'এক মাসের হিসাব ফিন্যান্সের নিজের ওই মাসের মোটের সঙ্গে মেলাও।'), feedback: b('Yes: an independent source is the strongest check.', 'হ্যাঁ: আলাদা একটা উৎস সবচেয়ে শক্ত যাচাই।') },
        { id: 'rows', correct: true, text: b('Count order_items rows before and after each join.', 'প্রতিটা জয়েনের আগে আর পরে order_items-এর সারি গুনে দেখো।'), feedback: b('Yes: if the count grows, a join is duplicating rows.', 'হ্যাঁ: সংখ্যা বাড়লে বুঝবে কোনো জয়েন সারি দ্বিগুণ করছে।') },
        { id: 'midnight', correct: true, text: b('Look at a few orders placed around midnight on the last day of a month.', 'মাসের শেষ দিনে মাঝরাতের আশপাশের কয়েকটা অর্ডার দেখো।'), feedback: b('Yes: that is where the timezone choice shows.', 'হ্যাঁ: টাইমজোনের প্রভাব ঠিক ওখানেই দেখা যায়।') },
        { id: 'runs', correct: false, text: b('It ran without errors, so the numbers are right.', 'কোনো এরর ছাড়া চলেছে, তাই সংখ্যাগুলো ঠিক।'), feedback: b('No: wrong queries run without errors all the time.', 'না: ভুল কোয়েরিও প্রায়ই কোনো এরর ছাড়া চলে।') },
        { id: 'askai', correct: false, text: b('Ask Office AI whether the totals look reasonable.', 'Office AI-কে জিজ্ঞেস করো মোটগুলো যুক্তিসংগত লাগছে কি না।'), feedback: b('No: the AI has never seen your shop’s data.', 'না: এআই তোমার দোকানের ডেটা কখনো দেখেনি।') },
      ],
      trap: { kind: 'quality', text: b('A query that runs is not a query that is right.', 'যে কোয়েরি চলে, সেটাই ঠিক কোয়েরি না।') },
      lesson: b('Reconcile with an independent total, watch row counts across joins, and test the boundaries.', 'আলাদা একটা মোটের সঙ্গে মেলাও, জয়েনে সারির সংখ্যা খেয়াল রাখো, আর সীমানার কেসগুলো টেস্ট করো।'),
    },
    {
      id: 'vague', kind: 'choose', skills: ['clarify', 'communicate'],
      title: b('“Numbers look off”', '“সংখ্যাগুলো ঠিক লাগছে না”'),
      messages: [{ from: 'farhana', at: '15:20', text: b('Numbers look off. Please fix before the demo.', 'সংখ্যাগুলো ঠিক লাগছে না। ডেমোর আগে ঠিক করে দিও।') }],
      prompt: b('The feedback has no details. What do you do?', 'ফিডব্যাকে কোনো খুঁটিনাটি নেই। কী করবে?'),
      options: [
        { id: 'rewrite', text: b('Rewrite the whole query from scratch, just in case.', 'যদি লাগে, পুরো কোয়েরিটা গোড়া থেকে আবার লেখো।'), score: { clarify: 0, communicate: 0 },
          feedback: b('Without knowing what looked wrong, a rewrite may “fix” the right parts and keep the wrong one.', 'কী ভুল লাগছে না জেনে আবার লিখলে ঠিক অংশগুলো “ঠিক” হতে পারে, আর ভুলটাই থেকে যেতে পারে।'),
          replies: [{ from: 'farhana', at: '16:50', text: b('Still off. I meant March: finance shows 12% less than your number.', 'এখনো মিলছে না। আমি মার্চের কথা বলছিলাম: ফিন্যান্স তোমার চেয়ে ১২% কম দেখাচ্ছে।') }] },
        { id: 'ask', text: b('Ask: “Which month or chart looks off, and what are you comparing it with? Then I can trace it.”', 'জিজ্ঞেস করো: “কোন মাস বা চার্ট ঠিক লাগছে না, আর কীসের সঙ্গে তুলনা করছেন? তাহলে খুঁজে বের করতে পারব।”'), score: { clarify: 2, communicate: 2 },
          feedback: b('Vague feedback needs a specific follow-up: which item, compared with what.', 'অস্পষ্ট ফিডব্যাকের পর নির্দিষ্ট প্রশ্ন লাগে: কোন জিনিস, কীসের সঙ্গে তুলনা।'),
          replies: [{ from: 'farhana', at: '15:28', text: b('March: finance shows 12% less. Probably refunds made in March for February orders?', 'মার্চ: ফিন্যান্স ১২% কম দেখাচ্ছে। সম্ভবত ফেব্রুয়ারির অর্ডারের মার্চে দেওয়া রিফান্ড?') }] },
        { id: 'defend', text: b('Reply that you checked everything carefully and the numbers are correct.', 'উত্তর দাও যে তুমি সব যত্ন করে দেখেছ, সংখ্যাগুলো ঠিক।'), score: { clarify: 0, communicate: 0 },
          feedback: b('Defending without looking closes the conversation. Ask what she saw first.', 'না দেখে নিজের পক্ষ নিলে আলোচনা বন্ধ হয়ে যায়। আগে জিজ্ঞেস করো তিনি কী দেখেছেন।'),
          replies: [{ from: 'farhana', at: '15:40', text: b('I’m comparing March with finance; it’s 12% lower there. Please look again.', 'আমি মার্চ ফিন্যান্সের সঙ্গে মিলাচ্ছি; ওখানে ১২% কম। আবার দেখো।') }] },
      ],
      trap: { kind: 'incomplete', text: b('Your lead’s feedback said something was wrong but not what or where.', 'লিডের ফিডব্যাকে কিছু একটা ভুল বলা ছিল, কিন্তু কী বা কোথায়, তা না।') },
      lesson: b('Turn vague feedback into a specific case (which item, compared with what) before changing anything.', 'কিছু বদলানোর আগে অস্পষ্ট ফিডব্যাককে একটা নির্দিষ্ট কেসে নিয়ে আসো: কোন জিনিস, কীসের সঙ্গে তুলনা।'),
    },
    {
      id: 'update', kind: 'choose', skills: ['communicate'],
      title: b('Your update to the team', 'টিমের কাছে তোমার আপডেট'),
      messages: [],
      prompt: b('You found that refunds explain the March gap. Which update do you post?', 'তুমি দেখলে মার্চের পার্থক্যের কারণ রিফান্ড। কোন আপডেটটা দেবে?'),
      options: [
        { id: 'clear', text: b('“Revenue query v2 is ready. Definition: delivered orders only (Imran, 10:40), qty × unit price, months in Dhaka time. Fixed: split payments were double-counted (AI draft). Checked: Jan–Mar match finance within 0.1% after adding refunds in the month they happen. Open: should the dashboard label this ‘net of refunds’?”', '“আয়ের কোয়েরি v2 রেডি। সংজ্ঞা: শুধু delivered অর্ডার (ইমরান, ১০:৪০), qty × unit price, মাস ঢাকার সময়ে। ঠিক করা হয়েছে: ভাগে দেওয়া টাকা দুবার গোনা হচ্ছিল (এআই-এর খসড়া)। যাচাই: রিফান্ড যে মাসে হয় সেই মাসে ধরার পর জানুয়ারি–মার্চ ফিন্যান্সের সঙ্গে ০.১%-এর মধ্যে মেলে। খোলা প্রশ্ন: ড্যাশবোর্ডে কি ‘রিফান্ড বাদে’ লেবেল দেব?”'), score: { communicate: 2 },
          feedback: b('Status, definition with who approved it, what was fixed, how it was verified, and the one open question.', 'স্ট্যাটাস, কে অনুমোদন দিয়েছেন সহ সংজ্ঞা, কী ঠিক হলো, কীভাবে যাচাই হলো, আর একটাই খোলা প্রশ্ন।') },
        { id: 'fixed', text: b('“Fixed the numbers.”', '“সংখ্যাগুলো ঠিক করে দিয়েছি।”'), score: { communicate: 0 },
          feedback: b('Nobody can tell what changed or whether to trust it now.', 'কী বদলাল বা এখন ভরসা করা যায় কি না, কেউ বুঝতে পারবে না।') },
        { id: 'blame', text: b('“The AI’s query was wrong and the requirements kept changing, so it took longer.”', '“এআই-এর কোয়েরি ভুল ছিল আর চাহিদা বারবার বদলাচ্ছিল, তাই সময় বেশি লেগেছে।”'), score: { communicate: 0 },
          feedback: b('Explaining delays by blame doesn’t tell the team the status. You own the final query.', 'দোষ দিয়ে দেরির ব্যাখ্যা টিমকে স্ট্যাটাস জানায় না। চূড়ান্ত কোয়েরির দায় তোমার।') },
      ],
      trap: { kind: 'update', text: b('After several changes, the team needs one clear record of the final definition and checks.', 'অনেক বদলের পর টিমের দরকার চূড়ান্ত সংজ্ঞা আর যাচাইয়ের একটা পরিষ্কার রেকর্ড।') },
      lesson: b('Close the loop in writing: the final definition, who agreed it, what was fixed, and how you verified it.', 'লিখিতভাবে কাজটা শেষ করো: চূড়ান্ত সংজ্ঞা, কে সম্মত হয়েছেন, কী ঠিক হলো, আর কীভাবে যাচাই করলে।'),
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Project 3: data / ML, flagging students who may drop a course.
// ─────────────────────────────────────────────────────────────────────────────
const dropout: Project = {
  id: 'dropout-model',
  free: false,
  track: b('Data science · Machine learning', 'ডেটা সায়েন্স · মেশিন লার্নিং'),
  title: b('Who might drop the course?', 'কে কোর্স ছেড়ে দিতে পারে?'),
  role: b('Machine learning intern', 'মেশিন লার্নিং ইন্টার্ন'),
  company: 'Nodi Labs',
  minutes: 20,
  summary: b(
    'Build a model that flags students likely to drop a course so advisors can call them. The goal is unclear, two managers want different numbers, the AI’s notebook leaks the answer, and a colleague swaps the data without saying why.',
    'এমন একটা মডেল বানাও, যা কোর্স ছেড়ে দিতে পারে এমন স্টুডেন্টদের চিহ্নিত করবে, যাতে অ্যাডভাইজররা ফোন করতে পারেন। লক্ষ্য অস্পষ্ট, দুই ম্যানেজার দুই রকম সংখ্যা চান, এআই-এর নোটবুক উত্তর আগেই ফাঁস করে দেয়, আর এক সহকর্মী কারণ না বলে ডেটা বদলে দেন।'),
  team: ['farhana', 'imran', 'tanvir', 'ai'],
  steps: [
    {
      id: 'goal', kind: 'choose', skills: ['clarify'],
      title: b('“High accuracy, by Sunday”', '“বেশি অ্যাকুরেসি, রবিবারের মধ্যে”'),
      messages: [
        { from: 'farhana', at: '09:00', text: b('We have last year’s data for 2,000 students (6% dropped). Please build a model to flag students likely to drop. Aim for high accuracy. Sunday, please.', 'গত বছরের ২,০০০ স্টুডেন্টের ডেটা আছে (৬% ছেড়ে দিয়েছিল)। কারা ছেড়ে দিতে পারে, চিহ্নিত করার একটা মডেল বানাও। অ্যাকুরেসি বেশি হওয়া চাই। রবিবারের মধ্যে, প্লিজ।') },
      ],
      prompt: b('What do you ask before starting?', 'শুরুর আগে কী জিজ্ঞেস করবে?'),
      options: [
        { id: 'use', text: b('Ask what happens to a flagged student, which mistake is worse (missing a dropper or a false alarm), and when in the term the prediction is needed.', 'জিজ্ঞেস করো চিহ্নিত স্টুডেন্টের সঙ্গে কী করা হবে, কোন ভুলটা খারাপ (ছেড়ে দেওয়া কাউকে মিস করা, নাকি ভুল অ্যালার্ম), আর টার্মের কখন প্রেডিকশন লাগবে।'), score: { clarify: 2 },
          feedback: b('These three answers decide the metric, the threshold and which features you may use.', 'এই তিনটা উত্তরই ঠিক করে দেয় মেট্রিক, থ্রেশহোল্ড আর কোন ফিচার ব্যবহার করা যাবে।'),
          replies: [{ from: 'farhana', at: '09:20', text: b('Advisors will call flagged students. Missing a dropper is worse. They can call about 150 students a term, and we predict in week 3.', 'চিহ্নিত স্টুডেন্টদের অ্যাডভাইজররা ফোন করবেন। কাউকে মিস করা বেশি খারাপ। প্রতি টার্মে ওঁরা প্রায় ১৫০ জনকে ফোন করতে পারেন, আর প্রেডিকশন হবে তৃতীয় সপ্তাহে।') }] },
        { id: 'algo', text: b('Ask which algorithm she prefers.', 'জিজ্ঞেস করো কোন অ্যালগরিদম তাঁর পছন্দ।'), score: { clarify: 1 },
          feedback: b('The algorithm is your job. What you need from her is how the model will be used.', 'অ্যালগরিদম বাছাই তোমার কাজ। তাঁর কাছ থেকে জানা দরকার মডেলটা কীভাবে ব্যবহার হবে।'),
          replies: [{ from: 'farhana', at: '09:25', text: b('Whatever works. Advisors call flagged students, about 150 per term, in week 3. Missing a dropper is the worst case.', 'যেটা কাজ করে। অ্যাডভাইজররা তৃতীয় সপ্তাহে চিহ্নিতদের ফোন করেন, টার্মে প্রায় ১৫০ জন। কাউকে মিস করাটাই সবচেয়ে খারাপ।') }] },
        { id: 'none', text: b('Nothing: “high accuracy” is clear enough. Start training.', 'কিছু না: “বেশি অ্যাকুরেসি” যথেষ্ট পরিষ্কার। ট্রেনিং শুরু করো।'), score: { clarify: 0 },
          feedback: b('With 6% dropouts, a model that predicts “nobody drops” already has 94% accuracy and helps no one.', '৬% ছেড়ে দিলে, “কেউ ছাড়বে না” বলা একটা মডেলেরই অ্যাকুরেসি ৯৪%, আর তাতে কারও কোনো উপকার হয় না।'),
          replies: [{ from: 'farhana', at: '15:00', text: b('Forgot to say: advisors can only call ~150 students, in week 3. Missing droppers is what we want to avoid.', 'বলতে ভুলে গেছি: অ্যাডভাইজররা তৃতীয় সপ্তাহে মাত্র ~১৫০ জনকে ফোন করতে পারেন। ছেড়ে দেওয়াদের মিস করাটাই এড়াতে চাই।') }] },
      ],
      trap: { kind: 'incomplete', text: b('“High accuracy” hid the real goal: catch droppers within 150 calls, using week-3 data.', '“বেশি অ্যাকুরেসি”-র আড়ালে ছিল আসল লক্ষ্য: তৃতীয় সপ্তাহের ডেটা দিয়ে ১৫০টা ফোনের মধ্যে ছেড়ে দেওয়াদের ধরা।') },
      lesson: b('Ask how a model’s output will be used before choosing a metric; that decides what “good” means.', 'মেট্রিক বাছার আগে জিজ্ঞেস করো মডেলের আউটপুট কীভাবে ব্যবহার হবে; “ভালো” মানে কী, সেটা ওখান থেকেই ঠিক হয়।'),
    },
    {
      id: 'kpi', kind: 'choose', skills: ['conflict', 'communicate'],
      title: b('Two managers, two numbers', 'দুই ম্যানেজার, দুই সংখ্যা'),
      messages: [
        { from: 'imran', at: '11:00', text: b('For the board report the KPI is accuracy above 95%. Please make sure we hit that.', 'বোর্ড রিপোর্টে KPI হলো ৯৫%-এর বেশি অ্যাকুরেসি। ওটা যেন অবশ্যই হয়।') },
      ],
      prompt: b('Imran wants accuracy above 95%. Farhana wants to catch droppers. What do you do?', 'ইমরান চান ৯৫%-এর বেশি অ্যাকুরেসি। ফারহানা চান ছেড়ে দেওয়াদের ধরতে। কী করবে?'),
      options: [
        { id: 'hit', text: b('Tune the model until accuracy is above 95%; that is the KPI.', 'অ্যাকুরেসি ৯৫%-এর ওপরে না যাওয়া পর্যন্ত মডেল টিউন করো; ওটাই KPI।'), score: { conflict: 0, communicate: 0 },
          feedback: b('You can reach 95% by flagging almost nobody, which defeats the purpose. The conflict needs to be raised, not optimised away.', 'প্রায় কাউকে চিহ্নিত না করেই ৯৫% পাওয়া যায়, তাতে উদ্দেশ্যটাই নষ্ট হয়। বিরোধটা তুলে ধরতে হবে, অপ্টিমাইজ করে লুকিয়ে ফেলা না।'),
          replies: [{ from: 'farhana', at: '17:30', text: b('The model flags only 12 students all term?! Advisors need about 150. What happened?', 'মডেল পুরো টার্মে মাত্র ১২ জনকে চিহ্নিত করছে?! অ্যাডভাইজরদের প্রায় ১৫০ জন লাগবে। কী হলো?') }] },
        { id: 'explain', text: b('Write to both with numbers: “Predicting nobody drops gives 94% accuracy. I suggest we report recall among the top 150 flagged (how many droppers advisors reach), with accuracy for reference. OK?”', 'দুজনকেই সংখ্যাসহ লেখো: “কেউ ছাড়বে না বললেই ৯৪% অ্যাকুরেসি। আমি প্রস্তাব করছি শীর্ষ ১৫০ জনের মধ্যে recall (অ্যাডভাইজররা কতজন ছেড়ে দেওয়াকে পাবেন) রিপোর্ট করি, পাশে অ্যাকুরেসি। ঠিক আছে?”'), score: { conflict: 2, communicate: 2 },
          feedback: b('You explained why the KPI misleads, with one number, and proposed a metric that serves both people.', 'একটা সংখ্যা দিয়ে বুঝিয়েছ KPI কেন বিভ্রান্তিকর, আর দুজনেরই কাজে লাগে এমন মেট্রিক প্রস্তাব করেছ।'),
          replies: [{ from: 'imran', at: '11:30', text: b('I didn’t know that about accuracy. Agreed: recall in the top 150 as the main number, accuracy next to it.', 'অ্যাকুরেসির এই ব্যাপারটা জানতাম না। রাজি: শীর্ষ ১৫০-এ recall মূল সংখ্যা, পাশে অ্যাকুরেসি।') }, { from: 'farhana', at: '11:35', text: b('👍 Perfect.', '👍 দারুণ।') }] },
        { id: 'farhana', text: b('Ignore Imran’s KPI. Farhana is your supervisor.', 'ইমরানের KPI উপেক্ষা করো। ফারহানাই তোমার সুপারভাইজার।'), score: { conflict: 0, communicate: 0 },
          feedback: b('Imran will present the number to the board. If you ignore him, the conflict surfaces later, in public.', 'বোর্ডে সংখ্যাটা ইমরানই দেখাবেন। তাঁকে উপেক্ষা করলে বিরোধটা পরে সবার সামনে বেরিয়ে আসবে।'),
          replies: [{ from: 'imran', at: '18:00', text: b('The report says accuracy 88%? The KPI was 95%. Why wasn’t I told?', 'রিপোর্টে অ্যাকুরেসি ৮৮%? KPI তো ৯৫% ছিল। আমাকে জানানো হলো না কেন?') }] },
      ],
      trap: { kind: 'conflict', text: b('A manager set a KPI (accuracy) that works against the real goal on imbalanced data.', 'এক ম্যানেজার এমন একটা KPI (অ্যাকুরেসি) দিয়েছিলেন, যা ভারসাম্যহীন ডেটায় আসল লক্ষ্যের বিপক্ষে যায়।') },
      lesson: b('When a target conflicts with the real goal, show why with one clear number and propose a metric both sides can accept.', 'লক্ষ্যমাত্রা আসল উদ্দেশ্যের সঙ্গে না মিললে একটা স্পষ্ট সংখ্যা দিয়ে কারণ দেখাও, আর দুই পক্ষই মানতে পারে এমন মেট্রিক প্রস্তাব করো।'),
    },
    {
      id: 'ai-notebook', kind: 'multi', skills: ['verify'],
      title: b('The AI assistant’s notebook', 'এআই সহকারীর নোটবুক'),
      aiAsk: b('Write Python (scikit-learn) to predict dropped = 1 from students.csv.', 'students.csv থেকে dropped = 1 প্রেডিক্ট করার Python (scikit-learn) কোড লিখে দাও।'),
      messages: [
        { from: 'ai', at: '12:10', text: b('Done! This pipeline reaches 97% accuracy. Ready for production.', 'হয়ে গেছে! এই পাইপলাইন ৯৭% অ্যাকুরেসি পায়। প্রোডাকশনের জন্য রেডি।'), codeLang: 'python',
          code: "df = pd.read_csv('students.csv')\nX = df[['attendance_wk3', 'quiz1', 'logins_wk3', 'final_grade']]\ny = df['dropped']\nX = StandardScaler().fit_transform(X)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)\nmodel = LogisticRegression().fit(X_tr, y_tr)\nprint('accuracy', model.score(X_te, y_te))   # 0.97" },
      ],
      prompt: b('The prediction must be made in week 3. Which problems does this notebook really have? Select all that apply.', 'প্রেডিকশন তৃতীয় সপ্তাহেই করতে হবে। এই নোটবুকে আসলেই কোন সমস্যাগুলো আছে? যতগুলো খাটে, সব।'),
      options: [
        { id: 'final', correct: true, text: b('It uses final_grade, which is only known after the term ends.', 'final_grade ব্যবহার করছে, যা টার্ম শেষ হওয়ার পরেই জানা যায়।'), feedback: b('Right: target leakage. In week 3 there is no final grade, so the 97% is fake.', 'ঠিক: টার্গেট লিকেজ। তৃতীয় সপ্তাহে কোনো final grade থাকে না, তাই ৯৭% আসলে মিথ্যা।') },
        { id: 'scale', correct: true, text: b('The scaler is fitted on all rows before the split, so test data leaks into training.', 'split-এর আগে সব সারি দিয়ে scaler fit করা হয়েছে, তাই টেস্ট ডেটা ট্রেনিংয়ে ঢুকে যায়।'), feedback: b('Right: fit the scaler on the training part only (a Pipeline does this).', 'ঠিক: scaler শুধু ট্রেনিং অংশে fit করো (Pipeline এটা নিজেই করে)।') },
        { id: 'acc', correct: true, text: b('Accuracy is the wrong yardstick with 6% dropouts; it doesn’t show how many droppers are caught.', '৬% ছেড়ে দেওয়ার ডেটায় অ্যাকুরেসি ভুল মাপকাঠি; কতজন ছেড়ে দেওয়াকে ধরা গেল, তা দেখায় না।'), feedback: b('Right: report recall among the top 150, as agreed.', 'ঠিক: যেমন ঠিক হয়েছে, শীর্ষ ১৫০-এর মধ্যে recall রিপোর্ট করো।') },
        { id: 'strat', correct: true, text: b('The split is not stratified, so the small test set may have very few droppers.', 'split stratified না, তাই ছোট টেস্ট সেটে ছেড়ে দেওয়া স্টুডেন্ট খুব কম পড়তে পারে।'), feedback: b('Right: use stratify=y so both parts keep about 6% droppers.', 'ঠিক: stratify=y দাও, যাতে দুই অংশেই প্রায় ৬% ছেড়ে দেওয়া থাকে।') },
        { id: 'lr', correct: false, text: b('Logistic regression can’t be used for yes/no predictions.', 'হ্যাঁ/না প্রেডিকশনে লজিস্টিক রিগ্রেশন ব্যবহার করা যায় না।'), feedback: b('No: logistic regression is a standard yes/no classifier.', 'না: লজিস্টিক রিগ্রেশন হ্যাঁ/না ক্লাসিফিকেশনের একটা সাধারণ পদ্ধতি।') },
        { id: 'csv', correct: false, text: b('pandas can’t read CSV files.', 'pandas CSV ফাইল পড়তে পারে না।'), feedback: b('No: read_csv is exactly what it is for.', 'না: read_csv ঠিক এই কাজের জন্যই।') },
      ],
      after: [{ from: 'tanvir', at: '12:40', text: b('Yes, without final_grade and with a proper pipeline I get recall about 0.55 in the top 150. Honest, and still useful.', 'হ্যাঁ, final_grade বাদ দিয়ে আর ঠিকঠাক Pipeline দিয়ে শীর্ষ ১৫০-এ recall পাই প্রায় ০.৫৫। সৎ সংখ্যা, আর তবুও কাজের।') }],
      trap: { kind: 'ai', text: b('The AI’s 97% came from leaked future data and a misleading metric.', 'এআই-এর ৯৭% এসেছিল ভবিষ্যতের ফাঁস হওয়া ডেটা আর বিভ্রান্তিকর মেট্রিক থেকে।') },
      lesson: b('A suspiciously good score is a reason to look for leakage, not to celebrate. Check every feature is known at prediction time.', 'অস্বাভাবিক ভালো স্কোর উদযাপনের না, লিকেজ খোঁজার কারণ। প্রতিটা ফিচার প্রেডিকশনের সময় জানা যায় কি না দেখো।'),
    },
    {
      id: 'newdata', kind: 'choose', skills: ['quality', 'communicate'],
      title: b('A new file, no explanation', 'নতুন ফাইল, কোনো ব্যাখ্যা নেই'),
      messages: [{ from: 'tanvir', at: '14:20', text: b('Use students_v2.csv instead, the old one had problems.', 'এর বদলে students_v2.csv ব্যবহার করো, পুরোনোটায় সমস্যা ছিল।') }],
      prompt: b('Tanvir sends a new data file without saying what changed. What do you do?', 'তানভীর কী বদলেছে না বলে নতুন একটা ডেটা ফাইল পাঠালেন। কী করবে?'),
      options: [
        { id: 'swap', text: b('Swap the file and retrain. He knows the data.', 'ফাইল বদলে আবার ট্রেন করো। ডেটা উনিই ভালো চেনেন।'), score: { quality: 0, communicate: 0 },
          feedback: b('If results change, you won’t know whether it was your model or the data, and you can’t explain it to anyone.', 'ফলাফল বদলালে বুঝবে না সেটা মডেলের কারণে না ডেটার, আর কাউকে ব্যাখ্যাও করতে পারবে না।'),
          replies: [{ from: 'farhana', at: '18:10', text: b('Why did the dropout rate jump from 6% to 9% in your report?', 'তোমার রিপোর্টে ছেড়ে দেওয়ার হার ৬% থেকে ৯% হয়ে গেল কেন?') }, { from: 'tanvir', at: '18:20', text: b('Ah, v2 counts late withdrawals (W after week 8) as dropped. Should have mentioned it.', 'আহ, v2-তে দেরিতে withdraw করা (অষ্টম সপ্তাহের পরে W) ছেড়ে দেওয়া হিসেবে ধরা হয়েছে। বলা উচিত ছিল।') }] },
        { id: 'check', text: b('Compare the two files (rows, columns, dropout rate) and ask Tanvir what changed and why, before retraining.', 'আবার ট্রেন করার আগে দুই ফাইল মিলিয়ে দেখো (সারি, কলাম, ছেড়ে দেওয়ার হার), আর তানভীরকে জিজ্ঞেস করো কী আর কেন বদলেছে।'), score: { quality: 2, communicate: 2 },
          feedback: b('You checked what changed yourself and asked for the reason, so the change is understood and documented.', 'কী বদলেছে নিজে যাচাই করেছ আর কারণও জিজ্ঞেস করেছ, তাই বদলটা বোঝা গেছে আর লেখা আছে।'),
          replies: [{ from: 'tanvir', at: '14:35', text: b('Good question. v2 counts late withdrawals (W after week 8) as dropped; that’s why the rate is 9%. Farhana approved it this morning.', 'ভালো প্রশ্ন। v2-তে দেরিতে withdraw করা (অষ্টম সপ্তাহের পরে W) ছেড়ে দেওয়া হিসেবে ধরা হয়েছে; তাই হার ৯%। ফারহানা আজ সকালে অনুমোদন দিয়েছেন।') }] },
        { id: 'ignore', text: b('Keep the old file. Changing data now will only cause confusion.', 'পুরোনো ফাইলই রাখো। এখন ডেটা বদলালে শুধু গোলমাল বাড়বে।'), score: { quality: 0, communicate: 0 },
          feedback: b('If the old file really had problems, your model learns them. Find out what was wrong first.', 'পুরোনো ফাইলে সত্যিই সমস্যা থাকলে মডেল সেগুলোই শিখবে। আগে জেনে নাও কী ভুল ছিল।'),
          replies: [{ from: 'tanvir', at: '17:00', text: b('You’re still on the old file? It missed late withdrawals, so the labels were wrong.', 'তুমি এখনো পুরোনো ফাইলে? ওতে দেরিতে withdraw করাদের ধরা হয়নি, তাই লেবেল ভুল ছিল।') }] },
      ],
      trap: { kind: 'incomplete', text: b('A colleague changed the label definition in the data without saying so.', 'এক সহকর্মী কিছু না বলে ডেটার লেবেলের সংজ্ঞা বদলে দিয়েছিলেন।') },
      lesson: b('When inputs change, compare old and new yourself and ask what changed and why before using them.', 'ইনপুট বদলালে ব্যবহারের আগে পুরোনো আর নতুন নিজে মিলিয়ে দেখো, আর জিজ্ঞেস করো কী আর কেন বদলেছে।'),
    },
    {
      id: 'checks', kind: 'multi', skills: ['quality'],
      title: b('Before you report the result', 'ফলাফল জানানোর আগে'),
      messages: [],
      prompt: b('Which checks belong in your evaluation? Select all that apply.', 'তোমার মূল্যায়নে কোন যাচাইগুলো থাকা উচিত? যতগুলো খাটে, সব।'),
      options: [
        { id: 'baseline', correct: true, text: b('Compare with a simple baseline (for example, flag the 150 students with the lowest week-3 attendance).', 'একটা সহজ বেসলাইনের সঙ্গে তুলনা করো (যেমন, তৃতীয় সপ্তাহে সবচেয়ে কম উপস্থিতির ১৫০ জনকে চিহ্নিত করা)।'), feedback: b('Yes: if the model can’t beat a simple rule, it isn’t worth deploying.', 'হ্যাঁ: মডেল একটা সহজ নিয়মকেও হারাতে না পারলে চালু করার মানে নেই।') },
        { id: 'holdout', correct: true, text: b('Measure recall in the top 150 on data the model never saw.', 'মডেল কখনো দেখেনি এমন ডেটায় শীর্ষ ১৫০-এর recall মাপো।'), feedback: b('Yes: the agreed metric, on held-out data.', 'হ্যাঁ: ঠিক হওয়া মেট্রিক, আলাদা রাখা ডেটায়।') },
        { id: 'features', correct: true, text: b('Confirm every feature is available in week 3.', 'নিশ্চিত হও যে প্রতিটা ফিচার তৃতীয় সপ্তাহেই পাওয়া যায়।'), feedback: b('Yes: the leakage check.', 'হ্যাঁ: লিকেজের যাচাই।') },
        { id: 'groups', correct: true, text: b('Check whether recall is much worse for some groups (for example, first-year vs final-year students).', 'দেখো কোনো গ্রুপে (যেমন, প্রথম বর্ষ বনাম শেষ বর্ষ) recall অনেক খারাপ কি না।'), feedback: b('Yes: a model that misses one group entirely needs a closer look before advisors rely on it.', 'হ্যাঁ: যে মডেল পুরো একটা গ্রুপকে মিস করে, অ্যাডভাইজরদের ভরসার আগে সেটা আরও খতিয়ে দেখা দরকার।') },
        { id: 'same', correct: false, text: b('Evaluate on the training data so the score uses all 2,000 students.', 'ট্রেনিং ডেটাতেই মূল্যায়ন করো, যাতে স্কোরে ২,০০০ জনই থাকে।'), feedback: b('No: scores on training data are always too optimistic.', 'না: ট্রেনিং ডেটার স্কোর সবসময় বেশি আশাবাদী হয়।') },
      ],
      trap: { kind: 'quality', text: b('One overall number can hide a useless model or a group it fails.', 'একটা সামগ্রিক সংখ্যা অকেজো মডেল বা যে গ্রুপে মডেল ব্যর্থ, তা লুকিয়ে রাখতে পারে।') },
      lesson: b('Evaluate on held-out data, against a baseline, with the agreed metric, and look at groups, not just the total.', 'আলাদা রাখা ডেটায়, বেসলাইনের সঙ্গে, ঠিক হওয়া মেট্রিক দিয়ে মূল্যায়ন করো, আর শুধু মোট না, গ্রুপগুলোও দেখো।'),
    },
    {
      id: 'update', kind: 'choose', skills: ['communicate'],
      title: b('Your results summary', 'তোমার ফলাফলের সারাংশ'),
      messages: [{ from: 'farhana', at: '17:00', text: b('Please post a summary for me and Imran.', 'আমার আর ইমরানের জন্য একটা সারাংশ দাও।') }],
      prompt: b('Which summary do you post?', 'কোন সারাংশটা দেবে?'),
      options: [
        { id: 'clear', text: b('“Model ready for review. On held-out data (v2 labels, late W = dropped), advisors’ top 150 would reach 55% of droppers vs 31% for the attendance rule; accuracy 91% for reference. Uses week-3 features only; removed final_grade (leak in the AI draft). Recall is lower for first-years (41%). Next: more week-3 signals. Questions?”', '“মডেল রিভিউয়ের জন্য রেডি। আলাদা রাখা ডেটায় (v2 লেবেল, দেরিতে W = ছেড়ে দেওয়া) অ্যাডভাইজরদের শীর্ষ ১৫০ জনের তালিকায় ৫৫% ছেড়ে দেওয়া স্টুডেন্ট পড়বে, উপস্থিতির নিয়মে ৩১%; রেফারেন্সের জন্য অ্যাকুরেসি ৯১%। শুধু তৃতীয় সপ্তাহের ফিচার; final_grade সরানো হয়েছে (এআই-এর খসড়ায় লিক)। প্রথম বর্ষে recall কম (৪১%)। পরের ধাপ: তৃতীয় সপ্তাহের আরও সিগন্যাল। প্রশ্ন আছে?”'), score: { communicate: 2 },
          feedback: b('The agreed metric, a baseline, the data version, a known weakness and the next step, in plain words.', 'ঠিক হওয়া মেট্রিক, বেসলাইন, ডেটার ভার্সন, জানা দুর্বলতা আর পরের ধাপ, সহজ ভাষায়।') },
        { id: 'acc', text: b('“Accuracy 91% (target was 95%). Will try to improve.”', '“অ্যাকুরেসি ৯১% (লক্ষ্য ছিল ৯৫%)। আরও ভালো করার চেষ্টা করব।”'), score: { communicate: 0 },
          feedback: b('This reports the metric everyone agreed not to use, and hides what the model achieves for advisors.', 'যে মেট্রিক ব্যবহার না করার কথা সবাই মেনেছিলেন, এটা সেটাই জানায়, আর অ্যাডভাইজরদের জন্য মডেল কী করে, তা লুকিয়ে রাখে।') },
        { id: 'jargon', text: b('A table of 14 metrics (AUC, F1, log loss, MCC…) with no explanation.', 'কোনো ব্যাখ্যা ছাড়া ১৪টা মেট্রিকের (AUC, F1, log loss, MCC…) একটা টেবিল।'), score: { communicate: 1 },
          feedback: b('Thorough, but Imran can’t use it in a board report. Lead with the one number that matters, in plain words.', 'বিস্তারিত, কিন্তু ইমরান এটা বোর্ড রিপোর্টে ব্যবহার করতে পারবেন না। আগে যে সংখ্যাটা জরুরি, সেটা সহজ ভাষায় বলো।') },
      ],
      trap: { kind: 'update', text: b('Two audiences (your lead and a manager reporting to the board) need the same honest result in plain words.', 'দুই ধরনের পাঠক (তোমার লিড আর বোর্ডে রিপোর্ট করা ম্যানেজার), দুজনেরই সহজ ভাষায় একই সৎ ফলাফল দরকার।') },
      lesson: b('Report the agreed metric against a baseline, name the data version and known weaknesses, and keep it readable for non-specialists.', 'বেসলাইনের পাশে ঠিক হওয়া মেট্রিক দাও, ডেটার ভার্সন আর জানা দুর্বলতার কথা বলো, আর এমনভাবে লেখো যাতে বিশেষজ্ঞ না হয়েও পড়া যায়।'),
    },
  ],
};

export const PROJECTS: Project[] = [cgpa, revenue, dropout];
export const getProject = (id: string) => PROJECTS.find((p) => p.id === id);
