// Free vs Pro (design: Pricing artboard). The waitlist form stores the email on the server.
import { api, getLang, applyI18n, mountNav, el, num, getConfig } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · every video and tutorial stays free',
    h1: 'Learn free. Go Pro for exam prep.', lead: 'Every video, tutorial, lab and quiz stays free. Pro adds exam practice, certificates and more AI help.',
    free: 'Free', freeP: 'For every student, always.', start: 'Start learning',
    freeList: (v, c, t, l, ai) => [`All ${v} videos from ${c} courses, in order`, `${t} written tutorial topics with runnable examples`, `${l} interactive labs and topic quizzes`, `Ask AI: ${ai} answers a day`, 'Bangla and English'],
    pro: 'Pro', proP: 'For exam season and serious practice.', soon: 'COMING SOON', price: 'Price announced soon', plus: 'Everything in Free, plus:',
    proList: ['PPS & SPL Exam Prep Pack: solved past papers', 'Timed mock tests with detailed feedback', 'Certificate of completion', 'More Ask AI answers every day', 'Live doubt-solving sessions', 'Class materials from instructors for each lesson'],
    wlLabel: 'Get an email when Pro opens', wlPh: 'you@example.com', wlBtn: 'Join the waitlist', wlOk: 'You are on the list. We will email you when Pro opens.', wlAgain: 'You were already on the list. We will email you when Pro opens.',
    wlPrivacy: 'We use your email only to tell you about Pro. No spam.', preview: 'Preview the Pro library →',
    compare: 'Compare plans', feature: 'Feature', inc: 'Included', no: '—',
    rows: (c, ai) => [[`Video courses (${c})`, 1, 1], ['Written tutorials and labs', 1, 1], ['Topic quizzes', 1, 1], ['Ask AI answers per day', `${ai}`, 'More'], ['Solved past papers', 0, 1], ['Timed mock tests', 0, 1], ['Certificate', 0, 1], ['Live doubt sessions', 0, 1]],
    faqH: 'Questions',
    faq: [['Will the videos stay free?', 'Yes. Every playlist on the Loop & Logic YouTube channel is free, here and on YouTube. So are the written tutorials and labs.'],
      ['How will I pay?', 'With bKash, Nagad or a card through a Bangladeshi payment gateway, once payments open.'],
      ['Do I need an account?', 'You can learn without signing in. To keep your progress and purchases on every device, you will sign in with Google.']],
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · সব ভিডিও আর টিউটোরিয়াল ফ্রিই থাকবে',
    h1: 'ফ্রিতে শেখো। পরীক্ষার প্রস্তুতিতে প্রো নাও।', lead: 'প্রতিটি ভিডিও, টিউটোরিয়াল, ল্যাব আর কুইজ ফ্রি থাকবে। প্রো যোগ করে পরীক্ষার অনুশীলন, সার্টিফিকেট আর আরও বেশি এআই সাহায্য।',
    free: 'ফ্রি', freeP: 'সব শিক্ষার্থীর জন্য, সবসময়।', start: 'শেখা শুরু করো',
    freeList: (v, c, t, l, ai) => [`${c}টি কোর্সের ${v}টি ভিডিও, ক্রমানুসারে`, `চালানো যায় এমন উদাহরণসহ ${t}টি লিখিত টিউটোরিয়াল টপিক`, `${l}টি ইন্টারঅ্যাকটিভ ল্যাব আর টপিক কুইজ`, `এআই-কে জিজ্ঞেস করো: দিনে ${ai}টি উত্তর`, 'বাংলা ও ইংরেজি'],
    pro: 'প্রো', proP: 'পরীক্ষার মৌসুম আর গভীর অনুশীলনের জন্য।', soon: 'শিগগিরই আসছে', price: 'দাম শিগগিরই জানানো হবে', plus: 'ফ্রি-র সবকিছু, সঙ্গে:',
    proList: ['PPS ও SPL পরীক্ষা প্রস্তুতি প্যাক: পুরোনো প্রশ্নের সমাধান', 'বিস্তারিত ফিডব্যাকসহ সময় ধরে মক টেস্ট', 'কোর্স শেষের সার্টিফিকেট', 'প্রতিদিন আরও বেশি এআই উত্তর', 'লাইভ প্রশ্নোত্তর সেশন', 'প্রতিটি পাঠে শিক্ষকের ক্লাস ম্যাটেরিয়াল'],
    wlLabel: 'প্রো চালু হলে ইমেইল পেতে চাও?', wlPh: 'you@example.com', wlBtn: 'ওয়েটলিস্টে যোগ দাও', wlOk: 'তুমি তালিকায় আছ। প্রো চালু হলে ইমেইল করব।', wlAgain: 'তুমি আগেই তালিকায় ছিলে। প্রো চালু হলে ইমেইল করব।',
    wlPrivacy: 'তোমার ইমেইল শুধু প্রো-র খবর দিতে ব্যবহার করব। কোনো স্প্যাম নয়।', preview: 'প্রো লাইব্রেরির প্রিভিউ দেখো →',
    compare: 'প্ল্যান মিলিয়ে দেখো', feature: 'সুবিধা', inc: 'আছে', no: '—',
    rows: (c, ai) => [[`ভিডিও কোর্স (${c})`, 1, 1], ['লিখিত টিউটোরিয়াল ও ল্যাব', 1, 1], ['টপিক কুইজ', 1, 1], ['দিনে এআই উত্তর', `${ai}`, 'আরও বেশি'], ['পুরোনো প্রশ্নের সমাধান', 0, 1], ['সময় ধরে মক টেস্ট', 0, 1], ['সার্টিফিকেট', 0, 1], ['লাইভ প্রশ্নোত্তর', 0, 1]],
    faqH: 'প্রশ্ন',
    faq: [['ভিডিওগুলো কি ফ্রি থাকবে?', 'হ্যাঁ। লুপ অ্যান্ড লজিক ইউটিউব চ্যানেলের প্রতিটি প্লেলিস্ট এখানে আর ইউটিউবে ফ্রি। লিখিত টিউটোরিয়াল আর ল্যাবও ফ্রি।'],
      ['কীভাবে পেমেন্ট করব?', 'পেমেন্ট চালু হলে বাংলাদেশি পেমেন্ট গেটওয়ের মাধ্যমে বিকাশ, নগদ বা কার্ডে।'],
      ['অ্যাকাউন্ট লাগবে?', 'সাইন ইন ছাড়াই শিখতে পারো। সব ডিভাইসে অগ্রগতি আর কেনাকাটা রাখতে গুগল দিয়ে সাইন ইন করবে।']],
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const tick = (color) => { const s = el('span', { class: 'tick', 'aria-hidden': 'true' }); s.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>`; return s; };

async function render() {
  const L = t();
  applyI18n(L);
  document.title = `${L.free} · ${L.pro} · Loop & Logic`;
  const lang = getLang();
  const [cfg, catalog, learn] = await Promise.all([getConfig().catch(() => ({})), fetch(`/api/courses?lang=${lang}`).then((r) => r.json()).catch(() => null), fetch(`/api/learn?lang=${lang}`).then((r) => r.json()).catch(() => null)]);
  const ai = num(cfg.freeDailyAi ?? 10);
  const nC = num(catalog?.courses.length ?? 22);
  const msg = el('p', { class: 'wl-msg', role: 'status' });
  const email = el('input', { id: 'waitlist-email', type: 'email', required: true, autocomplete: 'email', placeholder: L.wlPh });
  const btn = el('button', { type: 'submit', class: 'btn-pro', text: L.wlBtn });
  const form = el('form', { class: 'wl', id: 'waitlist' },
    el('label', { for: 'waitlist-email', text: L.wlLabel }), el('div', { class: 'wl-row' }, email, btn), msg, el('p', { class: 'wl-note', text: L.wlPrivacy }));
  form.onsubmit = async (e) => {
    e.preventDefault();
    btn.disabled = true; msg.className = 'wl-msg';
    try { const r = await api('POST', '/api/waitlist', { email: email.value, lang }); msg.textContent = r.already ? L.wlAgain : L.wlOk; msg.classList.add('ok'); email.value = ''; }
    catch (err) { msg.textContent = err.message; msg.classList.add('bad'); }
    btn.disabled = false;
  };
  main.replaceChildren(
    el('div', { class: 'pr-head' }, el('h1', { text: L.h1 }), el('p', { text: L.lead })),
    el('div', { class: 'pr-plans' },
      el('section', { class: 'pr-plan', 'aria-labelledby': 'free-plan' },
        el('div', {}, el('h2', { id: 'free-plan', text: L.free }), el('p', { class: 'muted', text: L.freeP })),
        el('strong', { class: 'pr-price', text: '৳0' }),
        el('ul', {}, ...L.freeList(num(catalog?.totals.videos ?? 302), nC, num(learn?.totals.topics ?? 0), num(learn?.totals.labs ?? 0), ai).map((x) => el('li', {}, tick('#116b58'), el('span', { text: x })))),
        el('a', { class: 'btn ghost big', href: '/learn.html', text: L.start })),
      el('section', { class: 'pr-plan pro', 'aria-labelledby': 'pro-plan' },
        el('span', { class: 'pr-soon', text: L.soon }),
        el('div', {}, el('h2', { id: 'pro-plan', text: L.pro }), el('p', { text: L.proP })),
        el('strong', { class: 'pr-price small', text: L.price }),
        el('ul', {}, el('li', { class: 'plus', text: L.plus }), ...L.proList.map((x) => el('li', {}, tick('#f2c14e'), el('span', { text: x })))),
        form,
        el('a', { class: 'pr-preview', href: '/library.html', text: L.preview }))),
    el('section', { class: 'pr-sec', 'aria-labelledby': 'compare-title' }, el('h2', { id: 'compare-title', text: L.compare }),
      el('div', { class: 'pr-table' }, el('table', {},
        el('thead', {}, el('tr', {}, el('th', { scope: 'col', text: L.feature }), el('th', { scope: 'col', text: L.free }), el('th', { scope: 'col', text: L.pro }))),
        el('tbody', {}, ...L.rows(nC, ai).map(([f, a, b]) => el('tr', {}, el('th', { scope: 'row', text: f }), el('td', { text: a === 1 ? L.inc : a === 0 ? L.no : a }), el('td', { class: 'strong', text: b === 1 ? L.inc : b === 0 ? L.no : b }))))))),
    el('section', { class: 'pr-sec pr-faq', 'aria-labelledby': 'faq-title' }, el('h2', { id: 'faq-title', text: L.faqH }),
      ...L.faq.map(([q, a]) => el('div', { class: 'pr-q' }, el('strong', { text: q }), el('p', { text: a })))));
  if (location.hash === '#waitlist') { form.scrollIntoView({ block: 'center' }); email.focus(); }
}
mountNav('pricing', render);
render();
