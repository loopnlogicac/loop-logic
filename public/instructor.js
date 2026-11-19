// Instructor dashboard (design: "admin site and instructor dashboard" canvas, Instructor page).
// Classes, students, insights, assignments, content studio, exam packs, announcements.
// Figures come from what students in the class actually did; class-wide numbers are
// hidden below the privacy minimum, and AI questions are counted, never shown as text.
import { getLang, api, el, toast, currentUser, showSignIn, num, ago, store } from './common.js';

const T = {
  en: { masteryGain: 'Average gain per topic', masteryTopic: 'Topic', masteryStudents: 'Students with both checks', masteryPoints: 'Gain (percentage points)', masteryHidden: (n) => `Shown when at least ${n} students completed both checks on a topic.` },
  bn: { masteryGain: 'টপিক অনুযায়ী গড় উন্নতি', masteryTopic: 'টপিক', masteryStudents: 'দুই চেকই শেষ করেছে', masteryPoints: 'উন্নতি (শতাংশ পয়েন্ট)', masteryHidden: (n) => `একটি টপিকের দুই চেকই অন্তত ${n} জন শেষ করলে দেখাবে।` },
};
const $ = (id) => document.getElementById(id);
const content = $('adm-content');
const NAV = [
  ['overview', 'Overview', 'M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z'],
  ['students', 'Students', 'M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  ['insights', 'Insights', 'M3 3v18h18M7 15l4-4 3 3 5-6'],
  ['assignments', 'Assignments', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
  ['studio', 'Content studio', 'M15 10l4.5-2.5v9L15 14M3 6h12v12H3z'],
  ['packs', 'Exam packs', 'M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z'],
  ['announcements', 'Announcements', 'M3 11l15-6v14L3 13zM7 13v5a2 2 0 0 0 4 0v-3'],
  ['questions', 'Student questions', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  ['settings', 'Class settings', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2'],
];
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
function table(head, rows, emptyText = 'Nothing here yet.', rowAttrs = () => ({})) {
  if (!rows.length) return empty(emptyText);
  return el('div', { class: 'adm-table-wrap' }, el('table', { class: 'adm-table' }, el('thead', {}, el('tr', {}, ...head.map((h) => el('th', { scope: 'col', text: h })))),
    el('tbody', {}, ...rows.map((cells, i) => el('tr', rowAttrs(i), ...cells.map((c) => el('td', {}, c)))))));
}
const meter = (pct) => el('div', { class: 'adm-meter small' }, el('i', { style: `width:${pct ?? 0}%` }));
const initials = (email) => email.split('@')[0].split(/[._-]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const hidden = () => empty(`Shown when at least ${dash.minGroup} students in the class have done this, so no single student can be picked out.`);
function busy(btn, fn) { return async () => { btn.disabled = true; try { await fn(); } catch (e) { toast(e.message); } finally { btn.disabled = false; } }; }
const go = (h) => { if (location.hash === `#${h}`) route(); else location.hash = h; };
const currentClass = () => classes.find((c) => c.id === store.get('ll_class')) ?? classes[0] ?? null;

function shell(active) {
  $('adm-nav').replaceChildren(...NAV.map(([id, label, d]) => el('a', { href: `#${id}`, class: 'adm-nav-item', 'aria-current': id === active ? 'page' : null }, icon(d), el('span', { text: label }))));
  const sel = $('ins-class');
  sel.replaceChildren(...classes.map((c) => el('option', { value: c.id, text: c.name })), el('option', { value: '__new', text: '+ New class…' }));
  sel.value = currentClass()?.id ?? '__new';
  sel.onchange = () => { if (sel.value === '__new') go('new-class'); else { store.set('ll_class', sel.value); dash = null; route(); } };
  $('adm-who').textContent = me ? `${me.email} · ${me.role === 'admin' ? 'Admin' : 'Instructor'}` : '';
  $('ins-admin').hidden = me?.role !== 'admin';
}
function header(title) {
  const c = currentClass();
  $('adm-title').textContent = title;
  $('adm-sub').textContent = c ? `${c.name} · ${num(c.students)} students${c.pending ? ` · ${num(c.pending)} waiting` : ''}` : '';
  document.title = `${title} · Instructor · Loop & Logic`;
  $('ins-actions').replaceChildren(...(c ? [el('a', { class: 'adm-btn', href: '#announcements', text: 'Post an announcement' }), el('a', { class: 'adm-btn primary', href: '#assignments', text: 'New assignment' })] : []));
}

// ── pages ──
function newClassPage(existing) {
  const c = existing ? { ...existing } : { name: '', track: '', course: '', requireApproval: false };
  const save = button(existing ? 'Save' : 'Create class', null, 'primary');
  save.onclick = busy(save, async () => {
    const out = await api('POST', existing ? `/api/instructor/classes/${existing.id}` : '/api/instructor/classes', c);
    store.set('ll_class', out.id); toast(existing ? 'Saved.' : `Class created. Share the code ${out.code} with your students.`);
    await loadClasses(); go(existing ? 'settings' : 'overview');
  });
  return card(existing ? 'Class details' : 'Create your first class',
    existing ? null : el('p', { class: 'adm-hint', text: 'A class is one course section. Students join it with a code from their dashboard, and you see their progress here.' }),
    field('Class name', input(c.name, (v) => { c.name = v; }, { placeholder: 'CSE 2103 · Data Structures · Section A' })),
    row(field('Tutorial track', select(c.track ?? '', [['', 'None'], ...meta.tracks.map((t) => [t.id, t.title])], (v) => { c.track = v; })),
      field('Video course', select(c.course ?? '', [['', 'None'], ...meta.courses.map((x) => [x.id, x.title])], (v) => { c.course = v; }))),
    check('I approve each student before they join', c.requireApproval, (on) => { c.requireApproval = on; }),
    save);
}

function overviewPage() {
  const k = dash.kpis;
  const help = dash.roster.filter((r) => r.reasons.length).slice(0, 6);
  return [
    el('div', { class: 'adm-kpis' },
      kpi('Students', num(k.students), k.pending ? `${num(k.pending)} waiting to join` : null), kpi('Active this week', num(k.activeWeek), k.students ? `${Math.round((100 * k.activeWeek) / k.students)}% of the class` : null),
      kpi('Average progress', k.avgProgress === null ? '—' : `${k.avgProgress}%`, k.delivered ? `of ${num(k.delivered)} topics` : 'no tutorial track'), kpi('Quiz average', k.quizAvg === null ? '—' : `${k.quizAvg}%`, k.quizAvg === null ? `needs ${dash.minGroup}+ students` : null),
      kpi('May need help', num(k.needHelp), 'inactive or low scores')),
    k.students ? null : card('Invite your students', el('p', {}, 'Share this code. Students open their dashboard, choose “Join a class” and type it in: ', el('span', { class: 'ins-code', text: dash.class.code }))),
    row(
      card('Topics the class finds hardest', el('p', { class: 'adm-hint', text: 'Average quiz score per topic, lowest first.' }), dash.enough ? (dash.hardTopics.length ? el('div', {}, ...dash.hardTopics.map((t) => el('div', { class: 'ins-mistake' },
        el('div', { class: 'adm-progress-row' }, el('strong', { text: t.title }), el('span', { text: `${t.avg}% · ${num(t.students)} students` })), meter(100 - t.avg)))) : empty('No quizzes taken yet.')) : hidden()),
      card('Students who may need help', help.length ? el('div', { class: 'adm-list' }, ...help.map((r) => el('div', { class: 'adm-list-row' }, el('span', { class: 'ins-avatar risk', text: initials(r.email) }), el('span', {}, el('strong', { text: r.email }), el('br'), el('small', { class: 'adm-hint', text: r.reasons.join(' · ') })),
        el('a', { class: 'adm-btn small', href: `mailto:${r.email}`, text: 'Email' })))) : empty('Nobody right now.'))),
    row(
      card('Where students ask the AI for help', el('p', { class: 'adm-hint', text: 'Pages where several students asked questions. The questions themselves stay private.' }),
        dash.asks.length ? table(['Page', 'Students'], dash.asks.map((a) => [a.title, num(a.students)])) : hidden()),
      card('Hardest quiz questions', dash.hardQuestions.length ? table(['Question', 'Topic', 'Correct'], dash.hardQuestions.map((q) => [q.prompt, q.title, el('strong', { text: `${q.correct}%` })])) : hidden())),
  ];
}

function studentsPage() {
  const r = dash.roster;
  const sel = r.find((x) => x.learnerId === state.student) ?? r[0];
  const reqs = dash.pending.length ? card('Waiting to join', table(['Student', 'Asked', ''], dash.pending.map((p) => [p.email, ago(p.at), el('span', {},
    button('Accept', async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/requests/${encodeURIComponent(p.learnerId)}`, { approve: true }); toast('Accepted.'); await refresh(); }, 'primary small'), ' ',
    button('Decline', async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/requests/${encodeURIComponent(p.learnerId)}`, { approve: false }); toast('Declined.'); await refresh(); }, 'small danger'))]))) : null;
  const csv = () => {
    const lines = ['email,topics opened,quiz average,labs run,last active,' + dash.assignments.map((a) => `"${a.title.replace(/"/g, '""')}"`).join(',')];
    for (const s of r) lines.push([s.email, s.done, s.quizAvg ?? '', s.labs, s.lastActive ?? '', ...s.assignments.map((a) => `${a.done}/${a.of}`)].join(','));
    const a = el('a', { href: URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' })), download: `${dash.class.name.replace(/[^\w-]+/g, '-')}.csv` });
    a.click(); URL.revokeObjectURL(a.href);
  };
  return [
    card('', row(el('span', {}, 'Class code '), el('span', { class: 'ins-code', text: dash.class.code }), el('span', { class: 'adm-hint', text: 'Students type it under “Join a class” on their dashboard.' }), button('Copy invite text', () => navigator.clipboard?.writeText(`Join my class "${dash.class.name}" on Loop & Logic: sign in at ${location.origin}/dashboard.html, choose "Join a class" and enter ${dash.class.code}.`).then(() => toast('Copied.')), 'line small'), button('Export progress (CSV)', csv, 'line small'))),
    reqs,
    row(
      el('div', { class: 'adm-col wide' }, card('Students', table(['Student', 'Topics opened', 'Quiz average', 'Labs', 'Last active'], r.map((s) => [
        el('button', { type: 'button', class: 'ins-who', onclick: () => { state.student = s.learnerId; route(); } }, el('span', { class: `ins-avatar${s.reasons.length ? ' risk' : ''}`, text: initials(s.email) }), el('strong', { text: s.email })),
        el('div', { class: 'adm-inline' }, meter(dash.kpis.delivered ? Math.round((100 * s.done) / dash.kpis.delivered) : 0), el('span', { text: `${num(s.done)}${dash.kpis.delivered ? `/${num(dash.kpis.delivered)}` : ''}` })),
        s.quizAvg === null ? '—' : el('strong', { style: s.quizAvg < 60 ? 'color:#8f1d14' : '', text: `${s.quizAvg}%` }), num(s.labs), s.lastActive ? ago(s.lastActive) : 'not started',
      ]), 'No students yet. Share the class code.', (i) => ({ class: r[i] === sel ? 'sel' : '' })))),
      sel ? el('div', { class: 'adm-col' }, card(sel.email,
        el('span', { class: 'adm-hint', text: `Joined ${new Date(sel.joinedAt).toLocaleDateString('en-GB')} · last active ${sel.lastActive ? ago(sel.lastActive) : 'never'}` }),
        sel.modules.length ? el('div', { class: 'adm-stack' }, el('span', { class: 'adm-hint', text: 'Progress by module' }), ...sel.modules.filter((m) => m.pct !== null).map((m) => el('div', {}, el('div', { class: 'adm-progress-row' }, el('span', { text: m.title }), el('span', { text: `${m.pct}%` })), el('div', { class: 'adm-meter' }, el('i', { style: `width:${m.pct}%` }))))) : null,
        row(kpi('Quiz average', sel.quizAvg === null ? '—' : `${sel.quizAvg}%`), kpi('Questions to the AI', num(sel.asks))),
        dash.assignments.length ? el('div', { class: 'adm-list' }, ...dash.assignments.map((a) => { const x = sel.assignments.find((y) => y.id === a.id); return el('div', { class: 'adm-list-row' }, el('span', { text: a.title }), chip(`${x.done}/${x.of}`, x.done === x.of ? 'ok' : '')); })) : null,
        sel.reasons.length ? el('p', { class: 'adm-ok', style: 'background:#fde8e6;border-color:#f0c8c3;color:#8f1d14', text: sel.reasons.join(' · ') }) : null,
        el('a', { class: 'adm-btn primary', href: `mailto:${sel.email}`, text: 'Email this student' }))) : null),
  ];
}

function insightsPage() {
  const L = T[getLang()];
  return [
    card(L.masteryGain, dash.masteryGain?.length ? table([L.masteryTopic, L.masteryPoints, L.masteryStudents], dash.masteryGain.map((r) => [r.title, `${r.gain > 0 ? '+' : ''}${r.gain}`, num(r.students)])) : empty(L.masteryHidden(dash.minGroup))),
    card('How far the class has got, module by module', el('p', { class: 'adm-hint', text: 'Share of students who opened every ready topic in the module.' }),
      dash.heat ? el('div', { class: 'ins-heat' }, ...dash.heat.map((m) => el('div', { class: `ins-cell ${m.pct === null ? 'none' : m.pct >= 75 ? 'hi' : m.pct >= 40 ? 'mid' : 'lo'}` }, el('strong', { text: m.pct === null ? '—' : `${m.pct}%` }), el('span', { text: m.title })))) : dash.class.track ? hidden() : empty('Link a tutorial track to the class in Class settings.')),
    row(
      card('Labs students ran', dash.labs.length ? table(['Lab', 'Topic', 'Students'], dash.labs.map((l) => [l.lab, l.title, num(l.students)])) : empty('No labs run yet.')),
      card('Video quizzes', dash.class.course ? (dash.videoQuizzes.length ? table(['Video', 'Students', 'Average'], dash.videoQuizzes.map((v) => [v.title, num(v.students), `${v.avg}%`])) : hidden()) : empty('Link a video course to the class in Class settings.'))),
    card('Topics the class finds hardest', dash.hardTopics.length ? table(['Topic', 'Average quiz score', 'Students'], dash.hardTopics.map((t) => [t.title, `${t.avg}%`, num(t.students)])) : hidden()),
  ];
}

async function assignmentsPage() {
  const tr = dash.track;
  const labIdx = tr ? await api('GET', `/api/learn-labs/${tr.id}`).catch(() => null) : null;
  const labsOf = (topic) => labIdx?.topics.find((x) => x.id === topic)?.labs ?? [];
  const a = { title: '', due: '', marks: 10, passMark: 60, hintsOnly: true, items: [] };
  const topics = tr ? tr.modules.flatMap((m) => m.topics.map((t) => ({ ...t, module: m.title }))) : [];
  const itemsHost = el('div', { class: 'ins-items' });
  const drawItems = () => itemsHost.replaceChildren(...a.items.map((it, i) => {
    return el('div', { class: 'ins-item' },
      select(it.kind, [['read', 'Read'], ['quiz', 'Pass the quiz'], ['lab', 'Run the lab']], (v) => { it.kind = v; drawItems(); }, { 'aria-label': 'What to do' }),
      select(it.topic, topics.map((x) => [x.id, `${x.module} · ${x.title}`]), (v) => { it.topic = v; it.lab = null; drawItems(); }, { 'aria-label': 'Topic' }),
      it.kind === 'lab' ? (labsOf(it.topic).length ? select(it.lab ?? (it.lab = labsOf(it.topic)[0].id), labsOf(it.topic).map((l) => [l.id, l.title]), (v) => { it.lab = v; }, { 'aria-label': 'Lab' }) : el('span', { class: 'adm-hint', text: 'This topic has no lab.' })) : null,
      button('Remove', () => { a.items.splice(i, 1); drawItems(); }, 'small danger'));
  }), tr ? button('+ Add a topic, quiz or lab', () => { a.items.push({ kind: 'read', topic: topics[0]?.id }); drawItems(); }, 'line small') : empty('Link a tutorial track to the class first (Class settings).'));
  drawItems();
  const save = button(`Give to ${dash.class.name}`, null, 'primary');
  save.onclick = busy(save, async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/assignments`, { ...a, items: a.items.map((it) => ({ ...it, track: tr?.id })) }); toast('Assignment given.'); await refresh(); });
  return [row(
    el('div', { class: 'adm-col wide' }, card('Assignments', dash.assignments.length ? el('div', { class: 'adm-stack' }, ...dash.assignments.map((x) => el('div', { class: 'adm-sub-card' },
      row(el('strong', { text: x.title }), chip(x.due ? `due ${new Date(x.due).toLocaleDateString('en-GB')}` : 'no due date', x.due && Date.parse(x.due) < Date.now() ? '' : 'ok')),
      el('span', { class: 'adm-hint', text: x.items.map((it) => `${{ read: 'Read', quiz: 'Quiz', lab: 'Lab' }[it.kind]}: ${it.title}`).join(' · ') }),
      el('div', { class: 'adm-inline' }, el('div', { class: 'adm-meter', style: 'flex:1' }, el('i', { style: `width:${dash.kpis.students ? Math.round((100 * x.submitted) / dash.kpis.students) : 0}%` })), el('span', { text: `${num(x.submitted)}/${num(dash.kpis.students)} done` })),
      button('Delete', async () => { if (!confirm(`Delete "${x.title}"?`)) return; await api('DELETE', `/api/instructor/classes/${dash.class.id}/assignments/${x.id}`); toast('Deleted.'); await refresh(); }, 'small danger')))) : empty('No assignments yet.'))),
    el('div', { class: 'adm-col' }, card('New assignment',
      field('Title', input('', (v) => { a.title = v; }, { placeholder: 'Hashing practice set' })),
      el('div', { class: 'adm-field' }, el('span', { class: 'adm-label', text: 'What students must do' }), itemsHost),
      row(field('Due', input('', (v) => { a.due = v; }, { type: 'date' })), field('Marks', input(10, (v) => { a.marks = Number(v); }, { type: 'number', min: '0' })), field('Quiz pass mark (%)', input(60, (v) => { a.passMark = Number(v); }, { type: 'number', min: '0', max: '100' }))),
      el('p', { class: 'adm-hint', text: 'Progress updates by itself: reading a topic, passing its quiz or running the lab ticks the item off.' }),
      save)))];
}

async function studioPage() {
  const s = await api('GET', `/api/instructor/classes/${dash.class.id}/studio`);
  if (!s.course) return [card('Content studio', empty('Link a video course to this class in Class settings to write video quizzes and add materials.'))];
  return [card(`${s.course.title}: video quizzes and materials`,
    el('p', { class: 'adm-hint', text: 'Open a video to add a quiz (shown after the video), class materials and “Try now” code. You are signed in as an instructor, so no key is needed.' }),
    table(['#', 'Video', 'Length', 'Quiz', 'Materials', ''], s.videos.map((v) => [num(v.n), v.title, v.duration, v.quiz ? chip(`${v.quiz} questions`, 'ok') : '—', v.materials ? num(v.materials) : '—',
      el('a', { class: 'adm-btn small line', href: `/watch.html?course=${encodeURIComponent(s.course.id)}&v=${encodeURIComponent(v.id)}#edit`, target: '_blank', rel: 'noopener', text: 'Edit' })])))];
}

async function packsPage() {
  const packs = await api('GET', '/api/instructor/packs');
  const p = { title: '', course: '', description: '', lessons: '', papers: '', mockTests: 0, files: [] };
  const filesHost = el('div', { class: 'adm-stack' });
  const drawFiles = () => filesHost.replaceChildren(...p.files.map((f, i) => row(field('File name', input(f.name, (v) => { f.name = v; })), field('Link (https://)', input(f.url, (v) => { f.url = v; }, { type: 'url' })), button('Remove', () => { p.files.splice(i, 1); drawFiles(); }, 'small danger'))),
    button('+ Add a file link', () => { p.files.push({ name: '', url: '' }); drawFiles(); }, 'line small'));
  drawFiles();
  const save = async (submit) => { await api('POST', '/api/instructor/packs', { ...p, submit }); toast(submit ? 'Sent to the admin for review.' : 'Saved as a draft.'); route(); };
  const draft = button('Save draft', null, 'line'); draft.onclick = busy(draft, () => save(false));
  const send = button('Submit for admin review', null, 'primary'); send.onclick = busy(send, () => save(true));
  return [row(
    el('div', { class: 'adm-col' }, card('My exam packs', packs.length ? el('div', { class: 'adm-list' }, ...packs.map((x) => el('div', { class: 'adm-list-row' }, el('strong', { text: x.title }),
      el('span', { class: 'adm-hint', text: `${num(x.lessons.length)} lessons · ${num(x.papers.length)} past papers · ${num(x.mockTests)} mock tests${x.note ? ` · Note: ${x.note}` : ''}` }),
      chip({ draft: 'Draft', review: 'With the admin', approved: 'Approved' }[x.status] ?? x.status, x.status === 'approved' ? 'ok' : x.status === 'review' ? 'info' : '')))) : empty('No packs yet.'))),
    el('div', { class: 'adm-col wide' }, card('New exam pack',
      el('p', { class: 'adm-hint', text: 'Exam packs are sold in Pro. An admin checks each pack before it goes on sale.' }),
      row(field('Pack name', input('', (v) => { p.title = v; }, { placeholder: 'Data Structures Midterm Pack' })), field('For course', select('', [['', 'Any'], ...meta.courses.map((c) => [c.id, c.title])], (v) => { p.course = v; }))),
      field('What it covers', area('', (v) => { p.description = v; }, 3)),
      row(field('Lessons (one per line)', area('', (v) => { p.lessons = v; }, 5)), field('Solved past papers (one per line)', area('', (v) => { p.papers = v; }, 5))),
      field('Timed mock tests', input(0, (v) => { p.mockTests = Number(v); }, { type: 'number', min: '0', max: '50' })),
      el('div', { class: 'adm-field' }, el('span', { class: 'adm-label', text: 'Files (links to PDFs or slides)' }), filesHost),
      row(draft, send))))];
}

function announcementsPage() {
  const p = { title: '', body: '', pinned: false };
  const send = button('Post', null, 'primary');
  send.onclick = busy(send, async () => { await api('POST', `/api/instructor/classes/${dash.class.id}/posts`, p); toast('Posted. Students see it on their dashboard.'); await refresh(); });
  return [row(
    el('div', { class: 'adm-col' }, card(`Post to ${dash.class.name}`,
      field('Title', input('', (v) => { p.title = v; }, { placeholder: 'Midterm syllabus' })),
      field('Message', area('', (v) => { p.body = v; }, 6)),
      check('Pin to the top of the class', false, (on) => { p.pinned = on; }),
      el('p', { class: 'adm-hint', text: 'Students see posts under “My classes” on their dashboard.' }), send)),
    el('div', { class: 'adm-col' }, card('Earlier posts', dash.posts.length ? el('div', {}, ...dash.posts.map((x) => el('div', { class: 'ins-post' },
      row(el('strong', { text: `${x.pinned ? '📌 ' : ''}${x.title}` }), el('span', { class: 'adm-hint', text: ago(x.at) }), button('Delete', async () => { if (!confirm('Delete this post?')) return; await api('DELETE', `/api/instructor/classes/${dash.class.id}/posts/${x.id}`); await refresh(); }, 'small danger')),
      el('p', { text: x.body })))) : empty('Nothing posted yet.'))))];
}

function questionsPage() {
  return [card('Where your students ask the AI Teacher for help',
    el('p', { class: 'adm-hint', text: 'Pages where at least a few students in this class asked the AI. To protect students, the questions themselves are never shown to instructors.' }),
    dash.asks.length ? table(['Page', 'Students who asked'], dash.asks.map((a) => [a.title, num(a.students)])) : hidden()),
  card('Hardest quiz questions', dash.hardQuestions.length ? table(['Question', 'Topic', 'Answers', 'Correct'], dash.hardQuestions.map((q) => [q.prompt, q.title, num(q.answers), `${q.correct}%`])) : hidden())];
}

function settingsPage() {
  const c = dash.class;
  const newCode = button('Make a new code', null, 'line small');
  newCode.onclick = busy(newCode, async () => { if (!confirm('The old code will stop working. Continue?')) return; const r = await api('POST', `/api/instructor/classes/${c.id}/code`); toast(`New code: ${r.code}`); await loadClasses(); await refresh(); });
  return [newClassPage(c), card('Class code', row(el('span', { class: 'ins-code', text: c.code }), newCode)),
    card('Archive the class', el('p', { class: 'adm-hint', text: 'Students can no longer see it, and it leaves your list. Their own progress is kept.' }),
      button('Archive this class', async () => { if (!confirm(`Archive "${c.name}"?`)) return; await api('DELETE', `/api/instructor/classes/${c.id}`); store.del('ll_class'); toast('Archived.'); await loadClasses(); go('overview'); }, 'danger'))];
}

// ── loading and routing ──
async function loadClasses() { classes = await api('GET', '/api/instructor/classes'); }
async function refresh() { dash = null; await route(); }
const PAGES = { overview: overviewPage, students: studentsPage, insights: insightsPage, assignments: assignmentsPage, studio: studioPage, packs: packsPage, announcements: announcementsPage, questions: questionsPage, settings: settingsPage };
const TITLES = { overview: 'Class overview', students: 'Students', insights: 'Insights', assignments: 'Assignments', studio: 'Content studio', packs: 'Exam packs', announcements: 'Announcements', questions: 'Student questions', settings: 'Class settings' };
let routeSeq = 0;
async function route() {
  const name = location.hash.slice(1) || 'overview';
  const my = ++routeSeq;
  if (name === 'new-class' || !classes.length) {
    shell(''); header(classes.length ? 'New class' : 'Welcome');
    content.replaceChildren(newClassPage());
    return;
  }
  const c = currentClass();
  shell(PAGES[name] ? name : 'overview'); header(TITLES[name] ?? TITLES.overview);
  content.replaceChildren(el('div', { class: 'skeleton' }));
  try {
    if (!dash || dash.class.id !== c.id) {
      dash = await api('GET', `/api/instructor/classes/${c.id}`);
      Object.assign(c, { students: dash.kpis.students, pending: dash.kpis.pending });
    }
    if (name === 'packs' || name === 'studio') { /* these load their own data */ }
    const nodes = await (PAGES[name] ?? overviewPage)();
    if (my === routeSeq) { content.replaceChildren(...[nodes].flat().filter(Boolean)); header(TITLES[name] ?? TITLES.overview); }
  } catch (e) {
    if (my === routeSeq) content.replaceChildren(card('Something went wrong', el('p', { text: e.message }), button('Try again', refresh, 'line')));
  }
}

async function start() {
  if (!currentUser()) {
    content.replaceChildren(card('Instructors only', el('p', { text: 'Sign in with the account an admin gave the instructor role.' }), button('Sign in', () => showSignIn(), 'primary')));
    showSignIn();
    return;
  }
  try {
    const m = await api('GET', '/api/me');
    me = { email: m.email, role: m.role };
    if (m.role !== 'admin' && m.role !== 'instructor') throw Object.assign(new Error('This account is not an instructor yet. Ask an admin to give you the instructor role (Admin site → Users and roles).'), { status: 403 });
    [meta] = await Promise.all([api('GET', '/api/instructor/meta'), loadClasses()]);
  } catch (e) {
    content.replaceChildren(card('Instructors only', el('p', { text: e.message }), el('a', { class: 'adm-btn line', href: '/', text: 'Back to the site' })));
    return;
  }
  window.addEventListener('hashchange', route);
  route();
}
start();
