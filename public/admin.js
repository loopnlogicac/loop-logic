import { downloadFile } from './download.js';
// Admin site (design: "admin site and instructor dashboard" canvas, Admin page).
// Every number shown here is real; nothing is sample data. Pages are chosen by the
// URL hash: #overview, #content, #topic/<id|new>, #track/new, #course/<id|new>,
// #posts, #post/<id|new>, #users, #ai, #pro, #coupons, #ads, #ad/<id|new>, #site, #settings, #audit.
import { getLang, api, el, toast, currentUser, showSignIn, num, ago, getConfig } from './common.js';

const T = {
  en: { backup: 'Backup', downloadBackup: 'Download backup (JSON)', backupHelp: 'Download stored documents grouped by kind. API keys and credentials are excluded.', revenue: 'Revenue report', revenueHelp: 'Approved orders only, grouped by approval month in Bangladesh time. Fully discounted orders add ৳0.', month: 'Month', course: 'Course', method: 'Method', orders: 'Approved orders', amount: 'Revenue (BDT)', total: 'Total revenue', downloadCsv: 'Download CSV', noRevenue: 'No approved orders yet.', unknown: 'Unknown date', free: 'Fully discounted', other: 'Other' },
  bn: { backup: 'ব্যাকআপ', downloadBackup: 'ব্যাকআপ ডাউনলোড করো (JSON)', backupHelp: 'ধরন অনুযায়ী সেভ করা ডকুমেন্ট ডাউনলোড করো। API key আর সাইন ইনের গোপন তথ্য বাদ থাকবে।', revenue: 'আয়ের রিপোর্ট', revenueHelp: 'শুধু অনুমোদিত অর্ডার, বাংলাদেশের সময়ে অনুমোদনের মাস অনুযায়ী। পুরো ছাড়ের অর্ডারে আয় ৳০।', month: 'মাস', course: 'কোর্স', method: 'মাধ্যম', orders: 'অনুমোদিত অর্ডার', amount: 'আয় (BDT)', total: 'মোট আয়', downloadCsv: 'CSV ডাউনলোড করো', noRevenue: 'এখনো কোনো অর্ডার অনুমোদিত হয়নি।', unknown: 'তারিখ নেই', free: 'পুরো ছাড়', other: 'অন্যান্য' },
};
const $ = (id) => document.getElementById(id);
const content = $('adm-content');
const NAV = [
  ['overview', 'Overview', 'M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z'],
  ['content', 'Content', 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5zM20 17v4H6.5'],
  ['posts', 'Posts', 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z'],
  ['users', 'Users and roles', 'M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  ['ai', 'AI Teacher', 'M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5z'],
  ['pro', 'Pro and waitlist', 'M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5L5.5 21l2-7.5L2 9h7z'],
  ['orders', 'Orders', 'M3 6h18M3 12h18M3 18h12M19 16l2 2 4-4'],
  ['coupons', 'Coupons', 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01'],
  ['ads', 'Ad banners', 'M3 5h18v10H3zM7 19h10M12 15v4'],
  ['site', 'Site and announcements', 'M3 11l15-6v14L3 13zM7 13v5a2 2 0 0 0 4 0v-3'],
  ['settings', 'Settings', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4'],
  ['audit', 'Audit log', 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
];
const PARENT = { topic: 'content', track: 'content', course: 'content', post: 'posts', ad: 'ads' };
const TINTS = ['#e6efb5', '#d9ecf2', '#f4e3c8', '#e5e0f4', '#f3dcd6', '#dcefe4'];
const SUBJECTS = [['cse', 'Computer science'], ['math', 'Mathematics'], ['physics', 'Physics'], ['eee', 'Electrical & electronics'], ['business', 'Business'], ['science', 'General science']];
let me = null;

// ── small building blocks ──
const icon = (d, size = 18) => { const s = el('span', { class: 'adm-ico', 'aria-hidden': 'true' }); s.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`; return s; };
const card = (title, ...kids) => el('section', { class: 'adm-card' }, title ? el('h2', { text: title }) : null, ...kids);
const chip = (text, kind = '') => el('span', { class: `adm-chip ${kind}`, text });
const button = (text, onclick, kind = '') => el('button', { type: 'button', class: `adm-btn ${kind}`, text, onclick });
const link = (text, href, kind = '') => el('a', { class: `adm-btn ${kind}`, href, text });
let fieldSeq = 0;
function field(label, input, hint) {
  const id = input.id || `f${++fieldSeq}`;
  input.id = id;
  return el('div', { class: 'adm-field' }, el('label', { for: id, text: label }), input, hint ? el('span', { class: 'adm-hint', text: hint }) : null);
}
const input = (value, oninput, attrs = {}) => el('input', { type: 'text', value: value ?? '', oninput: (e) => oninput(e.target.value), ...attrs });
const area = (value, oninput, rows = 4, attrs = {}) => { const t = el('textarea', { rows: String(rows), oninput: (e) => oninput(e.target.value), ...attrs }); t.value = value ?? ''; return t; };
function select(value, options, onchange, attrs = {}) {
  const s = el('select', { onchange: (e) => onchange(e.target.value), ...attrs }, ...options.map(([v, label]) => el('option', { value: v, text: label })));
  s.value = value ?? options[0]?.[0] ?? '';
  return s;
}
const check = (label, checked, onchange) => el('label', { class: 'adm-check' }, el('input', { type: 'checkbox', checked: checked || null, onchange: (e) => onchange(e.target.checked) }), el('span', { text: label }));
const row = (...kids) => el('div', { class: 'adm-row' }, ...kids);
const grid = (...kids) => el('div', { class: 'adm-grid' }, ...kids);
const kpi = (label, value, note) => el('div', { class: 'adm-kpi' }, el('span', { text: label }), el('strong', { text: value }), note ? el('small', { text: note }) : null);
function table(head, rows, empty = 'Nothing here yet.') {
  if (!rows.length) return el('p', { class: 'adm-empty', text: empty });
  return el('div', { class: 'adm-table-wrap' }, el('table', { class: 'adm-table' },
    el('thead', {}, el('tr', {}, ...head.map((h) => el('th', { scope: 'col', text: h })))),
    el('tbody', {}, ...rows.map((cells) => el('tr', {}, ...cells.map((c) => el('td', {}, c)))))));
}
const date = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—');
const dateOnly = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');
const statusChip = (s) => chip(s, { published: 'ok', running: 'ok', active: 'ok', scheduled: 'info', draft: '', stopped: '', paused: '' }[s] ?? '');
function busy(btn, fn) {
  return async () => {
    btn.disabled = true;
    try { await fn(); } catch (e) { toast(e.message); } finally { btn.disabled = false; }
  };
}
const go = (hash) => { if (location.hash === `#${hash}`) route(); else location.hash = hash; };

/** Markdown helper bar above a text area. */
function mdToolbar(textarea) {
  const wrap = (before, after = before, ph = 'text') => () => {
    const { selectionStart: a, selectionEnd: b, value } = textarea;
    const sel = value.slice(a, b) || ph;
    textarea.setRangeText(before + sel + after, a, b, 'select');
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
  };
  const line = (prefix) => () => {
    const { selectionStart: a, value } = textarea;
    const start = value.lastIndexOf('\n', a - 1) + 1;
    textarea.setRangeText(prefix, start, start, 'end');
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
  };
  const b = (label, title, fn) => el('button', { type: 'button', class: 'adm-tool', title, 'aria-label': title, text: label, onclick: fn });
  return el('div', { class: 'adm-toolbar', role: 'toolbar', 'aria-label': 'Formatting' },
    b('H2', 'Heading', line('## ')), b('H3', 'Smaller heading', line('### ')), b('B', 'Bold', wrap('**')), b('I', 'Italic', wrap('*')), b('</>', 'Inline code', wrap('`')),
    b('{ }', 'Code block', wrap('\n```c\n', '\n```\n', 'code')), b('•', 'Bulleted list', line('- ')), b('1.', 'Numbered list', line('1. ')), b('❝', 'Quote', line('> ')), b('↗', 'Link', wrap('[', '](https://)', 'link text')),
    el('span', { class: 'adm-hint', text: 'Markdown: ## heading, **bold**, `code`' }));
}
/** English / Bangla tabs over two text areas. */
function biEditor(label, obj, key, rows = 12) {
  let lang = 'en';
  const ta = { en: area(obj[key]?.en, (v) => { obj[key].en = v; }, rows, { 'aria-label': `${label} (English)` }), bn: area(obj[key]?.bn, (v) => { obj[key].bn = v; }, rows, { 'aria-label': `${label} (Bangla)`, lang: 'bn' }) };
  obj[key] ??= { en: '', bn: '' };
  const host = el('div', { class: 'adm-bi-body' });
  const tabs = el('div', { class: 'adm-tabs small', role: 'tablist' });
  const draw = () => {
    tabs.replaceChildren(...[['en', 'English'], ['bn', 'বাংলা']].map(([l, name]) => el('button', { type: 'button', role: 'tab', 'aria-selected': String(l === lang), text: name + (l === 'bn' && !obj[key].bn?.trim() ? ' (not written yet)' : ''), onclick: () => { lang = l; draw(); } })));
    host.replaceChildren(mdToolbar(ta[lang]), ta[lang]);
  };
  draw();
  return el('div', { class: 'adm-field' }, el('span', { class: 'adm-label', text: label }), tabs, host);
}

// ── shell ──
function mountShell(active) {
  $('adm-nav').replaceChildren(...NAV.map(([id, label, d]) => el('a', { href: `#${id}`, class: 'adm-nav-item', 'aria-current': id === active ? 'page' : null }, icon(d), el('span', { text: label }))));
  $('adm-who').textContent = me ? `Signed in as ${me.email} · Admin` : '';
}
function setTitle(title, sub) {
  $('adm-title').textContent = title;
  $('adm-sub').textContent = sub ?? '';
  document.title = `${title} · Admin · Loop & Logic`;
}
function createMenu() {
  const btn = $('adm-create-btn'), menu = $('adm-create-menu');
  const items = [['topic/new', 'New tutorial topic', 'A lesson in an existing track'], ['track/new', 'New tutorial track', 'A whole new subject with its modules'], ['course/new', 'New course', 'Free (YouTube playlist) or paid (with samples)'], ['post/new', 'New post', 'Blog, news, changelog or exam notice'], ['coupons', 'New coupon code', 'A discount for a paid course or Pro'], ['ad/new', 'New ad banner', 'Promote a course on chosen pages']];
  menu.replaceChildren(...items.map(([hash, label, desc]) => el('a', { role: 'menuitem', href: `#${hash}`, onclick: () => close() }, el('strong', { text: label }), el('span', { text: desc }))));
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); };
  document.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ── overview ──
async function overview() {
  setTitle('Overview', 'Everything that needs you today, in one place');
  const d = await api('GET', '/api/admin/overview');
  const k = d.kpis;
  const max = Math.max(1, ...d.activeByDay.map((x) => x.learners));
  return [
    el('div', { class: 'adm-kpis' },
      kpi('Active learners today', num(k.activeToday), `${num(k.activeWeek)} this week`), kpi('Signed-in accounts', num(k.members), `+${num(k.newMembersWeek)} this week`),
      kpi('AI answers today', num(k.aiToday)), kpi('On the Pro waitlist', num(k.waitlist)), kpi('Topics live', num(k.topics), `${num(k.labs)} labs`), kpi('Courses', num(k.courses))),
    row(
      card('Active learners, last 14 days', el('div', { class: 'adm-bars', role: 'img', 'aria-label': d.activeByDay.map((x) => `${x.day}: ${x.learners}`).join(', ') },
        ...d.activeByDay.map((x, i) => el('div', { class: 'adm-bar' }, el('span', { text: num(x.learners) }), el('i', { class: i === d.activeByDay.length - 1 ? 'now' : '', style: `height:${Math.round((x.learners / max) * 140) + 2}px` }), el('small', { text: x.day.slice(8) }))))),
      card('Needs your attention', d.attention.length ? el('div', { class: 'adm-list' }, ...d.attention.map((a) => el('div', { class: 'adm-list-row' }, chip(a.tag, a.tag === 'Setup' ? 'warn' : ''), el('span', { text: a.text }), el('a', { href: `#${a.go}`, text: 'Open' })))) : el('p', { class: 'adm-empty', text: 'All clear.' }))),
    card('Tutorial content', el('div', { class: 'adm-progress-list' }, ...d.tracks.map((x) => el('div', {},
      el('div', { class: 'adm-progress-row' }, el('strong', { text: x.title }), el('span', { text: `${num(x.delivered)}/${num(x.planned)}` })),
      el('div', { class: 'adm-meter' }, el('i', { style: `width:${Math.round((100 * x.delivered) / Math.max(1, x.planned))}%` })))))),
  ];
}

// ── content: tracks, admin topics, courses, labs ──
let contentTab = 'tutorials';
async function contentPage() {
  setTitle('Content', 'Tutorials, video courses and labs');
  const [tut, courses] = await Promise.all([api('GET', '/api/admin/tutorials'), api('GET', '/api/admin/courses')]);
  const tabs = el('div', { class: 'adm-tabs', role: 'tablist' }, ...[['tutorials', 'Tutorials'], ['courses', 'Video courses'], ['labs', 'Labs']].map(([id, label]) =>
    el('button', { type: 'button', role: 'tab', 'aria-selected': String(id === contentTab), text: label, onclick: () => { contentTab = id; route(); } })));
  const actions = row(link('+ New topic', '#topic/new', 'line'), link('+ New track', '#track/new', 'line'), link('+ New course', '#course/new', 'line'));
  let body;
  if (contentTab === 'tutorials') {
    body = [
      card('Tracks', table(['Track', 'Topics live', 'Labs', 'Bangla text', 'Written here', 'Visible'], tut.tracks.map((x) => [
        el('span', {}, el('strong', { text: x.title }), x.custom ? chip('added here', 'info') : null),
        el('div', { class: 'adm-inline' }, el('div', { class: 'adm-meter small' }, el('i', { style: `width:${Math.round((100 * x.delivered) / Math.max(1, x.planned))}%` })), el('span', { text: `${num(x.delivered)}/${num(x.planned)}` })),
        num(x.labs), `${num(x.bangla)}/${num(x.delivered)}`, num(x.customTopics),
        x.custom ? '—' : check(x.hidden ? 'Hidden' : 'On', !x.hidden, async (on) => { try { await api('POST', `/api/admin/tracks/${x.id}/visibility`, { hidden: !on }); toast(on ? 'Track is visible.' : 'Track is hidden from learners.'); route(); } catch (e) { toast(e.message); } }),
      ]))),
      card('Topics written in the admin site', table(['Topic', 'Track', 'Status', 'Checker', 'Updated', ''], tut.topics.map((tp) => {
        const errors = tp.issues.filter((i) => i.level === 'error').length;
        return [el('strong', { text: tp.title.en || '(untitled)' }), tp.track, statusChip(tp.status), errors ? chip(`${errors} to fix`, 'bad') : chip('ready', 'ok'), date(tp.updatedAt), el('a', { href: `#topic/${tp.id}`, text: 'Edit' })];
      }), 'No topics written here yet. Use "+ New topic". Codex topics arrive through GitHub.')),
    ];
  } else if (contentTab === 'courses') {
    body = [
      card('Courses added here', table(['Course', 'Type', 'Videos', 'Status', 'Updated', ''], courses.added.map((c) => [
        el('strong', { text: c.title.en }), c.access === 'paid' ? chip(`Paid · ৳ ${num(c.price)}`, 'gold') : chip('Free', 'ok'),
        `${num(c.counts.videos)}${c.access === 'paid' ? ` (${num(c.counts.samples)} samples)` : ''}`, statusChip(c.published ? 'published' : 'draft'), date(c.updatedAt), el('a', { href: `#course/${c.id}`, text: 'Edit' })]), 'No courses added yet. Use "+ New course".')),
      card('Built-in courses (from the YouTube channel)', table(['Course', 'Videos', 'Visible'], courses.builtIn.map((c) => [
        el('strong', { text: c.title }), num(c.videos),
        check(c.hidden ? 'Hidden' : 'On', !c.hidden, async (on) => { try { await api('POST', `/api/admin/builtin-courses/${c.id}/visibility`, { hidden: !on }); toast(on ? 'Course is visible.' : 'Course is hidden.'); route(); } catch (e) { toast(e.message); } })]))),
    ];
  } else {
    const withLabs = tut.tracks.filter((x) => x.labs);
    body = [el('div', { class: 'adm-kpis' }, ...withLabs.map((x) => kpi(x.title, `${num(x.labs)} labs`))),
      card('', el('p', { class: 'adm-empty', text: 'Labs come with Codex topics (they need a checked simulator). Learners see them course by course on the homepage under Labs.' }))];
  }
  return [tabs, actions, ...body];
}

function issuesBox(issues) {
  return el('div', { class: 'adm-issues' }, ...issues.map((i) => el('div', { class: `adm-issue ${i.level}` }, el('span', { class: 'adm-issue-mark', text: i.level === 'ok' ? '✓' : i.level === 'error' ? '✕' : '!' }), el('span', { text: i.text }))));
}

async function topicPage(id) {
  const tut = await api('GET', '/api/admin/tutorials');
  const isNew = id === 'new';
  const tp = isNew ? { track: 'data-structures', module: '', title: { en: '', bn: '' }, summary: { en: '', bn: '' }, level: 'beginner', minutes: 10, body: { en: '', bn: '' }, examples: [], quiz: [], status: 'draft', issues: [] } : await api('GET', `/api/admin/topics/${encodeURIComponent(id)}`);
  setTitle(isNew ? 'New tutorial topic' : `Edit: ${tp.title.en}`, 'Write it here, check it, then publish');
  const tracks = tut.tracks;
  const moduleSel = el('div');
  const drawModules = () => {
    const tr = tracks.find((x) => x.id === tp.track) ?? tracks[0];
    tp.track = tr.id;
    if (!tr.modules.some((m) => m.id === tp.module)) tp.module = tr.modules[0]?.id ?? '';
    moduleSel.replaceChildren(field('Module', select(tp.module, tr.modules.map((m) => [m.id, m.title]), (v) => { tp.module = v; })));
  };
  drawModules();
  const exHost = el('div', { class: 'adm-stack' });
  const drawExamples = () => exHost.replaceChildren(...tp.examples.map((ex, i) => el('div', { class: 'adm-sub-card' },
    row(field(`Example ${i + 1} title`, input(ex.title, (v) => { ex.title = v; })), field('Language', select(ex.language || 'c', [['c', 'C'], ['python', 'Python'], ['java', 'Java'], ['sql', 'SQL'], ['text', 'Other']], (v) => { ex.language = v; }))),
    field('Code', area(ex.code, (v) => { ex.code = v; }, 7, { class: 'mono', spellcheck: 'false' })),
    field('Output (paste what the program prints)', area(ex.output, (v) => { ex.output = v; }, 3, { class: 'mono', spellcheck: 'false' })),
    button('Remove example', () => { tp.examples.splice(i, 1); drawExamples(); }, 'danger small'))),
    button('+ Add a code example', () => { tp.examples.push({ title: '', language: tracks.find((x) => x.id === tp.track)?.language || 'c', code: '', output: '' }); drawExamples(); }, 'line'));
  drawExamples();
  const qHost = el('div', { class: 'adm-stack' });
  const drawQuiz = () => qHost.replaceChildren(...tp.quiz.map((q, i) => el('div', { class: 'adm-sub-card' },
    field(`Question ${i + 1}`, input(q.prompt, (v) => { q.prompt = v; })),
    el('fieldset', { class: 'adm-options' }, el('legend', { text: 'Options (choose the correct one)' }),
      ...q.options.map((o, k) => el('div', { class: 'adm-option' },
        el('input', { type: 'radio', name: `q${i}`, checked: q.answer === k || null, 'aria-label': `Option ${k + 1} is correct`, onchange: () => { q.answer = k; } }),
        input(o, (v) => { q.options[k] = v; }, { 'aria-label': `Option ${k + 1}` }),
        q.options.length > 2 ? button('×', () => { q.options.splice(k, 1); if (q.answer >= q.options.length) q.answer = 0; drawQuiz(); }, 'icon') : null)),
      q.options.length < 6 ? button('+ Option', () => { q.options.push(''); drawQuiz(); }, 'small line') : null),
    field('Why (shown after answering)', input(q.explanation, (v) => { q.explanation = v; })),
    button('Remove question', () => { tp.quiz.splice(i, 1); drawQuiz(); }, 'danger small'))),
    button('+ Add a quiz question', () => { tp.quiz.push({ prompt: '', options: ['', '', '', ''], answer: 0, explanation: '' }); drawQuiz(); }, 'line'));
  drawQuiz();
  const issues = el('div', {}, tp.issues?.length ? issuesBox(tp.issues) : el('p', { class: 'adm-empty', text: 'Save once to run the checker.' }));
  const save = async (publish) => {
    const out = await api('POST', isNew ? '/api/admin/topics' : `/api/admin/topics/${encodeURIComponent(id)}`, { ...tp, publish });
    toast(publish === true ? 'Published. It is now in its track.' : publish === false ? 'Moved back to draft.' : 'Saved.');
    if (isNew) go(`topic/${out.id}`); else { Object.assign(tp, out); issues.replaceChildren(issuesBox(out.issues)); statusBox.replaceChildren(statusChip(out.status)); }
  };
  const statusBox = el('span', {}, statusChip(tp.status));
  const saveBtn = button('Save draft', null, 'line'); saveBtn.onclick = busy(saveBtn, () => save(undefined));
  const pubBtn = button(tp.status === 'published' ? 'Save and keep published' : 'Publish', null, 'primary'); pubBtn.onclick = busy(pubBtn, () => save(true));
  const codexBtn = button('Copy the Codex task', () => {
    const tr = tracks.find((x) => x.id === tp.track);
    const text = `Repository: https://github.com/loopnlogicac/loop-logic (branch main).\n\nWrite one new topic for the ${tr?.title ?? tp.track} track, module "${tp.module}": "${tp.title.en || 'TITLE'}"${tp.title.bn ? ` (Bangla title: ${tp.title.bn})` : ''}. Follow content-kit/README.md and content-kit/BANGLA_STYLE.md. Add it to the track's curriculum and manifest, compile and run every example, write every .out file from real runs, and run the content checker until it reports 0 errors. Open a pull request.`;
    navigator.clipboard?.writeText(text).then(() => toast('Codex task copied.'), () => toast('Could not copy.'));
  }, 'light');
  return [
    el('a', { href: '#content', class: 'adm-back', text: '← Content' }),
    row(
      el('div', { class: 'adm-col wide' },
        card('Topic details',
          row(field('Track', select(tp.track, tracks.map((x) => [x.id, x.title]), (v) => { tp.track = v; drawModules(); })), moduleSel,
            field('Level', select(tp.level, [['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced']], (v) => { tp.level = v; })),
            field('Minutes', input(tp.minutes, (v) => { tp.minutes = Number(v); }, { type: 'number', min: '1', max: '240' }))),
          row(field('Title in English', input(tp.title.en, (v) => { tp.title.en = v; })), field('Title in Bangla', input(tp.title.bn, (v) => { tp.title.bn = v; }, { lang: 'bn' }))),
          row(field('One-line summary (English)', input(tp.summary.en, (v) => { tp.summary.en = v; })), field('One-line summary (Bangla)', input(tp.summary.bn, (v) => { tp.summary.bn = v; }, { lang: 'bn' }))),
          biEditor('Topic text', tp, 'body', 14)),
        card('Code examples', el('p', { class: 'adm-hint', text: 'Examples appear after the text. The server cannot run code, so paste the real output.' }), exHost),
        card('Quiz (at least 3 questions)', qHost)),
      el('div', { class: 'adm-col' },
        card('Checker', issues),
        card('Publish', row(el('span', { text: 'Status: ' }), statusBox), el('p', { class: 'adm-hint', text: 'Published topics appear in their track for everyone, after the Codex topics of the same module.' }),
          row(saveBtn, pubBtn), !isNew && tp.status === 'published' ? button('Move back to draft', busy(el('span'), () => save(false)), 'line small') : null,
          !isNew ? button('Delete topic', async () => { if (!confirm('Delete this topic? This cannot be undone.')) return; await api('DELETE', `/api/admin/topics/${encodeURIComponent(id)}`); toast('Deleted.'); go('content'); }, 'danger small') : null),
        el('section', { class: 'adm-card dark' }, el('h2', { text: 'Hand it to Codex instead' }), el('p', { text: 'Fill in the track, module and title, then copy a ready-made task. Codex writes the text, runs the code and opens a pull request.' }), codexBtn))),
  ];
}

async function trackPage() {
  setTitle('New tutorial track', 'Start a whole subject, then add its topics');
  const tr = { title: { en: '', bn: '' }, blurb: { en: '', bn: '' }, language: 'c', course: '', modules: [{ title: { en: '', bn: '' } }] };
  const courses = await api('GET', '/api/admin/courses');
  const modHost = el('div', { class: 'adm-stack' });
  const draw = () => modHost.replaceChildren(...tr.modules.map((m, i) => row(field(`Module ${i + 1} (English)`, input(m.title.en, (v) => { m.title.en = v; })), field('Bangla', input(m.title.bn, (v) => { m.title.bn = v; }, { lang: 'bn' })), tr.modules.length > 1 ? button('Remove', () => { tr.modules.splice(i, 1); draw(); }, 'danger small') : null)),
    button('+ Add a module', () => { tr.modules.push({ title: { en: '', bn: '' } }); draw(); }, 'line'));
  draw();
  const saveBtn = button('Create track', null, 'primary');
  saveBtn.onclick = busy(saveBtn, async () => { const out = await api('POST', '/api/admin/custom-tracks', tr); toast(`Track created. Now add its first topic.`); go('topic/new'); return out; });
  return [el('a', { href: '#content', class: 'adm-back', text: '← Content' }),
    card('Track details',
      row(field('Name in English', input('', (v) => { tr.title.en = v; })), field('Name in Bangla', input('', (v) => { tr.title.bn = v; }, { lang: 'bn' }))),
      field('One-line description', input('', (v) => { tr.blurb.en = v; })),
      row(field('Code language', select('c', [['c', 'C (C17)'], ['python', 'Python'], ['java', 'Java'], ['sql', 'SQL (MySQL)'], ['none', 'None']], (v) => { tr.language = v; })),
        field('Matching video course', select('', [['', 'None'], ...[...courses.builtIn.map((c) => [c.id, c.title]), ...courses.added.map((c) => [c.id, c.title.en])]], (v) => { tr.course = v; })))),
    card('Modules', modHost, el('p', { class: 'adm-hint', text: 'The track appears on the site once its first topic is published.' }), saveBtn)];
}

// ── courses ──
async function coursePage(id) {
  const isNew = id === 'new';
  const tut = await api('GET', '/api/admin/tutorials');
  const c = isNew ? { access: '', title: { en: '', bn: '' }, blurb: { en: '', bn: '' }, code: '', subject: 'cse', instructor: '', linkedTrack: '', tint: TINTS[1], playlist: '', videos: [], nightlySync: true, price: '', accessMonths: 6, includedInPro: true, couponsAllowed: true, published: false } : await api('GET', `/api/admin/courses/${encodeURIComponent(id)}`);
  if (!isNew) c.playlist = `https://www.youtube.com/playlist?list=${c.playlistId}`;
  setTitle(isNew ? 'New course' : `Edit: ${c.title.en}`, 'Free from a YouTube playlist, or paid with free sample videos');
  const host = el('div', { class: 'adm-stack' });
  const preview = el('div');
  const drawPreview = () => {
    const shown = c.videos.filter((v) => !v.hidden);
    const samples = shown.filter((v) => v.sample).length;
    const short = (c.title.en || 'New course').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
    preview.replaceChildren(el('div', { class: 'adm-tile', style: `background:${c.tint}` }, el('span', { text: short })),
      row(el('strong', { text: c.title.en || 'Course name' }), c.access === 'paid' ? chip(`৳ ${c.price || '—'}`, 'gold') : chip('FREE', 'ok')),
      el('span', { class: 'adm-hint', text: `${num(shown.length)} videos${c.access === 'paid' ? ` · ${num(samples)} free samples` : ''}` }),
      el('div', { class: 'adm-swatches', role: 'group', 'aria-label': 'Tile colour' }, ...TINTS.map((t) => el('button', { type: 'button', class: 'adm-swatch', 'aria-pressed': String(t === c.tint), 'aria-label': `Tile colour ${t}`, style: `background:${t}`, onclick: () => { c.tint = t; drawPreview(); } }))));
  };
  const videoList = el('div', { class: 'adm-stack' });
  const drawVideos = () => {
    const paid = c.access === 'paid';
    const samples = c.videos.filter((v) => v.sample && !v.hidden).length;
    videoList.replaceChildren(
      paid && c.videos.length ? el('div', { class: 'adm-sample-bar' },
        el('div', {}, el('strong', { text: 'Free sample videos' }), el('p', { class: 'adm-hint', text: 'Anyone can watch these before paying. Pick them below, or set how many from the start.' })),
        el('div', { class: 'adm-stepper' },
          button('−', () => { const n = Math.max(0, samples - 1); c.videos.forEach((v, i) => { v.sample = i < n; }); drawVideos(); drawPreview(); }, 'icon big'),
          el('output', { 'aria-live': 'polite', text: num(samples) }),
          button('+', () => { const n = Math.min(c.videos.length, samples + 1); c.videos.forEach((v, i) => { v.sample = i < n; }); drawVideos(); drawPreview(); }, 'icon big'),
          el('span', { text: `of ${num(c.videos.length)}` }))) : null,
      ...c.videos.map((v, i) => el('div', { class: `adm-video${paid && v.sample ? ' sample' : ''}${v.hidden ? ' hidden' : ''}` },
        el('div', { class: 'adm-video-move' }, button('↑', () => { if (i) { [c.videos[i - 1], c.videos[i]] = [c.videos[i], c.videos[i - 1]]; drawVideos(); } }, 'icon'), button('↓', () => { if (i < c.videos.length - 1) { [c.videos[i + 1], c.videos[i]] = [c.videos[i], c.videos[i + 1]]; drawVideos(); } }, 'icon')),
        el('img', { src: `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`, alt: '', loading: 'lazy', width: '96', height: '54' }),
        el('div', { class: 'adm-video-text' }, el('strong', { text: `${i + 1}. ${v.title}` }), el('span', { class: 'adm-hint', text: `${v.duration}${v.by ? ` · by ${v.by}` : ''}` })),
        paid ? chip(v.sample ? 'FREE SAMPLE' : 'PAID', v.sample ? 'ok' : '') : null,
        paid ? button(v.sample ? 'Make it paid' : 'Make it a sample', () => { v.sample = !v.sample; drawVideos(); drawPreview(); }, 'small line') : null,
        check('Show', !v.hidden, (on) => { v.hidden = !on; drawVideos(); drawPreview(); }))));
  };
  const fetchBtn = button(c.videos.length ? 'Read the playlist again' : 'Add the videos', null, 'dark');
  fetchBtn.onclick = busy(fetchBtn, async () => {
    const imp = await api('POST', '/api/admin/youtube/playlist', { url: c.playlist });
    const old = new Map(c.videos.map((v) => [v.id, v]));
    c.videos = imp.videos.map((v, i) => ({ ...v, hidden: old.get(v.id)?.hidden ?? false, sample: old.get(v.id)?.sample ?? (c.access === 'paid' && i < 2) }));
    if (!c.title.en) c.title.en = imp.title;
    toast(`Found ${imp.videos.length} videos in “${imp.title}”.`);
    draw();
  });
  const playlistBox = () => card(c.access === 'paid' ? 'Videos (an unlisted YouTube playlist)' : 'YouTube playlist',
    el('p', { class: 'adm-hint', text: c.access === 'paid' ? 'Upload the course videos to YouTube as Unlisted, put them in one playlist, and paste its link. Learners never see the YouTube links of locked videos.' : 'Paste the playlist link. Every video in it is added to the website, in the same order.' }),
    row(field(c.access === 'paid' ? 'Unlisted playlist link' : 'Playlist link (required)', input(c.playlist, (v) => { c.playlist = v; }, { type: 'url', placeholder: 'https://www.youtube.com/playlist?list=…' })), fetchBtn),
    c.videos.length ? el('p', { class: 'adm-ok', text: `✓ ${num(c.videos.length)} videos. Titles, lengths and pictures come from YouTube.` }) : null,
    videoList,
    c.access === 'free' ? check('Check the playlist every night and add new videos automatically', c.nightlySync, (on) => { c.nightlySync = on; }) : null);
  const kindCard = card('Step 1 · Is this course free or paid?', el('div', { class: 'adm-choice' }, ...[['free', 'Free', 'Everyone can watch every video. Paste a YouTube playlist link and the videos are added automatically.'], ['paid', 'Paid', 'Students pay to watch. You choose how many videos are free samples.']].map(([k, label, desc]) =>
    el('label', { class: 'adm-choice-card', 'data-on': String(c.access === k) }, el('input', { type: 'radio', name: 'ckind', checked: c.access === k || null, onchange: () => { c.access = k; if (k === 'paid' && !c.videos.some((v) => v.sample)) c.videos.forEach((v, i) => { v.sample = i < 2; }); draw(); } }), el('span', {}, el('strong', { text: label }), el('span', { text: desc }))))));
  const draw = () => {
    if (!c.access) { host.replaceChildren(kindCard); return; }
    host.replaceChildren(kindCard,
      card('Step 2 · Course details',
        row(field('Name in English', input(c.title.en, (v) => { c.title.en = v; drawPreview(); })), field('Name in Bangla', input(c.title.bn, (v) => { c.title.bn = v; }, { lang: 'bn' })), field('Course code', input(c.code, (v) => { c.code = v; }, { placeholder: 'e.g. CSE-3201' }))),
        row(field('Subject', select(c.subject, SUBJECTS, (v) => { c.subject = v; })), field('Instructor', input(c.instructor, (v) => { c.instructor = v; }, { placeholder: 'Loop & Logic team' })),
          field('Linked tutorial', select(c.linkedTrack ?? '', [['', 'None'], ...tut.tracks.map((x) => [x.id, x.title])], (v) => { c.linkedTrack = v; }))),
        row(field('What students will learn (English)', area(c.blurb.en, (v) => { c.blurb.en = v; }, 2)), field('Bangla', area(c.blurb.bn, (v) => { c.blurb.bn = v; }, 2, { lang: 'bn' })))),
      c.access === 'paid' ? card('Step 3 · Price and access',
        row(field('Price (৳)', input(c.price, (v) => { c.price = v; drawPreview(); }, { type: 'number', min: '1' })), field('Access lasts', select(String(c.accessMonths ?? 6), [['6', 'One semester (6 months)'], ['12', 'One year'], ['0', 'For ever']], (v) => { c.accessMonths = Number(v); }))),
        check('Included for Pro members at no extra cost', c.includedInPro !== false, (on) => { c.includedInPro = on; }),
        check('Coupon codes can be used', c.couponsAllowed !== false, (on) => { c.couponsAllowed = on; }),
        check('Also unlocks the Virtual Office (all premium internship projects)', c.includesOffice === true, (on) => { c.includesOffice = on; })) : null,
      playlistBox());
    drawVideos();
    drawPreview();
  };
  draw();
  const save = async (publish) => {
    const body = { ...c, published: publish ?? c.published, videos: c.videos.map((v) => ({ id: v.id, hidden: v.hidden, sample: v.sample })) };
    const out = await api('POST', isNew ? '/api/admin/courses' : `/api/admin/courses/${encodeURIComponent(id)}`, body);
    toast(out.published ? 'Saved. The course is live.' : 'Saved as a draft.');
    if (isNew) go(`course/${out.id}`); else route();
  };
  const draftBtn = button('Save draft', null, 'line'); draftBtn.onclick = busy(draftBtn, () => save(false));
  const pubBtn = button(c.published ? 'Save' : 'Publish course', null, 'primary'); pubBtn.onclick = busy(pubBtn, () => save(true));
  const side = [card('How it will look', preview), card('Publish', el('p', { class: 'adm-hint', text: c.published ? 'This course is live.' : 'Drafts are only visible here.' }), row(draftBtn, pubBtn),
    !isNew ? (() => { const b = button('Sync with YouTube now', null, 'line small'); b.onclick = busy(b, async () => { const r = await api('POST', `/api/admin/courses/${encodeURIComponent(id)}/sync`); toast(r.added > 0 ? `${r.added} new videos added.` : 'Already up to date.'); route(); }); return b; })() : null,
    !isNew ? button('Delete course', async () => { if (!confirm('Delete this course? Learners lose access to it.')) return; await api('DELETE', `/api/admin/courses/${encodeURIComponent(id)}`); toast('Deleted.'); go('content'); }, 'danger small') : null)];
  if (!isNew && c.access === 'paid') side.push(await accessCard(id));
  return [el('a', { href: '#content', class: 'adm-back', text: '← Content' }), row(el('div', { class: 'adm-col wide' }, host), el('div', { class: 'adm-col' }, ...side))];
}

async function accessCard(courseId) {
  const grants = await api('GET', `/api/admin/courses/${encodeURIComponent(courseId)}/access`);
  let email = '';
  const add = button('Give access', null, 'primary small');
  add.onclick = busy(add, async () => { await api('POST', `/api/admin/courses/${encodeURIComponent(courseId)}/access`, { email }); toast('Access given.'); route(); });
  return card('People with access',
    el('p', { class: 'adm-hint', text: 'After you confirm a bKash or Nagad payment, give the student access here. They must have signed in once.' }),
    row(field('Student email', input('', (v) => { email = v; }, { type: 'email', placeholder: 'student@example.com' })), add),
    grants.length ? el('div', { class: 'adm-list' }, ...grants.map((g) => el('div', { class: 'adm-list-row' }, el('span', { text: g.email }), el('span', { class: 'adm-hint', text: g.until ? `until ${dateOnly(g.until)}` : 'for ever' }),
      button('Remove', async () => { if (!confirm(`Remove ${g.email}'s access?`)) return; await api('DELETE', `/api/admin/courses/${encodeURIComponent(courseId)}/access/${encodeURIComponent(g.learnerId)}`); toast('Access removed.'); route(); }, 'danger small')))) : el('p', { class: 'adm-empty', text: 'Nobody yet.' }));
}

// ── posts ──
const POST_TYPES = [['blog', 'Blog'], ['news', 'News'], ['changelog', 'Changelog'], ['exam-notice', 'Exam notice']];
async function postsPage() {
  setTitle('Posts', 'Blog posts, news, changelogs and exam notices');
  const { posts } = await api('GET', '/api/admin/posts');
  return [row(link('New post', '#post/new', 'primary'), link('Open the blog ↗', '/blog.html', 'line')),
    card('', table(['Title', 'Type', 'Bangla', 'Status', 'Views', ''], posts.map((p) => [
      el('span', {}, el('strong', { text: p.title.en }), el('br'), el('small', { class: 'adm-hint', text: `${p.author} · ${p.publishAt ? date(p.publishAt) : 'not published'}` })),
      POST_TYPES.find((x) => x[0] === p.type)?.[1] ?? p.type, p.body.bn?.trim() ? 'Yes' : '—', statusChip(p.status), num(p.views ?? 0),
      el('span', {}, el('a', { href: `#post/${encodeURIComponent(p.id)}`, text: 'Edit' }), p.status !== 'draft' ? el('span', {}, ' · ', el('a', { href: `/post.html?slug=${encodeURIComponent(p.slug)}`, target: '_blank', rel: 'noopener', text: 'View' })) : null)]), 'No posts yet.'))];
}

async function postPage(id) {
  const isNew = id === 'new';
  const p = isNew ? { title: { en: '', bn: '' }, slug: '', type: 'blog', author: 'Loop & Logic team', tags: [], excerpt: { en: '', bn: '' }, body: { en: '', bn: '' }, status: 'draft', publishAt: null } : await api('GET', `/api/admin/posts/${encodeURIComponent(id)}`);
  setTitle(isNew ? 'New post' : `Edit: ${p.title.en}`, 'Write once in English and Bangla, publish now or later');
  let when = p.status === 'scheduled' ? 'scheduled' : p.status === 'published' ? 'published' : 'draft';
  let at = p.publishAt ? new Date(p.publishAt).toISOString().slice(0, 16) : '';
  const save = async () => {
    const out = await api('POST', isNew ? '/api/admin/posts' : `/api/admin/posts/${encodeURIComponent(id)}`, { ...p, tags: Array.isArray(p.tags) ? p.tags : String(p.tags).split(','), status: when, publishAt: when === 'scheduled' ? new Date(at).toISOString() : null });
    toast(when === 'published' ? 'Published.' : when === 'scheduled' ? 'Scheduled.' : 'Saved as a draft.');
    if (isNew) go(`post/${encodeURIComponent(out.id)}`); else route();
  };
  const saveBtn = button('Save', null, 'primary'); saveBtn.onclick = busy(saveBtn, save);
  const schedule = input(at, (v) => { at = v; }, { type: 'datetime-local', 'aria-label': 'Publish time' });
  return [el('a', { href: '#posts', class: 'adm-back', text: '← All posts' }),
    row(el('div', { class: 'adm-col wide' }, card('',
      field('Title', input(p.title.en, (v) => { p.title.en = v; }, { class: 'big' })), field('Title in Bangla', input(p.title.bn, (v) => { p.title.bn = v; }, { lang: 'bn' })),
      row(field('Web address', input(p.slug, (v) => { p.slug = v; }, { placeholder: 'made from the title if left empty' }), 'Shown as /post.html?slug=…'), field('Type', select(p.type, POST_TYPES, (v) => { p.type = v; }))),
      biEditor('Post text', p, 'body', 16),
      row(field('Short description for search and sharing (English)', area(p.excerpt.en, (v) => { p.excerpt.en = v; }, 2)), field('Bangla', area(p.excerpt.bn, (v) => { p.excerpt.bn = v; }, 2, { lang: 'bn' }))))),
    el('div', { class: 'adm-col' }, card('Publish',
      el('fieldset', { class: 'adm-radios' }, el('legend', { text: 'When' }),
        ...[['draft', 'Keep as a draft'], ['published', 'Publish now'], ['scheduled', 'Schedule']].map(([v, label]) => el('label', { class: 'adm-check' }, el('input', { type: 'radio', name: 'when', checked: when === v || null, onchange: () => { when = v; } }), el('span', { text: label })))),
      schedule,
      field('Author', input(p.author, (v) => { p.author = v; })), field('Tags (comma separated)', input(Array.isArray(p.tags) ? p.tags.join(', ') : p.tags, (v) => { p.tags = v; })),
      saveBtn,
      !isNew ? button('Delete post', async () => { if (!confirm('Delete this post?')) return; await api('DELETE', `/api/admin/posts/${encodeURIComponent(id)}`); toast('Deleted.'); go('posts'); }, 'danger small') : null))),
  ];
}

// ── users ──
async function usersPage() {
  setTitle('Users and roles', 'People who signed in, and who can run the site');
  const d = await api('GET', '/api/admin/users');
  let email = '', role = 'instructor', filter = '';
  const add = button('Give the role', null, 'primary');
  add.onclick = busy(add, async () => { await api('POST', '/api/admin/roles', { email, role }); toast('Role saved.'); route(); });
  const list = el('div');
  const draw = () => {
    const f = filter.toLowerCase();
    list.replaceChildren(table(['Email', 'Role', 'First seen', 'Last active'], d.users.filter((u) => !f || u.email.includes(f) || u.role === f).map((u) => [
      el('strong', { text: u.email }),
      u.fixed ? chip('Admin (server setting)', 'dark') : select(u.role, [['learner', 'Learner'], ['instructor', 'Instructor'], ['admin', 'Admin']], async (v) => { try { await api('POST', '/api/admin/roles', { email: u.email, role: v }); toast('Role saved.'); u.role = v; } catch (e) { toast(e.message); route(); } }, { 'aria-label': `Role for ${u.email}` }),
      u.firstSeen ? dateOnly(u.firstSeen) : '—', u.lastSeen ? ago(u.lastSeen) : 'not signed in yet']), 'Nobody has signed in yet.'));
  };
  draw();
  return [el('div', { class: 'adm-kpis' }, kpi('Signed-in accounts', num(d.counts.total)), kpi('Admins', num(d.counts.admins)), kpi('Instructors', num(d.counts.instructors))),
    card('Give someone a role', row(field('Email', input('', (v) => { email = v; }, { type: 'email', placeholder: 'teacher@uni.edu.bd' })), field('Role', select(role, [['instructor', 'Instructor'], ['admin', 'Admin'], ['learner', 'Learner (remove role)']], (v) => { role = v; })), add)),
    card('Everyone', field('Filter', input('', (v) => { filter = v; draw(); }, { type: 'search', placeholder: 'email or role' })), list)];
}

// ── AI Teacher ──
async function aiPage() {
  setTitle('AI Teacher', 'Use, cost drivers and what learners say about answers');
  const [d, cfg] = await Promise.all([api('GET', '/api/admin/ai'), getConfig()]);
  return [el('div', { class: 'adm-kpis' }, kpi('AI calls, last 30 days', num(d.month.calls)), kpi('Input tokens', num(d.month.inputTokens)), kpi('Output tokens', num(d.month.outputTokens)), kpi('Served from cache', num(d.month.cached)), kpi('Failed or fell back', num(d.month.failed)), kpi('Free answers a day', num(cfg.freeDailyAi ?? 10), 'FREE_DAILY_AI_CALLS')),
    row(card('What the AI was used for', table(['Purpose', 'Calls'], d.byPurpose.map((x) => [x.purpose, num(x.n)]), 'No AI calls yet.')),
      card('Latest learner feedback on explanations', table(['When', 'Where', 'Said'], d.feedback.map((f) => [ago(f.at), f.where, String(f.value ?? '')]), 'No feedback yet.'))),
    card('Latest questions to the AI', table(['When', 'Page', 'Question'], d.asks.map((a) => [ago(a.at), a.where, a.question]), 'No questions recorded yet.')),
    card('Sources', el('p', { class: 'adm-hint', text: 'The AI answers only from the tutorials, the video class materials and the approved websites built into the server. The model and keys are set in the server environment, never here.' }))];
}

// ── Pro, waitlist ──
async function proPage() {
  setTitle('Pro and waitlist', 'Paid courses and the people waiting for Pro');
  const [w, courses] = await Promise.all([api('GET', '/api/admin/waitlist'), api('GET', '/api/admin/courses')]);
  const exp = button('Export the full list (CSV)', null, 'line');
  exp.onclick = busy(exp, async () => {
    const { csv } = await api('POST', '/api/admin/waitlist/export');
    const a = el('a', { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `waitlist-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click(); URL.revokeObjectURL(a.href);
  });
  const paid = courses.added.filter((c) => c.access === 'paid');
  const packs = await api('GET', '/api/admin/packs').catch(() => []);
  const review = (p, approve) => async () => {
    const note = approve ? null : prompt('What should the instructor change?', '');
    if (!approve && note === null) return;
    await api('POST', `/api/admin/packs/${p.id}/review`, { approve, note }); toast(approve ? 'Approved.' : 'Returned to the instructor.'); route();
  };
  const packCard = card('Exam packs from instructors', table(['Pack', 'By', 'Contents', 'Status', ''], packs.map((p) => [
    el('span', {}, el('strong', { text: p.title }), p.description ? el('br') : null, p.description ? el('small', { class: 'adm-hint', text: p.description.slice(0, 160) }) : null),
    p.ownerEmail, `${num(p.lessons.length)} lessons · ${num(p.papers.length)} papers · ${num(p.mockTests)} mock tests · ${num(p.files.length)} files`,
    chip({ draft: 'Draft', review: 'Waiting for review', approved: 'Approved' }[p.status] ?? p.status, p.status === 'approved' ? 'ok' : p.status === 'review' ? 'info' : ''),
    p.status === 'review' ? el('span', {}, button('Approve', review(p, true), 'primary small'), ' ', button('Return', review(p, false), 'small line')) : p.files.length ? el('a', { href: p.files[0].url, target: '_blank', rel: 'noopener', text: 'First file ↗' }) : '']), 'No packs yet. Instructors write them in their dashboard.'));
  return [el('div', { class: 'adm-kpis' }, kpi('On the waitlist', num(w.count)), kpi('Paid courses', num(paid.length)), kpi('Payments', 'bKash / Nagad', 'see Orders')),
    row(card('Paid courses', table(['Course', 'Price', 'Samples', ''], paid.map((c) => [c.title.en, `৳ ${num(c.price)}`, num(c.counts.samples), el('a', { href: `#course/${c.id}`, text: 'Manage access' })]), 'No paid courses yet.')),
      card('Latest waitlist sign-ups', el('p', { class: 'adm-hint', text: 'Emails are partly hidden here. The export is written to the audit log.' }), table(['Email', 'Wants', 'Joined'], w.waitlist.slice(0, 30).map((r) => [r.email, r.plan, ago(r.at)]), 'Nobody yet.'), exp)), packCard];
}

// ── orders (bKash / Nagad payments checked by hand) ──
let orderTab = 'pending';
async function ordersPage() {
  setTitle('Orders', 'Payments for paid courses: check each one in your bKash or Nagad app, then approve');
  const L = T[getLang()];
  const [d, pay, revenue] = await Promise.all([api('GET', `/api/admin/orders?status=${orderTab}`), api('GET', '/api/admin/payments'), api('GET', `/api/admin/revenue?lang=${getLang()}`)]);
  const tabs = el('div', { class: 'adm-tabs', role: 'tablist' }, ...[['pending', `Waiting · ${d.counts.pending ?? 0}`], ['approved', 'Approved'], ['rejected', 'Not accepted'], ['all', 'All']].map(([id, label]) =>
    el('button', { type: 'button', role: 'tab', 'aria-selected': String(id === orderTab), text: label, onclick: () => { orderTab = id; route(); } })));
  const decide = (o, approve) => async () => {
    let reason = null;
    if (approve) { if (!confirm(`Approve ৳ ${o.total} from ${o.email}? Check TrxID ${o.trxId} in your ${o.method === 'bkash' ? 'bKash' : 'Nagad'} app first.`)) return; }
    else { reason = prompt('Why is it not accepted? The student sees this.', 'No payment found with this TrxID'); if (!reason) return; }
    try { await api('POST', `/api/admin/orders/${o.id}/${approve ? 'approve' : 'reject'}`, { reason }); toast(approve ? 'Approved. The course is unlocked.' : 'Marked as not accepted.'); route(); } catch (e) { toast(e.message); }
  };
  const p = structuredClone(pay);
  const methodRow = (key, label) => row(
    check(`Accept ${label}`, p[key].on, (on) => { p[key].on = on; }),
    field(`${label} number`, input(p[key].number, (v) => { p[key].number = v; }, { inputmode: 'tel', placeholder: '01XXXXXXXXX' })),
    field('Number type', select(p[key].type, [['personal', 'Personal (Send Money)'], ['merchant', 'Merchant (Payment)'], ['agent', 'Agent (Cash In)']], (v) => { p[key].type = v; })));
  const savePay = button('Save payment details', null, 'primary');
  savePay.onclick = busy(savePay, async () => { await api('POST', '/api/admin/payments', p); toast('Payment details saved.'); });
  const downloadRevenue = button(L.downloadCsv, null);
  downloadRevenue.onclick = busy(downloadRevenue, () => downloadFile(`/api/admin/revenue.csv?lang=${getLang()}`, 'revenue.csv'));
  const methodTitle = (m) => m === 'bkash' ? 'bKash' : m === 'nagad' ? 'Nagad' : m === 'free' ? L.free : L.other;
  return [
    card(L.revenue, el('p', { class: 'adm-hint', text: L.revenueHelp }), downloadRevenue,
      el('div', { class: 'adm-kpis' }, kpi(L.total, `৳ ${num(revenue.revenue)}`), kpi(L.orders, num(revenue.orders))),
      row(table([L.month, L.orders, L.amount], revenue.byMonth.map((r) => [r.month === 'unknown' ? L.unknown : r.month, num(r.orders), num(r.revenue)]), L.noRevenue),
        table([L.method, L.orders, L.amount], revenue.byMethod.map((r) => [methodTitle(r.method), num(r.orders), num(r.revenue)]), L.noRevenue)),
      table([L.course, L.orders, L.amount], revenue.byCourse.map((r) => [r.title, num(r.orders), num(r.revenue)]), L.noRevenue)),
    el('div', { class: 'adm-kpis' }, kpi('Waiting to be checked', num(d.counts.pending ?? 0)), kpi('Approved', num(d.counts.approved ?? 0)), kpi('Not accepted', num(d.counts.rejected ?? 0)), kpi('Received (approved)', `৳ ${num(d.revenue)}`)),
    tabs,
    card('', table(['When', 'Student', 'Course', 'Amount', 'Paid with', 'Reference', ''], d.orders.map((o) => [
      ago(o.createdAt), el('strong', { text: o.email }), o.courseTitle,
      el('span', {}, el('strong', { text: `৳ ${num(o.total)}` }), o.coupon ? el('small', { class: 'adm-hint', text: ` (৳ ${num(o.price)} − ${o.coupon})` }) : null),
      o.method === 'free' ? chip('Coupon, free', 'ok') : el('span', {}, `${o.method === 'bkash' ? 'bKash' : 'Nagad'} · `, el('code', { text: o.trxId }), el('small', { class: 'adm-hint', text: ` · from …${o.senderLast4}` }), o.duplicate ? chip('TrxID used twice', 'bad') : null),
      el('code', { text: o.reference }),
      o.status === 'pending' ? el('span', {}, button('Approve', decide(o, true), 'primary small'), ' ', button('Not accepted', decide(o, false), 'small danger'))
        : el('span', {}, statusChip(o.status === 'approved' ? 'published' : o.status), o.reason ? el('small', { class: 'adm-hint', text: ` ${o.reason}` }) : null),
    ]), orderTab === 'pending' ? 'No payments are waiting.' : 'Nothing here.')),
    card('Payment details shown on the buy page',
      el('p', { class: 'adm-hint', text: 'Students send money to these numbers with a reference code, then enter the transaction ID. Only switch on a method you check every day.' }),
      methodRow('bkash', 'bKash'), methodRow('nagad', 'Nagad'),
      row(field('Extra note on the buy page (English)', input(p.note?.en, (v) => { p.note = { ...p.note, en: v }; }, { placeholder: 'e.g. Payments are checked between 9am and 11pm.' })), field('Bangla', input(p.note?.bn, (v) => { p.note = { ...p.note, bn: v }; }, { lang: 'bn' }))),
      savePay),
  ];
}

// ── coupons ──
async function couponsPage() {
  setTitle('Coupons', 'Discount codes for paid courses and Pro');
  const [{ coupons }, courses] = await Promise.all([api('GET', '/api/admin/coupons'), api('GET', '/api/admin/courses')]);
  const c = { code: '', kind: 'percent', value: 20, appliesTo: 'all', maxUses: 100, perPerson: 1, start: '', end: '', waitlistOnly: false, eduOnly: false, firstOnly: false };
  const codeInput = input('', (v) => { c.code = v.toUpperCase(); }, { class: 'mono', placeholder: 'MIDTERM25' });
  const make = button('Make one up', () => { codeInput.value = c.code = Math.random().toString(36).slice(2, 10).toUpperCase(); }, 'line small');
  const create = button('Create code', null, 'primary');
  create.onclick = busy(create, async () => { await api('POST', '/api/admin/coupons', c); toast('Code created.'); route(); });
  const targets = [['all', 'Anything (all of Pro)'], ...courses.added.filter((x) => x.access === 'paid').map((x) => [`course:${x.id}`, `Course: ${x.title.en}`])];
  return [row(
    el('div', { class: 'adm-col wide' }, card('Codes', table(['Code', 'Discount', 'For', 'Used', 'Valid', 'Status', ''], coupons.map((k) => [
      el('code', { text: k.code }), k.kind === 'percent' ? `${k.value}%` : `৳ ${num(k.value)}`, targets.find((x) => x[0] === k.appliesTo)?.[1] ?? k.appliesTo,
      `${num(k.used)}${k.maxUses ? ` / ${num(k.maxUses)}` : ''}`, `${k.start ? dateOnly(k.start) : 'now'} → ${k.end ? dateOnly(k.end) : 'no end'}`, statusChip(k.active ? 'active' : 'paused'),
      el('span', {}, button(k.active ? 'Pause' : 'Turn on', async () => { await api('POST', `/api/admin/coupons/${k.code}`, { ...k, active: !k.active }); route(); }, 'small line'), ' ', button('Delete', async () => { if (!confirm(`Delete ${k.code}?`)) return; await api('DELETE', `/api/admin/coupons/${k.code}`); route(); }, 'small danger'))]), 'No codes yet.'))),
    el('div', { class: 'adm-col' }, card('New coupon code',
      row(field('Code', codeInput), make),
      row(field('Discount', select(c.kind, [['percent', 'Percent'], ['fixed', 'Fixed amount (৳)']], (v) => { c.kind = v; })), field('Value', input(c.value, (v) => { c.value = Number(v); }, { type: 'number', min: '1' }))),
      field('Applies to', select(c.appliesTo, targets, (v) => { c.appliesTo = v; })),
      row(field('Total uses (0 = no limit)', input(c.maxUses, (v) => { c.maxUses = Number(v); }, { type: 'number', min: '0' })), field('Per person', input(c.perPerson, (v) => { c.perPerson = Number(v); }, { type: 'number', min: '1' }))),
      row(field('Starts', input('', (v) => { c.start = v; }, { type: 'date' })), field('Ends', input('', (v) => { c.end = v; }, { type: 'date' }))),
      check('Only for university email addresses (.edu.bd)', false, (on) => { c.eduOnly = on; }),
      check('Only for people on the waitlist', false, (on) => { c.waitlistOnly = on; }),
      check('First purchase only', false, (on) => { c.firstOnly = on; }),
      create)))];
}

// ── ads ──
const THEMES = [['ink', 'Dark'], ['lime', 'Lime'], ['gold', 'Gold'], ['teal', 'Teal']];
const PLACES = [['top', 'Top ad bar', 'A thin bar under the main menu'], ['inline', 'Banner in the page', 'Between sections: homepage, topic pages, blog'], ['side', 'Side card', 'Beside the text on tutorial pages'], ['video', 'Before a video', 'Above the player on video pages']];
async function adsPage() {
  setTitle('Ad banners', 'Promote courses and packs in the built-in ad spots, page by page');
  const { ads } = await api('GET', '/api/admin/ads');
  const tot = ads.reduce((a, x) => ({ views: a.views + (x.stats?.views ?? 0), clicks: a.clicks + (x.stats?.clicks ?? 0) }), { views: 0, clicks: 0 });
  return [el('div', { class: 'adm-kpis' }, kpi('Running now', num(ads.filter((a) => a.status === 'running').length)), kpi('Seen', num(tot.views)), kpi('Clicks', num(tot.clicks)), kpi('Click rate', tot.views ? `${((100 * tot.clicks) / tot.views).toFixed(1)}%` : '—')),
    row(link('New ad banner', '#ad/new', 'primary')),
    card('', table(['Ad', 'Spot', 'Pages', 'Dates', 'Seen', 'Clicks', 'Status', ''], ads.map((a) => [
      el('strong', { text: a.name }), PLACES.find((p) => p[0] === a.placement)?.[1] ?? a.placement, a.pages.join(', '), `${a.start ? dateOnly(a.start) : 'now'} → ${a.end ? dateOnly(a.end) : 'no end'}`,
      num(a.stats?.views ?? 0), num(a.stats?.clicks ?? 0), statusChip(a.status), el('a', { href: `#ad/${a.id}`, text: 'Edit' })]), 'No ads yet.'))];
}

async function adPage(id) {
  const isNew = id === 'new';
  const [{ ads }, tut, courses] = await Promise.all([api('GET', '/api/admin/ads'), api('GET', '/api/admin/tutorials'), api('GET', '/api/admin/courses')]);
  const a = isNew ? { name: '', head: { en: '', bn: '' }, cta: { en: '', bn: '' }, href: '/pricing.html', theme: 'ink', placement: 'top', pages: [], audience: 'everyone', start: '', end: '', priority: 'turns', reshowDays: 3, status: 'draft' } : ads.find((x) => x.id === id);
  if (!a) throw new Error('No such ad.');
  setTitle(isNew ? 'New ad banner' : `Edit: ${a.name}`, 'Change the words and the pages; the spots are built in');
  const pages = new Set(a.pages);
  const groups = [
    ['Main pages', [['*', 'Every page'], ['home', 'Homepage'], ['pricing', 'Pricing'], ['dashboard', 'Dashboard'], ['blog', 'Blog']]],
    ['Tutorials', [['learn', 'All tutorials'], ...tut.tracks.filter((x) => x.delivered).map((x) => [`learn/${x.id}`, x.title])]],
    ['Video courses', [['course', 'All video courses'], ...[...courses.builtIn.map((c) => [c.id, c.title]), ...courses.added.map((c) => [c.id, c.title.en])].map(([cid, title]) => [`course/${cid}`, title])]],
    ['Labs', [['labs', 'All lab pages']]],
  ];
  const preview = el('div', { class: 'adm-ad-preview', 'aria-hidden': 'true' });
  const drawPreview = () => {
    const ad = el('div', { class: `ad ad-${a.placement} ad-${a.theme}` }, el('span', { class: 'ad-tag', text: 'AD' }), el('strong', { class: 'ad-head', text: a.head.en || 'Your headline' }), el('span', { class: 'ad-cta', text: a.cta.en || 'Learn more' }));
    const lines = (n) => Array.from({ length: n }, (_, i) => el('i', { class: 'adm-line', style: `width:${88 - (i % 3) * 10}%` }));
    preview.replaceChildren(
      el('div', { class: 'adm-pv-promo', text: 'NEW · announcement bar' }),
      el('div', { class: 'adm-pv-top' }, el('b', { text: 'loop & logic' }), el('span', { text: 'Dashboard  Pricing  Profile' })),
      a.placement === 'top' ? ad : null,
      el('div', { class: 'adm-pv-page' },
        el('div', { class: 'adm-pv-text' }, el('strong', { text: 'A tutorial topic' }), a.placement === 'video' ? el('div', { class: 'adm-pv-video' }, ad) : null, ...lines(2), a.placement === 'inline' ? ad : null, ...lines(4)),
        a.placement === 'side' ? ad : null));
  };
  drawPreview();
  const pagesBox = el('div', { class: 'adm-pages' }, ...groups.map(([g, items]) => el('div', { class: 'adm-sub-card' }, el('strong', { text: g }),
    ...items.map(([key, label]) => check(label, pages.has(key), (on) => { if (on) pages.add(key); else pages.delete(key); a.pages = [...pages]; })))));
  let custom = a.pages.filter((p) => !groups.some(([, items]) => items.some(([k]) => k === p))).join(', ');
  const save = async (status) => {
    const all = [...new Set([...pages].concat(custom.split(',').map((s) => s.trim().replace(/^\/+/, '')).filter(Boolean)))];
    await api('POST', isNew ? '/api/admin/ads' : `/api/admin/ads/${id}`, { ...a, pages: all, status: status ?? a.status });
    toast(status === 'running' ? 'Saved. The ad is running.' : 'Saved.');
    go('ads');
  };
  const runBtn = button('Save and run', null, 'primary'); runBtn.onclick = busy(runBtn, () => save('running'));
  const draftBtn = button('Save draft', null, 'line'); draftBtn.onclick = busy(draftBtn, () => save('draft'));
  return [el('a', { href: '#ads', class: 'adm-back', text: '← Ad banners' }),
    row(el('div', { class: 'adm-col wide' },
      card('1 · What the ad says',
        field('Name (only admins see it)', input(a.name, (v) => { a.name = v; })),
        row(field('Headline in English', input(a.head.en, (v) => { a.head.en = v; drawPreview(); })), field('Headline in Bangla', input(a.head.bn, (v) => { a.head.bn = v; }, { lang: 'bn' }))),
        row(field('Button text (English)', input(a.cta.en, (v) => { a.cta.en = v; drawPreview(); })), field('Button text (Bangla)', input(a.cta.bn, (v) => { a.cta.bn = v; }, { lang: 'bn' })), field('Button opens', input(a.href, (v) => { a.href = v; }, { placeholder: '/course.html?id=… or https://…' }))),
        el('div', { class: 'adm-themes', role: 'group', 'aria-label': 'Colour' }, ...THEMES.map(([k, label]) => el('button', { type: 'button', class: `adm-theme ad-${k}`, 'aria-pressed': String(a.theme === k), text: label, onclick: (e) => { a.theme = k; e.currentTarget.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget))); drawPreview(); } })))),
      card('2 · Where on the page', el('div', { class: 'adm-choice' }, ...PLACES.map(([k, label, desc]) => el('label', { class: 'adm-choice-card', 'data-on': String(a.placement === k) },
        el('input', { type: 'radio', name: 'place', checked: a.placement === k || null, onchange: (e) => { a.placement = k; e.target.closest('.adm-choice').querySelectorAll('.adm-choice-card').forEach((n) => n.dataset.on = String(n.contains(e.target))); drawPreview(); } }),
        el('span', {}, el('strong', { text: label }), el('span', { text: desc })))))),
      card('3 · Which pages', pagesBox, field('Or any page whose key starts with (comma separated)', input(custom, (v) => { custom = v; }, { class: 'mono', placeholder: 'learn/data-structures/ds-stack-array' }), 'Page keys look like home, learn/<track>/<topic>, course/<id>, course/<id>/watch, blog/<slug>.')),
      card('4 · Who and when',
        row(field('Show to', select(a.audience, [['everyone', 'Everyone'], ['signedIn', 'Signed-in learners'], ['anonymous', 'Not signed in']], (v) => { a.audience = v; })),
          field('Starts', input(dateOnly(a.start), (v) => { a.start = v; }, { type: 'date' })), field('Ends', input(dateOnly(a.end), (v) => { a.end = v; }, { type: 'date' }))),
        row(field('If two ads want the same spot', select(a.priority, [['turns', 'Take turns'], ['high', 'This one wins'], ['low', 'The other one wins']], (v) => { a.priority = v; })),
          field('After someone closes it, show again after', select(String(a.reshowDays), [['1', '1 day'], ['3', '3 days'], ['7', '7 days'], ['30', '30 days'], ['0', 'Never']], (v) => { a.reshowDays = Number(v); }))),
        row(draftBtn, runBtn, !isNew && a.status === 'running' ? button('Stop this ad', busy(el('span'), () => save('stopped')), 'danger') : null,
          !isNew ? button('Delete', async () => { if (!confirm('Delete this ad?')) return; await api('DELETE', `/api/admin/ads/${id}`); toast('Deleted.'); go('ads'); }, 'danger small') : null))),
    el('div', { class: 'adm-col sticky' }, card('Live preview', preview, el('p', { class: 'adm-hint', text: 'Ads are always labelled and can be closed. The top ad bar scrolls away; the main bar stays pinned.' }))))];
}

// ── site ──
async function sitePage() {
  setTitle('Site and announcements', 'What learners see first');
  const [ann, site] = await Promise.all([api('GET', '/api/admin/announcement'), fetch('/api/site').then((r) => r.json())]);
  const a = structuredClone(ann);
  a.text ??= { en: '', bn: '' }; a.linkText ??= { en: '', bn: '' };
  let resetClosed = false;
  const pv = el('div', { class: 'promo adm-promo-pv', 'aria-hidden': 'true' });
  const drawPv = () => pv.replaceChildren(el('span', { class: 'promo-new', text: 'NEW' }), el('span', { text: (a.text.en || 'Your announcement').replace('{topics}', '365').replace('{labs}', '70') }), a.linkText.en ? el('a', { text: a.linkText.en }) : null);
  drawPv();
  const save = button('Publish', null, 'primary');
  save.onclick = busy(save, async () => { await api('POST', '/api/admin/announcement', { ...a, resetClosed }); toast('Announcement saved.'); route(); });
  let tabs = [...site.hubTabs];
  const ALL = [['tutorials', 'Tutorials'], ['courses', 'Video courses'], ['labs', 'Labs'], ['exam', 'Exam prep (Pro)']];
  const tabList = el('div', { class: 'adm-stack' });
  const drawTabs = () => tabList.replaceChildren(...[...tabs, ...ALL.map(([k]) => k).filter((k) => !tabs.includes(k))].map((k) => {
    const on = tabs.includes(k);
    const i = tabs.indexOf(k);
    return el('div', { class: 'adm-list-row' }, check(ALL.find((x) => x[0] === k)[1], on, (v) => { tabs = v ? [...tabs, k] : tabs.filter((x) => x !== k); drawTabs(); }),
      on ? el('span', {}, button('↑', () => { if (i > 0) { [tabs[i - 1], tabs[i]] = [tabs[i], tabs[i - 1]]; drawTabs(); } }, 'icon'), button('↓', () => { if (i < tabs.length - 1) { [tabs[i + 1], tabs[i]] = [tabs[i], tabs[i + 1]]; drawTabs(); } }, 'icon')) : null);
  }));
  drawTabs();
  const saveTabs = button('Save the tabs', null, 'primary');
  saveTabs.onclick = busy(saveTabs, async () => { await api('POST', '/api/admin/hub-tabs', { tabs }); toast('Homepage tabs saved.'); });
  return [card('Announcement bar', pv,
    check('Show the announcement bar', a.on, (on) => { a.on = on; }),
    row(field('Text in English', area(a.text.en, (v) => { a.text.en = v; drawPv(); }, 2), '{topics} and {labs} are replaced with the live counts.'), field('Text in Bangla', area(a.text.bn, (v) => { a.text.bn = v; }, 2, { lang: 'bn' }))),
    row(field('Link text (English)', input(a.linkText.en, (v) => { a.linkText.en = v; drawPv(); })), field('Link text (Bangla)', input(a.linkText.bn, (v) => { a.linkText.bn = v; }, { lang: 'bn' })), field('Link', input(a.href, (v) => { a.href = v; }, { placeholder: '/learn.html' }))),
    check('Show on every page (otherwise the homepage only)', a.everyPage, (on) => { a.everyPage = on; }),
    check('Show again to people who closed the last one', false, (on) => { resetClosed = on; }),
    save),
  card('Homepage hub', el('p', { class: 'adm-hint', text: 'Which tabs the "Platform overview" shows, and their order. Lists inside each tab are always A–Z.' }), tabList, saveTabs)];
}

// ── settings, audit ──
async function settingsPage() {
  setTitle('Settings', 'Set on the server, so secrets never pass through this page');
  const [m, cfg] = await Promise.all([api('GET', '/api/admin/me'), getConfig()]);
  const line = (label, ok, text) => el('div', { class: 'adm-list-row' }, chip(ok ? 'On' : 'Off', ok ? 'ok' : 'warn'), el('strong', { text: label }), el('span', { class: 'adm-hint', text }));
  const L = T[getLang()];
  const backup = button(L.downloadBackup, null, 'primary');
  backup.onclick = busy(backup, () => downloadFile('/api/admin/export', 'loop-logic-backup.json', 'application/json'));
  return [card(L.backup, el('p', { class: 'adm-hint', text: L.backupHelp }), backup), card('Server settings',
    line('YouTube playlist import', m.config.youtubeKey, m.config.youtubeKey ? 'YOUTUBE_API_KEY is set.' : 'Add YOUTUBE_API_KEY in the server environment (Render, or Hostinger later) to add courses from playlists.'),
    line('Admins from the server', m.config.adminEmails > 0, `${m.config.adminEmails} email(s) in ADMIN_EMAILS. They are always admins and cannot be removed here.`),
    line('Saved data', m.config.store === 'supabase', m.config.store === 'supabase' ? 'Supabase (kept across restarts).' : 'Memory only: everything resets on restart.'),
    line('Sign-in', cfg.authMode !== 'anonymous', `Mode: ${cfg.authMode}. Google and email links are set in Supabase.`)),
  card('How to change these', el('ol', { class: 'adm-steps' },
    el('li', { text: 'Open the server dashboard (Render now; Hostinger after the move) → Environment.' }),
    el('li', { text: 'Add or change the variable, e.g. ADMIN_EMAILS=you@example.com,partner@example.com.' }),
    el('li', { text: 'Save and redeploy. Keys and secrets are typed there only, never in this admin site or in GitHub.' })))];
}
async function auditPage() {
  setTitle('Audit log', 'Every admin change, newest first');
  const { entries } = await api('GET', '/api/admin/audit');
  return [card('', table(['When', 'Who', 'What', 'Item', 'Details'], entries.map((e) => [date(e.at), e.actor, e.action, e.target, Object.entries(e.detail ?? {}).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' · ')]), 'Nothing yet.'))];
}

// ── router ──
const PAGES = { overview, content: contentPage, orders: ordersPage, posts: postsPage, users: usersPage, ai: aiPage, pro: proPage, coupons: couponsPage, ads: adsPage, site: sitePage, settings: settingsPage, audit: auditPage };
const DETAIL = { topic: topicPage, track: trackPage, course: coursePage, post: postPage, ad: adPage };
let seq = 0;
async function route() {
  const [name, arg] = (location.hash.slice(1) || 'overview').split('/');
  mountShell(PARENT[name] ?? name);
  const my = ++seq;
  content.replaceChildren(el('div', { class: 'skeleton' }), el('div', { class: 'skeleton' }));
  try {
    const page = DETAIL[name] && arg ? () => DETAIL[name](decodeURIComponent(arg)) : PAGES[name] ?? overview;
    const nodes = await page();
    if (my === seq) { content.replaceChildren(...nodes.filter(Boolean)); content.focus?.({ preventScroll: true }); window.scrollTo({ top: 0 }); }
  } catch (e) {
    if (my === seq) content.replaceChildren(card('Something went wrong', el('p', { text: e.message }), button('Try again', route, 'line')));
  }
}

async function start() {
  if (!currentUser()) {
    content.replaceChildren(card('Admins only', el('p', { text: 'Sign in with your admin account to continue.' }), button('Sign in', () => showSignIn(), 'primary')));
    showSignIn();
    return;
  }
  try {
    me = await api('GET', '/api/admin/me');
  } catch (e) {
    content.replaceChildren(card(e.status === 403 ? 'This account is not an admin' : 'Admins only', el('p', { text: e.message }), link('Back to the site', '/', 'line')));
    return;
  }
  createMenu();
  window.addEventListener('hashchange', route);
  route();
}
start();
