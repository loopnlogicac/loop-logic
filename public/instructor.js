import { bankStrings, questionBankPage } from './question-bank.js';
import { downloadFile } from './download.js';
// Instructor dashboard (design: "admin site and instructor dashboard" canvas, Instructor page).
// Classes, students, insights, assignments, content studio, exam packs, announcements.
// Figures come from what students in the class actually did; class-wide numbers are
// hidden below the privacy minimum, and AI questions are counted, never shown as text.
import { getLang, setLang, api, el, toast, currentUser, showSignIn, num, ago, store } from './common.js';

const T = { en: { ...bankStrings.en }, bn: { ...bankStrings.bn } };
/** Page language: every visible string is written in English and Bangla. */
const isBn = () => getLang() === 'bn';
const S = (en, bn) => (isBn() ? bn : en);
const day = (iso) => new Date(iso).toLocaleDateString(isBn() ? 'bn-BD' : 'en-GB');
const $ = (id) => document.getElementById(id);
const content = $('adm-content');
const NAV = [
  ['overview', 'M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z'],
  ['students', 'M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  ['insights', 'M3 3v18h18M7 15l4-4 3 3 5-6'],
  ['gradebook', 'M3 3h18v18H3zM3 9h18M9 3v18'],
  ['assignments', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  ['question-bank', 'M3 3h18v18H3zM7 7h10M7 12h10M7 17h5'],
  ['studio', 'M15 10l4.5-2.5v9L15 14M3 6h12v12H3z'],
  ['packs', 'M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z'],
  ['announcements', 'M3 11l15-6v14L3 13zM7 13v5a2 2 0 0 0 4 0v-3'],
  ['questions', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  ['settings', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2'],
];
/** Sidebar labels (also the page titles, except the overview). */
const LABELS = () => ({
  overview: S('Overview', 'ওভারভিউ'), students: S('Students', 'শিক্ষার্থী'), insights: S('Insights', 'ইনসাইট'), gradebook: T[getLang()].gradebook,
  assignments: S('Assignments', 'অ্যাসাইনমেন্ট'), 'question-bank': T[getLang()].bank, studio: S('Content studio', 'কনটেন্ট স্টুডিও'), packs: S('Exam packs', 'এক্সাম প্যাক'),
  announcements: S('Announcements', 'ঘোষণা'), questions: S('Student questions', 'শিক্ষার্থীদের প্রশ্ন'), settings: S('Class settings', 'ক্লাস সেটিংস'),
});
let me = null, classes = [], dash = null, meta = null;
const state = { student: null };

// ── building blocks (same look as the admin site) ──
const icon = (d) => { const s = el('span', { class: 'adm-ico', 'aria-hidden': 'true' }); s.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`; return s; };
const card = (title, ...kids) => el('section', { class: 'adm-card' }, title ? el('h2', { text: title }) : null, ...kids);
const chip = (text, kind = '') => el('span', { class: `adm-chip ${kind}`, text });
const button = (text, onclick, kind = '') => el('button', { type: 'button', class: `adm-btn ${kind}`, text, onclick });
let seq = 0;
function field(label, input, hint) { input.id ||= `i${++seq}`; return el('div', { class: 'adm-field' }, el('label', { for: input.id, text: label }), input, hint ? el('span', { class: 'adm-hint', text: hint }) : null); }
const input = (value, oninput, attrs = {}) => el('input', { type: 'text', value: value ?? '', oninput: (e) => oninput(e.target.value), ...attrs });
const area = (value, oninput, rows = 4) => { const t = el('textarea', { rows: String(rows), oninput: (e) => oninput(e.target.value) }); t.value = value ?? ''; return t; };
function select(value, options, onchange, attrs = {}) { const s = el('select', { onchange: (e) => onchange(e.target.value), ...attrs }, ...options.map(([v, l]) => el('option', { value: v, text: l }))); s.value = value ?? options[0]?.[0] ?? ''; return s; }
const check = (label, checked, onchange) => el('label', { class: 'adm-check' }, el('input', { type: 'checkbox', checked: checked || null, onchange: (e) => onchange(e.target.checked) }), el('span', { text: label }));
const row = (...kids) => el('div', { class: 'adm-row' }, ...kids);
const kpi = (label, value, note) => el('div', { class: 'adm-kpi' }, el('span', { text: label }), el('strong', { text: value }), note ? el('small', { text: note }) : null);
const empty = (text) => el('p', { class: 'adm-empty', text });
function table(head, rows, emptyText = S('Nothing here yet.', 'এখানে এখনো কিছু নেই।'), rowAttrs = () => ({})) {
  if (!rows.length) return empty(emptyText);
  return el('div', { class: 'adm-table-wrap' }, el('table', { class: 'adm-table' }, el('thead', {}, el('tr', {}, ...head.map((h) => el('th', { scope: 'col', text: h })))),
    el('tbody', {}, ...rows.map((cells, i) => el('tr', rowAttrs(i), ...cells.map((c) => el('td', {}, c)))))));
}
const meter = (pct) => el('div', { class: 'adm-meter small' }, el('i', { style: `width:${pct ?? 0}%` }));
const initials = (email) => email.split('@')[0].split(/[._-]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const hidden = () => empty(S(`Shown when at least ${dash.minGroup} students in the class have done this, so no single student can be picked out.`, `ক্লাসের অন্তত ${num(dash.minGroup)} জন এটা করলে দেখাবে, যাতে আলাদা করে কোনো একজন শিক্ষার্থীকে চেনা না যায়।`));
function busy(btn, fn) { return async () => { btn.disabled = true; try { await fn(); } catch (e) { toast(e.message); } finally { btn.disabled = false; } }; }
const go = (h) => { if (location.hash === `#${h}`) route(); else location.hash = h; };
/** CSV for spreadsheets: every cell quoted, and text that would start a formula gets a leading apostrophe. */
function csvText(rows) {
  return '\uFEFF' + rows.map((cells) => cells.map((value) => {
    let text = value == null ? '' : String(value);
    if (/^[\s]*[=+\-@]|^[\t\r\n]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }).join(',')).join('\r\n') + '\r\n';
}
const currentClass = () => classes.find((c) => c.id === store.get('ll_class')) ?? classes[0] ?? null;

/** Sidebar text that is in the HTML, and the EN · বাংলা switch (also shown before sign-in). */
function chrome() {
  document.documentElement.lang = getLang();
  $('adm-nav').setAttribute('aria-label', S('Instructor', 'ইনস্ট্রাক্টর'));
  document.querySelector('.ins-side').setAttribute('aria-label', S('Instructor sections', 'ইনস্ট্রাক্টরের অংশগুলো'));
  $('ins-class-label').textContent = S('Class', 'ক্লাস');
  $('ins-student-site').textContent = S('Open the student site ↗', 'শিক্ষার্থীদের সাইট খোলো ↗');
  $('ins-admin').textContent = S('Admin site', 'অ্যাডমিন সাইট');
  if (!me) { $('adm-title').textContent = S('Instructor', 'ইনস্ট্রাক্টর'); document.title = `${S('Instructor', 'ইনস্ট্রাক্টর')} · Loop & Logic`; }
  const langBtn = $('ins-lang');
  langBtn.textContent = isBn() ? 'English' : 'বাংলা';
  langBtn.setAttribute('lang', isBn() ? 'en' : 'bn');
  langBtn.setAttribute('aria-label', S('Show this page in Bangla', 'এই পেজ ইংরেজিতে দেখো'));
  langBtn.onclick = () => { setLang(isBn() ? 'en' : 'bn'); dash = null; if (me) route(); else start(); };
}

function shell(active) {
  const labels = LABELS();
  chrome();
  $('adm-nav').replaceChildren(...NAV.map(([id, d]) => el('a', { href: `#${id}`, class: 'adm-nav-item', 'aria-current': id === active ? 'page' : null }, icon(d), el('span', { text: labels[id] }))));
  const sel = $('ins-class');
  sel.replaceChildren(...classes.map((c) => el('option', { value: c.id, text: c.name })), el('option', { value: '__new', text: S('+ New class…', '+ নতুন ক্লাস…') }));
  sel.value = currentClass()?.id ?? '__new';
  sel.onchange = () => { if (sel.value === '__new') go('new-class'); else { store.set('ll_class', sel.value); dash = null; route(); } };
  $('adm-who').textContent = me ? `${me.email} · ${me.role === 'admin' ? S('Admin', 'অ্যাডমিন') : S('Instructor', 'ইনস্ট্রাক্টর')}` : '';
  $('ins-admin').hidden = me?.role !== 'admin';
}
function header(title) {
  const c = currentClass();
  $('adm-title').textContent = title;
  $('adm-sub').textContent = c ? `${c.name} · ${S(`${num(c.students)} students`, `${num(c.students)} জন শিক্ষার্থী`)}${c.pending ? ` · ${S(`${num(c.pending)} waiting`, `${num(c.pending)} জন অপেক্ষায়`)}` : ''}` : '';
  document.title = `${title} · ${S('Instructor', 'ইনস্ট্রাক্টর')} · Loop & Logic`;
  $('ins-actions').replaceChildren(...(c ? [el('a', { class: 'adm-btn', href: '#announcements', text: S('Post an announcement', 'ঘোষণা দাও') }), el('a', { class: 'adm-btn primary', href: '#assignments', text: S('New assignment', 'নতুন অ্যাসাইনমেন্ট') })] : []));
}

// ── pages ──
function newClassPage(existing) {
  const c = existing ? { ...existing } : { name: '', track: '', course: '', requireApproval: false };
  const save = button(existing ? S('Save', 'সেভ করো') : S('Create class', 'ক্লাস তৈরি করো'), null, 'primary');
  save.onclick = busy(save, async () => {
    const out = await api('POST', existing ? `/api/instructor/classes/${existing.id}` : '/api/instructor/classes', c);
    store.set('ll_class', out.id); toast(existing ? S('Saved.', 'সেভ হয়েছে।') : S(`Class created. Share the code ${out.code} with your students.`, `ক্লাস তৈরি হয়েছে। শিক্ষার্থীদের ${out.code} কোডটা দাও।`));
    await loadClasses(); go(existing ? 'settings' : 'overview');
  });
  return card(existing ? S('Class details', 'ক্লাসের তথ্য') : S('Create your first class', 'তোমার প্রথম ক্লাস তৈরি করো'),
    existing ? null : el('p', { class: 'adm-hint', text: S('A class is one course section. Students join it with a code from their dashboard, and you see their progress here.', 'একটা ক্লাস মানে একটা কোর্সের একটা সেকশন। শিক্ষার্থীরা ড্যাশবোর্ড থেকে কোড দিয়ে যোগ দেয়, আর তাদের অগ্রগতি তুমি এখানে দেখো।') }),
    field(S('Class name', 'ক্লাসের নাম'), input(c.name, (v) => { c.name = v; }, { placeholder: 'CSE 2103 · Data Structures · Section A' })),
    row(field(S('Tutorial track', 'টিউটোরিয়াল ট্র্যাক'), select(c.track ?? '', [['', S('None', 'কোনোটি না')], ...meta.tracks.map((t) => [t.id, t.title])], (v) => { c.track = v; })),
      field(S('Video course', 'ভিডিও কোর্স'), select(c.course ?? '', [['', S('None', 'কোনোটি না')], ...meta.courses.map((x) => [x.id, x.title])], (v) => { c.course = v; }))),
    check(S('I approve each student before they join', 'প্রত্যেক শিক্ষার্থীকে যোগ দেওয়ার আগে আমি অনুমোদন দেব'), c.requireApproval, (on) => { c.requireApproval = on; }),
    save);
}

function overviewPage() {
  const k = dash.kpis;
  const help = dash.roster.filter((r) => r.reasons.length).slice(0, 6);
  return [
    el('div', { class: 'adm-kpis' },
      kpi(S('Students', 'শিক্ষার্থী'), num(k.students), k.pending ? S(`${num(k.pending)} waiting to join`, `${num(k.pending)} জন যোগ দেওয়ার অপেক্ষায়`) : null), kpi(S('Active this week', 'এই সপ্তাহে সক্রিয়'), num(k.activeWeek), k.students ? S(`${num(Math.round((100 * k.activeWeek) / k.students))}% of the class`, `ক্লাসের ${num(Math.round((100 * k.activeWeek) / k.students))}%`) : null),
      kpi(S('Average progress', 'গড় অগ্রগতি'), k.avgProgress === null ? '—' : `${num(k.avgProgress)}%`, k.delivered ? S(`of ${num(k.delivered)} topics`, `${num(k.delivered)}টি টপিকের মধ্যে`) : S('no tutorial track', 'টিউটোরিয়াল ট্র্যাক নেই')), kpi(S('Quiz average', 'কুইজের গড়'), k.quizAvg === null ? '—' : `${num(k.quizAvg)}%`, k.quizAvg === null ? S(`needs ${dash.minGroup}+ students`, `অন্তত ${num(dash.minGroup)} জন লাগবে`) : null),
      kpi(S('May need help', 'সাহায্য লাগতে পারে'), num(k.needHelp), S('inactive or low scores', 'নিষ্ক্রিয় বা কম নম্বর'))),
    k.students ? null : card(S('Invite your students', 'শিক্ষার্থীদের আমন্ত্রণ জানাও'), el('p', {}, S('Share this code. Students open their dashboard, choose “Join a class” and type it in: ', 'এই কোডটা দাও। শিক্ষার্থীরা ড্যাশবোর্ড খুলে “ক্লাসে যোগ দাও” বেছে কোডটা লিখবে: '), el('span', { class: 'ins-code', text: dash.class.code }))),
    row(
      card(S('Topics the class finds hardest', 'ক্লাসের কাছে সবচেয়ে কঠিন টপিক'), el('p', { class: 'adm-hint', text: S('Average quiz score per topic, lowest first.', 'প্রতি টপিকে কুইজের গড় নম্বর, সবচেয়ে কম আগে।') }), dash.enough ? (dash.hardTopics.length ? el('div', {}, ...dash.hardTopics.map((t) => el('div', { class: 'ins-mistake' },
        el('div', { class: 'adm-progress-row' }, el('strong', { text: t.title }), el('span', { text: `${num(t.avg)}% · ${S(`${num(t.students)} students`, `${num(t.students)} জন`)}` })), meter(100 - t.avg)))) : empty(S('No quizzes taken yet.', 'এখনো কেউ কুইজ দেয়নি।'))) : hidden()),
      card(S('Students who may need help', 'যাদের সাহায্য লাগতে পারে'), help.length ? el('div', { class: 'adm-list' }, ...help.map((r) => el('div', { class: 'adm-list-row' }, el('span', { class: 'ins-avatar risk', text: initials(r.email) }), el('span', {}, el('strong', { text: r.email }), el('br'), el('small', { class: 'adm-hint', text: r.reasons.join(' · ') })),
        el('a', { class: 'adm-btn small', href: `mailto:${r.email}`, text: S('Email', 'ইমেইল') })))) : empty(S('Nobody right now.', 'এই মুহূর্তে কেউ নেই।')))),
    row(
      card(S('Where students ask the AI for help', 'কোথায় শিক্ষার্থীরা এআই-এর সাহায্য নেয়'), el('p', { class: 'adm-hint', text: S('Pages where several students asked questions. The questions themselves stay private.', 'যেসব পেজে কয়েকজন শিক্ষার্থী প্রশ্ন করেছে। প্রশ্নগুলো নিজে গোপন থাকে।') }),
        dash.asks.length ? table([S('Page', 'পেজ'), S('Students', 'শিক্ষার্থী')], dash.asks.map((a) => [a.title, num(a.students)])) : hidden()),
      card(S('Hardest quiz questions', 'সবচেয়ে কঠিন কুইজ প্রশ্ন'), dash.hardQuestions.length ? table([S('Question', 'প্রশ্ন'), S('Topic', 'টপিক'), S('Correct', 'ঠিক')], dash.hardQuestions.map((q) => [q.prompt, q.title, el('strong', { text: `${num(q.correct)}%` })])) : hidden())),
  ];
}

function studentsPage() {
  const r = dash.roster;
  const sel = r.find((x) => x.learnerId === state.student) ?? r[0];
  const reqs = dash.pending.length ? card(S('Waiting to join', 'যোগ দেওয়ার অপেক্ষায়'), table([S('Student', 'শিক্ষার্থী'), S('Asked', 'অনুরোধ'), ''], dash.pending.map((p) => [p.email, ago(p.at), el('span', {},
    button(S('Accept', 'গ্রহণ করো'), async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/requests/${encodeURIComponent(p.learnerId)}`, { approve: true }); toast(S('Accepted.', 'গ্রহণ করা হয়েছে।')); await refresh(); }, 'primary small'), ' ',
    button(S('Decline', 'বাদ দাও'), async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/requests/${encodeURIComponent(p.learnerId)}`, { approve: false }); toast(S('Declined.', 'বাদ দেওয়া হয়েছে।')); await refresh(); }, 'small danger'))]))) : null;
  const csv = () => {
    const head = [S('Email', 'ইমেইল'), S('Topics opened', 'খোলা টপিক'), S('Quiz average (%)', 'কুইজের গড় (%)'), S('Labs run', 'চালানো ল্যাব'), S('Last active', 'শেষ সক্রিয়'), ...dash.assignments.map((a) => a.title)];
    const rows = r.map((s) => [s.email, s.done, s.quizAvg ?? '', s.labs, s.lastActive ?? '', ...s.assignments.map((a) => `${a.done}/${a.of}`)]);
    const a = el('a', { href: URL.createObjectURL(new Blob([csvText([head, ...rows])], { type: 'text/csv;charset=utf-8' })), download: `${dash.class.name.replace(/[^\w-]+/g, '-')}.csv` });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  return [
    card('', row(el('span', {}, S('Class code ', 'ক্লাস কোড ')), el('span', { class: 'ins-code', text: dash.class.code }), el('span', { class: 'adm-hint', text: S('Students type it under “Join a class” on their dashboard.', 'শিক্ষার্থীরা ড্যাশবোর্ডে “ক্লাসে যোগ দাও”-তে এটা লেখে।') }), button(S('Copy invite text', 'আমন্ত্রণের লেখা কপি করো'), () => navigator.clipboard?.writeText(S(`Join my class "${dash.class.name}" on Loop & Logic: sign in at ${location.origin}/dashboard.html, choose "Join a class" and enter ${dash.class.code}.`, `Loop & Logic-এ আমার "${dash.class.name}" ক্লাসে যোগ দাও: ${location.origin}/dashboard.html-এ সাইন ইন করে "ক্লাসে যোগ দাও" বেছে ${dash.class.code} কোডটা লেখো।`)).then(() => toast(S('Copied.', 'কপি হয়েছে।'))), 'line small'), button(S('Export progress (CSV)', 'অগ্রগতি ডাউনলোড (CSV)'), csv, 'line small'))),
    reqs,
    row(
      el('div', { class: 'adm-col wide' }, card(S('Students', 'শিক্ষার্থী'), table([S('Student', 'শিক্ষার্থী'), S('Topics opened', 'খোলা টপিক'), S('Quiz average', 'কুইজের গড়'), S('Labs', 'ল্যাব'), S('Last active', 'শেষ সক্রিয়')], r.map((s) => [
        el('button', { type: 'button', class: 'ins-who', onclick: () => { state.student = s.learnerId; route(); } }, el('span', { class: `ins-avatar${s.reasons.length ? ' risk' : ''}`, text: initials(s.email) }), el('strong', { text: s.email })),
        el('div', { class: 'adm-inline' }, meter(dash.kpis.delivered ? Math.round((100 * s.done) / dash.kpis.delivered) : 0), el('span', { text: `${num(s.done)}${dash.kpis.delivered ? `/${num(dash.kpis.delivered)}` : ''}` })),
        s.quizAvg === null ? '—' : el('strong', { style: s.quizAvg < 60 ? 'color:#8f1d14' : '', text: `${num(s.quizAvg)}%` }), num(s.labs), s.lastActive ? ago(s.lastActive) : S('not started', 'শুরু করেনি'),
      ]), S('No students yet. Share the class code.', 'এখনো কোনো শিক্ষার্থী নেই। ক্লাস কোডটা সবাইকে দাও।'), (i) => ({ class: r[i] === sel ? 'sel' : '' })))),
      sel ? el('div', { class: 'adm-col' }, card(sel.email,
        el('span', { class: 'adm-hint', text: S(`Joined ${day(sel.joinedAt)} · last active ${sel.lastActive ? ago(sel.lastActive) : 'never'}`, `যোগ দিয়েছে ${day(sel.joinedAt)} · শেষ সক্রিয় ${sel.lastActive ? ago(sel.lastActive) : 'কখনো না'}`) }),
        sel.modules.length ? el('div', { class: 'adm-stack' }, el('span', { class: 'adm-hint', text: S('Progress by module', 'মডিউল অনুযায়ী অগ্রগতি') }), ...sel.modules.filter((m) => m.pct !== null).map((m) => el('div', {}, el('div', { class: 'adm-progress-row' }, el('span', { text: m.title }), el('span', { text: `${num(m.pct)}%` })), el('div', { class: 'adm-meter' }, el('i', { style: `width:${m.pct}%` }))))) : null,
        row(kpi(S('Quiz average', 'কুইজের গড়'), sel.quizAvg === null ? '—' : `${num(sel.quizAvg)}%`), kpi(S('Questions to the AI', 'এআই-কে প্রশ্ন'), num(sel.asks))),
        dash.assignments.length ? el('div', { class: 'adm-list' }, ...dash.assignments.map((a) => { const x = sel.assignments.find((y) => y.id === a.id); return el('div', { class: 'adm-list-row' }, el('span', { text: a.title }), chip(`${num(x.done)}/${num(x.of)}`, x.done === x.of ? 'ok' : '')); })) : null,
        sel.reasons.length ? el('p', { class: 'adm-ok', style: 'background:#fde8e6;border-color:#f0c8c3;color:#8f1d14', text: sel.reasons.join(' · ') }) : null,
        el('a', { class: 'adm-btn primary', href: `mailto:${sel.email}`, text: S('Email this student', 'এই শিক্ষার্থীকে ইমেইল করো') }))) : null),
  ];
}

Object.assign(T.en, { masteryGain: 'Average gain per topic', masteryTopic: 'Topic', masteryStudents: 'Students with both checks', masteryPoints: 'Gain (percentage points)', masteryHidden: (n) => `Shown when at least ${n} students completed both checks on a topic.` });
Object.assign(T.bn, { masteryGain: 'টপিক অনুযায়ী গড় উন্নতি', masteryTopic: 'টপিক', masteryStudents: 'দুই চেকই শেষ করেছে', masteryPoints: 'উন্নতি (শতাংশ পয়েন্ট)', masteryHidden: (n) => `একটি টপিকের দুই চেকই অন্তত ${n} জন শেষ করলে দেখাবে।` });

function insightsPage() {
  const L = T[getLang()];
  return [
    card(L.masteryGain, dash.masteryGain?.length ? table([L.masteryTopic, L.masteryPoints, L.masteryStudents], dash.masteryGain.map((r) => [r.title, `${r.gain > 0 ? '+' : ''}${r.gain}`, num(r.students)])) : empty(L.masteryHidden(dash.minGroup))),
    card(S('How far the class has got, module by module', 'মডিউল ধরে ক্লাস কতদূর এগিয়েছে'), el('p', { class: 'adm-hint', text: S('Share of students who opened every ready topic in the module.', 'মডিউলের সব তৈরি টপিক খুলেছে এমন শিক্ষার্থীর হার।') }),
      dash.heat ? el('div', { class: 'ins-heat' }, ...dash.heat.map((m) => el('div', { class: `ins-cell ${m.pct === null ? 'none' : m.pct >= 75 ? 'hi' : m.pct >= 40 ? 'mid' : 'lo'}` }, el('strong', { text: m.pct === null ? '—' : `${num(m.pct)}%` }), el('span', { text: m.title })))) : dash.class.track ? hidden() : empty(S('Link a tutorial track to the class in Class settings.', 'ক্লাস সেটিংসে ক্লাসের সাথে একটা টিউটোরিয়াল ট্র্যাক যুক্ত করো।'))),
    row(
      card(S('Labs students ran', 'শিক্ষার্থীরা যেসব ল্যাব চালিয়েছে'), dash.labs.length ? table([S('Lab', 'ল্যাব'), S('Topic', 'টপিক'), S('Students', 'শিক্ষার্থী')], dash.labs.map((l) => [l.lab, l.title, num(l.students)])) : empty(S('No labs run yet.', 'এখনো কেউ ল্যাব চালায়নি।'))),
      card(S('Video quizzes', 'ভিডিও কুইজ'), dash.class.course ? (dash.videoQuizzes.length ? table([S('Video', 'ভিডিও'), S('Students', 'শিক্ষার্থী'), S('Average', 'গড়')], dash.videoQuizzes.map((v) => [v.title, num(v.students), `${num(v.avg)}%`])) : hidden()) : empty(S('Link a video course to the class in Class settings.', 'ক্লাস সেটিংসে ক্লাসের সাথে একটা ভিডিও কোর্স যুক্ত করো।')))),
    card(S('Topics the class finds hardest', 'ক্লাসের কাছে সবচেয়ে কঠিন টপিক'), dash.hardTopics.length ? table([S('Topic', 'টপিক'), S('Average quiz score', 'কুইজের গড় নম্বর'), S('Students', 'শিক্ষার্থী')], dash.hardTopics.map((t) => [t.title, `${num(t.avg)}%`, num(t.students)])) : hidden()),
  ];
}

Object.assign(T.en, { gradebook: 'Gradebook', student: 'Student', overall: 'Overall completion (%)', download: 'Download CSV', noStudents: 'No enrolled students yet.', noAssignments: 'Create an assignment to start the gradebook.', gradebookHelp: 'Each cell shows completion and the average quiz score for quizzes attempted in that assignment. Overall completion counts completed assignment items.', quiz: 'quiz', incomplete: 'Incomplete' });
Object.assign(T.bn, { gradebook: 'গ্রেডবুক', student: 'শিক্ষার্থী', overall: 'মোট সম্পন্ন (%)', download: 'CSV ডাউনলোড করো', noStudents: 'এখনো কোনো শিক্ষার্থী যোগ দেয়নি।', noAssignments: 'গ্রেডবুক শুরু করতে একটি অ্যাসাইনমেন্ট দাও।', gradebookHelp: 'প্রতি ঘরে কাজ সম্পন্ন হয়েছে কি না আর ওই অ্যাসাইনমেন্টে দেওয়া কুইজের গড় নম্বর দেখাবে। মোট শতাংশে অ্যাসাইনমেন্টের কতগুলো কাজ শেষ হয়েছে তা গোনা হয়।', quiz: 'কুইজ', incomplete: 'অসম্পন্ন' });

function gradebookPage() {
  const L = T[getLang()];
  const download = button(L.download, null);
  download.onclick = busy(download, () => downloadFile(`/api/instructor/classes/${encodeURIComponent(dash.class.id)}/gradebook.csv?lang=${getLang()}`, 'gradebook.csv'));
  return card(L.gradebook, el('p', { class: 'adm-hint', text: L.gradebookHelp }), download,
    dash.assignments.length ? table([L.student, ...dash.assignments.map((a) => a.title), L.overall], dash.roster.map((s) => [s.email, ...dash.assignments.map((a) => {
      const r = s.assignments.find((r) => r.id === a.id);
      return el('span', { 'aria-label': `${r.done === r.of ? '✓' : L.incomplete} · ${L.quiz}: ${r.quizPercent ?? '—'}` }, r.done === r.of ? '✓ ' : `${r.done}/${r.of} `, r.quizPercent === null ? '—' : `${r.quizPercent}%`);
    }), s.overallPercent === null ? '—' : `${s.overallPercent}%`]), L.noStudents) : empty(L.noAssignments));
}

async function assignmentsPage() {
  const L = T[getLang()];
  const bank = await api('GET', '/api/instructor/question-bank').catch(() => ({ questions: [] }));
  const tr = dash.track;
  const labIdx = tr ? await api('GET', `/api/learn-labs/${tr.id}`).catch(() => null) : null;
  const labsOf = (topic) => labIdx?.topics.find((x) => x.id === topic)?.labs ?? [];
  const a = { title: '', due: '', marks: 10, passMark: 60, hintsOnly: true, items: [] };
  const topics = tr ? tr.modules.flatMap((m) => m.topics.map((t) => ({ ...t, module: m.title }))) : [];
  const itemsHost = el('div', { class: 'ins-items' });
  const drawItems = () => itemsHost.replaceChildren(...a.items.map((it, i) => {
    const approved = bank.questions.filter((q) => q.status === 'approved' && q.track === tr?.id && q.topic === it.topic);
    return el('div', { class: 'ins-item' },
      select(it.kind, [['read', S('Read', 'পড়া')], ['quiz', S('Pass the quiz', 'কুইজে পাস')], ['lab', S('Run the lab', 'ল্যাব চালানো')], ['custom_quiz', L.customQuiz]], (v) => { it.kind = v; drawItems(); }, { 'aria-label': S('What to do', 'কী করতে হবে') }),
      select(it.topic, topics.map((x) => [x.id, `${x.module} · ${x.title}`]), (v) => { it.topic = v; it.lab = null; it.questionIds = []; drawItems(); }, { 'aria-label': S('Topic', 'টপিক') }),
      it.kind === 'lab' ? (labsOf(it.topic).length ? select(it.lab ?? (it.lab = labsOf(it.topic)[0].id), labsOf(it.topic).map((l) => [l.id, l.title]), (v) => { it.lab = v; }, { 'aria-label': S('Lab', 'ল্যাব') }) : el('span', { class: 'adm-hint', text: S('This topic has no lab.', 'এই টপিকে কোনো ল্যাব নেই।') })) : null,
      it.kind === 'custom_quiz' ? el('fieldset', {}, el('legend', { text: L.bankSelect }), ...(approved.length ? approved.map((q) => check(q.prompt[getLang()], (it.questionIds ?? []).includes(q.id), (on) => { const ids = new Set(it.questionIds ?? []); if (on) ids.add(q.id); else ids.delete(q.id); it.questionIds = [...ids]; })) : [el('p', { class: 'adm-hint', text: L.bankNoQuestions })])) : null,
      button(S('Remove', 'সরাও'), () => { a.items.splice(i, 1); drawItems(); }, 'small danger'));
  }), tr ? button(S('+ Add a topic, quiz or lab', '+ টপিক, কুইজ বা ল্যাব যোগ করো'), () => { a.items.push({ kind: 'read', topic: topics[0]?.id }); drawItems(); }, 'line small') : empty(S('Link a tutorial track to the class first (Class settings).', 'আগে ক্লাসের সাথে একটা টিউটোরিয়াল ট্র্যাক যুক্ত করো (ক্লাস সেটিংস)।')));
  drawItems();
  const save = button(S(`Give to ${dash.class.name}`, `${dash.class.name}-কে দাও`), null, 'primary');
  save.onclick = busy(save, async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/assignments`, { ...a, items: a.items.map((it) => ({ ...it, track: tr?.id })) }); toast(S('Assignment given.', 'অ্যাসাইনমেন্ট দেওয়া হয়েছে।')); await refresh(); });
  return [row(
    el('div', { class: 'adm-col wide' }, card(S('Assignments', 'অ্যাসাইনমেন্ট'), dash.assignments.length ? el('div', { class: 'adm-stack' }, ...dash.assignments.map((x) => el('div', { class: 'adm-sub-card' },
      row(el('strong', { text: x.title }), chip(x.due ? S(`due ${day(x.due)}`, `জমা ${day(x.due)}`) : S('no due date', 'জমার তারিখ নেই'), x.due && Date.parse(x.due) < Date.now() ? '' : 'ok')),
      el('span', { class: 'adm-hint', text: x.items.map((it) => `${{ read: S('Read', 'পড়া'), quiz: S('Quiz', 'কুইজ'), lab: S('Lab', 'ল্যাব'), custom_quiz: L.customQuiz }[it.kind]}: ${it.title}`).join(' · ') }),
      el('div', { class: 'adm-inline' }, el('div', { class: 'adm-meter', style: 'flex:1' }, el('i', { style: `width:${dash.kpis.students ? Math.round((100 * x.submitted) / dash.kpis.students) : 0}%` })), el('span', { text: S(`${num(x.submitted)}/${num(dash.kpis.students)} done`, `${num(dash.kpis.students)} জনের মধ্যে ${num(x.submitted)} জন শেষ করেছে`) })),
      button(S('Delete', 'মুছে ফেলো'), async () => { if (!confirm(S(`Delete "${x.title}"?`, `"${x.title}" মুছে ফেলবে?`))) return; await api('DELETE', `/api/instructor/classes/${dash.class.id}/assignments/${x.id}`); toast(S('Deleted.', 'মুছে ফেলা হয়েছে।')); await refresh(); }, 'small danger')))) : empty(S('No assignments yet.', 'এখনো কোনো অ্যাসাইনমেন্ট নেই।')))),
    el('div', { class: 'adm-col' }, card(S('New assignment', 'নতুন অ্যাসাইনমেন্ট'),
      field(S('Title', 'শিরোনাম'), input('', (v) => { a.title = v; }, { placeholder: S('Hashing practice set', 'হ্যাশিং অনুশীলন সেট') })),
      el('div', { class: 'adm-field' }, el('span', { class: 'adm-label', text: S('What students must do', 'শিক্ষার্থীদের যা করতে হবে') }), itemsHost),
      row(field(S('Due', 'জমার তারিখ'), input('', (v) => { a.due = v; }, { type: 'date' })), field(S('Marks', 'নম্বর'), input(10, (v) => { a.marks = Number(v); }, { type: 'number', min: '0' })), field(S('Quiz pass mark (%)', 'কুইজে পাস নম্বর (%)'), input(60, (v) => { a.passMark = Number(v); }, { type: 'number', min: '0', max: '100' }))),
      el('p', { class: 'adm-hint', text: S('Progress updates by itself: reading a topic, passing its quiz or running the lab ticks the item off.', 'অগ্রগতি নিজে থেকেই হালনাগাদ হয়: টপিক পড়লে, কুইজে পাস করলে বা ল্যাব চালালে কাজটা টিক হয়ে যায়।') }),
      save)))];
}

async function studioPage() {
  const s = await api('GET', `/api/instructor/classes/${dash.class.id}/studio`);
  if (!s.course) return [card(S('Content studio', 'কনটেন্ট স্টুডিও'), empty(S('Link a video course to this class in Class settings to write video quizzes and add materials.', 'ভিডিও কুইজ লিখতে আর ম্যাটেরিয়াল যোগ করতে ক্লাস সেটিংসে এই ক্লাসের সাথে একটা ভিডিও কোর্স যুক্ত করো।')))];
  return [card(S(`${s.course.title}: video quizzes and materials`, `${s.course.title}: ভিডিও কুইজ আর ম্যাটেরিয়াল`),
    el('p', { class: 'adm-hint', text: S('Open a video to add a quiz (shown after the video), class materials and “Try now” code. You are signed in as an instructor, so no key is needed.', 'কুইজ (ভিডিওর পরে দেখায়), ক্লাস ম্যাটেরিয়াল আর “Try now” কোড যোগ করতে একটা ভিডিও খোলো। তুমি ইনস্ট্রাক্টর হিসেবে সাইন ইন করা আছ, তাই কোনো key লাগবে না।') }),
    table(['#', S('Video', 'ভিডিও'), S('Length', 'দৈর্ঘ্য'), S('Quiz', 'কুইজ'), S('Materials', 'ম্যাটেরিয়াল'), ''], s.videos.map((v) => [num(v.n), v.title, v.duration, v.quiz ? chip(S(`${v.quiz} questions`, `${num(v.quiz)}টি প্রশ্ন`), 'ok') : '—', v.materials ? num(v.materials) : '—',
      el('a', { class: 'adm-btn small line', href: `/watch.html?course=${encodeURIComponent(s.course.id)}&v=${encodeURIComponent(v.id)}#edit`, target: '_blank', rel: 'noopener', text: S('Edit', 'এডিট করো') })])))];
}

async function packsPage() {
  const packs = await api('GET', '/api/instructor/packs');
  const p = { title: '', course: '', description: '', lessons: '', papers: '', mockTests: 0, files: [] };
  const filesHost = el('div', { class: 'adm-stack' });
  const drawFiles = () => filesHost.replaceChildren(...p.files.map((f, i) => row(field(S('File name', 'ফাইলের নাম'), input(f.name, (v) => { f.name = v; })), field(S('Link (https://)', 'লিংক (https://)'), input(f.url, (v) => { f.url = v; }, { type: 'url' })), button(S('Remove', 'সরাও'), () => { p.files.splice(i, 1); drawFiles(); }, 'small danger'))),
    button(S('+ Add a file link', '+ ফাইলের লিংক যোগ করো'), () => { p.files.push({ name: '', url: '' }); drawFiles(); }, 'line small'));
  drawFiles();
  const save = async (submit) => { await api('POST', '/api/instructor/packs', { ...p, submit }); toast(submit ? S('Sent to the admin for review.', 'যাচাইয়ের জন্য অ্যাডমিনের কাছে পাঠানো হয়েছে।') : S('Saved as a draft.', 'ড্রাফট হিসেবে সেভ হয়েছে।')); route(); };
  const draft = button(S('Save draft', 'ড্রাফট সেভ করো'), null, 'line'); draft.onclick = busy(draft, () => save(false));
  const send = button(S('Submit for admin review', 'অ্যাডমিনের যাচাইয়ে পাঠাও'), null, 'primary'); send.onclick = busy(send, () => save(true));
  return [row(
    el('div', { class: 'adm-col' }, card(S('My exam packs', 'আমার এক্সাম প্যাক'), packs.length ? el('div', { class: 'adm-list' }, ...packs.map((x) => el('div', { class: 'adm-list-row' }, el('strong', { text: x.title }),
      el('span', { class: 'adm-hint', text: S(`${num(x.lessons.length)} lessons · ${num(x.papers.length)} past papers · ${num(x.mockTests)} mock tests${x.note ? ` · Note: ${x.note}` : ''}`, `${num(x.lessons.length)}টি লেসন · ${num(x.papers.length)}টি পুরোনো প্রশ্ন · ${num(x.mockTests)}টি মক টেস্ট${x.note ? ` · নোট: ${x.note}` : ''}`) }),
      chip({ draft: S('Draft', 'ড্রাফট'), review: S('With the admin', 'অ্যাডমিনের কাছে'), approved: S('Approved', 'অনুমোদিত') }[x.status] ?? x.status, x.status === 'approved' ? 'ok' : x.status === 'review' ? 'info' : '')))) : empty(S('No packs yet.', 'এখনো কোনো প্যাক নেই।')))),
    el('div', { class: 'adm-col wide' }, card(S('New exam pack', 'নতুন এক্সাম প্যাক'),
      el('p', { class: 'adm-hint', text: S('Exam packs are sold in Pro. An admin checks each pack before it goes on sale.', 'এক্সাম প্যাক Pro-তে বিক্রি হয়। বিক্রির আগে একজন অ্যাডমিন প্রতিটা প্যাক দেখে নেন।') }),
      row(field(S('Pack name', 'প্যাকের নাম'), input('', (v) => { p.title = v; }, { placeholder: S('Data Structures Midterm Pack', 'ডেটা স্ট্রাকচার মিডটার্ম প্যাক') })), field(S('For course', 'কোন কোর্সের জন্য'), select('', [['', S('Any', 'যেকোনো')], ...meta.courses.map((c) => [c.id, c.title])], (v) => { p.course = v; }))),
      field(S('What it covers', 'কী কী আছে'), area('', (v) => { p.description = v; }, 3)),
      row(field(S('Lessons (one per line)', 'লেসন (প্রতি লাইনে একটা)'), area('', (v) => { p.lessons = v; }, 5)), field(S('Solved past papers (one per line)', 'সমাধানসহ পুরোনো প্রশ্ন (প্রতি লাইনে একটা)'), area('', (v) => { p.papers = v; }, 5))),
      field(S('Timed mock tests', 'সময় ধরা মক টেস্ট'), input(0, (v) => { p.mockTests = Number(v); }, { type: 'number', min: '0', max: '50' })),
      el('div', { class: 'adm-field' }, el('span', { class: 'adm-label', text: S('Files (links to PDFs or slides)', 'ফাইল (PDF বা স্লাইডের লিংক)') }), filesHost),
      row(draft, send))))];
}

function announcementsPage() {
  const p = { title: '', body: '', pinned: false };
  const send = button(S('Post', 'পোস্ট করো'), null, 'primary');
  send.onclick = busy(send, async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/posts`, p); toast(S('Posted. Students see it on their dashboard.', 'পোস্ট হয়েছে। শিক্ষার্থীরা ড্যাশবোর্ডে দেখবে।')); await refresh(); });
  return [row(
    el('div', { class: 'adm-col' }, card(S(`Post to ${dash.class.name}`, `${dash.class.name}-এ পোস্ট করো`),
      field(S('Title', 'শিরোনাম'), input('', (v) => { p.title = v; }, { placeholder: S('Midterm syllabus', 'মিডটার্মের সিলেবাস') })),
      field(S('Message', 'মেসেজ'), area('', (v) => { p.body = v; }, 6)),
      check(S('Pin to the top of the class', 'ক্লাসের ওপরে পিন করে রাখো'), false, (on) => { p.pinned = on; }),
      el('p', { class: 'adm-hint', text: S('Students see posts under “My classes” on their dashboard.', 'শিক্ষার্থীরা ড্যাশবোর্ডে “আমার ক্লাস”-এর নিচে পোস্ট দেখে।') }), send)),
    el('div', { class: 'adm-col' }, card(S('Earlier posts', 'আগের পোস্ট'), dash.posts.length ? el('div', {}, ...dash.posts.map((x) => el('div', { class: 'ins-post' },
      row(el('strong', { text: `${x.pinned ? '📌 ' : ''}${x.title}` }), el('span', { class: 'adm-hint', text: ago(x.at) }), button(S('Delete', 'মুছে ফেলো'), async () => { if (!confirm(S('Delete this post?', 'এই পোস্টটা মুছে ফেলবে?'))) return; await api('DELETE', `/api/instructor/classes/${dash.class.id}/posts/${x.id}`); await refresh(); }, 'small danger')),
      el('p', { text: x.body })))) : empty(S('Nothing posted yet.', 'এখনো কিছু পোস্ট করা হয়নি।')))))];
}

function questionsPage() {
  return [card(S('Where your students ask the AI Teacher for help', 'কোথায় তোমার শিক্ষার্থীরা এআই টিচারের সাহায্য নেয়'),
    el('p', { class: 'adm-hint', text: S('Pages where at least a few students in this class asked the AI. To protect students, the questions themselves are never shown to instructors.', 'যেসব পেজে এই ক্লাসের অন্তত কয়েকজন শিক্ষার্থী এআই-কে প্রশ্ন করেছে। শিক্ষার্থীদের সুরক্ষার জন্য প্রশ্নগুলো কখনো ইনস্ট্রাক্টরকে দেখানো হয় না।') }),
    dash.asks.length ? table([S('Page', 'পেজ'), S('Students who asked', 'যারা প্রশ্ন করেছে')], dash.asks.map((a) => [a.title, num(a.students)])) : hidden()),
  card(S('Hardest quiz questions', 'সবচেয়ে কঠিন কুইজ প্রশ্ন'), dash.hardQuestions.length ? table([S('Question', 'প্রশ্ন'), S('Topic', 'টপিক'), S('Answers', 'উত্তর'), S('Correct', 'ঠিক')], dash.hardQuestions.map((q) => [q.prompt, q.title, num(q.answers), `${num(q.correct)}%`])) : hidden())];
}

function settingsPage() {
  const c = dash.class;
  const newCode = button(S('Make a new code', 'নতুন কোড বানাও'), null, 'line small');
  newCode.onclick = busy(newCode, async () => { if (!confirm(S('The old code will stop working. Continue?', 'পুরোনো কোডটা আর কাজ করবে না। চালিয়ে যাবে?'))) return; const r = await api('POST', `/api/instructor/classes/${c.id}/code`); toast(S(`New code: ${r.code}`, `নতুন কোড: ${r.code}`)); await loadClasses(); await refresh(); });
  return [newClassPage(c), card(S('Class code', 'ক্লাস কোড'), row(el('span', { class: 'ins-code', text: c.code }), newCode)),
    card(S('Archive the class', 'ক্লাস আর্কাইভ করো'), el('p', { class: 'adm-hint', text: S('Students can no longer see it, and it leaves your list. Their own progress is kept.', 'শিক্ষার্থীরা আর ক্লাসটা দেখতে পাবে না, তোমার তালিকা থেকেও সরে যাবে। তাদের নিজেদের অগ্রগতি থেকে যাবে।') }),
      button(S('Archive this class', 'এই ক্লাস আর্কাইভ করো'), async () => { if (!confirm(S(`Archive "${c.name}"?`, `"${c.name}" আর্কাইভ করবে?`))) return; await api('DELETE', `/api/instructor/classes/${c.id}?lang=${getLang()}`); store.del('ll_class'); toast(S('Archived.', 'আর্কাইভ হয়েছে।')); await loadClasses(); go('overview'); }, 'danger'))];
}

// ── loading and routing ──
async function loadClasses() { classes = await api('GET', '/api/instructor/classes'); }
async function refresh() { dash = null; await route(); }
const PAGES = { gradebook: gradebookPage, overview: overviewPage, students: studentsPage, insights: insightsPage, assignments: assignmentsPage, studio: studioPage, packs: packsPage, announcements: announcementsPage, questions: questionsPage, settings: settingsPage };
const titleOf = (name) => (name === 'overview' || !PAGES[name] ? S('Class overview', 'ক্লাসের ওভারভিউ') : LABELS()[name]);
let routeSeq = 0;
async function route() {
  const name = location.hash.slice(1) || 'overview';
  const my = ++routeSeq;
  if (name === 'question-bank') { shell('question-bank'); header(T[getLang()].bank); content.replaceChildren(await questionBankPage(meta, T[getLang()])); return; }
  if (name === 'new-class' || !classes.length) {
    shell(''); header(classes.length ? S('New class', 'নতুন ক্লাস') : S('Welcome', 'স্বাগতম'));
    content.replaceChildren(newClassPage());
    return;
  }
  const c = currentClass();
  shell(PAGES[name] ? name : 'overview'); header(titleOf(name));
  content.replaceChildren(el('div', { class: 'skeleton' }));
  try {
    if (!dash || dash.class.id !== c.id) {
      dash = await api('GET', `/api/instructor/classes/${c.id}?lang=${getLang()}`);
      Object.assign(c, { students: dash.kpis.students, pending: dash.kpis.pending });
    }
    if (name === 'packs' || name === 'studio') { /* these load their own data */ }
    const nodes = await (PAGES[name] ?? overviewPage)();
    if (my === routeSeq) { content.replaceChildren(...[nodes].flat().filter(Boolean)); header(titleOf(name)); }
  } catch (e) {
    if (my === routeSeq) content.replaceChildren(card(S('Something went wrong', 'কিছু একটা ভুল হয়েছে'), el('p', { text: e.message }), button(S('Try again', 'আবার চেষ্টা করো'), refresh, 'line')));
  }
}

async function start() {
  chrome();
  if (!currentUser()) {
    content.replaceChildren(card(S('Instructors only', 'শুধু ইনস্ট্রাক্টরদের জন্য'), el('p', { text: S('Sign in with the account an admin gave the instructor role.', 'যে অ্যাকাউন্টে অ্যাডমিন ইনস্ট্রাক্টরের রোল দিয়েছেন, সেটা দিয়ে সাইন ইন করো।') }), button(S('Sign in', 'সাইন ইন করো'), () => showSignIn(), 'primary')));
    showSignIn();
    return;
  }
  try {
    const m = await api('GET', '/api/me');
    me = { email: m.email, role: m.role };
    if (m.role !== 'admin' && m.role !== 'instructor') throw Object.assign(new Error(S('This account is not an instructor yet. Ask an admin to give you the instructor role (Admin site → Users and roles).', 'এই অ্যাকাউন্ট এখনো ইনস্ট্রাক্টর নয়। একজন অ্যাডমিনকে ইনস্ট্রাক্টরের রোল দিতে বলো (অ্যাডমিন সাইট → Users and roles)।')), { status: 403 });
    [meta] = await Promise.all([api('GET', '/api/instructor/meta'), loadClasses()]);
  } catch (e) {
    content.replaceChildren(card(S('Instructors only', 'শুধু ইনস্ট্রাক্টরদের জন্য'), el('p', { text: e.message }), el('a', { class: 'adm-btn line', href: '/', text: S('Back to the site', 'সাইটে ফিরে যাও') })));
    return;
  }
  chrome();
  window.addEventListener('hashchange', route);
  route();
}
start();
