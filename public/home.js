// Homepage (design: "platform-hub layout", Main artboard): a short hero, then one
// "Platform overview" hub. Its tabs (Tutorials, Video courses, Labs, Exam prep) each
// list their items A–Z on the left and preview the chosen one on the right.
// Labs are chosen course by course. The top bar is the shared sticky header.
import { api, getLang, applyI18n, mountNav, el, num, getSite, fillAdSlots } from './common.js';
import { courseAccess } from './course-access.js';

const T = {
  en: {
    tagline: 'Learn with purpose',
    follow: 'learners follow Loop & Logic on YouTube', vh: (n, h) => `${n} videos · ${h} h`,
    h1: 'One place to learn CSE, one clear step at a time.',
    lead: 'Written tutorials, free Bangla video courses, interactive labs and an AI teacher that answers from checked sources, all in one place.',
    start: 'Start learning for free', explorePro: 'Explore Pro',
    sTopics: 'tutorial topics', sLabs: 'interactive labs', sVideos: 'free videos', sCourses: 'video courses',
    overview: 'PLATFORM OVERVIEW', hubH: ['One platform.', 'Everything for your semester.'],
    tabs: { tutorials: 'Tutorials', courses: 'Video courses', labs: 'Labs', exam: 'Exam prep' },
    az: 'A–Z', filter: 'Filter this list', filterPh: 'Filter…', jump: 'Jump to letter', none: 'Nothing matches.',
    complete: (n) => `Complete · ${n} topics`, ofTopics: (a, b) => `${a}/${b} topics`, labsN: (n) => `${n} labs`, noLabs: 'Labs coming soon',
    modules: (n) => `${n} modules`, interactive: (n) => `${n} interactive labs`, ready: (a, b) => `${a} of ${b} topics ready`, readyTag: 'Ready', soonTag: 'Coming soon', more: (n) => `+ ${n} more modules`,
    free: 'FREE', startReading: 'Start reading', seeLabs: 'See the labs',
    videos: (n, h) => `${n} videos · ${h} h · Bangla`, playlist: 'Playlist', startWatching: 'Start watching', watchSamples: 'Watch the free samples', buy: 'Buy', readTut: (t) => `Read the ${t} tutorial`, samples: (n) => `${n} free sample videos`, locked: 'Locked until you buy', sample: 'Free sample',
    labsFor: 'Labs for this course', pickLab: 'Lab topics · pick one to preview', openLab: 'Open this lab', readLesson: 'Read the lesson', labsWay: 'Labs for this course are on the way', labsWayP: 'The written tutorial is ready to read now. When its labs are published, they will appear here, grouped by topic.', readTutorial: 'Read the tutorial',
    examTag: 'Exam prep · Pro', comingSoon: 'COMING SOON', includes: ['Solved past papers', 'Timed mock tests', 'Class materials', 'Certificate'], price: 'Price announced soon', join: 'Join the waitlist', stayFree: 'Videos and tutorials stay free.',
    play: 'Play', stepOf: 'Step 1 of many',
    faqH: 'Questions students ask',
    faq: [['Is everything free?', 'Tutorials, labs, quizzes and every free video course are free. Premium courses are bought one by one, and Pro will add exam-prep packs.'], ['Can I learn in Bangla?', 'Yes. Switch with EN · বাংলা at the top. Videos are in Bangla, and more tutorials get full Bangla text every week.'], ['Do I need an account?', 'No. Sign in with Google only if you want your progress on every device.']],
    footP: 'Answers come only from reviewed notes and approved websites.',
    foot: [['/learn.html', 'Tutorials'], ['/courses.html', 'Video courses'], ['/blog.html', 'Blog'], ['/practice.html', 'Practice'], ['/pricing.html', 'Pricing'], ['/instructor.html', 'For instructors'], ['/privacy.html', 'Privacy'], ['/terms.html', 'Terms']],
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা',
    follow: 'শিক্ষার্থী ইউটিউবে Loop & Logic ফলো করে', vh: (n, h) => `${n}টি ভিডিও · ${h} ঘণ্টা`,
    h1: 'CSE শেখার এক জায়গা, এক একটি পরিষ্কার ধাপে।',
    lead: 'লিখিত টিউটোরিয়াল, ফ্রি বাংলা ভিডিও কোর্স, ইন্টারঅ্যাকটিভ ল্যাব আর যাচাই করা উৎস থেকে উত্তর দেওয়া এআই শিক্ষক, সব এক জায়গায়।',
    start: 'ফ্রিতে শেখা শুরু করো', explorePro: 'প্রো দেখো',
    sTopics: 'টিউটোরিয়াল টপিক', sLabs: 'ইন্টারঅ্যাকটিভ ল্যাব', sVideos: 'ফ্রি ভিডিও', sCourses: 'ভিডিও কোর্স',
    overview: 'প্ল্যাটফর্ম এক নজরে', hubH: ['একটাই প্ল্যাটফর্ম।', 'সেমিস্টারের সব কিছু।'],
    tabs: { tutorials: 'টিউটোরিয়াল', courses: 'ভিডিও কোর্স', labs: 'ল্যাব', exam: 'পরীক্ষার প্রস্তুতি' },
    az: 'A–Z', filter: 'এই তালিকায় খোঁজো', filterPh: 'খোঁজো…', jump: 'অক্ষরে যাও', none: 'কিছু মেলেনি।',
    complete: (n) => `সম্পূর্ণ · ${n}টি টপিক`, ofTopics: (a, b) => `${a}/${b} টপিক`, labsN: (n) => `${n}টি ল্যাব`, noLabs: 'ল্যাব শিগগিরই আসছে',
    modules: (n) => `${n}টি মডিউল`, interactive: (n) => `${n}টি ইন্টারঅ্যাকটিভ ল্যাব`, ready: (a, b) => `${b}টির মধ্যে ${a}টি টপিক তৈরি`, readyTag: 'তৈরি', soonTag: 'শিগগিরই', more: (n) => `+ আরও ${n}টি মডিউল`,
    free: 'ফ্রি', startReading: 'পড়া শুরু করো', seeLabs: 'ল্যাবগুলো দেখো',
    videos: (n, h) => `${n}টি ভিডিও · ${h} ঘণ্টা · বাংলা`, playlist: 'প্লেলিস্ট', startWatching: 'দেখা শুরু করো', watchSamples: 'ফ্রি নমুনা দেখো', buy: 'কিনে নাও', readTut: (t) => `${t} টিউটোরিয়াল পড়ো`, samples: (n) => `${n}টি ফ্রি নমুনা ভিডিও`, locked: 'কিনলে খুলবে', sample: 'ফ্রি নমুনা',
    labsFor: 'এই কোর্সের ল্যাব', pickLab: 'ল্যাবের টপিক · একটি বেছে নিয়ে দেখো', openLab: 'ল্যাবটি খোলো', readLesson: 'পাঠটি পড়ো', labsWay: 'এই কোর্সের ল্যাব আসছে', labsWayP: 'লিখিত টিউটোরিয়াল এখনই পড়া যায়। ল্যাব প্রকাশ হলে টপিক অনুযায়ী এখানে দেখা যাবে।', readTutorial: 'টিউটোরিয়াল পড়ো',
    examTag: 'পরীক্ষার প্রস্তুতি · প্রো', comingSoon: 'শিগগিরই', includes: ['পুরোনো প্রশ্নের সমাধান', 'সময় ধরে মক টেস্ট', 'ক্লাসের ম্যাটেরিয়াল', 'সার্টিফিকেট'], price: 'দাম শিগগিরই জানানো হবে', join: 'ওয়েটলিস্টে যোগ দাও', stayFree: 'ভিডিও আর টিউটোরিয়াল ফ্রিই থাকবে।',
    play: 'চালাও', stepOf: 'প্রথম ধাপ',
    faqH: 'শিক্ষার্থীরা যা জানতে চায়',
    faq: [['সব কি ফ্রি?', 'টিউটোরিয়াল, ল্যাব, কুইজ আর সব ফ্রি ভিডিও কোর্স ফ্রি। প্রিমিয়াম কোর্স আলাদা আলাদা কেনা যায়, আর প্রো-তে আসবে পরীক্ষার প্রস্তুতির প্যাক।'], ['বাংলায় কি শেখা যায়?', 'হ্যাঁ। উপরের EN · বাংলা দিয়ে বদলাও। ভিডিও বাংলায়, আর প্রতি সপ্তাহে আরও টিউটোরিয়াল পুরো বাংলায় আসছে।'], ['অ্যাকাউন্ট কি লাগবে?', 'না। সব ডিভাইসে অগ্রগতি রাখতে চাইলে Google দিয়ে সাইন ইন করো।']],
    footP: 'উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে।',
    foot: [['/learn.html', 'টিউটোরিয়াল'], ['/courses.html', 'ভিডিও কোর্স'], ['/blog.html', 'ব্লগ'], ['/practice.html', 'অনুশীলন'], ['/pricing.html', 'মূল্য'], ['/instructor.html', 'শিক্ষকদের জন্য'], ['/privacy.html', 'গোপনীয়তা'], ['/terms.html', 'শর্তাবলি']],
  },
};
const t = () => T[getLang()];
const TINTS = ['#e6efb5', '#d9ecf2', '#f4e3c8', '#e5e0f4', '#f3dcd6', '#dcefe4'];
const MARK = { c: 'C', 'data-structures': 'DS', algorithms: 'Al', 'oop-java': 'OOP', python: 'Py', dbms: 'DB', 'compiler-design': 'CD', 'machine-learning': 'ML' };
const KIND = { array: 'Array', heap: 'Heap', grid: 'Table', 'linked-list': 'Linked list', queue: 'Queue', stack: 'Stack', tree: 'Tree', ml: 'ML plot', graph: 'Graph', 'hash-table': 'Hash table' };
const EXAM = [
  { key: 'dld', en: ['Digital Logic Design Exam Pack', 'K-maps, SOP/POS and sequential circuits, with mock tests marked instantly.'], bn: ['ডিজিটাল লজিক ডিজাইন পরীক্ষা প্যাক', 'K-map, SOP/POS আর সিকোয়েন্সিয়াল সার্কিট, সঙ্গে সঙ্গে নম্বর দেওয়া মক টেস্টসহ।'] },
  { key: 'ds-mid', en: ['Data Structures Midterm Pack', 'Linked lists, stacks and queues: previous questions with full solutions and timed practice.'], bn: ['ডেটা স্ট্রাকচার মিডটার্ম প্যাক', 'লিংকড লিস্ট, স্ট্যাক আর কিউ: পুরোনো প্রশ্নের পূর্ণ সমাধান আর সময় ধরে অনুশীলন।'] },
  { key: 'mat101', en: ['MAT-101 Final Revision Pack', 'Differentiation and integration, solved past papers, and class notes from the instructor.'], bn: ['MAT-101 ফাইনাল রিভিশন প্যাক', 'ডিফারেনশিয়েশন আর ইন্টিগ্রেশন, পুরোনো প্রশ্নের সমাধান আর শিক্ষকের ক্লাস নোট।'] },
  { key: 'phy102', en: ['PHY-102 Final Revision Pack', 'Electrostatics to quantum theory: solved past papers and short revision videos.'], bn: ['PHY-102 ফাইনাল রিভিশন প্যাক', 'ইলেকট্রোস্ট্যাটিক্স থেকে কোয়ান্টাম তত্ত্ব: পুরোনো প্রশ্নের সমাধান আর ছোট রিভিশন ভিডিও।'] },
  { key: 'pps', en: ['PPS & SPL Exam Prep Pack', 'Past midterm and final questions with full solutions, timed mock tests and a certificate.'], bn: ['PPS ও SPL পরীক্ষা প্রস্তুতি প্যাক', 'মিডটার্ম আর ফাইনালের পুরোনো প্রশ্নের পূর্ণ সমাধান, সময় ধরে মক টেস্ট আর সার্টিফিকেট।'] },
];
const svg = (cls, html) => { const s = el('span', { class: cls, 'aria-hidden': 'true' }); s.innerHTML = html; return s; };
const SEARCH = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const PLAY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const LOCK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2c14e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';

let learn = null, catalog = null, site = null;
const state = { tab: 'tutorials', sel: {}, lab: {}, filter: '' };
const cache = new Map();
const once = (key, fn) => { if (!cache.has(key)) cache.set(key, fn().catch((e) => { cache.delete(key); throw e; })); return cache.get(key); };
const shortOf = (title) => title.split(/[\s&-]+/).filter((w) => /^[A-Za-z0-9]/.test(w) && !/^(and|of|in|to|the|for)$/i.test(w)).map((w) => w[0]).join('').slice(0, 3).toUpperCase() || title.slice(0, 2).toUpperCase();

function hero(L) {
  const subs = catalog?.channel?.subscribers;
  const stat = (v, label) => el('div', { class: 'hh-stat' }, el('strong', { text: num(v) }), el('span', { text: label }));
  return el('section', { class: 'hh wrap', 'aria-labelledby': 'hh-title' },
    subs ? el('a', { class: 'hh-follow', href: catalog.channel.url, target: '_blank', rel: 'noopener' }, el('strong', { text: `${num(subs)}+` }), ` ${L.follow}`) : null,
    el('h1', { id: 'hh-title', text: L.h1 }),
    el('p', { class: 'hh-lead', text: L.lead }),
    el('div', { class: 'hh-cta' },
      el('a', { class: 'btn primary big', href: '#hub' }, L.start, svg('', '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>')),
      el('a', { class: 'btn ghost big', href: '/pricing.html', text: L.explorePro })),
    el('div', { class: 'hh-stats' }, stat(learn.totals.topics, L.sTopics), stat(learn.totals.labs, L.sLabs), stat(catalog?.totals?.videos ?? 0, L.sVideos), stat(catalog?.courses?.length ?? 0, L.sCourses)),
    el('div', { id: 'ad-inline', class: 'ad-slot' }));
}

// ── the hub ──
function items(tab, L) {
  const bn = getLang() === 'bn';
  if (tab === 'tutorials' || tab === 'labs') {
    return learn.tracks.filter((x) => tab === 'labs' || x.available).map((x) => ({
      key: x.id, label: x.title, mark: MARK[x.id] ?? shortOf(x.title),
      meta: tab === 'labs' ? (x.labs ? L.labsN(num(x.labs)) : L.noLabs) : x.delivered >= x.planned ? L.complete(num(x.delivered)) : `${L.ofTopics(num(x.delivered), num(x.planned))}${x.labs ? ` · ${L.labsN(num(x.labs))}` : ''}`,
    }));
  }
  if (tab === 'courses') return (catalog?.courses ?? []).map((c, i) => ({ key: c.id, label: c.title, mark: shortOf(c.title), meta: L.vh(num(c.videos), num(c.hours)), pro: courseAccess(c).paid, i }));
  return EXAM.map((e) => ({ key: e.key, label: (bn ? e.bn : e.en)[0], mark: '★', meta: L.examTag, pro: true }));
}

function hubTabs(L) {
  const tabs = (site?.hubTabs ?? ['tutorials', 'courses', 'labs', 'exam']).filter((x) => L.tabs[x]);
  if (!tabs.includes(state.tab)) state.tab = tabs[0];
  return el('div', { class: 'hub-tabs', role: 'tablist', 'aria-label': L.overview },
    ...tabs.map((id) => el('button', { type: 'button', role: 'tab', id: `tab-${id}`, 'aria-selected': String(id === state.tab), 'aria-controls': 'hub-panel', class: 'hub-tab',
      onclick: () => { state.tab = id; state.filter = ''; renderHub(); document.getElementById(`tab-${id}`)?.focus(); } },
      L.tabs[id], el('span', { class: 'hub-count', text: num(items(id, L).length) }))));
}

function hubList(L, list) {
  const sel = state.sel[state.tab] ?? list[0]?.key;
  const f = state.filter.trim().toLowerCase();
  const shown = list.filter((x) => !f || x.label.toLowerCase().includes(f)).sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));
  const groups = new Map();
  for (const x of shown) { const ch = x.label[0].toUpperCase(); (groups.get(ch) ?? groups.set(ch, []).get(ch)).push(x); }
  const input = el('input', { type: 'search', placeholder: L.filterPh, value: state.filter, 'aria-label': L.filter,
    oninput: (e) => { state.filter = e.target.value; const pos = e.target.selectionStart; renderHub(); const i = document.querySelector('.hub-filter input'); i?.focus(); i?.setSelectionRange(pos, pos); } });
  return el('aside', { class: 'hub-list', 'aria-label': `${L.tabs[state.tab]}, ${L.az}` },
    el('div', { class: 'hub-list-head' }, el('strong', { text: L.tabs[state.tab] }), el('span', { text: `${L.az} · ${num(list.length)}` })),
    el('label', { class: 'hub-filter' }, svg('', SEARCH), input),
    el('nav', { class: 'hub-letters', 'aria-label': L.jump }, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => groups.has(ch)
      ? el('a', { href: `#az-${state.tab}-${ch}`, text: ch, onclick: (e) => { e.preventDefault(); document.getElementById(`az-${state.tab}-${ch}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } })
      : el('span', { 'aria-hidden': 'true', text: ch }))),
    el('div', { class: 'hub-scroll' }, shown.length ? [...groups].flatMap(([ch, xs]) => [
      el('div', { class: 'hub-letter', id: `az-${state.tab}-${ch}`, text: ch }),
      ...xs.map((x) => el('button', { type: 'button', class: 'hub-item', 'aria-current': String(x.key === sel), onclick: () => { state.sel[state.tab] = x.key; renderHub(); if (matchMedia('(max-width: 860px)').matches) document.getElementById('hub-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } },
        el('span', { class: 'hub-mark', text: x.mark }),
        el('span', { class: 'hub-item-text' }, el('span', { class: 'hub-item-title', text: x.label }), el('span', { class: 'hub-item-meta', text: x.meta })),
        x.pro ? el('span', { class: 'hub-pro', text: 'PRO' }) : null)),
    ]) : el('p', { class: 'hub-none', text: L.none })));
}

const loading = () => el('div', { class: 'hub-loading' }, el('div', { class: 'skeleton' }), el('div', { class: 'skeleton' }));
const btn = (href, text, kind = 'primary') => el('a', { class: `btn ${kind}`, href, text });

async function tutorialPreview(L, key) {
  const x = learn.tracks.find((tr) => tr.id === key) ?? learn.tracks.find((tr) => tr.available);
  const d = await once(`track:${x.id}:${getLang()}`, () => api('GET', `/api/learn/${x.id}?lang=${getLang()}`));
  const pct = Math.round((100 * x.delivered) / Math.max(1, x.planned));
  const mods = d.modules.slice(0, 8);
  return [
    el('div', { class: 'hp-head' },
      el('div', { class: 'hp-title' }, el('span', { class: 'hp-mark', text: MARK[x.id] ?? shortOf(x.title) }), el('div', {}, el('h3', { text: x.title }), el('span', { class: 'hp-sub', text: `${L.modules(num(d.modules.length))}${x.labs ? ` · ${L.interactive(num(x.labs))}` : ''}` }))),
      el('span', { class: 'hp-free', text: L.free })),
    el('p', { class: 'hp-blurb', text: x.blurb }),
    el('div', { class: 'hp-progress' }, el('div', { class: 'hp-progress-row' }, el('span', { text: L.ready(num(x.delivered), num(x.planned)) }), el('span', { text: `${num(pct)}%` })), el('div', { class: 'bar' }, el('div', { style: `width:${pct}%` }))),
    el('div', { class: 'hp-mods' }, ...mods.map((m, i) => {
      const ready = m.topics.filter((tp) => tp.available).length;
      const done = ready >= m.topics.length && m.topics.length > 0;
      return el('div', { class: 'hp-mod' },
        el('div', { class: 'hp-mod-row' }, el('strong', { text: `${num(i + 1)}. ${m.title}` }), el('span', { class: `hp-tag${done ? ' on' : ''}`, text: done ? L.readyTag : ready ? `${num(ready)}/${num(m.topics.length)}` : L.soonTag })),
        el('div', { class: 'bar thin' }, el('div', { style: `width:${Math.round((100 * ready) / Math.max(1, m.topics.length))}%` })));
    })),
    d.modules.length > 8 ? el('span', { class: 'hp-sub', text: L.more(num(d.modules.length - 8)) }) : null,
    el('div', { class: 'hp-actions' }, btn(`/learn.html?track=${x.id}`, L.startReading), x.labs ? el('button', { type: 'button', class: 'btn ghost', text: L.seeLabs, onclick: () => { state.tab = 'labs'; state.sel.labs = x.id; renderHub(); } }) : null),
  ];
}

async function coursePreview(L, key) {
  const list = catalog?.courses ?? [];
  const i = Math.max(0, list.findIndex((c) => c.id === key));
  const c = list[i];
  if (!c) return [el('p', { text: L.none })];
  const v = await once(`videos:${c.id}:${getLang()}`, () => api('GET', `/api/courses/${c.id}/videos?lang=${getLang()}`));
  const first = (v.sections ?? []).flatMap((s) => s.items).filter((it) => !it.repeat).slice(0, 4);
  const tut = learn.tracks.find((tr) => tr.course === c.id && tr.available);
  const acc = courseAccess(c, getLang());
  const paid = acc.paid;
  return [
    el('div', { class: 'hp-course' },
      el('div', { class: 'hp-tile', style: `background:${c.tint ?? TINTS[i % TINTS.length]}` }, el('span', { text: shortOf(c.title) }), svg('hp-play', PLAY)),
      el('div', { class: 'hp-course-text' }, el('span', { class: 'hp-sub', text: c.subjectName }), el('h3', { text: c.title }),
        el('span', { class: 'hp-course-meta' }, L.videos(num(c.videos), num(c.hours)), ' · ', el('strong', { class: paid ? 'hp-price' : 'hp-free-text', text: paid ? acc.label : L.free })),
        paid && c.samples ? el('span', { class: 'hp-sub', text: L.samples(num(c.samples)) }) : null)),
    el('div', { class: 'hp-videos' }, el('strong', { class: 'hp-sub', text: L.playlist }),
      ...first.map((it, k) => el('div', { class: `hp-video${it.locked ? ' locked' : ''}` }, el('span', { class: 'hp-n', text: num(k + 1) }), el('span', { class: 'hp-video-title', text: it.title }),
        it.locked ? svg('hp-lock', LOCK) : it.sample ? el('span', { class: 'hp-tag on', text: L.sample }) : svg('hp-play-s', PLAY)))),
    el('div', { class: 'hp-actions' }, btn(`/watch.html?course=${encodeURIComponent(c.id)}`, paid ? L.watchSamples : L.startWatching), paid ? btn(`/buy.html?course=${encodeURIComponent(c.id)}`, acc.price ? `${L.buy} · ${acc.price}` : L.buy, 'pro') : null, tut ? btn(`/learn.html?track=${tut.id}`, L.readTut(tut.title), 'ghost') : null),
  ];
}

const VIZ = {
  bars: () => el('div', { class: 'viz-bars' }, ...[42, 17, 63, 25, 88, 9, 54, 31].map((n, k) => el('div', { class: `vb${k === 3 || k === 4 ? ' hot' : k > 5 ? ' done' : ''}`, style: `height:${30 + n * 1.3}px` }, el('span', { text: String(n) })))),
  list: () => el('div', { class: 'viz-list' }, ...[72, 85, 91, 40].flatMap((n, k, a) => [el('div', { class: `vn${k === 1 ? ' hot' : ''}`, text: String(n) }), el('span', { class: 'va', text: k < a.length - 1 ? '→' : '∅' })])),
  tree: () => el('div', { class: 'viz-tree' }, ...[[50, 8, 50], [25, 45, 30], [75, 45, 70], [12, 82, 20], [38, 82, 40], [62, 82, 60], [88, 82, 80]].map(([x, y, n], k) => el('div', { class: `vt${k === 2 ? ' done' : ''}`, style: `left:calc(${x}% - 20px);top:calc(${y}% - 10px)`, text: String(n) }))),
  plot: () => el('div', { class: 'viz-plot' }, el('div', { class: 'vp-line' }), ...[[12, 70, 0], [20, 55, 0], [28, 78, 0], [18, 40, 0], [35, 62, 0], [40, 30, 0], [62, 22, 1], [70, 35, 1], [78, 15, 1], [66, 50, 1], [85, 40, 1], [90, 25, 1]].map(([x, y, c]) => el('div', { class: `vp${c ? ' b' : ''}`, style: `left:${x}%;top:${y}%` }))),
  grid: () => el('div', { class: 'viz-grid' }, ...Array.from({ length: 24 }, (_, k) => el('div', { class: `vg${k < 9 ? ' done' : k === 9 ? ' hot' : ''}`, text: k < 10 ? String([0, 1, 1, 2, 3, 5, 8, 13, 21, 34][k]) : '' }))),
  graph: () => { const s = svg('viz-graph', '<svg viewBox="0 0 300 160" width="100%" height="160"><g stroke="currentColor" stroke-width="2" opacity=".5"><line x1="40" y1="80" x2="120" y2="30"/><line x1="40" y1="80" x2="120" y2="130"/><line x1="120" y1="30" x2="200" y2="30"/><line x1="120" y1="130" x2="200" y2="130"/><line x1="200" y1="30" x2="260" y2="80"/><line x1="200" y1="130" x2="260" y2="80"/><line x1="120" y1="30" x2="120" y2="130"/></g><g font-size="13" font-weight="700" text-anchor="middle"><circle cx="40" cy="80" r="16" fill="#2e9e5b"/><text x="40" y="85" fill="#fff">A</text><circle cx="120" cy="30" r="16" fill="#2e9e5b"/><text x="120" y="35" fill="#fff">B</text><circle cx="120" cy="130" r="16" fill="#f2b705"/><text x="120" y="135" fill="#173a36">C</text><circle cx="200" cy="30" r="16" fill="#2a3d37"/><text x="200" y="35" fill="#fff">D</text><circle cx="200" cy="130" r="16" fill="#2a3d37"/><text x="200" y="135" fill="#fff">E</text><circle cx="260" cy="80" r="16" fill="#2a3d37"/><text x="260" y="85" fill="#fff">F</text></g></svg>'); return s; },
};
const vizFor = (kind) => ({ array: 'bars', heap: 'bars', stack: 'bars', queue: 'bars', 'hash-table': 'bars', 'linked-list': 'list', tree: 'tree', ml: 'plot', grid: 'grid', graph: 'graph' }[kind] ?? 'bars');

async function labsPreview(L, key) {
  const x = learn.tracks.find((tr) => tr.id === key) ?? learn.tracks[0];
  const head = el('div', { class: 'hp-head' },
    el('div', { class: 'hp-title' }, el('span', { class: 'hp-mark', text: MARK[x.id] ?? shortOf(x.title) }), el('div', {}, el('span', { class: 'hp-sub', text: L.labsFor }), el('h3', { text: x.title }))),
    el('span', { class: `hp-free${x.labs ? '' : ' off'}`, text: x.labs ? L.interactive(num(x.labs)).toUpperCase() : L.noLabs.toUpperCase() }));
  if (!x.labs) return [head, el('div', { class: 'hp-empty' }, el('strong', { text: L.labsWay }), el('p', { text: L.labsWayP }), x.available ? btn(`/learn.html?track=${x.id}`, L.readTutorial) : null)];
  const d = await once(`labs:${x.id}:${getLang()}`, () => api('GET', `/api/learn-labs/${x.id}?lang=${getLang()}`));
  const all = d.topics.flatMap((tp) => tp.labs.map((lb) => ({ ...lb, topic: tp })));
  const pickedId = state.lab[x.id] ?? all[0]?.id;
  const picked = all.find((lb) => lb.id === pickedId) ?? all[0];
  return [head,
    el('div', { class: 'hp-labtopics' }, el('strong', { class: 'hp-sub', text: L.pickLab }),
      el('div', { class: 'hp-labscroll' }, ...d.topics.map((tp, i) => el('div', { class: 'hp-labtopic' },
        el('span', { class: 'hp-labtopic-title', text: `${num(i + 1)}. ${tp.title}` }),
        el('div', { class: 'hp-labchips' }, ...tp.labs.map((lb) => el('button', { type: 'button', class: 'hp-labchip', 'aria-pressed': String(lb.id === picked.id), text: lb.title, onclick: () => { state.lab[x.id] = lb.id; renderHub(); } }))))))),
    el('div', { class: 'hp-lab' },
      el('div', { class: 'hp-lab-head' }, el('div', {}, el('span', { class: 'hp-sub', text: picked.topic.title }), el('h4', { text: picked.title })), el('span', { class: 'hp-kind', text: `LAB · ${(KIND[picked.kind] ?? picked.kind).toUpperCase()}` })),
      el('p', { class: 'hp-blurb', text: picked.summary }),
      el('div', { class: 'hp-viz', 'aria-hidden': 'true' }, VIZ[vizFor(picked.kind)]()),
      el('div', { class: 'hp-player', 'aria-hidden': 'true' }, el('span', { text: '⏮' }), el('span', { text: '◀' }), el('span', { class: 'on', text: `▶ ${L.play}` }), el('span', { text: '▶|' }))),
    el('div', { class: 'hp-actions' }, btn(`/learn.html?track=${x.id}&topic=${picked.topic.id}#lab-${picked.id}`, L.openLab), btn(`/learn.html?track=${x.id}&topic=${picked.topic.id}`, L.readLesson, 'ghost')),
  ];
}

function examPreview(L, key) {
  const bn = getLang() === 'bn';
  const e = EXAM.find((x) => x.key === key) ?? EXAM[0];
  const [title, desc] = bn ? e.bn : e.en;
  return [
    el('div', { class: 'hp-head' }, el('div', {}, el('span', { class: 'hp-sub', text: L.examTag }), el('h3', { text: title })), el('span', { class: 'hp-soon', text: L.comingSoon })),
    el('p', { class: 'hp-blurb', text: desc }),
    el('div', { class: 'hp-incl' }, ...L.includes.map((x) => el('div', { class: 'hp-incl-item' }, svg('', CHECK), el('span', { text: x })))),
    el('div', { class: 'hp-actions' }, el('strong', { class: 'hp-price-big', text: L.price }), btn('/pricing.html#waitlist', L.join, 'pro'), el('span', { class: 'hp-sub', text: L.stayFree })),
  ];
}

let hubSeq = 0;
async function renderHub() {
  const L = t();
  const hub = document.getElementById('hub');
  if (!hub) return;
  const list = items(state.tab, L);
  const key = state.sel[state.tab] ?? [...list].sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }))[0]?.key;
  state.sel[state.tab] = key;
  const panel = el('div', { class: 'hub-panel', id: 'hub-panel', role: 'tabpanel', 'aria-labelledby': `tab-${state.tab}`, 'aria-live': 'polite' }, loading());
  hub.querySelector('.hub-tabs')?.replaceWith(hubTabs(L));
  hub.querySelector('.hub-body').replaceChildren(hubList(L, list), panel);
  const seq = ++hubSeq;
  try {
    const content = state.tab === 'tutorials' ? await tutorialPreview(L, key) : state.tab === 'courses' ? await coursePreview(L, key) : state.tab === 'labs' ? await labsPreview(L, key) : examPreview(L, key);
    if (seq === hubSeq) panel.replaceChildren(...content.filter(Boolean));
  } catch (e) {
    if (seq === hubSeq) panel.replaceChildren(el('p', { class: 'hub-none', text: e.message }));
  }
}

function render() {
  const L = t();
  applyI18n({ tagline: L.tagline });
  const main = document.getElementById('home');
  main.replaceChildren(
    hero(L),
    el('section', { id: 'hub', class: 'hub', 'aria-labelledby': 'hub-title' }, el('div', { class: 'wrap hub-wrap' },
      el('div', { class: 'hub-head' }, el('span', { class: 'hub-chip', text: L.overview }), el('h2', { id: 'hub-title' }, L.hubH[0], el('br'), L.hubH[1])),
      el('div', { class: 'hub-tabs' }),
      el('div', { class: 'hub-body' }))),
    el('section', { class: 'wrap hfaq', 'aria-labelledby': 'faq-title' }, el('h2', { id: 'faq-title', text: L.faqH }),
      el('div', { class: 'hfaq-grid' }, ...L.faq.map(([q, a]) => el('div', { class: 'hfaq-card' }, el('strong', { text: q }), el('p', { text: a }))))));
  document.getElementById('foot').replaceChildren(el('div', { class: 'wrap h-foot' },
    el('div', {}, el('strong', { text: 'loop & logic' }), el('p', { text: L.footP })),
    el('nav', { 'aria-label': 'Footer' }, ...L.foot.map(([href, text]) => el('a', { href, text })))));
  renderHub();
  fillAdSlots();
}

async function load() {
  cache.clear();
  [learn, catalog, site] = await Promise.all([
    api('GET', `/api/learn?lang=${getLang()}`),
    api('GET', `/api/courses?lang=${getLang()}`).catch(() => null),
    getSite(),
  ]);
  render();
}

mountNav('home', load);
load().catch((e) => { document.getElementById('home').replaceChildren(el('div', { class: 'wrap card empty' }, el('h2', { text: 'Couldn’t load this' }), el('p', { text: e.message }))); });
