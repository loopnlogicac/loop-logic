// "Ask AI" on every learning page: a chat box (bottom-right button) and an
// "Ask AI" button that appears when the learner selects text. Answers come
// from reviewed notes, the instructor's materials and approved websites.
import { api, getLang, el } from './common.js';

const T = {
  en: {
    open: 'Ask AI', title: 'Ask AI', sub: 'Answers come from reviewed notes, instructor materials and approved websites.',
    placeholder: 'Ask anything about this page…', send: 'Send', close: 'Close', thinking: 'Finding a checked answer…',
    selected: 'Selected text', removeSel: 'Remove selected text', askSel: '✨ Ask AI', left: (n) => `${n} AI answers left today`,
    checked: 'Checked against sources', reviewed: 'From reviewed notes', none: 'No checked answer', sources: 'Sources', web: 'website',
    hello: 'Hi! Ask a question about this page, or select any text and press “Ask AI”.', paused: 'Help is paused during a sealed check.',
    explain: 'Explain this', example: 'Give an example', simpler: 'Say it more simply', clear: 'Clear chat', whereFrom: 'Where answers come from',
    checkIntro: 'Quick check first, so I can pitch the explanation at the right level:', skip: 'Skip', right: '✓ Right. I’ll keep the explanation short and precise.', wrong: '✗ Not quite. I’ll explain it in simpler steps.',
    styled: { simpler: 'Simpler wording', concise: 'Short and precise' },
  },
  bn: {
    open: 'এআই-কে জিজ্ঞেস করো', title: 'এআই-কে জিজ্ঞেস করো', sub: 'উত্তর আসে পর্যালোচিত নোট, শিক্ষকের উপকরণ আর অনুমোদিত ওয়েবসাইট থেকে।',
    placeholder: 'এই পেজ নিয়ে যেকোনো প্রশ্ন লেখো…', send: 'পাঠাও', close: 'বন্ধ', thinking: 'যাচাই করা উত্তর খোঁজা হচ্ছে…',
    selected: 'নির্বাচিত অংশ', removeSel: 'নির্বাচিত অংশ সরাও', askSel: '✨ এআই-কে জিজ্ঞেস', left: (n) => `আজ আরও ${n}টি এআই উত্তর বাকি`,
    checked: 'উৎসের সঙ্গে যাচাই করা', reviewed: 'পর্যালোচিত নোট থেকে', none: 'যাচাই করা উত্তর নেই', sources: 'উৎস', web: 'ওয়েবসাইট',
    hello: 'হাই! এই পেজ নিয়ে প্রশ্ন করো, অথবা যেকোনো লেখা সিলেক্ট করে “এআই-কে জিজ্ঞেস” চাপো।', paused: 'বন্ধ যাচাই চলার সময় সাহায্য বন্ধ থাকে।',
    explain: 'এটা বুঝিয়ে বলো', example: 'একটা উদাহরণ দাও', simpler: 'আরও সহজ করে বলো', clear: 'চ্যাট মুছো', whereFrom: 'উত্তর কোথা থেকে আসে',
    checkIntro: 'আগে একটা ছোট যাচাই, যাতে ঠিক স্তরে বুঝিয়ে বলতে পারি:', skip: 'বাদ দাও', right: '✓ ঠিক। ব্যাখ্যা ছোট আর নির্ভুল রাখছি।', wrong: '✗ পুরোপুরি না। সহজ ধাপে বুঝিয়ে বলছি।',
    styled: { simpler: 'সহজ ভাষায়', concise: 'ছোট ও নির্ভুল' },
  },
};
const t = () => T[getLang()];

// stylesheet for the widget (CSP allows same-origin styles)
document.head.append(el('link', { rel: 'stylesheet', href: '/ask.css' }));

function pageContext() {
  const q = new URLSearchParams(location.search);
  const path = location.pathname;
  if (path.endsWith('/watch.html')) return { kind: 'video', courseId: q.get('course'), videoId: q.get('v') };
  if (path.endsWith('/course.html')) return { kind: 'course', courseId: q.get('id') };
  if (path.endsWith('/lesson.html')) return { kind: 'lesson', lessonId: q.get('id') };
  if (path.endsWith('/lab.html')) return { kind: 'lab', lessonId: q.get('id') };
  if (path.endsWith('/learn.html') && q.get('topic')) return { kind: 'tutorial', track: q.get('track'), topic: q.get('topic') };
  return { kind: 'page' };
}

const state = { open: false, busy: false, selection: '', history: [], left: null };

const fab = el('button', { class: 'ask-fab', type: 'button', 'aria-haspopup': 'dialog', onclick: () => toggle(true) });
const panel = el('section', { class: 'ask-panel', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'ask-title', hidden: true });
const log = el('div', { class: 'ask-log', 'aria-live': 'polite' });
const quote = el('div', { class: 'ask-quote', hidden: true });
const input = el('textarea', { rows: '2', maxlength: '500' });
const sendBtn = el('button', { class: 'btn primary small', type: 'button', onclick: () => send() });
const leftLine = el('p', { class: 'ask-left' });
const chips = el('div', { class: 'ask-chips' });
const selBtn = el('button', { class: 'ask-sel', type: 'button', hidden: true });
document.body.append(fab, panel, selBtn);

input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

function chrome() {
  const L = t();
  fab.textContent = `✨ ${L.open}`;
  selBtn.textContent = L.askSel;
  input.placeholder = L.placeholder;
  input.setAttribute('aria-label', L.placeholder);
  sendBtn.textContent = L.send;
  chips.replaceChildren(...[L.explain, L.example, L.simpler].map((c) => el('button', { type: 'button', text: c, onclick: () => send(c) })));
  panel.replaceChildren(
    el('header', { class: 'ask-head' },
      el('div', {}, el('h2', { id: 'ask-title', text: `✨ ${L.title}` }), el('p', {}, `${L.sub} `, el('a', { href: '/sources.html', text: L.whereFrom }))),
      el('div', { class: 'ask-head-actions' },
        el('button', { class: 'linkish small', type: 'button', onclick: () => { state.history = []; renderLog(); }, text: L.clear }),
        el('button', { class: 'ask-x', type: 'button', 'aria-label': L.close, onclick: () => toggle(false), text: '×' }))),
    log, quote, chips,
    el('div', { class: 'ask-input' }, input, sendBtn),
    leftLine);
  renderLog();
  renderQuote();
  renderLeft();
}

function renderQuote() {
  const L = t();
  quote.hidden = !state.selection;
  chips.hidden = !state.selection;
  if (state.selection) {
    quote.replaceChildren(
      el('span', { class: 'ask-quote-label', text: L.selected }),
      el('span', { class: 'ask-quote-text', text: state.selection.length > 220 ? `${state.selection.slice(0, 217)}…` : state.selection }),
      el('button', { class: 'ask-x small', type: 'button', 'aria-label': L.removeSel, onclick: () => { state.selection = ''; renderQuote(); }, text: '×' }));
  }
}

function renderLeft() {
  leftLine.textContent = state.left === null ? '' : t().left(state.left);
}

function bubble(m) {
  const L = t();
  if (m.role === 'user') {
    return el('div', { class: 'ask-msg user' }, m.selection ? el('blockquote', { text: m.selection.length > 160 ? `${m.selection.slice(0, 157)}…` : m.selection }) : null, m.text ? el('p', { text: m.text }) : null);
  }
  if (m.pending) return el('div', { class: 'ask-msg bot pending', text: L.thinking });
  if (m.kind === 'check') {
    const q = m.question;
    return el('div', { class: 'ask-msg bot ask-check' },
      el('p', { class: 'small muted', text: L.checkIntro }),
      el('p', { class: 'ask-text', text: q.prompt }),
      q.code ? el('pre', { class: 'ask-code' }, el('code', { text: q.code })) : null,
      m.result ? el('p', { class: `ask-check-res ${m.result.correct ? 'ok' : 'bad'}`, text: m.result.correct ? L.right : L.wrong }) : el('div', { class: 'ask-check-opts' },
        ...q.options.map((o, k) => el('button', { type: 'button', text: o, disabled: m.busy || null, onclick: () => answerCheck(m, k) })),
        el('button', { type: 'button', class: 'linkish small', text: L.skip, disabled: m.busy || null, onclick: () => answerCheck(m, null) })));
  }
  const badge = { ai_checked: L.checked, reviewed: L.reviewed, none: L.none }[m.origin] ?? '';
  return el('div', { class: `ask-msg bot ${m.origin ?? ''}` },
    badge ? el('span', { class: `ask-badge ${m.origin}`, text: badge }) : null,
    el('p', { class: 'ask-text', text: m.text }),
    m.style && m.style !== 'standard' && m.origin === 'ai_checked' ? el('p', { class: 'ask-styled', text: L.styled[m.style] }) : null,
    m.sources?.length ? el('details', { class: 'ask-sources' }, el('summary', { text: `${L.sources} (${m.sources.length})` }),
      el('ul', {}, ...m.sources.map((s) => el('li', {}, s.url ? el('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', text: s.title }) : el('span', { text: s.title }),
        el('span', { class: 'muted', text: ` · ${s.live ? `${s.location} (${L.web})` : s.location}` }))))) : null);
}

function renderLog() {
  const msgs = state.history.length ? state.history : [{ role: 'assistant', origin: 'hello', text: t().hello }];
  log.replaceChildren(...msgs.map(bubble));
  log.scrollTop = log.scrollHeight;
}

function toggle(open) {
  state.open = open;
  panel.hidden = !open;
  fab.hidden = open;
  fab.setAttribute('aria-expanded', String(open));
  if (open) {
    if (state.left === null) api('GET', '/api/ask/limit').then((r) => { state.left = r.left; renderLeft(); }).catch(() => {});
    setTimeout(() => input.focus(), 0);
  } else fab.focus();
}

async function send(preset) {
  if (state.busy) return;
  const question = (preset ?? input.value).trim();
  const selection = state.selection;
  if (!question && !selection) return input.focus();
  state.busy = true;
  sendBtn.disabled = true;
  const prior = state.history.filter((m) => !m.pending && m.origin !== 'hello' && m.kind !== 'check').slice(-4).map((m) => ({ role: m.role, text: m.text }));
  const style = answerStyle();
  state.history.push({ role: 'user', text: question, selection });
  const pending = { role: 'assistant', pending: true };
  state.history.push(pending);
  if (!preset) input.value = '';
  state.selection = '';
  renderQuote();
  renderLog();
  try {
    const r = await api('POST', '/api/ask', { question, selection, history: prior, style, lang: getLang(), page: pageContext() });
    Object.assign(pending, { pending: false, origin: r.origin, text: r.text, sources: r.sources, style });
    state.left = r.left;
  } catch (e) {
    Object.assign(pending, { pending: false, origin: 'none', text: e.code === 'assessment_open' ? t().paused : e.message, sources: [] });
  } finally {
    state.busy = false;
    sendBtn.disabled = false;
    renderLog();
    renderLeft();
  }
}

// ── select text → "Ask AI" ──────────────────────────────────────────────────
function selectedText() {
  const sel = getSelection();
  if (!sel || sel.isCollapsed || !sel.rangeCount) return null;
  const text = sel.toString().replace(/\s+/g, ' ').trim();
  if (text.length < 2 || text.length > 600) return null;
  const node = sel.anchorNode?.nodeType === 1 ? sel.anchorNode : sel.anchorNode?.parentElement;
  // not inside forms, the chat itself, the instructor editor, or the lesson reader (it has its own)
  if (!node || node.closest('input, textarea, select, .ask-panel, .editor, #article')) return null;
  return { text, rect: sel.getRangeAt(0).getBoundingClientRect() };
}
function placeSelButton() {
  const s = selectedText();
  if (!s) { selBtn.hidden = true; return; }
  selBtn.hidden = false;
  selBtn.dataset.text = s.text;
  const top = s.rect.top + scrollY - selBtn.offsetHeight - 8;
  const left = Math.min(Math.max(8, s.rect.left + scrollX + s.rect.width / 2 - selBtn.offsetWidth / 2), scrollX + innerWidth - selBtn.offsetWidth - 8);
  selBtn.style.top = `${Math.max(scrollY + 8, top)}px`;
  selBtn.style.left = `${left}px`;
}
document.addEventListener('mouseup', () => setTimeout(placeSelButton, 0));
document.addEventListener('touchend', () => setTimeout(placeSelButton, 250));
document.addEventListener('keyup', (e) => { if (e.shiftKey) placeSelButton(); });
document.addEventListener('selectionchange', () => { if (!getSelection()?.toString()) selBtn.hidden = true; });
selBtn.addEventListener('mousedown', (e) => e.preventDefault()); // keep the selection
selBtn.addEventListener('click', async () => {
  state.selection = selBtn.dataset.text ?? '';
  selBtn.hidden = true;
  getSelection()?.removeAllRanges();
  if (!state.open) toggle(true);
  renderQuote();
  if (await askQuickCheck()) return;
  send(t().explain);
});

// ── quick check: before the first explanation on a tutorial topic, one question
// from that topic's quiz (graded on the server) decides how the answer is pitched ──
const checkKey = (c) => `ll-qc:${c.track}:${c.topic}`;
function topicStyle() {
  const c = pageContext();
  if (c.kind !== 'tutorial') return null;
  try { return localStorage.getItem(checkKey(c)); } catch { return state.checked?.[checkKey(c)] ?? null; }
}
function saveTopicStyle(c, style) {
  state.checked = { ...state.checked, [checkKey(c)]: style };
  try { localStorage.setItem(checkKey(c), style); } catch { /* kept for this page */ }
}
/** The page's chosen reading style wins; otherwise the quick-check result for this topic. */
function answerStyle() {
  const page = document.documentElement.dataset.readingStyle;
  if (page && page !== 'standard') return page;
  return topicStyle() ?? state.checked?.[checkKey(pageContext())] ?? 'standard';
}
async function askQuickCheck() {
  const c = pageContext();
  if (c.kind !== 'tutorial' || topicStyle() || state.checked?.[checkKey(c)]) return false;
  const path = `/api/learn/${encodeURIComponent(c.track)}/${encodeURIComponent(c.topic)}/quick-check`;
  const r = await api('GET', `${path}?lang=${getLang()}`).catch(() => null);
  if (!r?.question) { saveTopicStyle(c, 'standard'); return false; }
  state.history.push({ role: 'assistant', kind: 'check', question: r.question, path, ctx: c });
  renderLog();
  return true;
}
async function answerCheck(m, choice) {
  m.busy = true;
  renderLog();
  let style = 'standard';
  try {
    const r = await api('POST', m.path, choice === null ? { skip: true, lang: getLang() } : { id: m.question.id, choice, lang: getLang() });
    style = r.style ?? 'standard';
    if (choice !== null) m.result = r;
  } catch { /* grade failed: explain at the standard level */ }
  if (choice === null) state.history = state.history.filter((x) => x !== m);
  saveTopicStyle(m.ctx, style);
  renderLog();
  send(t().explain);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.open) toggle(false); });

// language switch: the nav button re-renders pages; refresh the widget's text too
document.getElementById('lang')?.addEventListener('click', () => setTimeout(chrome, 0));
chrome();
