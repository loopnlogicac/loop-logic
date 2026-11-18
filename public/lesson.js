// Lesson reader: adaptive text, select-to-ask sidebar, reading signals.
// Server text is always inserted with textContent, never as HTML.
import { api, ApiError, ensureSignedIn, getConfig, getLang, mountNav, el } from './common.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let lessonId = params.get('id') ?? 'margin-basics';
let lesson = null;
let current = null; // { blockId, text }
let currentAction = 'understand';
let lastRequest = null;
let courses = [];

const T = {
  en: {
    tagline: 'Learn with purpose', lv1: 'Simpler', lv2: 'Standard', lv3: 'Deeper', 'original-label': 'Show original',
    'why-btn': 'Why is this tailored?', 'display-title': 'Page style', 'pr-light': 'Light', 'pr-sepia': 'Sepia', 'pr-dark': 'Dark', 'pr-contrast': 'High contrast',
    'large-label': 'Larger text', 'enabled-label': 'Adapt this page to me', 'why-title': 'Why this page looks like this', 'side-title': 'Help',
    'act-understand': 'Quick understand', 'act-search': 'Search trusted sources', 'act-quiz': 'Quiz me', 'sp-understand': 'Explain', 'sp-search': 'Sources', 'sp-quiz': 'Quiz',
    foot: 'Answers come only from the reviewed library and approved websites.',
    ask: 'Ask about this paragraph', tailored: 'Adapted for you', original: 'Original version', loading: 'Finding a short answer…',
    noWhy: 'Nothing has changed yet. The page starts at the standard version and adapts as you read, select text or answer quizzes.',
    whyFoot: (v) => `Rules ${v}. Only reading activity is used — no personal traits.`,
    extra: 'Another worked example', terms: 'Key terms', videoH: 'Watch the video lesson', videoRelated: 'Related video from Loop & Logic', videoP: 'The same topic, explained in Bangla on the Loop & Logic channel.', labH: 'Now do the lab', labP: (m) => `About ${m} minutes. Setup steps, starter material and a checked result.`, labGo: 'Open the lab', chips: { simpler: 'Simpler', example: 'An example', more: 'Tell me more', quiz: 'Quiz me' },
    fb: 'Was this helpful?', fbv: { too_easy: 'Too easy', just_right: 'Just right', too_hard: 'Too hard', too_long: 'Too long' }, thanks: 'Thanks — the page will adjust.',
    origin: { glossary: 'From the glossary', reviewed: 'From the reviewed notes', ai_checked: 'Reworded by AI · checked against the sources' },
    refresher: 'Quick refresher', sources: 'Sources', reviewed: 'Reviewed', live: 'Approved website', retrieved: 'retrieved',
    prereqTitle: 'One quick question first', skip: 'Skip — just explain', depthQ: 'How much do you need?',
    latest: 'Search latest from approved sites', noLive: 'Live search is off; showing the reviewed library.',
    quizRight: 'Correct.', quizWrong: 'Not quite.', sealed: 'Help is paused while your sealed check is open. Finish the check first.',
    calc: { title: 'Margin calculator', cost: 'Cost', list: 'List price', disc: 'Discount', sale: 'Selling price', profit: 'Profit', margin: 'Margin', rule: 'Rule: at least 15%', ok: 'Meets the rule', no: 'Breaks the rule' },
    thr: { title: 'Spam threshold', thr: 'Threshold', flagged: 'Flagged', fp: 'False positives', fn: 'False negatives', spam: 'spam', notSpam: 'not spam' },
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', lv1: 'সহজ', lv2: 'সাধারণ', lv3: 'গভীর', 'original-label': 'মূল লেখা দেখাও',
    'why-btn': 'কেন এভাবে সাজানো?', 'display-title': 'পাতার ধরন', 'pr-light': 'আলো', 'pr-sepia': 'সেপিয়া', 'pr-dark': 'অন্ধকার', 'pr-contrast': 'উচ্চ কনট্রাস্ট',
    'large-label': 'বড় লেখা', 'enabled-label': 'পাতাটা আমার মতো করে সাজাও', 'why-title': 'পাতাটা কেন এমন দেখাচ্ছে', 'side-title': 'সাহায্য',
    'act-understand': 'দ্রুত বুঝি', 'act-search': 'বিশ্বস্ত উৎসে খুঁজি', 'act-quiz': 'কুইজ দাও', 'sp-understand': 'ব্যাখ্যা', 'sp-search': 'উৎস', 'sp-quiz': 'কুইজ',
    foot: 'উত্তর আসে শুধু পর্যালোচিত লাইব্রেরি আর অনুমোদিত ওয়েবসাইট থেকে।',
    ask: 'এই অনুচ্ছেদ নিয়ে প্রশ্ন', tailored: 'তোমার জন্য সাজানো', original: 'মূল সংস্করণ', loading: 'ছোট উত্তর খোঁজা হচ্ছে…',
    noWhy: 'এখনো কিছু বদলায়নি। পাতা সাধারণ সংস্করণে শুরু হয়, তুমি পড়লে, সিলেক্ট করলে বা কুইজ দিলে মানিয়ে নেয়।',
    whyFoot: (v) => `নিয়ম ${v}। শুধু পড়ার কাজ ব্যবহার হয় — কোনো ব্যক্তিগত বৈশিষ্ট্য নয়।`,
    extra: 'আরেকটি সমাধানসহ উদাহরণ', terms: 'মূল শব্দ', videoH: 'ভিডিও লেসন দেখো', videoRelated: 'লুপ অ্যান্ড লজিকের সংশ্লিষ্ট ভিডিও', videoP: 'একই বিষয়, লুপ অ্যান্ড লজিক চ্যানেলে বাংলায় ব্যাখ্যা করা।', labH: 'এবার ল্যাবটি করো', labP: (m) => `প্রায় ${m} মিনিট। সেটআপের ধাপ, স্টার্টার আর যাচাই করা ফল।`, labGo: 'ল্যাব খোলো', chips: { simpler: 'আরও সহজ', example: 'একটা উদাহরণ', more: 'আরও বলো', quiz: 'কুইজ দাও' },
    fb: 'কাজে লাগল?', fbv: { too_easy: 'খুব সহজ', just_right: 'ঠিক আছে', too_hard: 'খুব কঠিন', too_long: 'খুব লম্বা' }, thanks: 'ধন্যবাদ — পাতা মানিয়ে নেবে।',
    origin: { glossary: 'শব্দকোষ থেকে', reviewed: 'পর্যালোচিত নোট থেকে', ai_checked: 'এআই নতুন করে লিখেছে · উৎসের সঙ্গে মিলিয়ে দেখা' },
    refresher: 'ছোট করে মনে করিয়ে দিই', sources: 'উৎস', reviewed: 'পর্যালোচিত', live: 'অনুমোদিত ওয়েবসাইট', retrieved: 'সংগ্রহ',
    prereqTitle: 'আগে একটা ছোট প্রশ্ন', skip: 'বাদ দাও — শুধু বুঝিয়ে বলো', depthQ: 'কতটুকু দরকার?',
    latest: 'অনুমোদিত সাইটে সর্বশেষ তথ্য খুঁজি', noLive: 'লাইভ খোঁজ বন্ধ; পর্যালোচিত লাইব্রেরি দেখানো হচ্ছে।',
    quizRight: 'ঠিক।', quizWrong: 'পুরোপুরি ঠিক নয়।', sealed: 'বন্ধ যাচাই চলার সময় সাহায্য বন্ধ থাকে। আগে যাচাইটা শেষ করো।',
    calc: { title: 'মার্জিন ক্যালকুলেটর', cost: 'খরচ', list: 'তালিকা মূল্য', disc: 'ছাড়', sale: 'বিক্রয়মূল্য', profit: 'লাভ', margin: 'মার্জিন', rule: 'নিয়ম: কমপক্ষে ১৫%', ok: 'নিয়ম মানে', no: 'নিয়ম ভাঙে' },
    thr: { title: 'স্প্যাম থ্রেশহোল্ড', thr: 'থ্রেশহোল্ড', flagged: 'চিহ্নিত', fp: 'ফলস পজিটিভ', fn: 'ফলস নেগেটিভ', spam: 'স্প্যাম', notSpam: 'স্প্যাম নয়' },
  },
};
const t = () => T[getLang()];
const bnDigits = (s) => (getLang() === 'bn' ? String(s).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]) : String(s));

// ── reading signals ─────────────────────────────────────────────────────────
const queue = [];
const activeSeconds = new Map();
const visible = new Set();
const scrolledBack = new Set();
function push(e) { queue.push({ lessonId, ...e }); }
async function flush(keepalive = false) {
  for (const [blockId, s] of activeSeconds) if (s >= 5) push({ type: 'active_time', blockId, seconds: Math.round(s) });
  activeSeconds.clear();
  if (!queue.length) return;
  const events = queue.splice(0, queue.length);
  if (keepalive) {
    const headers = { 'content-type': 'application/json' };
    try { const tok = sessionStorage.getItem('ll_token'); if (tok) headers.authorization = `Bearer ${tok}`; } catch { /* none */ }
    fetch('/api/reading-events', { method: 'POST', headers, body: JSON.stringify({ events }), keepalive: true, credentials: 'same-origin' }).catch(() => {});
    return;
  }
  try {
    const r = await api('POST', '/api/reading-events', { events });
    applyProfile(getLang() === 'bn' ? r.profileBn : r.profile);
  } catch { /* signals are best effort */ }
}
setInterval(() => { if (document.visibilityState === 'visible') for (const id of visible) activeSeconds.set(id, (activeSeconds.get(id) ?? 0) + 1); }, 1000);
setInterval(() => flush(), 20000);
addEventListener('pagehide', () => flush(true));
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(true); });

const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const id = e.target.dataset.block;
    if (e.isIntersecting && e.intersectionRatio >= 0.6) visible.add(id); else visible.delete(id);
  }
}, { threshold: [0, 0.6, 1] });

let maxY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  maxY = Math.max(maxY, y);
  if (maxY - y > 350) {
    const mid = document.elementFromPoint(innerWidth / 3, innerHeight / 2)?.closest('[data-block]');
    const id = mid?.dataset.block;
    if (id && !scrolledBack.has(id)) { scrolledBack.add(id); push({ type: 'scroll_back', blockId: id }); }
    maxY = y;
  }
}, { passive: true });

let lastZoom = 0;
function zoomSeen() { if (Date.now() - lastZoom > 60000) { lastZoom = Date.now(); push({ type: 'zoom' }); flush(); } }
addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && ['+', '='].includes(e.key)) zoomSeen(); });
addEventListener('wheel', (e) => { if (e.ctrlKey && e.deltaY < 0) zoomSeen(); }, { passive: true });
window.visualViewport?.addEventListener('resize', () => { if (visualViewport.scale > 1.3) zoomSeen(); });

// ── rendering ───────────────────────────────────────────────────────────────
function chrome() {
  const L = t();
  document.documentElement.lang = getLang();
  for (const [id, v] of Object.entries(L)) { const n = $(id); if (n && typeof v === 'string') n.textContent = v; }
}

function withTerms(text, terms) {
  // Wrap the first occurrence of each glossary term; everything stays text nodes.
  const nodes = [];
  let rest = text;
  const found = terms
    .map((tm) => ({ ...tm, i: text.toLowerCase().indexOf(tm.match.toLowerCase()) }))
    .filter((tm) => tm.i >= 0)
    .sort((a, b) => a.i - b.i);
  let offset = 0;
  for (const tm of found) {
    const i = tm.i - offset;
    if (i < 0) continue;
    nodes.push(rest.slice(0, i));
    nodes.push(el('span', { class: 'term', title: tm.definition, tabindex: '0', text: rest.slice(i, i + tm.match.length) }));
    rest = rest.slice(i + tm.match.length);
    offset = tm.i + tm.match.length;
  }
  nodes.push(rest);
  return nodes;
}

function renderLesson() {
  const L = t();
  const art = $('article');
  const course = courses.find((c) => c.lessonIds?.includes(lessonId));
  art.replaceChildren(
    course ? el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
      el('a', { href: '/courses.html', text: getLang() === 'bn' ? 'কোর্স' : 'Courses' }), ' › ',
      el('a', { href: `/course.html?id=${encodeURIComponent(course.id)}`, text: course.title })) : '',
    el('h1', { text: lesson.title }),
    el('p', { class: 'lede', text: lesson.summary }),
  );
  if (!lesson.personalised) art.append(el('span', { class: 'tailored-tag', text: L.original }));
  else if (lesson.level !== 2) art.append(el('span', { class: 'tailored-tag', text: L.tailored }));
  for (const b of lesson.blocks) {
    let node;
    if (b.type === 'heading') node = el('h2', { 'data-block': b.id, text: b.text });
    else if (b.type === 'formula') node = el('div', { class: 'block formula', 'data-block': b.id, text: b.text });
    else if (b.type === 'interactive') node = widget(b);
    else {
      const wrap = el('div', { class: `block ${b.type === 'text' ? 'text-block' : 'example'}`, 'data-block': b.id });
      wrap.append(el('p', {}, ...withTerms(b.text, b.terms)));
      wrap.append(el('button', { type: 'button', class: 'ask', 'aria-label': L.ask, title: L.ask, text: '?', onclick: () => openHelp(b.id, b.text, 'understand') }));
      if (b.extraExample) wrap.append(el('div', { class: 'extra' }, el('b', { text: L.extra }), b.extraExample));
      node = wrap;
    }
    art.append(node);
    observer.observe(node);
  }
  const after = el('div', { class: 'after' });
  if (lesson.lab) {
    after.append(el('section', { class: 'after-card lab-cta' },
      el('h2', { text: lesson.lab.title }),
      el('p', { text: `${L.labH}. ${L.labP(bnDigits(lesson.lab.minutes))}` }),
      el('a', { class: 'go', href: `/lab.html?id=${encodeURIComponent(lessonId)}`, text: L.labGo })));
  }
  if (lesson.videos?.length) {
    const covers = lesson.videos.some((v) => v.relation === 'covers');
    after.append(el('section', { class: 'after-card' },
      el('h2', { text: covers ? L.videoH : L.videoRelated }),
      covers ? el('p', { text: L.videoP }) : null,
      el('ul', { class: 'video-links' }, ...lesson.videos.map((v) => el('li', {}, el('a', { href: v.url, target: '_blank', rel: 'noopener noreferrer' }, el('span', { text: `▶ ${v.title}` }), el('span', { text: '↗' })))))));
  }
  if (after.children.length) art.append(after);
  $('lv1').setAttribute('aria-pressed', lesson.level === 1); $('lv2').setAttribute('aria-pressed', lesson.level === 2); $('lv3').setAttribute('aria-pressed', lesson.level === 3);
  $('original').checked = !lesson.personalised && lesson.profile.enabled;
  applyProfile(lesson.profile);
}

function applyProfile(p) {
  if (!p) return;
  const L = t();
  const body = document.body;
  body.classList.remove('theme-sepia', 'theme-dark', 'theme-contrast');
  if (p.display.preset !== 'light') body.classList.add(`theme-${p.display.preset}`);
  body.classList.toggle('large', p.display.large);
  for (const btn of document.querySelectorAll('[data-preset]')) btn.setAttribute('aria-pressed', btn.dataset.preset === p.display.preset);
  $('large').checked = p.display.large;
  $('enabled').checked = p.enabled;
  $('why-list').replaceChildren(...(p.whyTailored.length ? p.whyTailored : [L.noWhy]).map((x) => el('li', { text: x })));
  $('why-foot').textContent = L.whyFoot(p.rulesVersion);
  const s = p.suggestions[0];
  const box = $('suggestion');
  if (!s) { box.hidden = true; return; }
  box.hidden = false;
  box.replaceChildren(
    el('span', { text: s.text }),
    el('button', { type: 'button', text: getLang() === 'bn' ? 'চালু করো' : 'Turn on', onclick: () => saveSetting({ display: s.apply }) }),
    el('button', { type: 'button', class: 'ghost', text: getLang() === 'bn' ? 'না, ধন্যবাদ' : 'No thanks', onclick: () => { box.hidden = true; } }),
  );
}

async function saveSetting(change) {
  push({ type: 'setting', ...change });
  await flush();
}

// ── interactive blocks (never personalised) ─────────────────────────────────
function widget(b) {
  const L = t();
  const box = el('div', { class: 'widget', 'data-block': b.id });
  box.append(el('p', { class: 'w-title', text: b.text }));
  if (b.interactive === 'margin_calculator') {
    const cost = 800, list = 1000;
    const slider = el('input', { type: 'range', min: '0', max: '30', step: '1', value: '10', 'aria-label': L.calc.disc });
    const out = el('div', { class: 'w-row' });
    const verdict = el('p', { class: 'verdict' });
    const draw = () => {
      const d = Number(slider.value);
      const sale = (list * (100 - d)) / 100;
      const profit = sale - cost;
      const margin = sale > 0 ? (profit / sale) * 100 : 0;
      const stat = (k, v) => el('div', { class: 'w-stat' }, k, el('b', { text: v }));
      out.replaceChildren(
        stat(`${L.calc.disc}`, bnDigits(`${d}%`)), stat(L.calc.sale, bnDigits(`৳${sale}`)),
        stat(L.calc.profit, bnDigits(`৳${profit}`)), stat(L.calc.margin, bnDigits(`${margin.toFixed(1)}%`)),
      );
      const ok = margin >= 15;
      verdict.className = `verdict ${ok ? 'ok' : 'no'}`;
      verdict.textContent = `${L.calc.rule} · ${ok ? L.calc.ok : L.calc.no}`;
    };
    slider.addEventListener('input', draw);
    box.append(el('p', { class: 'muted small', text: bnDigits(`${L.calc.cost} ৳${cost} · ${L.calc.list} ৳${list}`) }), slider, out, verdict);
    draw();
  } else if (b.interactive === 'threshold_slider') {
    const emails = [[0.9, true], [0.65, true], [0.55, false], [0.4, true], [0.2, false]];
    const slider = el('input', { type: 'range', min: '0.05', max: '0.95', step: '0.05', value: '0.5', 'aria-label': L.thr.thr });
    const row = el('div', { class: 'emails' });
    const out = el('div', { class: 'w-row' });
    const draw = () => {
      const th = Number(slider.value);
      let fp = 0, fn = 0, flagged = 0;
      row.replaceChildren(...emails.map(([score, spam]) => {
        const flag = score >= th;
        if (flag) flagged++;
        if (flag && !spam) fp++;
        if (!flag && spam) fn++;
        return el('div', { class: `email ${flag ? 'flag' : ''}` }, el('span', { class: 'tag', text: bnDigits(score.toFixed(2)) }), spam ? L.thr.spam : L.thr.notSpam);
      }));
      const stat = (k, v) => el('div', { class: 'w-stat' }, k, el('b', { text: bnDigits(v) }));
      out.replaceChildren(stat(L.thr.thr, th.toFixed(2)), stat(L.thr.flagged, flagged), stat(L.thr.fp, fp), stat(L.thr.fn, fn));
    };
    slider.addEventListener('input', draw);
    box.append(slider, row, out);
    draw();
  }
  return box;
}

// ── selection → help ────────────────────────────────────────────────────────
const pop = $('sel-pop');
function selectionInfo() {
  const sel = getSelection();
  if (!sel || sel.isCollapsed) return null;
  const text = sel.toString().trim();
  if (text.length < 2 || text.length > 600) return null;
  const a = sel.anchorNode?.parentElement?.closest('[data-block]');
  const f = sel.focusNode?.parentElement?.closest('[data-block]');
  const block = a ?? f;
  if (!block || !$('article').contains(block)) return null;
  return { blockId: block.dataset.block, text, rect: sel.getRangeAt(0).getBoundingClientRect() };
}
function maybeShowPop() {
  const info = selectionInfo();
  if (!info) { pop.hidden = true; return; }
  pop.hidden = false;
  const top = info.rect.top + scrollY - pop.offsetHeight - 8;
  const left = Math.min(Math.max(8, info.rect.left + scrollX + info.rect.width / 2 - pop.offsetWidth / 2), innerWidth - pop.offsetWidth - 8);
  pop.style.top = `${Math.max(8, top)}px`;
  pop.style.left = `${left}px`;
  pop.dataset.block = info.blockId;
  pop.dataset.text = info.text;
}
document.addEventListener('mouseup', () => setTimeout(maybeShowPop, 0));
document.addEventListener('keyup', (e) => { if (e.shiftKey) maybeShowPop(); });
document.addEventListener('selectionchange', () => { if (!getSelection()?.toString()) pop.hidden = true; });
document.addEventListener('touchend', () => setTimeout(maybeShowPop, 250));
pop.addEventListener('mousedown', (e) => e.preventDefault());
for (const b of pop.querySelectorAll('button')) b.addEventListener('click', () => { pop.hidden = true; openHelp(pop.dataset.block, pop.dataset.text, b.dataset.action); });
document.addEventListener('click', (e) => { if (e.target.classList?.contains('term')) openHelp(e.target.closest('[data-block]').dataset.block, e.target.textContent, 'understand'); });

function openHelp(blockId, text, action) {
  current = { blockId, text };
  for (const n of document.querySelectorAll('.block.selected')) n.classList.remove('selected');
  document.querySelector(`[data-block="${CSS.escape(blockId)}"]`)?.classList.add('selected');
  $('sidebar').hidden = false;
  $('layout').classList.add('open');
  $('side-quote').textContent = text.length > 160 ? `${text.slice(0, 157)}…` : text;
  ask({ action });
}

$('side-close').onclick = () => {
  $('sidebar').hidden = true;
  $('layout').classList.remove('open');
  for (const n of document.querySelectorAll('.block.selected')) n.classList.remove('selected');
};
for (const b of document.querySelectorAll('.side-actions button')) b.addEventListener('click', () => ask({ action: b.dataset.action }));

async function ask(extra) {
  if (!current) return;
  currentAction = extra.action ?? currentAction;
  for (const b of document.querySelectorAll('.side-actions button')) b.setAttribute('aria-pressed', b.dataset.action === currentAction);
  const body = $('side-body');
  body.replaceChildren(el('p', { class: 'loading', text: t().loading }));
  lastRequest = { lessonId, blockId: current.blockId, text: current.text, lang: getLang(), ...extra, action: currentAction };
  try {
    const r = await api('POST', '/api/selection-help', lastRequest);
    renderHelp(r);
  } catch (e) {
    body.replaceChildren(el('p', { class: 'refresher', text: e instanceof ApiError && e.code === 'assessment_open' ? t().sealed : e.message }));
  }
}

function sourceList(sources) {
  const L = t();
  if (!sources?.length) return null;
  return el('div', {},
    el('h3', { text: L.sources }),
    el('ul', { class: 'sources' }, ...sources.map((s) => el('li', {},
      s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', text: s.title }) : el('strong', { text: s.title }),
      ` · ${s.live ? `${L.live}${s.retrievedAt ? `, ${L.retrieved} ${new Date(s.retrievedAt).toLocaleDateString()}` : ''}` : `${s.location}${s.reviewed ? ` · ${L.reviewed}` : ''}`}`,
      s.text ? el('span', { class: 'src-text', text: s.text.length > 220 ? `${s.text.slice(0, 217)}…` : s.text }) : null,
    ))));
}

function feedbackRow() {
  const L = t();
  const row = el('div', { class: 'fb' }, L.fb);
  for (const [v, label] of Object.entries(L.fbv)) {
    row.append(el('button', { type: 'button', text: label, onclick: async () => {
      try {
        const r = await api('POST', '/api/selection-help/feedback', { lessonId, blockId: current.blockId, value: v, lang: getLang() });
        row.replaceChildren(el('span', { text: L.thanks }));
        applyProfile(r.profile);
        if (v !== 'just_right') load();
      } catch (e) { row.append(el('span', { text: e.message })); }
    } }));
  }
  return row;
}

function renderHelp(r) {
  const L = t();
  const body = $('side-body');
  if (r.kind === 'message') return body.replaceChildren(el('p', { class: 'answer', text: r.text }));
  if (r.kind === 'prereq') {
    let depth;
    const nodes = [el('h3', { text: L.prereqTitle }), el('p', { text: r.question })];
    if (r.askDepth) {
      const dRow = el('div', { class: 'chips', role: 'group', 'aria-label': L.depthQ }, el('span', { class: 'small muted', text: L.depthQ }));
      for (const [k, label] of Object.entries(r.depthOptions)) {
        const b = el('button', { type: 'button', text: label, 'aria-pressed': 'false', onclick: () => { depth = k; for (const x of dRow.querySelectorAll('button')) x.setAttribute('aria-pressed', x === b); } });
        dRow.append(b);
      }
      nodes.push(dRow);
    }
    nodes.push(el('div', { class: 'opts' }, ...r.options.map((o, i) => el('button', { type: 'button', text: o, onclick: () => ask({ action: 'understand', prereqAnswer: i, depth }) }))));
    nodes.push(el('button', { type: 'button', class: 'linkish', text: L.skip, onclick: () => ask({ action: 'understand', skipPrereq: true, depth }) }));
    return body.replaceChildren(...nodes);
  }
  if (r.kind === 'quiz') {
    const opts = el('div', { class: 'opts' });
    const result = el('p', { class: 'answer' });
    r.options.forEach((o, i) => opts.append(el('button', { type: 'button', text: o, onclick: async () => {
      try {
        const c = await api('POST', '/api/quiz/check', { lessonId, blockId: r.blockId, choice: i, lang: getLang() });
        for (const [j, btn] of [...opts.children].entries()) { btn.disabled = true; if (j === c.answer) btn.classList.add('right'); else if (j === i) btn.classList.add('wrong'); }
        result.textContent = `${c.correct ? L.quizRight : L.quizWrong} ${c.explanation}`;
        applyProfile(c.profile);
      } catch (e) { result.textContent = e.message; }
    } })));
    return body.replaceChildren(el('p', { text: r.question }), opts, result);
  }
  if (r.kind === 'search') {
    const nodes = [el('p', { class: 'answer', text: r.summary }), sourceList(r.results)];
    if (r.liveAvailable && !r.liveUsed) nodes.push(el('button', { type: 'button', class: 'secondary', text: L.latest, onclick: () => ask({ action: 'search', latest: true }) }));
    if (!r.liveAvailable) nodes.push(el('p', { class: 'small muted', text: L.noLive }));
    return body.replaceChildren(...nodes.filter(Boolean));
  }
  // answer
  const nodes = [el('span', { class: `badge ${r.origin === 'ai_checked' ? 'ai' : ''}`, text: L.origin[r.origin] ?? r.origin })];
  if (r.title) nodes.push(el('h3', { text: r.title }));
  nodes.push(el('p', { class: 'answer', text: r.text }));
  if (r.refresher) nodes.push(el('div', { class: 'refresher' }, el('b', { text: `${L.refresher}: ` }), r.refresher));
  nodes.push(sourceList(r.sources));
  nodes.push(el('div', { class: 'chips' }, ...(r.chips ?? []).map((c) => el('button', { type: 'button', text: L.chips[c] ?? c, onclick: () => (c === 'quiz' ? ask({ action: 'quiz' }) : ask({ action: 'understand', variant: c })) }))));
  nodes.push(feedbackRow());
  body.replaceChildren(...nodes.filter(Boolean));
  if (r.profile) applyProfile(r.profile);
}

// ── toolbar ─────────────────────────────────────────────────────────────────
function togglePop(btn, panel) {
  const open = panel.hidden;
  for (const [b, p] of [[$('display-btn'), $('display-menu')], [$('why-btn'), $('why-panel')]]) { p.hidden = true; b.setAttribute('aria-expanded', 'false'); }
  panel.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  if (open) panel.style.top = `${btn.getBoundingClientRect().bottom + scrollY + 6}px`;
}
$('display-btn').onclick = () => togglePop($('display-btn'), $('display-menu'));
$('why-btn').onclick = () => togglePop($('why-btn'), $('why-panel'));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { $('display-menu').hidden = true; $('why-panel').hidden = true; pop.hidden = true; } });
for (const b of document.querySelectorAll('[data-preset]')) b.onclick = () => saveSetting({ display: { preset: b.dataset.preset } });
$('large').onchange = (e) => saveSetting({ display: { large: e.target.checked } });
$('enabled').onchange = async (e) => { await saveSetting({ enabled: e.target.checked }); load(); };
$('original').onchange = () => load();
for (const b of document.querySelectorAll('[data-level]')) b.onclick = async () => { await saveSetting({ level: Number(b.dataset.level) }); $('original').checked = false; load(); };
$('lesson-pick').onchange = (e) => { flush(); lessonId = e.target.value; history.replaceState(null, '', `?id=${lessonId}`); load(); };

async function load() {
  const original = $('original').checked ? '&original=1' : '';
  lesson = await api('GET', `/api/lessons/${encodeURIComponent(lessonId)}?lang=${getLang()}${original}`);
  document.title = `${lesson.title} · Loop & Logic`;
  renderLesson();
}

async function boot() {
  await ensureSignedIn();
  const cfg = await getConfig();
  const pick = $('lesson-pick');
  const fill = () => pick.replaceChildren(...cfg.lessons.map((l) => el('option', { value: l.id, text: l.title[getLang()], selected: l.id === lessonId })));
  fill();
  chrome();
  const loadCourses = async () => { try { courses = (await fetch(`/api/courses?lang=${getLang()}`).then((r) => r.json())).courses; } catch { courses = []; } };
  await loadCourses();
  mountNav('courses', async () => { chrome(); fill(); await loadCourses(); await load(); if (current && !$('sidebar').hidden) ask({ action: currentAction }); });
  const h = new Date().getHours();
  if (h >= 23 || h < 5) { try { if (!sessionStorage.getItem('ll_late')) { sessionStorage.setItem('ll_late', '1'); push({ type: 'late_read' }); } } catch { /* none */ } }
  try { await load(); } catch (e) { $('article').replaceChildren(el('p', { text: e.message })); }
  push({ type: 'view' });
  flush();
}
boot();
