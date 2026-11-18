// Loop & Logic practice page. Vanilla JS, no build step.
import { api as apiCall, ensureSignedIn, getLang, setLang, mountNav, uuid } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', reset: 'Reset demo', reasoning: 'Your reasoning (optional)', check: 'Check my answer',
    help: 'I’m stuck: help me', whyNext: 'Why this comes next', next: 'Next task', prove: 'Ready: take the sealed check',
    underHood: 'Under the hood', hideHood: 'Hide details', sealed: 'Sealed check', submitSealed: 'Submit sealed answer',
    receiptTitle: 'Your evidence receipt', again: 'Practise again', helpTitle: 'Help',
    footer: 'Prototype · help text is reviewed draft content · AI answers are shown only when they cite the library',
    correct: 'Correct', notYet: 'Not yet', allRight: 'All correct', someWrong: 'Some answers need another look',
    level: 'Level', assistedTag: 'with help', ready: 'You’re ready for the sealed check. It has no hints and no tutor.',
    demonstrated: 'Shown independently', withHelp: 'Completed with help', uncertain: 'Still uncertain', nextCheck: 'Next check',
    none: 'Nothing yet', evidence: 'evidence', sealedResult: (n, total) => `Sealed check: ${n} of ${total} answers correct.`,
    fieldNames: { salePrice: 'Price after discount', profit: 'Profit', marginPct: 'Margin', decision: 'Decision', totalCost: 'Total cost', minimumPrice: 'Minimum price' },
    fillAll: 'Please fill in every answer.', network: 'Could not reach the server. Your answer was not saved; try again.',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', reset: 'ডেমো আবার শুরু', reasoning: 'তোমার যুক্তি (ঐচ্ছিক)', check: 'উত্তর যাচাই করো',
    help: 'আটকে গেছি: সাহায্য চাই', whyNext: 'পরেরটা কেন', next: 'পরের প্রশ্ন', prove: 'প্রস্তুত: বন্ধ যাচাই শুরু করো',
    underHood: 'ভেতরের হিসাব', hideHood: 'বিস্তারিত লুকাও', sealed: 'বন্ধ যাচাই', submitSealed: 'উত্তর জমা দাও',
    receiptTitle: 'তোমার প্রমাণপত্র', again: 'আবার অনুশীলন', helpTitle: 'সাহায্য',
    footer: 'প্রোটোটাইপ · সাহায্যের লেখা পর্যালোচনার খসড়া · এআই উত্তর দেখানো হয় শুধু লাইব্রেরির উৎস থাকলে',
    correct: 'সঠিক', notYet: 'এখনো হয়নি', allRight: 'সব ঠিক', someWrong: 'কিছু উত্তর আরেকবার দেখতে হবে',
    level: 'স্তর', assistedTag: 'সাহায্যসহ', ready: 'তুমি বন্ধ যাচাইয়ের জন্য প্রস্তুত। এতে কোনো ইঙ্গিত বা টিউটর নেই।',
    demonstrated: 'নিজে দেখিয়েছ', withHelp: 'সাহায্য নিয়ে করেছ', uncertain: 'এখনো অনিশ্চিত', nextCheck: 'পরের যাচাই',
    none: 'এখনো কিছু নেই', evidence: 'প্রমাণ', sealedResult: (n, total) => `বন্ধ যাচাই: ${total}টির মধ্যে ${n}টি সঠিক।`,
    fieldNames: { salePrice: 'ছাড়ের পরে দাম', profit: 'লাভ', marginPct: 'মার্জিন', decision: 'সিদ্ধান্ত', totalCost: 'মোট খরচ', minimumPrice: 'ন্যূনতম দাম' },
    fillAll: 'সবগুলো উত্তর লেখো।', network: 'সার্ভারে পৌঁছানো যায়নি। উত্তর সংরক্ষণ হয়নি; আবার চেষ্টা করো।',
  },
};

const $ = (id) => document.getElementById(id);
let state = null;
let pendingState = null;
let lastAttemptId = null;
let lastFeedback = null;
let lastHelp = null;

const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

const lang = () => (state?.lang ?? getLang());
const t = (key) => T[lang()][key];
const api = apiCall;
const key = uuid;

function show(id) {
  for (const s of ['practice', 'feedback', 'transfer', 'receipt']) $(s).hidden = s !== id;
}

function applyChrome() {
  document.documentElement.lang = lang();
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const v = t(el.dataset.i18n);
    if (typeof v === 'string') el.textContent = v;
  }
}

function renderGivens(dl, givens) {
  dl.replaceChildren(...givens.map((g) => {
    const box = document.createElement('div');
    const dt = document.createElement('dt'); dt.textContent = g.label;
    const dd = document.createElement('dd'); dd.textContent = g.value;
    box.append(dt, dd);
    return box;
  }));
}

function renderFields(container, fields, prefix) {
  container.replaceChildren(...fields.map((f) => {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    const label = f.label[lang()];
    if (f.type === 'choice') {
      const title = document.createElement('label'); title.textContent = label;
      const group = document.createElement('div'); group.className = 'choice'; group.setAttribute('role', 'radiogroup'); group.setAttribute('aria-label', label);
      for (const o of f.options) {
        const l = document.createElement('label');
        const input = document.createElement('input'); input.type = 'radio'; input.name = `${prefix}-${f.id}`; input.value = o.value;
        l.append(input, document.createTextNode(o.label[lang()]));
        group.append(l);
      }
      wrap.append(title, group);
    } else {
      const id = `${prefix}-${f.id}`;
      const l = document.createElement('label'); l.htmlFor = id; l.textContent = label;
      const input = document.createElement('input'); input.id = id; input.name = id; input.inputMode = 'decimal'; input.autocomplete = 'off';
      wrap.append(l, input);
    }
    return wrap;
  }));
}

function collect(form, fields, prefix) {
  const answer = {};
  for (const f of fields) {
    if (f.type === 'choice') answer[f.id] = form.querySelector(`input[name="${prefix}-${f.id}"]:checked`)?.value ?? null;
    else answer[f.id] = form.querySelector(`#${prefix}-${f.id}`)?.value.trim() ?? '';
  }
  return answer;
}

function render() {
  applyChrome();
  $('banner').hidden = true;
  if (!state) return;
  if (state.phase === 'practice') {
    const task = state.task;
    show('practice');
    $('level-pill').textContent = `${t('level')} ${task.level} · ${task.levelLabel[lang()]}`;
    $('bloom').textContent = task.bloom[lang()];
    $('prompt').textContent = task.prompt;
    renderGivens($('givens'), task.givens);
    $('coworker').hidden = !task.coworker;
    if (task.coworker) { $('coworker-name').textContent = task.coworker.name; $('coworker-message').textContent = task.coworker.message; }
    renderFields($('fields'), task.fields, 'p');
    $('reasoning').value = '';
    $('form-error').hidden = true;
    if (state.readyForTransfer) { $('banner').textContent = t('ready'); $('banner').hidden = false; }
  } else if (state.phase === 'assessment') {
    closeHelp();
    const tr = state.transfer;
    show('transfer');
    $('transfer-note').textContent = tr.note[lang()];
    $('transfer-prompt').textContent = tr.prompt;
    renderGivens($('transfer-givens'), tr.givens);
    $('transfer-coworker-name').textContent = tr.coworker.name;
    $('transfer-coworker-message').textContent = tr.coworker.message;
    renderFields($('transfer-fields'), tr.fields, 't');
    $('transfer-error').hidden = true;
  } else {
    loadReceipt();
  }
}

function renderFeedback(r) {
  show('feedback');
  $('feedback-title').textContent = r.result.allCorrect ? `✓ ${t('allRight')}${r.result.assisted ? ` (${t('assistedTag')})` : ''}` : t('someWrong');
  $('field-results').replaceChildren(...Object.entries(r.result.fields).map(([k, v]) => {
    const li = document.createElement('li');
    const mark = document.createElement('span'); mark.className = v.correct ? 'ok' : 'no'; mark.textContent = v.correct ? '✓' : '✗';
    li.append(mark, document.createTextNode(` ${t('fieldNames')[k] ?? k}: ${v.correct ? t('correct') : t('notYet')}`));
    return li;
  }));
  lastFeedback = r;
  $('diagnosis').textContent = r.diagnosis.summary[lang()];
  $('diagnosis').hidden = r.result.allCorrect;
  $('reason').textContent = r.adaptation.reason[lang()];
  $('go-transfer').hidden = !r.adaptation.readyForTransfer;
  $('trace').hidden = true;
  $('show-trace').textContent = t('underHood');
}

async function submitPractice(ev) {
  ev.preventDefault();
  const answer = collect($('answer-form'), state.task.fields, 'p');
  if (Object.values(answer).some((v) => v === null || v === '')) { $('form-error').textContent = t('fillAll'); $('form-error').hidden = false; return; }
  answer.reasoning = $('reasoning').value;
  try {
    const r = await api('POST', `/api/sessions/${state.sessionId}/attempts`, { idempotencyKey: key(), expectedRevision: state.revision, answer });
    lastAttemptId = r.attemptId;
    pendingState = r.state;
    state = { ...state, revision: r.state.revision };
    closeHelp();
    renderFeedback(r);
  } catch (e) {
    $('form-error').textContent = e.message; $('form-error').hidden = false;
    if (e.code === 'stale_state') await refresh();
  }
}

async function getHelp() {
  try {
    const r = await api('POST', `/api/sessions/${state.sessionId}/help`);
    state = r.state;
    lastHelp = r;
    renderHelp();
    $('sidebar').hidden = false;
    document.querySelector('.layout').classList.add('with-help');
  } catch (e) {
    $('form-error').textContent = e.message; $('form-error').hidden = false;
  }
}

function renderHelp() {
  if (!lastHelp) return;
  const h = lastHelp.help;
  $('help-question').textContent = h.question[lang()];
  $('help-title').textContent = h.title[lang()];
  $('help-explanation').textContent = h.explanation[lang()];
  $('help-sources').textContent = h.sources.map((s) => `${s.title}, ${s.location}${s.reviewed ? '' : ' (draft)'}`).join(' · ');
  $('help-note').textContent = lastHelp.note[lang()] + (h.origin === 'ai_checked' ? (lang() === 'en' ? ' · Wording by AI, checked against the reviewed note.' : ' · লেখা এআই-এর, পর্যালোচিত নোটের সঙ্গে মিলিয়ে দেখা।') : '');
}

function closeHelp() {
  $('sidebar').hidden = true;
  document.querySelector('.layout').classList.remove('with-help');
}

async function toggleTrace() {
  const pre = $('trace');
  if (!pre.hidden) { pre.hidden = true; $('show-trace').textContent = t('underHood'); return; }
  const tr = await api('GET', `/api/sessions/${state.sessionId}/trace/${lastAttemptId}`);
  pre.textContent = JSON.stringify({
    task: tr.taskId, level: tr.level,
    verifier: { version: tr.verifierVersion, ...tr.facts },
    diagnosis: { rule: tr.diagnosis.version, code: tr.diagnosis.code, confidence: tr.diagnosis.confidence, evidence: tr.diagnosis.evidence, alternatives: tr.diagnosis.alternatives },
    adaptation: { policy: tr.adaptation.version, action: tr.adaptation.action, nextKind: tr.adaptation.nextKind, nextCoworkerCase: tr.adaptation.nextCoworkerCase, readyForTransfer: tr.adaptation.readyForTransfer },
    signals: tr.signals,
  }, null, 2);
  pre.hidden = false;
  $('show-trace').textContent = t('hideHood');
}

async function startTransfer() {
  try {
    const r = await api('POST', `/api/sessions/${state.sessionId}/transfer`);
    state = r.state;
    render();
  } catch (e) { $('banner').textContent = e.message; $('banner').hidden = false; }
}

async function submitTransfer(ev) {
  ev.preventDefault();
  const fields = state.transfer.fields;
  const answer = collect($('transfer-form'), fields, 't');
  if (Object.values(answer).some((v) => v === null || v === '')) { $('transfer-error').textContent = t('fillAll'); $('transfer-error').hidden = false; return; }
  try {
    const r = await api('POST', `/api/sessions/${state.sessionId}/transfer/submit`, { idempotencyKey: key(), answer });
    state = r.state;
    renderReceipt(r.receipt, r.result);
  } catch (e) { $('transfer-error').textContent = e.message; $('transfer-error').hidden = false; }
}

async function loadReceipt() {
  const r = await api('GET', `/api/sessions/${state.sessionId}/receipt`);
  renderReceipt(r.receipt, null);
}

function renderReceipt(receipt, result) {
  show('receipt');
  closeHelp();
  const body = $('receipt-body');
  body.replaceChildren();
  if (result) {
    const p = document.createElement('p');
    const total = Object.keys(result.fields).length;
    const n = Object.values(result.fields).filter(Boolean).length;
    p.className = 'banner'; p.textContent = t('sealedResult')(n, total);
    body.append(p);
  }
  const groups = [['demonstrated', receipt.demonstratedIndependently], ['withHelp', receipt.completedWithHelp], ['uncertain', receipt.stillUncertain], ['nextCheck', receipt.nextCheck]];
  for (const [k, lines] of groups) {
    const g = document.createElement('div'); g.className = 'receipt-group';
    const h = document.createElement('h3'); h.textContent = t(k);
    const ul = document.createElement('ul');
    if (lines.length === 0) { const li = document.createElement('li'); li.textContent = t('none'); ul.append(li); }
    for (const line of lines) {
      const li = document.createElement('li');
      li.textContent = line.text[lang()];
      if (line.evidence.length) { const s = document.createElement('small'); s.textContent = ` · ${line.evidence.length} ${t('evidence')}`; li.append(s); }
      ul.append(li);
    }
    g.append(h, ul);
    body.append(g);
  }
}

async function refresh() {
  state = await api('GET', `/api/sessions/${state.sessionId}`);
  render();
}

async function boot() {
  await ensureSignedIn();
  mountNav('practice', null);
  const saved = storage.get('ll_session');
  if (saved) {
    try { state = await api('GET', `/api/sessions/${saved}`); } catch { state = null; }
  }
  if (!state) {
    state = await api('POST', '/api/sessions', { lang: getLang(), demo: true });
    storage.set('ll_session', state.sessionId);
  }
  render();
}

$('answer-form').addEventListener('submit', submitPractice);
$('transfer-form').addEventListener('submit', submitTransfer);
$('help').addEventListener('click', getHelp);
$('close-help').addEventListener('click', closeHelp);
$('next').addEventListener('click', () => { state = pendingState ?? state; render(); });
$('go-transfer').addEventListener('click', () => { state = pendingState ?? state; startTransfer(); });
$('show-trace').addEventListener('click', toggleTrace);
$('again').addEventListener('click', async () => { state = await api('POST', `/api/sessions/${state.sessionId}/reset`); storage.set('ll_session', state.sessionId); render(); });
$('reset').addEventListener('click', async () => { closeHelp(); state = await api('POST', `/api/sessions/${state.sessionId}/reset`); storage.set('ll_session', state.sessionId); render(); });
$('lang').addEventListener('click', async () => {
  const next = lang() === 'en' ? 'bn' : 'en';
  setLang(next);
  const onFeedback = !$('feedback').hidden;
  state = await api('POST', `/api/sessions/${state.sessionId}/language`, { lang: next });
  if (pendingState) pendingState = { ...state };
  if (onFeedback && lastFeedback) { applyChrome(); renderFeedback(lastFeedback); } else { render(); }
  renderHelp();
  mountNav('practice', null);
});

boot().catch((e) => { $('banner').textContent = e.message ?? 'Could not start'; $('banner').hidden = false; });
