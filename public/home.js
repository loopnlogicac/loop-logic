// Homepage (design: "Loop & Logic — new layout mockup", Main artboard), filled with live data.
import { getLang, applyI18n, mountNav, el, num, store } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose',
    promoNew: 'NEW', promo: (n, l) => `Written tutorials are live: ${n} topics and ${l} interactive labs, free for every student.`, promoGo: 'Start learning', close: 'Close announcement',
    kicker: 'AN AI TEACHER FOR BANGLADESHI STUDENTS',
    h1: 'Learn programming one clear step at a time.',
    lead: 'Read structured tutorials, run every example in one click, watch the matching Bangla video, and ask the AI about any line you don’t understand.',
    ctaTut: 'Start the C tutorial', ctaVid: 'Browse video courses',
    sVideos: 'free videos', sHours: 'of lessons in Bangla', sCourses: 'courses', sTopics: 'tutorial topics',
    crumb: 'C Programming › Loops › for Loop', free: 'FREE', copy: 'Copy', copied: 'Copied', tryNow: 'Try now', io: 'Input: 10 → Output: Sum = 55',
    checked: 'Checked against sources', checkedText: ' includes n itself, so the loop adds every number from 1 up to and including n.',
    tutorials: 'Tutorials', allTut: 'All tutorials', topics: 'topics', labs: 'labs', soon: 'Coming soon',
    proTag: 'PRO · EXAM PREP', proH: 'PPS & SPL Exam Prep Pack', proP: 'Past midterm and final questions with full solutions, timed mock tests, and a certificate when you pass. The videos and tutorials stay free.',
    proList: ['Solved past papers', 'Timed mock tests', 'More AI answers per day', 'Certificate of completion'],
    proPrice: 'Price', proSoon: 'Announced soon', proCta: 'Join the waitlist', proNote: 'Payments open soon. We’ll email you first.', proPreview: 'See the Pro library →',
    coursesH: 'Free video courses', allCourses: (n) => `All ${n} courses`, coursesP: 'Every playlist from the Loop & Logic YouTube channel, in order, with progress tracking.',
    vids: (n, h) => `${n} videos · ${h} h`,
    howH: 'How the AI Teacher helps',
    how: [['Ask about any line', 'Select a sentence or a line of code and press Ask AI. Answers cite reviewed notes and approved sites, never guesses.'],
      ['Run every example', 'Every program shows its real output. Try now copies the code and opens an online compiler.'],
      ['Labs you can play', 'Watch sorting, linked lists, KNN and more step by step, on your own input, with each step explained.'],
      ['Quizzes that adapt', 'Short quizzes after each topic show what to revisit, and lessons adjust to how you read.']],
    ytH: 'All our playlists are free on YouTube', ytP: (n) => `Subscribe to Loop & Logic for new Bangla lessons every week. ${n} people already have.`, ytCta: 'Open the channel',
    footP: 'Answers come only from reviewed notes and approved websites.', fTut: 'Tutorials', fVid: 'Video courses', fPrice: 'Pricing', fPractice: 'Practice', fDash: 'My dashboard',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা',
    promoNew: 'নতুন', promo: (n, l) => `লিখিত টিউটোরিয়াল চালু হয়েছে: ${n}টি টপিক আর ${l}টি ইন্টারঅ্যাকটিভ ল্যাব, সব শিক্ষার্থীর জন্য ফ্রি।`, promoGo: 'শেখা শুরু করো', close: 'ঘোষণা বন্ধ করো',
    kicker: 'বাংলাদেশি শিক্ষার্থীদের জন্য একজন এআই শিক্ষক',
    h1: 'প্রোগ্রামিং শেখো, এক এক করে পরিষ্কার ধাপে।',
    lead: 'গোছানো টিউটোরিয়াল পড়ো, এক ক্লিকে প্রতিটি উদাহরণ চালাও, মিলিয়ে বাংলা ভিডিও দেখো, আর যে লাইন বোঝোনি তা এআইকে জিজ্ঞেস করো।',
    ctaTut: 'সি টিউটোরিয়াল শুরু করো', ctaVid: 'ভিডিও কোর্স দেখো',
    sVideos: 'ফ্রি ভিডিও', sHours: 'বাংলায় পাঠ', sCourses: 'কোর্স', sTopics: 'টিউটোরিয়াল টপিক',
    crumb: 'সি প্রোগ্রামিং › লুপ › for লুপ', free: 'ফ্রি', copy: 'কপি', copied: 'কপি হয়েছে', tryNow: 'এখনই চালাও', io: 'ইনপুট: 10 → আউটপুট: Sum = 55',
    checked: 'উৎসের সঙ্গে মিলিয়ে দেখা', checkedText: ' n-কেও ধরে, তাই লুপটি 1 থেকে n পর্যন্ত (n-সহ) সব সংখ্যা যোগ করে।',
    tutorials: 'টিউটোরিয়াল', allTut: 'সব টিউটোরিয়াল', topics: 'টপিক', labs: 'ল্যাব', soon: 'শিগগিরই আসছে',
    proTag: 'প্রো · পরীক্ষার প্রস্তুতি', proH: 'PPS ও SPL পরীক্ষা প্রস্তুতি প্যাক', proP: 'মিডটার্ম আর ফাইনালের পুরোনো প্রশ্নের পূর্ণ সমাধান, সময় ধরে মক টেস্ট, আর পাস করলে সার্টিফিকেট। ভিডিও আর টিউটোরিয়াল ফ্রিই থাকবে।',
    proList: ['পুরোনো প্রশ্নের সমাধান', 'সময় ধরে মক টেস্ট', 'দিনে আরও বেশি এআই উত্তর', 'কোর্স শেষের সার্টিফিকেট'],
    proPrice: 'দাম', proSoon: 'শিগগিরই জানানো হবে', proCta: 'ওয়েটলিস্টে যোগ দাও', proNote: 'পেমেন্ট শিগগিরই চালু হবে। সবার আগে তোমাকে ইমেইল করব।', proPreview: 'প্রো লাইব্রেরি দেখো →',
    coursesH: 'ফ্রি ভিডিও কোর্স', allCourses: (n) => `সব ${n}টি কোর্স`, coursesP: 'লুপ অ্যান্ড লজিক ইউটিউব চ্যানেলের প্রতিটি প্লেলিস্ট, ক্রমানুসারে, অগ্রগতির হিসাবসহ।',
    vids: (n, h) => `${n}টি ভিডিও · ${h} ঘণ্টা`,
    howH: 'এআই শিক্ষক কীভাবে সাহায্য করে',
    how: [['যেকোনো লাইন নিয়ে প্রশ্ন', 'একটি বাক্য বা কোডের লাইন সিলেক্ট করে “এআই-কে জিজ্ঞেস করো” চাপো। উত্তর আসে পর্যালোচিত নোট আর অনুমোদিত সাইট থেকে, অনুমান থেকে নয়।'],
      ['প্রতিটি উদাহরণ চালাও', 'প্রতিটি প্রোগ্রামের আসল আউটপুট দেখানো আছে। “এখনই চালাও” কোড কপি করে অনলাইন কম্পাইলার খুলে দেয়।'],
      ['খেলার মতো ল্যাব', 'সর্টিং, লিংকড লিস্ট, KNN আর আরও অনেক কিছু ধাপে ধাপে দেখো, নিজের ইনপুটে, প্রতিটি ধাপের ব্যাখ্যাসহ।'],
      ['মানিয়ে নেওয়া কুইজ', 'প্রতিটি টপিকের পর ছোট কুইজ দেখায় কী আবার পড়তে হবে, আর তুমি যেভাবে পড়ো পাঠ সেভাবে বদলায়।']],
    ytH: 'আমাদের সব প্লেলিস্ট ইউটিউবে ফ্রি', ytP: (n) => `প্রতি সপ্তাহে নতুন বাংলা পাঠের জন্য লুপ অ্যান্ড লজিক সাবস্ক্রাইব করো। ইতিমধ্যে ${n} জন করেছে।`, ytCta: 'চ্যানেল খোলো',
    footP: 'উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে।', fTut: 'টিউটোরিয়াল', fVid: 'ভিডিও কোর্স', fPrice: 'মূল্য', fPractice: 'অনুশীলন', fDash: 'আমার ড্যাশবোর্ড',
  },
};
const t = () => T[getLang()];
const TINTS = ['#e6efb5', '#d9ecf2', '#f4e3c8', '#e5e0f4', '#f3dcd6', '#dcefe4'];
const SHORT = { 'c-programming': 'C', 'discrete-math': 'DM', 'operating-systems': 'OS', 'electric-circuits': 'EC', 'computer-fundamentals': 'CF', 'artificial-intelligence': 'AI', 'machine-learning': 'ML', 'data-structures': 'DS', algorithms: 'ALG' };
const MARK = { c: 'C', 'data-structures': 'DS', algorithms: 'Al', 'oop-java': 'OOP', python: 'Py', dbms: 'DB', 'compiler-design': 'CD', 'machine-learning': 'ML' };
const FEATURED = ['c-programming', 'discrete-math', 'operating-systems', 'electric-circuits', 'computer-fundamentals', 'artificial-intelligence'];
const svg = (html) => { const s = el('span', { class: 'ico', 'aria-hidden': 'true' }); s.innerHTML = html; return s; };
const ICONS = [
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c4d40" stroke-width="2" stroke-linejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c4d40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c4d40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M7 16V9M12 16V5M17 16v-4"/></svg>',
  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0c4d40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/></svg>',
];
const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2c14e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
const CODE = 'for (int i = 1; i <= n; i++) {\n    sum += i;   /* 1 + 2 + ... + n */\n}\nprintf("Sum = %lld\\n", sum);';
const FULL = '#include <stdio.h>\n\nint main(void) {\n    int n = 10;\n    long long sum = 0;\n    for (int i = 1; i <= n; i++) {\n        sum += i;   /* 1 + 2 + ... + n */\n    }\n    printf("Sum = %lld\\n", sum);\n    return 0;\n}\n';

let catalog = null, learn = null;

function promo(L) {
  const box = document.getElementById('promo');
  if (!learn || store.get('ll_promo_closed') === 'tut-1') { box.replaceChildren(); return; }
  const close = el('button', { type: 'button', class: 'promo-x', 'aria-label': L.close, onclick: () => { store.set('ll_promo_closed', 'tut-1'); box.replaceChildren(); } });
  close.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  box.replaceChildren(el('div', { class: 'promo' }, el('span', { class: 'promo-new', text: L.promoNew }), el('span', { text: L.promo(num(learn.totals.topics), num(learn.totals.labs)) }), el('a', { href: '/learn.html', text: L.promoGo }), close));
}

function render() {
  const L = t();
  applyI18n(L);
  promo(L);
  const totals = catalog?.totals ?? { videos: 302, hours: 157 };
  const nCourses = catalog?.courses.length ?? 22;
  const copyBtn = el('button', { type: 'button', class: 'cb ghost', text: L.copy, onclick: async () => { try { await navigator.clipboard.writeText(FULL); copyBtn.textContent = L.copied; setTimeout(() => (copyBtn.textContent = L.copy), 1500); } catch { /* no clipboard */ } } });
  const tryBtn = el('a', { class: 'cb', href: 'https://www.programiz.com/c-programming/online-compiler/', target: '_blank', rel: 'noopener', text: L.tryNow, onclick: () => navigator.clipboard?.writeText(FULL).catch(() => {}) });

  const hero = el('section', { class: 'h-hero wrap' },
    el('div', { class: 'h-copy' },
      el('p', { class: 'h-kicker', text: L.kicker }),
      el('h1', { text: L.h1 }),
      el('p', { class: 'h-lead', text: L.lead }),
      el('div', { class: 'h-cta' },
        el('a', { class: 'btn primary big', href: '/learn.html?track=c' }, L.ctaTut, ' →'),
        el('a', { class: 'btn ghost big', href: '/courses.html', text: L.ctaVid })),
      el('div', { class: 'h-stats' },
        el('div', {}, el('strong', { text: num(totals.videos) }), el('span', { text: L.sVideos })),
        el('div', {}, el('strong', { text: `${num(totals.hours)} h` }), el('span', { text: L.sHours })),
        el('div', {}, el('strong', { text: num(nCourses) }), el('span', { text: L.sCourses })),
        learn ? el('div', {}, el('strong', { text: num(learn.totals.topics) }), el('span', { text: L.sTopics })) : null)),
    el('div', { class: 'h-demo' },
      el('div', { class: 'h-demo-top' }, el('span', { text: L.crumb }), el('span', { class: 'pill', text: L.free })),
      el('div', { class: 'h-code' },
        el('div', { class: 'h-code-bar' }, el('span', { class: 'mono', text: 'sum.c' }), el('span', {}, copyBtn, tryBtn)),
        el('pre', { text: CODE }),
        el('div', { class: 'h-code-io mono', text: L.io })),
      el('div', { class: 'h-ai' }, svg(ICONS[0]),
        el('div', {}, el('strong', { text: L.checked }), el('span', {}, el('code', { text: 'i <= n' }), L.checkedText)))));

  const tracks = learn ? el('section', { class: 'wrap h-sec', 'aria-labelledby': 'tracks-title' },
    el('div', { class: 'h-sec-head' }, el('h2', { id: 'tracks-title', text: L.tutorials }), el('a', { href: '/learn.html', text: L.allTut })),
    el('div', { class: 'h-tracks' }, ...learn.tracks.map((x) => el(x.available ? 'a' : 'div', { class: `h-track${x.available ? '' : ' off'}`, href: x.available ? `/learn.html?track=${x.id}` : null },
      el('span', { class: 'h-track-top' }, el('span', { class: 'h-mark', text: MARK[x.id] ?? '•' }), el('span', { class: 'pill', text: x.available ? L.free : L.soon })),
      el('strong', { text: x.title }),
      el('span', { class: 'muted', text: x.available ? `${num(x.delivered)} ${L.topics}${x.labs ? ` · ${num(x.labs)} ${L.labs}` : ''}` : x.blurb }))))) : null;

  const pro = el('section', { class: 'wrap h-sec' },
    el('div', { class: 'h-pro' },
      el('div', { class: 'h-pro-copy' },
        el('span', { class: 'pill gold', text: L.proTag }),
        el('h2', { text: L.proH }), el('p', { text: L.proP }),
        el('ul', {}, ...L.proList.map((x) => { const li = el('li'); li.innerHTML = CHECK; li.append(x); return li; })),
        el('a', { class: 'h-pro-preview', href: '/library.html', text: L.proPreview })),
      el('div', { class: 'h-pro-card' },
        el('span', { class: 'muted small', text: L.proPrice }), el('strong', { text: L.proSoon }),
        el('a', { class: 'btn-pro big', href: '/pricing.html#waitlist', text: L.proCta }),
        el('span', { class: 'muted small', text: L.proNote }))));

  const byId = Object.fromEntries((catalog?.courses ?? []).map((c) => [c.id, c]));
  const featured = FEATURED.map((id) => byId[id]).filter(Boolean);
  const courses = featured.length ? el('section', { class: 'wrap h-sec', id: 'courses', 'aria-labelledby': 'courses-title' },
    el('div', { class: 'h-sec-head' }, el('h2', { id: 'courses-title', text: L.coursesH }), el('a', { href: '/courses.html', text: L.allCourses(num(nCourses)) })),
    el('p', { class: 'h-sec-p', text: L.coursesP }),
    el('div', { class: 'h-courses' }, ...featured.map((c, i) => el('a', { class: 'h-course', href: `/course.html?id=${c.id}` },
      el('span', { class: 'h-course-art', style: `background:${TINTS[i % TINTS.length]}` }, el('span', { class: 'h-course-short', text: SHORT[c.id] ?? c.title.slice(0, 2) }), el('span', { class: 'h-play', 'aria-hidden': 'true', text: '▶' })),
      el('span', { class: 'h-course-body' }, el('span', { class: 'h-course-title' }, el('strong', { text: c.title }), el('span', { class: 'pill', text: L.free })), el('span', { class: 'muted', text: L.vids(num(c.videos), num(c.hours)) })))))) : null;

  const how = el('section', { class: 'h-how' }, el('div', { class: 'wrap' }, el('h2', { text: L.howH }),
    el('div', { class: 'h-how-grid' }, ...L.how.map(([h, p], i) => el('div', {}, svg(ICONS[i]), el('strong', { text: h }), el('span', { text: p }))))));

  const ch = catalog?.channel;
  const yt = el('section', { class: 'wrap h-sec' }, el('div', { class: 'h-yt' },
    el('div', {}, el('h2', { text: L.ytH }), el('p', { text: L.ytP(num(ch?.subscribers ?? 6340)) })),
    el('a', { class: 'btn dark', href: ch?.url ?? 'https://www.youtube.com/@loopNlogic', target: '_blank', rel: 'noopener' }, '▶ ', L.ytCta)));

  document.getElementById('home').replaceChildren(...[hero, tracks, pro, courses, how, yt].filter(Boolean));
  document.getElementById('foot').replaceChildren(el('div', { class: 'wrap h-foot' },
    el('div', {}, el('strong', { text: 'loop & logic' }), el('p', { text: L.footP })),
    el('nav', { 'aria-label': 'Footer' }, el('a', { href: '/learn.html', text: L.fTut }), el('a', { href: '/courses.html', text: L.fVid }), el('a', { href: '/practice.html', text: L.fPractice }), el('a', { href: '/pricing.html', text: L.fPrice }), el('a', { href: '/dashboard.html', text: L.fDash }))));
}

async function load() {
  const lang = getLang();
  [catalog, learn] = await Promise.all([
    fetch(`/api/courses?lang=${lang}`).then((r) => r.json()).catch(() => null),
    fetch(`/api/learn?lang=${lang}`).then((r) => r.json()).catch(() => null),
  ]);
  render();
}
mountNav('home', load);
load();
