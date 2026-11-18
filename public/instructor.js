// Instructor dashboard: class-level patterns only, small groups hidden.
import { api, ApiError, getConfig, getLang, mountNav, el, store } from './common.js';

const $ = (id) => document.getElementById(id);
const T = {
  en: {
    refresh: 'Refresh', 'key-label': 'Instructor key', 'key-go': 'Open', title: 'Class overview', seed: 'Add labelled demo learners',
    'h-diff': 'Where learners go wrong', 'p-diff': 'Practice mistakes, by the reason the system found.',
    'h-help': 'Help: did it carry over?', 'p-help': 'Correct with help vs. on their own; then the sealed check with no help.',
    'h-heat': 'Paragraphs learners ask about most', 'p-heat': 'Use this to rewrite the passages that confuse people.',
    'h-ai': 'AI use and cost', 'p-ai': 'Every AI call is logged. Answers that fail the checks fall back to reviewed text.',
    foot: 'Groups smaller than the privacy minimum are hidden. Demo learners are labelled as synthetic.',
    subtitle: (o) => `Updated ${new Date(o.generatedAt).toLocaleTimeString()} · groups under ${o.minGroup} learners are hidden`,
    synthetic: (n, all) => `${n} of ${all} learners are synthetic demo learners, made by the seed button. Don't read them as real results.`,
    k: { learners: 'Learners', attempts: 'Practice attempts', help: 'Help requests', sealed: 'Sealed checks passed' },
    ofSubmitted: (p, s) => `${p} of ${s} submitted`,
    indep: 'Correct on their own', assisted: 'Correct with help', passed: 'Passed sealed check', failed: 'Missed sealed check',
    hidden: 'Hidden — fewer learners than the privacy minimum.', none: 'No data yet. Use the class, or add demo learners.',
    cols: ['Lesson', 'Paragraph', 'Look-ups'],
    ai: { calls: 'AI answers generated', cache: 'Served from cache', fb: 'Fell back to reviewed text', tokens: 'Tokens (in / out)', latency: 'Average wait', live: 'Live searches (cached)' },
    keyMsg: 'Wrong key, try again.', seeded: (n) => `Added ${n} synthetic learners.`, noSeed: 'Demo seeding is turned off on this server.',
    diag: { ai_over_reliance: 'Followed the AI without checking', margin_markup_confusion: 'Confused markup with margin', missed_constraint: 'Ignored the shop’s rule', arithmetic_slip: 'Arithmetic slip', uncertain: 'Unclear — needs a look' },
  },
  bn: {
    refresh: 'রিফ্রেশ', 'key-label': 'শিক্ষক কী', 'key-go': 'খোলো', title: 'ক্লাসের সারসংক্ষেপ', seed: 'চিহ্নিত ডেমো শিক্ষার্থী যোগ করো',
    'h-diff': 'শিক্ষার্থীরা কোথায় ভুল করে', 'p-diff': 'অনুশীলনের ভুল, সিস্টেম যে কারণ খুঁজে পেয়েছে সে অনুযায়ী।',
    'h-help': 'সাহায্য কি কাজে লাগল?', 'p-help': 'সাহায্য নিয়ে বনাম নিজে ঠিক; তারপর সাহায্য ছাড়া বন্ধ যাচাই।',
    'h-heat': 'যে অনুচ্ছেদ নিয়ে সবচেয়ে বেশি প্রশ্ন', 'p-heat': 'যে অংশ বিভ্রান্ত করে, সেগুলো নতুন করে লিখতে এটা ব্যবহার করো।',
    'h-ai': 'এআই ব্যবহার ও খরচ', 'p-ai': 'প্রতিটি এআই কল লগ হয়। যাচাইয়ে ব্যর্থ উত্তরের বদলে পর্যালোচিত লেখা দেখানো হয়।',
    foot: 'গোপনীয়তার ন্যূনতম সংখ্যার চেয়ে ছোট দল লুকানো থাকে। ডেমো শিক্ষার্থীদের সিনথেটিক হিসেবে চিহ্নিত করা হয়।',
    subtitle: (o) => `হালনাগাদ ${new Date(o.generatedAt).toLocaleTimeString()} · ${o.minGroup} জনের কম দল লুকানো`,
    synthetic: (n, all) => `${all} জনের মধ্যে ${n} জন সিনথেটিক ডেমো শিক্ষার্থী। এগুলোকে আসল ফল হিসেবে পড়বে না।`,
    k: { learners: 'শিক্ষার্থী', attempts: 'অনুশীলনের চেষ্টা', help: 'সাহায্যের অনুরোধ', sealed: 'বন্ধ যাচাইয়ে পাস' },
    ofSubmitted: (p, s) => `${s} জন জমা দিয়েছে, ${p} জন পাস`,
    indep: 'নিজে ঠিক', assisted: 'সাহায্য নিয়ে ঠিক', passed: 'বন্ধ যাচাইয়ে পাস', failed: 'বন্ধ যাচাইয়ে ভুল',
    hidden: 'লুকানো — গোপনীয়তার ন্যূনতম সংখ্যার চেয়ে কম শিক্ষার্থী।', none: 'এখনো ডেটা নেই। ক্লাস ব্যবহার করো, বা ডেমো শিক্ষার্থী যোগ করো।',
    cols: ['পাঠ', 'অনুচ্ছেদ', 'প্রশ্ন'],
    ai: { calls: 'এআই উত্তর তৈরি', cache: 'ক্যাশ থেকে', fb: 'পর্যালোচিত লেখায় ফেরা', tokens: 'টোকেন (ইন / আউট)', latency: 'গড় অপেক্ষা', live: 'লাইভ খোঁজ (ক্যাশ)' },
    keyMsg: 'ভুল কী, আবার চেষ্টা করো।', seeded: (n) => `${n} জন সিনথেটিক শিক্ষার্থী যোগ হয়েছে।`, noSeed: 'এই সার্ভারে ডেমো যোগ করা বন্ধ।',
    diag: { ai_over_reliance: 'যাচাই না করে এআই-এর কথা মেনেছে', margin_markup_confusion: 'মার্কআপ আর মার্জিন গুলিয়েছে', missed_constraint: 'দোকানের নিয়ম খেয়াল করেনি', arithmetic_slip: 'হিসাবের ছোট ভুল', uncertain: 'অস্পষ্ট — দেখা দরকার' },
  },
};
const t = () => T[getLang()];
const keyHeader = () => { const k = store.get('ll_ikey', 'session'); return k ? { 'x-instructor-key': k } : {}; };
let data = null;
let lessonTitles = {};

function chrome() {
  document.documentElement.lang = getLang();
  for (const [id, v] of Object.entries(t())) { const n = $(id); if (n && typeof v === 'string') n.textContent = v; }
}

const kpi = (label, value, note) => el('div', { class: 'kpi' }, el('span', { text: label }), el('b', { text: value ?? '—' }), note ? el('small', { text: note }) : null);
function bars(rows, max) {
  return rows.map(([label, value, alt]) => el('div', { class: 'bar-row' },
    el('span', { text: label }),
    el('div', { class: `bar ${alt ? 'alt' : ''}` }, el('i', { style: `width:${max ? Math.round((value / max) * 100) : 0}%` })),
    el('span', { class: 'num', text: value })));
}

function render() {
  const L = t();
  const o = data;
  $('subtitle').textContent = L.subtitle(o);
  const syn = $('synthetic');
  syn.hidden = !o.syntheticLearners;
  syn.textContent = L.synthetic(o.syntheticLearners, o.learners);

  $('kpis').replaceChildren(
    kpi(L.k.learners, o.learners),
    kpi(L.k.attempts, o.practice.attempts),
    kpi(L.k.help, o.practice.helpRequests),
    kpi(L.k.sealed, o.sealed.submitted ? `${Math.round((o.sealed.passed / o.sealed.submitted) * 100)}%` : '—', L.ofSubmitted(o.sealed.passed, o.sealed.submitted)),
  );

  const diff = $('difficulties');
  if (!o.difficulties.length) diff.replaceChildren(el('p', { class: 'hidden-note', text: L.none }));
  else {
    const shown = o.difficulties.filter((d) => !d.suppressed);
    const max = Math.max(1, ...shown.map((d) => d.value));
    diff.replaceChildren(...bars(shown.map((d) => [L.diag[d.code] ?? d.code, d.value]), max));
    const hiddenCount = o.difficulties.length - shown.length;
    if (hiddenCount) diff.append(el('p', { class: 'hidden-note', text: `${hiddenCount} × ${L.hidden}` }));
  }

  const a = o.practice, s = o.sealed;
  const maxA = Math.max(1, a.independentCorrect, a.assistedCorrect, s.passed, s.submitted - s.passed);
  $('assist').replaceChildren(...bars([
    [L.indep, a.independentCorrect], [L.assisted, a.assistedCorrect, true],
    [L.passed, s.passed], [L.failed, s.submitted - s.passed, true],
  ], maxA));

  const rows = o.heatmap.filter((h) => h.value > 0 || h.suppressed).slice(0, 8);
  const heat = $('heatmap');
  if (!rows.length) heat.replaceChildren(el('p', { class: 'hidden-note', text: L.none }));
  else {
    const max = Math.max(1, ...rows.map((h) => h.value ?? 0));
    heat.replaceChildren(el('table', { class: 'heat' },
      el('thead', {}, el('tr', {}, ...L.cols.map((c) => el('th', { text: c })), el('th', {}))),
      el('tbody', {}, ...rows.map((h) => el('tr', {},
        el('td', { text: lessonTitles[h.lessonId]?.[getLang()] ?? h.lessonTitle }),
        el('td', { class: 'muted', text: `${h.preview}…` }),
        el('td', { class: 'cnt', text: h.suppressed ? '—' : h.value }),
        el('td', { class: 'cell' }, h.suppressed ? el('span', { class: 'hidden-note', text: L.hidden }) : el('div', { class: 'bar' }, el('i', { style: `width:${Math.round((h.value / max) * 100)}%` }))),
      )))));
  }

  const ai = o.ai;
  $('ai').replaceChildren(
    kpi(L.ai.calls, ai.calls),
    kpi(L.ai.cache, ai.cacheHits, ai.cacheHitRate === null ? null : `${ai.cacheHitRate}%`),
    kpi(L.ai.fb, ai.fallbacks, ai.fallbackRate === null ? null : `${ai.fallbackRate}%`),
    kpi(L.ai.tokens, `${ai.inputTokens.toLocaleString()} / ${ai.outputTokens.toLocaleString()}`),
    kpi(L.ai.latency, ai.avgLatencyMs === null ? '—' : `${(ai.avgLatencyMs / 1000).toFixed(1)} s`),
    kpi(L.ai.live, `${ai.liveSearches} (${ai.liveCacheHits})`),
  );
}

async function load() {
  try {
    data = await api('GET', '/api/instructor/overview', null, keyHeader());
    $('key-form').hidden = true;
    $('content').hidden = false;
    render();
  } catch (e) {
    if (e instanceof ApiError && (e.status === 403 || e.code === 'forbidden' || e.code === 'instructor_key')) {
      $('content').hidden = true;
      $('key-form').hidden = false;
      if (store.get('ll_ikey', 'session')) $('key-msg').textContent = t().keyMsg;
    } else {
      $('content').hidden = false;
      $('subtitle').textContent = e.message;
    }
  }
}

$('key-form').addEventListener('submit', (e) => { e.preventDefault(); store.set('ll_ikey', $('key').value, 'session'); load(); });
$('refresh').onclick = load;
$('seed').onclick = async () => {
  try {
    const r = await api('POST', '/api/instructor/seed-demo', {}, keyHeader());
    await load();
    $('subtitle').textContent = `${t().seeded(r.created)} ${$('subtitle').textContent}`;
  } catch (e) { $('subtitle').textContent = e.code === 'forbidden' ? t().noSeed : e.message; }
};

(async () => {
  const cfg = await getConfig();
  lessonTitles = Object.fromEntries(cfg.lessons.map((l) => [l.id, l.title]));
  chrome();
  mountNav('instructor', () => { chrome(); if (data) render(); });
  if (cfg.instructorKeyRequired && !store.get('ll_ikey', 'session')) { $('key-form').hidden = false; return; }
  load();
})();
