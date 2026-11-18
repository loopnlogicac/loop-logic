// Public landing page.
import { getLang, setLang, applyI18n, el, num } from './common.js';
import { courseCard } from './ui.js';

const T = {
  en: {
    tagline: 'Learn with purpose', nCourses: 'Courses', nHow: 'How it works', nOrgs: 'For institutions', nPricing: 'Pricing', nStart: 'Start learning',
    kicker: 'AI teacher for Bangla-speaking university students', h1a: 'Understand every line.', h1b: 'Prove it without help.',
    sub: 'Lessons that adapt to how you read. Select anything you don’t get for a short answer from trusted sources — no prompt to write. Practise catching an AI’s mistakes, then show what you know on a sealed check.',
    cta1: 'Try a lesson — free', cta2: 'Browse courses',
    demoP1: 'Raising the threshold flags fewer emails, so', demoMark: 'false positives go down and false negatives go up', demoA1: 'Explain', demoA2: 'Sources', demoA3: 'Quiz',
    demoBadge: 'From the reviewed notes', demoAns: 'A higher threshold means fewer emails count as spam. Fewer real emails get wrongly flagged, but more spam slips through.', demoSrc: 'Source: Loop & Logic ML notes · §3 Two kinds of mistakes',
    pSubs: 'YouTube subscribers', pVideos: 'Bangla video lessons', pCourses: 'university courses covered', pLangVal: 'EN + বাংলা', pLang: 'every page, every answer',
    howK: 'How it works', howH: 'Read, ask without prompting, prove it', howL: 'Students don’t need to know how to talk to an AI. They read, tap what confuses them, and the platform does the rest — from sources a teacher approved.',
    s1h: 'Read a lesson that fits you', s1p: 'Wording, term help and examples adjust to how you read. Facts, formulas and numbers never change — and you can always see the original.',
    s2h: 'Select a line, get a short answer', s2p: 'Explain, search trusted sources or take a quick quiz. Answers cite the passage they came from; if the AI can’t back it up, you get the reviewed text instead.',
    s3h: 'Prove it on a sealed check', s3p: 'Practise judging an AI coworker’s advice, then solve a fresh task with no help. You get an evidence receipt showing what you did alone and what needed help.',
    fK: 'Why it’s different', fH: 'An AI teacher that shows its sources',
    f1h: 'Trusted sources only', f1p: 'Answers come from reviewed notes, your teacher’s videos and approved websites. Every URL is re-checked before you see it.',
    f2h: 'Adapts the text, not the facts', f2p: 'Simpler or deeper wording, term help, extra examples, reading themes. Every change comes with a reason you can read.',
    f3h: 'Bangla and English', f3p: 'Switch language on any page. Search understands Bangla and romanised Bangla, the way students actually type.',
    f4h: 'Checks AI instead of trusting it', f4p: 'Code checks every number. Students learn to spot when an AI’s confident advice is wrong — the skill employers now ask for.',
    f5h: 'Evidence, not just scores', f5p: 'Help is allowed in practice but never counted as mastery. The sealed check shows what a student can do alone.',
    f6h: 'A hands-on lab with every lesson', f6p: 'Real code, a circuit simulator or a spreadsheet, with setup steps, starter material and a checked result. Every lab runs free in a browser.',
    cK: 'Courses', cH: 'Your university courses, already on Loop & Logic', cL: 'Every course links to our Bangla video playlists. Eight courses already have adaptive lessons, each with a hands-on lab; more are added course by course.', cAll: 'See all courses',
    oK: 'For universities, coaching and career centres', oH: 'See where your class gets stuck — without watching individuals', oL: 'Instructors see which paragraphs confuse people, which mistakes repeat, and whether help carried over to the sealed check.', oCta: 'Open the instructor demo',
    o1: 'Class patterns only — groups below a privacy minimum are hidden', o2: 'Add your own trusted library: notes, slides, approved websites', o3: 'Evidence receipts you can attach to grades or job readiness', o4: 'AI cost and fallback rate visible on the dashboard', o5: 'Sign-in with Google or email; data stays exportable and deletable',
    prK: 'Pricing', prH: 'Free to start. Fair for students. Simple for institutions.',
    pl1n: 'Free', pl1w: 'For every student', pl1a: 'All courses and video playlists', pl1b: 'Adaptive lessons in English and Bangla', pl1c: 'Glossary and reviewed answers, unlimited', pl1d: '10 AI-worded answers a day', pl1cta: 'Start free',
    pl2n: 'Student Plus', pl2w: 'For exam season and job prep', perMonth: '/ month', pl2a: 'Everything in Free', pl2b: 'Unlimited AI answers (fair use)', pl2c: 'Live search on approved websites', pl2d: 'All practice sets and sealed checks', pl2e: 'Shareable evidence receipts', pl2cta: 'Get Student Plus',
    pl3n: 'Institution', pl3w: 'Universities, coaching and career centres', perSeat: '/ learner / semester', pl3a: 'Student Plus for every learner', pl3b: 'Instructor dashboard and class reports', pl3c: 'Your own trusted library and lessons', pl3d: 'Sign-in with your domain; data export', pl3cta: 'Talk to us',
    prNote: 'Prices in Bangladeshi taka. Pilot partners get the first semester free.',
    qK: 'Questions', qH: 'Common questions',
    endH: 'Start with one lesson. It takes five minutes.', endCta: 'Open a lesson',
    footC: '© 2026 Loop & Logic · Built for the International AI Builders Congress', footI: 'Instructors',
    videos: 'videos', adaptive: 'Lessons + labs', videoOnly: 'Video playlists', lessonsLabs: (l, b) => `${l} lessons · ${b} labs`,
    faq: [
      ['Does the AI make things up?', 'It isn’t allowed to. Every AI answer must cite the passages it was given and may only use numbers from them. If it fails that check, you see the reviewed passage instead. Live search is limited to websites a teacher approved.'],
      ['Do I need to know how to write prompts?', 'No. You select text and tap Explain, Sources or Quiz. The platform builds the request for you.'],
      ['What does “adapts to me” mean — is it tracking me?', 'It uses only reading signals on our pages: which paragraphs you ask about, quiz answers, and settings you choose. No personality labels. You can see every change and its reason on your profile, download your data, or reset it.'],
      ['Is it in Bangla?', 'Yes. Every lesson, answer and page works in Bangla and English, and search understands romanised Bangla too.'],
      ['How is this different from watching the videos?', 'Videos explain; the platform checks understanding. You read at your own level, get instant answers to the exact line that confused you, and finish with a sealed check that shows what you can do alone.'],
    ],
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', nCourses: 'কোর্স', nHow: 'কীভাবে কাজ করে', nOrgs: 'প্রতিষ্ঠানের জন্য', nPricing: 'মূল্য', nStart: 'শেখা শুরু করো',
    kicker: 'বাংলাভাষী বিশ্ববিদ্যালয় শিক্ষার্থীদের জন্য এআই শিক্ষক', h1a: 'প্রতিটি লাইন বোঝো।', h1b: 'সাহায্য ছাড়াই প্রমাণ দাও।',
    sub: 'পাঠ যা তোমার পড়ার ধরনের সঙ্গে মানিয়ে নেয়। যা বোঝোনি তা সিলেক্ট করো, বিশ্বস্ত উৎস থেকে ছোট উত্তর পাবে — কোনো প্রম্পট লিখতে হবে না। এআই-এর ভুল ধরার অনুশীলন করো, তারপর বন্ধ যাচাইয়ে দেখাও তুমি কী পারো।',
    cta1: 'একটা পাঠ দেখো — বিনামূল্যে', cta2: 'কোর্সগুলো দেখো',
    demoP1: 'থ্রেশহোল্ড বাড়ালে কম ইমেইল চিহ্নিত হয়, তাই', demoMark: 'ফলস পজিটিভ কমে আর ফলস নেগেটিভ বাড়ে', demoA1: 'ব্যাখ্যা', demoA2: 'উৎস', demoA3: 'কুইজ',
    demoBadge: 'পর্যালোচিত নোট থেকে', demoAns: 'থ্রেশহোল্ড বেশি মানে কম ইমেইল স্প্যাম ধরা হয়। আসল ইমেইল ভুল করে কম চিহ্নিত হয়, কিন্তু বেশি স্প্যাম ফসকে যায়।', demoSrc: 'উৎস: লুপ অ্যান্ড লজিক এমএল নোট · §৩ দুই ধরনের ভুল',
    pSubs: 'ইউটিউব সাবস্ক্রাইবার', pVideos: 'বাংলা ভিডিও লেসন', pCourses: 'বিশ্ববিদ্যালয়ের কোর্স', pLangVal: 'EN + বাংলা', pLang: 'প্রতিটি পাতা, প্রতিটি উত্তর',
    howK: 'কীভাবে কাজ করে', howH: 'পড়ো, প্রম্পট ছাড়াই জিজ্ঞেস করো, প্রমাণ দাও', howL: 'এআই-এর সঙ্গে কীভাবে কথা বলতে হয় তা জানার দরকার নেই। পড়ো, যেখানে আটকাও সেখানে ট্যাপ করো — বাকিটা প্ল্যাটফর্ম করে দেয়, শিক্ষকের অনুমোদিত উৎস থেকে।',
    s1h: 'তোমার মতো করে সাজানো পাঠ পড়ো', s1p: 'তুমি যেভাবে পড়ো, সেভাবে ভাষা, শব্দের ব্যাখ্যা আর উদাহরণ বদলায়। তথ্য, সূত্র আর সংখ্যা কখনো বদলায় না — আর মূল লেখা সবসময় দেখা যায়।',
    s2h: 'একটা লাইন সিলেক্ট করো, ছোট উত্তর পাও', s2p: 'ব্যাখ্যা, বিশ্বস্ত উৎসে খোঁজ বা ছোট কুইজ। উত্তরে থাকে কোন অংশ থেকে এসেছে; এআই প্রমাণ দিতে না পারলে পর্যালোচিত লেখাটাই দেখানো হয়।',
    s3h: 'বন্ধ যাচাইয়ে প্রমাণ দাও', s3p: 'এআই সহকর্মীর পরামর্শ যাচাইয়ের অনুশীলন করো, তারপর সাহায্য ছাড়া নতুন প্রশ্ন সমাধান করো। প্রমাণপত্রে দেখা যায় কোনটা নিজে পেরেছ আর কোনটায় সাহায্য লেগেছে।',
    fK: 'কেন আলাদা', fH: 'এমন এআই শিক্ষক যে উৎস দেখায়',
    f1h: 'শুধু বিশ্বস্ত উৎস', f1p: 'উত্তর আসে পর্যালোচিত নোট, শিক্ষকের ভিডিও আর অনুমোদিত ওয়েবসাইট থেকে। দেখানোর আগে প্রতিটি লিংক আবার যাচাই হয়।',
    f2h: 'লেখা বদলায়, তথ্য নয়', f2p: 'সহজ বা গভীর ভাষা, শব্দের ব্যাখ্যা, বাড়তি উদাহরণ, পড়ার থিম। প্রতিটি পরিবর্তনের কারণ পড়া যায়।',
    f3h: 'বাংলা ও ইংরেজি', f3p: 'যেকোনো পাতায় ভাষা বদলাও। খোঁজ বাংলা আর রোমান হরফে লেখা বাংলাও বোঝে, যেভাবে শিক্ষার্থীরা আসলে লেখে।',
    f4h: 'এআই-কে অন্ধ বিশ্বাস নয়, যাচাই', f4p: 'প্রতিটি সংখ্যা কোড দিয়ে যাচাই হয়। শিক্ষার্থীরা শেখে কখন এআই-এর আত্মবিশ্বাসী পরামর্শ ভুল — যে দক্ষতা এখন নিয়োগকর্তারা চান।',
    f5h: 'শুধু নম্বর নয়, প্রমাণ', f5p: 'অনুশীলনে সাহায্য নেওয়া যায়, কিন্তু তা দক্ষতা হিসেবে গোনা হয় না। বন্ধ যাচাই দেখায় শিক্ষার্থী একা কী পারে।',
    f6h: 'প্রতিটি পাঠের সঙ্গে হাতে-কলমে ল্যাব', f6p: 'আসল কোড, সার্কিট সিমুলেটর বা স্প্রেডশিট — সেটআপের ধাপ, স্টার্টার আর যাচাই করা ফলসহ। প্রতিটি ল্যাব ব্রাউজারে বিনামূল্যে চলে।',
    cK: 'কোর্স', cH: 'তোমার বিশ্ববিদ্যালয়ের কোর্স, লুপ অ্যান্ড লজিকে', cL: 'প্রতিটি কোর্সে আমাদের বাংলা ভিডিও প্লেলিস্টের লিংক আছে। আটটি কোর্সে এরই মধ্যে অ্যাডাপটিভ পাঠ আছে, প্রতিটির সঙ্গে হাতে-কলমে ল্যাব; একে একে আরও যোগ হচ্ছে।', cAll: 'সব কোর্স দেখো',
    oK: 'বিশ্ববিদ্যালয়, কোচিং ও ক্যারিয়ার সেন্টারের জন্য', oH: 'ক্লাস কোথায় আটকায় দেখো — কাউকে আলাদা করে নজরদারি না করে', oL: 'শিক্ষকেরা দেখেন কোন অনুচ্ছেদ বিভ্রান্ত করে, কোন ভুল বারবার হয়, আর সাহায্য বন্ধ যাচাইয়ে কাজে লেগেছে কি না।', oCta: 'শিক্ষক ডেমো খোলো',
    o1: 'শুধু ক্লাসের ধরন — গোপনীয়তার ন্যূনতম সংখ্যার চেয়ে ছোট দল লুকানো', o2: 'নিজস্ব বিশ্বস্ত লাইব্রেরি যোগ করো: নোট, স্লাইড, অনুমোদিত ওয়েবসাইট', o3: 'প্রমাণপত্র, যা গ্রেড বা চাকরির প্রস্তুতির সঙ্গে যুক্ত করা যায়', o4: 'ড্যাশবোর্ডে এআই খরচ আর ফলব্যাকের হার দেখা যায়', o5: 'গুগল বা ইমেইলে সাইন-ইন; ডেটা ডাউনলোড ও মুছে ফেলা যায়',
    prK: 'মূল্য', prH: 'শুরু বিনামূল্যে। শিক্ষার্থীর সাধ্যের মধ্যে। প্রতিষ্ঠানের জন্য সহজ।',
    pl1n: 'ফ্রি', pl1w: 'প্রত্যেক শিক্ষার্থীর জন্য', pl1a: 'সব কোর্স আর ভিডিও প্লেলিস্ট', pl1b: 'ইংরেজি ও বাংলায় অ্যাডাপটিভ পাঠ', pl1c: 'শব্দকোষ আর পর্যালোচিত উত্তর, সীমাহীন', pl1d: 'দিনে ১০টি এআই-লেখা উত্তর', pl1cta: 'বিনামূল্যে শুরু',
    pl2n: 'স্টুডেন্ট প্লাস', pl2w: 'পরীক্ষার মৌসুম আর চাকরির প্রস্তুতির জন্য', perMonth: '/ মাস', pl2a: 'ফ্রি-র সবকিছু', pl2b: 'সীমাহীন এআই উত্তর (যুক্তিসঙ্গত ব্যবহার)', pl2c: 'অনুমোদিত ওয়েবসাইটে লাইভ খোঁজ', pl2d: 'সব অনুশীলনী আর বন্ধ যাচাই', pl2e: 'শেয়ারযোগ্য প্রমাণপত্র', pl2cta: 'স্টুডেন্ট প্লাস নাও',
    pl3n: 'প্রতিষ্ঠান', pl3w: 'বিশ্ববিদ্যালয়, কোচিং ও ক্যারিয়ার সেন্টার', perSeat: '/ শিক্ষার্থী / সেমিস্টার', pl3a: 'প্রত্যেক শিক্ষার্থীর জন্য স্টুডেন্ট প্লাস', pl3b: 'শিক্ষক ড্যাশবোর্ড আর ক্লাস রিপোর্ট', pl3c: 'নিজস্ব বিশ্বস্ত লাইব্রেরি আর পাঠ', pl3d: 'প্রতিষ্ঠানের ডোমেইনে সাইন-ইন; ডেটা এক্সপোর্ট', pl3cta: 'যোগাযোগ করো',
    prNote: 'মূল্য বাংলাদেশি টাকায়। পাইলট পার্টনারদের প্রথম সেমিস্টার বিনামূল্যে।',
    qK: 'প্রশ্ন', qH: 'সাধারণ প্রশ্ন',
    endH: 'একটা পাঠ দিয়ে শুরু করো। পাঁচ মিনিট লাগবে।', endCta: 'একটা পাঠ খোলো',
    footC: '© ২০২৬ লুপ অ্যান্ড লজিক · ইন্টারন্যাশনাল এআই বিল্ডার্স কংগ্রেসের জন্য তৈরি', footI: 'শিক্ষকদের জন্য',
    videos: 'ভিডিও', adaptive: 'পাঠ + ল্যাব', videoOnly: 'ভিডিও প্লেলিস্ট', lessonsLabs: (l, b) => `${l}টি পাঠ · ${b}টি ল্যাব`,
    faq: [
      ['এআই কি বানিয়ে কথা বলে?', 'সেই সুযোগ নেই। প্রতিটি এআই উত্তরকে দেওয়া অংশগুলোর উৎস দেখাতে হয় আর শুধু সেগুলোর সংখ্যাই ব্যবহার করতে পারে। যাচাইয়ে ব্যর্থ হলে পর্যালোচিত লেখা দেখানো হয়। লাইভ খোঁজ শুধু শিক্ষকের অনুমোদিত ওয়েবসাইটে।'],
      ['প্রম্পট লেখা জানতে হবে?', 'না। লেখা সিলেক্ট করে ব্যাখ্যা, উৎস বা কুইজে ট্যাপ করো। অনুরোধটা প্ল্যাটফর্ম নিজেই তৈরি করে।'],
      ['“আমার মতো করে সাজানো” মানে কি নজরদারি?', 'শুধু আমাদের পাতায় পড়ার সংকেত ব্যবহার হয়: কোন অনুচ্ছেদ নিয়ে প্রশ্ন করেছ, কুইজের উত্তর আর তোমার বেছে নেওয়া সেটিং। কোনো ব্যক্তিত্বের লেবেল নয়। প্রোফাইলে প্রতিটি পরিবর্তন আর তার কারণ দেখা যায়, ডেটা ডাউনলোড বা রিসেট করা যায়।'],
      ['এটা কি বাংলায়?', 'হ্যাঁ। প্রতিটি পাঠ, উত্তর আর পাতা বাংলা ও ইংরেজিতে চলে, আর খোঁজ রোমান হরফে লেখা বাংলাও বোঝে।'],
      ['শুধু ভিডিও দেখার সঙ্গে পার্থক্য কী?', 'ভিডিও বোঝায়; প্ল্যাটফর্ম বোঝাটা যাচাই করে। নিজের স্তরে পড়ো, ঠিক যে লাইনে আটকেছ তার উত্তর সঙ্গে সঙ্গে পাও, আর শেষে বন্ধ যাচাইয়ে দেখাও একা কী পারো।'],
    ],
  },
};

let catalog = null;

function render() {
  const L = T[getLang()];
  applyI18n(L);
  document.getElementById('faq').replaceChildren(...L.faq.map(([q, a]) => el('details', {}, el('summary', { text: q }), el('p', { text: a }))));
  if (catalog) {
    const ch = catalog.channel;
    document.getElementById('p-subs').textContent = num(ch.subscribers);
    document.getElementById('p-videos').textContent = num(ch.videos);
    document.getElementById('p-courses').textContent = num(catalog.courses.length);
    const pick = [...catalog.courses.filter((c) => c.adaptive), ...catalog.courses.filter((c) => !c.adaptive)].slice(0, 6);
    document.getElementById('course-preview').replaceChildren(...pick.map((c) => courseCard(c, L)));
  }
}

async function load() {
  try { catalog = await fetch(`/api/courses?lang=${getLang()}`).then((r) => r.json()); } catch { catalog = null; }
  render();
}

document.getElementById('lang').onclick = async () => { setLang(getLang() === 'en' ? 'bn' : 'en'); render(); await load(); };
render();
load();
