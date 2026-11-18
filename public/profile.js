// Profile & settings: preferences, what the system learned (with reasons), data controls.
import { api, getConfig, getLang, setLang, applyI18n, mountNav, el, num, errorBox, ensureSignedIn, toast, store } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    title: 'Profile & settings', sub: 'Your preferences, everything the platform has learned about how you read, and your data.',
    account: 'Account', signedInAs: 'Signed in as', anon: 'Guest on this browser', anonSub: 'Progress is kept for this browser only. Sign-in arrives with the full launch.', signOut: 'Sign out',
    prefs: 'Preferences', lang: 'Language', langSub: 'Lessons, answers and pages', style: 'Page style', styleSub: 'Colours only — never content',
    large: 'Larger text', largeSub: 'Bigger lesson text', adapt: 'Adapt lessons to me', adaptSub: 'Off = everyone sees the standard version',
    level: 'Reading level', levelSub: 'You can change it any time; the page may also suggest a change', levels: { 1: 'Simpler', 2: 'Standard', 3: 'Deeper' },
    presets: { light: 'Light', sepia: 'Sepia', dark: 'Dark', contrast: 'High contrast' },
    learned: 'What the platform has learned', learnedSub: 'Built only from your reading on these pages: what you asked about, quiz answers and the settings you chose. No personality or learning-style labels.',
    weak: 'Worth another look', known: 'Shown you know', none: 'Nothing yet', termHelp: 'Term help on',
    why: 'Every change, with its reason', noReasons: 'No changes yet. The platform starts everyone at the standard version.', rules: (v) => `Rules version: ${v}`,
    data: 'Your data', dataSub: (r, s, a) => `${r} reading events · ${s} practice sessions · ${a} practice attempts`,
    download: 'Download my data (JSON)', resetReading: 'Reset reading profile', resetPractice: 'Delete practice history',
    confirmReading: 'Reset your reading profile? Lessons go back to the standard version and your reading history is deleted. This can’t be undone.',
    confirmPractice: 'Delete all practice sessions and evidence receipts? This can’t be undone.',
    doneReading: 'Reading profile reset.', donePractice: 'Practice history deleted.', saved: 'Saved',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    title: 'প্রোফাইল ও সেটিং', sub: 'তোমার পছন্দ, তুমি কীভাবে পড়ো সে বিষয়ে প্ল্যাটফর্ম যা শিখেছে, আর তোমার ডেটা।',
    account: 'অ্যাকাউন্ট', signedInAs: 'সাইন ইন করা আছে', anon: 'এই ব্রাউজারে অতিথি', anonSub: 'অগ্রগতি শুধু এই ব্রাউজারে থাকে। পূর্ণ সংস্করণে সাইন-ইন আসছে।', signOut: 'সাইন আউট',
    prefs: 'পছন্দ', lang: 'ভাষা', langSub: 'পাঠ, উত্তর আর পাতা', style: 'পাতার ধরন', styleSub: 'শুধু রং — লেখা কখনো নয়',
    large: 'বড় লেখা', largeSub: 'পাঠের লেখা বড়', adapt: 'পাঠ আমার মতো করে সাজাও', adaptSub: 'বন্ধ = সবাই সাধারণ সংস্করণ দেখবে',
    level: 'পড়ার স্তর', levelSub: 'যেকোনো সময় বদলাতে পারো; পাতাও পরিবর্তনের পরামর্শ দিতে পারে', levels: { 1: 'সহজ', 2: 'সাধারণ', 3: 'গভীর' },
    presets: { light: 'আলো', sepia: 'সেপিয়া', dark: 'অন্ধকার', contrast: 'উচ্চ কনট্রাস্ট' },
    learned: 'প্ল্যাটফর্ম যা শিখেছে', learnedSub: 'শুধু এই পাতাগুলোতে তোমার পড়া থেকে তৈরি: কী নিয়ে প্রশ্ন করেছ, কুইজের উত্তর আর তোমার বেছে নেওয়া সেটিং। কোনো ব্যক্তিত্ব বা শেখার ধরনের লেবেল নয়।',
    weak: 'আরেকবার দেখা ভালো', known: 'যা জানো বলে দেখিয়েছ', none: 'এখনো কিছু নেই', termHelp: 'শব্দের ব্যাখ্যা চালু',
    why: 'প্রতিটি পরিবর্তন, কারণসহ', noReasons: 'এখনো কোনো পরিবর্তন নেই। প্ল্যাটফর্ম সবাইকে সাধারণ সংস্করণে শুরু করায়।', rules: (v) => `নিয়মের সংস্করণ: ${v}`,
    data: 'তোমার ডেটা', dataSub: (r, s, a) => `${r}টি পড়ার ইভেন্ট · ${s}টি অনুশীলন সেশন · ${a}টি অনুশীলনী চেষ্টা`,
    download: 'আমার ডেটা ডাউনলোড (JSON)', resetReading: 'পড়ার প্রোফাইল রিসেট', resetPractice: 'অনুশীলনের ইতিহাস মুছে ফেলো',
    confirmReading: 'পড়ার প্রোফাইল রিসেট করবে? পাঠ সাধারণ সংস্করণে ফিরবে আর পড়ার ইতিহাস মুছে যাবে। এটা ফেরানো যাবে না।',
    confirmPractice: 'সব অনুশীলন সেশন আর প্রমাণপত্র মুছে ফেলবে? এটা ফেরানো যাবে না।',
    doneReading: 'পড়ার প্রোফাইল রিসেট হয়েছে।', donePractice: 'অনুশীলনের ইতিহাস মুছে ফেলা হয়েছে।', saved: 'সেভ হয়েছে',
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const SUBJECT_LESSON = { business: 'margin-basics', ml: 'classification-threshold', cs: 'stack-queue', ee: 'ohms-law' };
let me = { email: null };
let cfg = null;

const row = (title, sub, control) => el('div', { class: 'set-row' }, el('div', {}, el('b', { text: title }), el('span', { text: sub })), el('div', {}, control));
function seg(options, current, onPick, label) {
  return el('div', { class: 'segbtn', role: 'group', 'aria-label': label }, ...options.map(([v, text]) =>
    el('button', { type: 'button', 'aria-pressed': String(v === current), text, onclick: () => onPick(v) })));
}

async function setting(change, lessonId = 'margin-basics') {
  await api('POST', '/api/reading-events', { events: [{ type: 'setting', lessonId, ...change }] });
  toast(t().saved);
  await load();
}

// Two-step confirm inside the page (no browser dialogs).
function confirmButton(label, question, action) {
  const box = el('div', {});
  const start = () => box.replaceChildren(el('button', { type: 'button', class: 'btn danger', text: label, onclick: ask }));
  const ask = () => box.replaceChildren(el('div', { class: 'alert' },
    el('p', { style: 'margin:0 0 10px', text: question }),
    el('div', { class: 'row', style: 'margin:0' },
      el('button', { type: 'button', class: 'btn danger', text: label, onclick: action }),
      el('button', { type: 'button', class: 'btn ghost', text: getLang() === 'bn' ? 'বাতিল' : 'Cancel', onclick: start }))));
  start();
  return box;
}

function render(p) {
  const L = t();
  applyI18n(L);
  document.title = `${L.title} · Loop & Logic`;

  const account = el('section', { class: 'card' }, el('div', { class: 'card-head' }, el('h2', { text: L.account })));
  if (cfg.authMode === 'supabase' && me.email) {
    account.append(el('p', { text: `${L.signedInAs} ${me.email}` }), el('button', { type: 'button', class: 'btn ghost', text: L.signOut, onclick: () => { store.del('ll_token', 'session'); location.href = '/'; } }));
  } else {
    account.append(el('p', { style: 'margin:0', text: L.anon }), el('p', { class: 'muted small', text: L.anonSub }));
  }

  const prefs = el('section', { class: 'card settings' }, el('div', { class: 'card-head' }, el('h2', { text: L.prefs })),
    el('div', {},
      row(L.lang, L.langSub, seg([['en', 'English'], ['bn', 'বাংলা']], getLang(), async (v) => { setLang(v); mountNav('profile', load); await load(); }, L.lang)),
      row(L.style, L.styleSub, seg(Object.entries(L.presets), p.display.preset, (v) => setting({ display: { preset: v } }), L.style)),
      row(L.large, L.largeSub, el('label', { class: 'toggle' }, el('input', { type: 'checkbox', checked: p.display.large || null, onchange: (e) => setting({ display: { large: e.target.checked } }) }), L.large)),
      row(L.adapt, L.adaptSub, el('label', { class: 'toggle' }, el('input', { type: 'checkbox', checked: p.enabled || null, onchange: (e) => setting({ enabled: e.target.checked }) }), L.adapt)),
      ...p.levels.map((lv) => row(`${L.level} · ${lv.name}`, L.levelSub, seg(Object.entries(L.levels).map(([k, v]) => [Number(k), v]), lv.level, (v) => setting({ level: v }, SUBJECT_LESSON[lv.subject]), lv.name)))));

  const chipList = (items) => (items.length ? el('div', { class: 'chips-list' }, ...items.map((x) => el('span', { class: 'tag', text: x }))) : el('p', { class: 'muted small', style: 'margin:0', text: L.none }));
  const learned = el('section', { class: 'card' },
    el('div', { class: 'card-head' }, el('h2', { text: L.learned })),
    el('p', { class: 'muted small', text: L.learnedSub }),
    el('div', { class: 'learned' },
      el('div', { class: 'box' }, el('h3', { text: L.weak }), chipList(p.weakConcepts)),
      el('div', { class: 'box' }, el('h3', { text: L.known }), chipList(p.knownConcepts)),
      ...p.levels.map((lv) => el('div', { class: 'box' }, el('h3', { text: lv.name }), el('p', { style: 'margin:0', text: `${L.level}: ${lv.levelName}${lv.termHelp ? ` · ${L.termHelp}` : ''}` })))),
    el('h3', { style: 'margin:20px 0 10px;font-size:16px', text: L.why }),
    p.reasons.length
      ? el('ol', { class: 'timeline' }, ...p.reasons.map((r) => el('li', {}, el('time', { datetime: r.at, text: new Date(r.at).toLocaleString(getLang() === 'bn' ? 'bn-BD' : 'en-GB') }), r.text)))
      : el('p', { class: 'muted small', text: L.noReasons }),
    el('p', { class: 'muted small', style: 'margin-top:12px', text: L.rules(p.rulesVersion) }));

  const data = el('section', { class: 'card danger-zone' },
    el('div', { class: 'card-head' }, el('h2', { text: L.data })),
    el('p', { class: 'muted small', text: L.dataSub(num(p.data.readingEvents), num(p.data.practiceSessions), num(p.data.practiceAttempts)) }),
    el('div', { class: 'row' },
      el('button', { type: 'button', class: 'btn secondary', text: L.download, onclick: download }),
      confirmButton(L.resetReading, L.confirmReading, () => reset('reading', L.doneReading)),
      confirmButton(L.resetPractice, L.confirmPractice, () => reset('practice', L.donePractice))));

  main.replaceChildren(el('div', { class: 'page-head' }, el('h1', { text: L.title }), el('p', { text: L.sub })), account, prefs, learned, data);
}

async function download() {
  const data = await api('GET', '/api/profile/export');
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const a = el('a', { href: url, download: `loop-logic-my-data-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function reset(scope, done) {
  try { await api('POST', '/api/profile/reset', { scope }); toast(done); } catch (e) { toast(e.message); }
  if (scope === 'practice') { try { localStorage.removeItem('ll_session'); } catch { /* none */ } }
  await load();
}

async function load() {
  try {
    [cfg, me] = await Promise.all([getConfig(), api('GET', '/api/me')]);
    render(await api('GET', `/api/profile?lang=${getLang()}`));
  } catch (e) { errorBox(main, e.message, load); }
}

await ensureSignedIn();
mountNav('profile', load);
applyI18n(t());
load();
