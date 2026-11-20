// Trusted sources: the public list of everything the AI Teacher may answer from,
// built from the same data the AI uses (GET /api/sources).
import { api, getLang, applyI18n, mountNav, el, num, errorBox } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    h1: 'Trusted sources', lead: 'The AI Teacher answers only from the material on this page. It never searches the open web, and every answer is checked before you see it.',
    howH: 'How an answer is made',
    flow: [['Your question', 'In English or Bangla, typed or from text you selected.'], ['Search reviewed lessons', 'The closest sections of our checked tutorials and notes.'], ['Approved websites', 'Only if the lessons are not enough, and only the sites listed below.'], ['AI writes', 'Gemini, with Groq as a backup, writes from that evidence only.'], ['Checker', 'Rejects answers with wrong citations, new numbers or the wrong language.'], ['You get', 'A checked answer with its sources, or the reviewed text itself.']],
    tutH: 'Reviewed tutorials', tutP: 'Written by the Loop & Logic team. Every code example was compiled and run before publishing.',
    stats: (t) => [[num(t.topics), 'tutorial topics'], [num(t.sections), 'searchable sections'], [num(t.bangla), 'topics with full Bangla text']],
    cols: ['Tutorial', 'Topics', 'With Bangla text', 'Sections'],
    libH: 'Reviewed notes', libP: (n) => `${num(n)} short passages that the AI may quote for lessons, labs and practice.`, libCols: ['Source', 'Licence', 'Passages'],
    sitesH: 'Approved websites', sitesP: 'When the lessons are not enough, the AI may search these sites, and only these. Each answer that uses one links to the exact page.',
    chH: 'Our videos', chP: 'Video pages use the materials our instructors attach to each video on the', chLink: 'YouTube channel',
    changeH: 'Changes to this list', changeP: 'A site is added only after a reviewer checks it. This page updates by itself when the list changes. Spotted a problem in an answer? Email loopnlogic.ac@gmail.com.',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    h1: 'বিশ্বস্ত উৎস', lead: 'এআই টিচার শুধু এই পাতার উৎসগুলো থেকে উত্তর দেয়। সে খোলা ইন্টারনেটে খোঁজে না, আর প্রতিটি উত্তর তোমাকে দেখানোর আগে যাচাই করা হয়।',
    howH: 'একটি উত্তর কীভাবে তৈরি হয়',
    flow: [['তোমার প্রশ্ন', 'বাংলা বা ইংরেজিতে, লিখে বা কোনো লেখা সিলেক্ট করে।'], ['পর্যালোচিত পাঠে খোঁজা', 'আমাদের যাচাই করা টিউটোরিয়াল ও নোটের সবচেয়ে কাছের অংশ।'], ['অনুমোদিত ওয়েবসাইট', 'পাঠে যথেষ্ট না হলে, শুধু নিচের তালিকার সাইটে।'], ['এআই লেখে', 'Gemini (ব্যাকআপ Groq) শুধু সেই প্রমাণ থেকে লেখে।'], ['যাচাইকারী', 'ভুল উৎস, নতুন সংখ্যা বা ভুল ভাষার উত্তর বাতিল করে।'], ['তুমি পাও', 'উৎসসহ যাচাই করা উত্তর, অথবা পর্যালোচিত লেখাটাই।']],
    tutH: 'পর্যালোচিত টিউটোরিয়াল', tutP: 'লুপ অ্যান্ড লজিক টিমের লেখা। প্রকাশের আগে প্রতিটি কোড উদাহরণ কম্পাইল করে চালানো হয়েছে।',
    stats: (t) => [[num(t.topics), 'টিউটোরিয়াল টপিক'], [num(t.sections), 'খোঁজা যায় এমন অংশ'], [num(t.bangla), 'পূর্ণ বাংলা লেখাসহ টপিক']],
    cols: ['টিউটোরিয়াল', 'টপিক', 'বাংলা লেখাসহ', 'অংশ'],
    libH: 'পর্যালোচিত নোট', libP: (n) => `পাঠ, ল্যাব আর অনুশীলনের জন্য ${num(n)}টি ছোট অংশ, যেগুলো থেকে এআই উদ্ধৃতি দিতে পারে।`, libCols: ['উৎস', 'লাইসেন্স', 'অংশ'],
    sitesH: 'অনুমোদিত ওয়েবসাইট', sitesP: 'পাঠে যথেষ্ট না হলে এআই শুধু এই সাইটগুলোতে খুঁজতে পারে। যে উত্তরে এগুলো ব্যবহার হয়, সেখানে ঠিক সেই পেজের লিংক থাকে।',
    chH: 'আমাদের ভিডিও', chP: 'ভিডিও পেজে উত্তর আসে আমাদের শিক্ষকদের যোগ করা উপকরণ থেকে, ভিডিওগুলো আছে', chLink: 'ইউটিউব চ্যানেলে',
    changeH: 'এই তালিকার পরিবর্তন', changeP: 'কোনো সাইট যোগ হয় শুধু একজন পর্যালোচক যাচাই করার পর। তালিকা বদলালে এই পাতা নিজে থেকেই হালনাগাদ হয়। কোনো উত্তরে ভুল দেখলে লেখো: loopnlogic.ac@gmail.com।',
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');

function table(cols, rows, numeric = []) {
  return el('div', { class: 'src-wrap' }, el('table', { class: 'src-table' },
    el('thead', {}, el('tr', {}, ...cols.map((c, i) => el('th', { class: numeric.includes(i) ? 'n' : null, text: c })))),
    el('tbody', {}, ...rows.map((r) => el('tr', {}, ...r.map((c, i) => el('td', { class: numeric.includes(i) ? 'n' : null, text: String(c) })))))));
}

async function render() {
  const L = t();
  applyI18n(L);
  document.title = `${L.h1} · Loop & Logic`;
  try {
    const d = await api('GET', `/api/sources?lang=${getLang()}`);
    main.replaceChildren(
      el('h1', { text: L.h1 }), el('p', { class: 'lead', text: L.lead }),
      el('h2', { id: 'how', text: L.howH }),
      el('ol', { class: 'src-flow' }, ...L.flow.map(([h, p]) => el('li', {}, el('strong', { text: h }), p))),
      el('h2', { id: 'tutorials', text: L.tutH }), el('p', { text: L.tutP }),
      el('div', { class: 'src-stats' }, ...L.stats(d.tutorials).map(([n, s]) => el('div', {}, el('strong', { text: n }), el('span', { text: s })))),
      table(L.cols, d.tutorials.tracks.map((x) => [x.title, num(x.topics), num(x.bangla), num(x.sections)]), [1, 2, 3]),
      el('h2', { id: 'sites', text: L.sitesH }), el('p', { text: L.sitesP }),
      el('div', { class: 'src-sites' }, ...d.sites.map((g) => el('section', {}, el('h3', { text: g.name }),
        el('ul', {}, ...g.sites.map((s) => el('li', {}, el('a', { href: s.url, target: '_blank', rel: 'noopener', text: s.label }), el('span', { class: 'src-note', text: ` · ${s.domain}` }))))))),
      el('h2', { id: 'notes', text: L.libH }), el('p', { text: L.libP(d.library.passages) }),
      table(L.libCols, d.library.sources.map((s) => [s.title, s.licence, num(s.passages)]), [2]),
      el('h2', { id: 'videos', text: L.chH }), el('p', {}, `${L.chP} `, el('a', { href: d.channel.url, target: '_blank', rel: 'noopener', text: L.chLink }), '.'),
      el('h2', { id: 'changes', text: L.changeH }), el('p', { class: 'src-note', text: L.changeP }));
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch (e) { errorBox(main, e.message, render); }
}
mountNav('sources', render);
render();
