// Virtual Office (/office.html): interns practise a real workplace. Role-based
// messages (team lead, colleagues, product manager) can be incomplete or conflict,
// and the AI assistant sometimes gives faulty output. The server grades each choice
// and explains it; answer keys never reach the browser before an answer.
import { api, getLang, applyI18n, mountNav, el, num, errorBox, toast } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · names and companies in the Virtual Office are fictional',
    title: 'Virtual Office', kicker: 'Internship practice',
    intro: 'Practise the parts of a first job that courses skip. You join a team at a software company, get tasks from a team lead and colleagues, and use an AI assistant. Some messages leave things out, people sometimes disagree, and the AI is sometimes wrong. Your job: ask the right questions, check the work and deliver quality.',
    how: [['💬', 'Role-based messages', 'A team lead, colleagues and a product manager, each with their own view.'], ['🤖', 'An AI assistant that can be wrong', 'Its answers sound confident. Some contain planted mistakes for you to catch.'], ['📋', 'Feedback on every choice', 'See why a choice works or backfires, then a debrief and a skills report.']],
    projects: 'Projects', free: 'Free sample', premium: 'Premium', min: (n) => `about ${n} min`, steps: (d, n) => `${d} of ${n} tasks`,
    start: 'Start project', resume: 'Continue', again: 'Open', bestScore: (n) => `Best score ${n}%`, unlock: 'Unlock with Premium', soon: 'Premium coming soon',
    lockedNote: 'Part of the Premium Virtual Office.', report: 'Your workplace skills', reportEmpty: 'Finish a project to see your skills report here.',
    back: '← All projects', team: 'Your team', you: 'You', role: 'Your role', progress: (d, n) => `Task ${d} of ${n}`,
    aiTitle: 'Office AI', aiNote: 'The assistant is useful and fast, but it can be confidently wrong. Check everything it gives you.', aiNone: 'You haven’t asked the assistant anything yet.',
    youAsked: 'You asked Office AI', aiBadge: 'AI · check before using', chose: 'You chose', flagged: 'Your review',
    verdict: { best: 'Best practice', partial: 'Partly right', poor: 'Risky choice' },
    pickOne: 'Choose one', pickMany: 'Select all that apply', send: 'Send', sendReview: 'Submit review', choose: 'Choose an option first.', chooseSome: 'Select at least one option.',
    mark: { hit: 'Correct', wrongPick: 'Not a real problem', missed: 'Missed', fine: 'Rightly left out' },
    debrief: 'Debrief', overall: 'Overall', skillsTitle: 'Skills in this project', traps: 'Every trap in this project',
    yours: 'Your answer', best: 'Best practice', habit: 'Habit to keep', retry: 'Try again', toOffice: 'Back to the office',
    trapKind: { incomplete: 'Incomplete information', conflict: 'Conflicting instructions', ai: 'Faulty AI output', quality: 'Quality check', update: 'Status update' },
    premiumTitle: 'This project is Premium', premiumBody: 'The first project is free. The other projects are part of the Premium Virtual Office.',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · ভার্চুয়াল অফিসের নাম আর প্রতিষ্ঠান কাল্পনিক',
    title: 'ভার্চুয়াল অফিস', kicker: 'ইন্টার্নশিপ অনুশীলন',
    intro: 'প্রথম চাকরির যে অংশগুলো কোর্সে শেখানো হয় না, সেগুলো অনুশীলন করো। তুমি একটা সফটওয়্যার কোম্পানির টিমে যোগ দেবে, টিম লিড আর সহকর্মীদের কাছ থেকে কাজ পাবে, আর একটা এআই সহকারী ব্যবহার করবে। কিছু মেসেজে দরকারি কথা বাদ পড়ে, মানুষ মাঝে মাঝে দ্বিমত করে, আর এআই কখনো কখনো ভুল করে। তোমার কাজ: সঠিক প্রশ্ন করা, কাজ যাচাই করা আর মানসম্মত কাজ জমা দেওয়া।',
    how: [['💬', 'ভূমিকাভিত্তিক মেসেজ', 'টিম লিড, সহকর্মী আর প্রোডাক্ট ম্যানেজার, প্রত্যেকের নিজের দৃষ্টিভঙ্গি।'], ['🤖', 'ভুল করতে পারে এমন এআই সহকারী', 'ওর উত্তর আত্মবিশ্বাসী শোনায়। কিছু উত্তরে ইচ্ছা করে ভুল রাখা আছে, যেগুলো তোমাকে ধরতে হবে।'], ['📋', 'প্রতিটা সিদ্ধান্তে ফিডব্যাক', 'কোন সিদ্ধান্ত কেন কাজে দেয় বা উল্টো ফল আনে দেখো, তারপর সারসংক্ষেপ আর দক্ষতার রিপোর্ট।']],
    projects: 'প্রজেক্ট', free: 'ফ্রি নমুনা', premium: 'প্রিমিয়াম', min: (n) => `প্রায় ${n} মিনিট`, steps: (d, n) => `${n}টি কাজের মধ্যে ${d}টি`,
    start: 'প্রজেক্ট শুরু করো', resume: 'চালিয়ে যাও', again: 'খোলো', bestScore: (n) => `সেরা স্কোর ${n}%`, unlock: 'প্রিমিয়ামে খুলে নাও', soon: 'প্রিমিয়াম শিগগিরই আসছে',
    lockedNote: 'প্রিমিয়াম ভার্চুয়াল অফিসের অংশ।', report: 'তোমার কর্মক্ষেত্রের দক্ষতা', reportEmpty: 'একটা প্রজেক্ট শেষ করলে এখানে দক্ষতার রিপোর্ট দেখাবে।',
    back: '← সব প্রজেক্ট', team: 'তোমার টিম', you: 'তুমি', role: 'তোমার ভূমিকা', progress: (d, n) => `${n}টির মধ্যে ${d} নম্বর কাজ`,
    aiTitle: 'Office AI', aiNote: 'সহকারীটা কাজের আর দ্রুত, কিন্তু আত্মবিশ্বাসের সঙ্গে ভুলও করতে পারে। যা দেয়, সব যাচাই করো।', aiNone: 'তুমি এখনো সহকারীকে কিছু জিজ্ঞেস করোনি।',
    youAsked: 'তুমি Office AI-কে জিজ্ঞেস করেছ', aiBadge: 'এআই · ব্যবহারের আগে যাচাই করো', chose: 'তুমি বেছে নিয়েছ', flagged: 'তোমার রিভিউ',
    verdict: { best: 'সেরা পদ্ধতি', partial: 'আংশিক ঠিক', poor: 'ঝুঁকিপূর্ণ সিদ্ধান্ত' },
    pickOne: 'একটা বেছে নাও', pickMany: 'যতগুলো খাটে, সব বেছে নাও', send: 'পাঠাও', sendReview: 'রিভিউ জমা দাও', choose: 'আগে একটা অপশন বেছে নাও।', chooseSome: 'অন্তত একটা অপশন বেছে নাও।',
    mark: { hit: 'ঠিক', wrongPick: 'আসল সমস্যা না', missed: 'বাদ পড়েছে', fine: 'ঠিকভাবেই বাদ' },
    debrief: 'সারসংক্ষেপ', overall: 'সামগ্রিক', skillsTitle: 'এই প্রজেক্টে দক্ষতা', traps: 'এই প্রজেক্টের সব ফাঁদ',
    yours: 'তোমার উত্তর', best: 'সেরা পদ্ধতি', habit: 'যে অভ্যাস রাখবে', retry: 'আবার চেষ্টা করো', toOffice: 'অফিসে ফিরে যাও',
    trapKind: { incomplete: 'অসম্পূর্ণ তথ্য', conflict: 'পরস্পরবিরোধী নির্দেশনা', ai: 'এআই-এর ভুল আউটপুট', quality: 'মান যাচাই', update: 'স্ট্যাটাস আপডেট' },
    premiumTitle: 'এই প্রজেক্টটা প্রিমিয়াম', premiumBody: 'প্রথম প্রজেক্টটা ফ্রি। বাকি প্রজেক্টগুলো প্রিমিয়াম ভার্চুয়াল অফিসের অংশ।',
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const enc = encodeURIComponent;
const projectId = () => new URLSearchParams(location.search).get('p');

/** Text with `inline code` shown as code, built safely as DOM nodes. */
function rich(text) {
  return String(text).split(/(`[^`]+`)/).map((part) => (part.startsWith('`') && part.endsWith('`') && part.length > 2 ? el('code', { text: part.slice(1, -1) }) : part));
}
const avatar = (r, id) => el('span', { class: `vo-av k-${r?.kind ?? 'you'}`, 'aria-hidden': 'true', text: r?.initials ?? id });

// ── lobby ──
async function lobby() {
  const L = t();
  document.title = `${L.title} · Loop & Logic`;
  const d = await api('GET', `/api/office?lang=${getLang()}`);
  const card = (p) => {
    const href = `/office.html?p=${enc(p.id)}`;
    const action = p.locked
      ? (d.unlock ? el('a', { class: 'btn primary small', href: `/buy.html?course=${enc(d.unlock.id)}`, text: d.unlock.price ? `${L.unlock} · ৳ ${num(d.unlock.price)}` : L.unlock }) : el('span', { class: 'btn ghost small', 'aria-disabled': 'true', text: L.soon }))
      : el('a', { class: 'btn primary small', href, text: p.finished ? L.again : p.done ? L.resume : L.start });
    return el('article', { class: `vo-card${p.locked ? ' locked' : ''}` },
      el('div', { class: 'vo-card-top' }, el('span', { class: 'vo-track', text: p.track }), el('span', { class: `access-tag ${p.free ? 'free' : 'paid'}`, text: p.free ? L.free : L.premium })),
      el('h3', {}, p.locked ? p.title : el('a', { href, text: p.title })),
      el('p', { class: 'vo-role', text: `${p.role} · ${p.company} · ${L.min(num(p.minutes))}` }),
      el('p', { text: p.summary }),
      el('div', { class: 'vo-chips' }, ...p.skills.map((s) => el('span', { class: 'vo-chip', text: s }))),
      el('div', { class: 'vo-card-foot' },
        el('span', { class: 'muted small', text: p.locked ? L.lockedNote : p.best !== null ? L.bestScore(num(p.best)) : p.done ? L.steps(num(p.done), num(p.steps)) : '' }),
        action));
  };
  main.replaceChildren(
    el('section', { class: 'vo-hero' },
      el('p', { class: 'vo-kicker', text: L.kicker }), el('h1', { text: L.title }), el('p', { class: 'vo-intro', text: L.intro }),
      el('div', { class: 'vo-how' }, ...L.how.map(([icon, h, p]) => el('div', { class: 'vo-how-item' }, el('span', { class: 'vo-how-ico', 'aria-hidden': 'true', text: icon }), el('div', {}, el('strong', { text: h }), el('p', { text: p })))))),
    el('h2', { class: 'vo-h2', text: L.projects }),
    el('div', { class: 'vo-grid' }, ...d.projects.map(card)),
    el('section', { class: 'card vo-report' }, el('h2', { text: L.report }),
      d.report.length ? el('div', { class: 'vo-bars' }, ...d.report.map((s) => bar(s.title, s.percent, s.blurb))) : el('p', { class: 'muted', text: L.reportEmpty })));
}
const bar = (label, percent, hint) => el('div', { class: 'vo-bar' },
  el('div', { class: 'vo-bar-head' }, el('strong', { text: label }), el('span', { text: `${num(percent)}%` })),
  el('div', { class: 'vo-meter', role: 'img', 'aria-label': `${label}: ${percent}%` }, el('i', { style: `width:${percent}%` })),
  hint ? el('p', { class: 'muted small', text: hint }) : null);

// ── a project ──
async function project(id, view) {
  const L = t();
  let v = view;
  if (!v) {
    try { v = await api('GET', `/api/office/${enc(id)}?lang=${getLang()}`); } catch (e) {
      if (e.code === 'premium') return premiumCard();
      throw e;
    }
  }
  document.title = `${v.project.title} · ${L.title} · Loop & Logic`;
  const roles = v.roles;
  const thread = el('div', { class: 'vo-thread', role: 'log', 'aria-label': v.project.title });
  for (const item of v.thread) thread.append(renderItem(item, roles, L));
  const lower = v.debrief ? debrief(v, L) : v.current ? task(v, L) : null;
  const side = el('aside', { class: 'vo-side' },
    el('section', { class: 'card vo-panel' }, el('h2', { text: L.team }),
      el('div', { class: 'vo-member' }, avatar(null, '👤'), el('div', {}, el('strong', { text: L.you }), el('span', { class: 'muted small', text: v.project.role }))),
      ...v.project.team.map((r) => el('div', { class: 'vo-member' }, avatar(roles[r], r), el('div', {}, el('strong', { text: roles[r].name }), el('span', { class: 'muted small', text: roles[r].title }))))),
    el('section', { class: 'card vo-panel vo-ai' }, el('h2', {}, '🤖 ', L.aiTitle), el('p', { class: 'vo-ai-note', text: L.aiNote }),
      v.ai.length ? el('div', {}, ...v.ai.map((x) => el('div', { class: 'vo-ai-item' }, el('p', { class: 'small' }, el('strong', { text: `${L.you}: ` }), x.ask),
        ...x.answers.map((m) => el('p', { class: 'small muted', text: m.text }))))) : el('p', { class: 'muted small', text: L.aiNone })),
    el('section', { class: 'card vo-panel' }, el('h2', { text: L.progress(num(Math.min(v.progress.done + (v.debrief ? 0 : 1), v.progress.total)), num(v.progress.total)) }),
      el('ol', { class: 'vo-steps' }, ...v.project.steps.map((s, i) => el('li', { class: i < v.progress.done ? 'done' : i === v.progress.done && !v.debrief ? 'now' : '', text: s })))));
  main.replaceChildren(
    el('a', { class: 'vo-back', href: '/office.html', text: L.back }),
    el('div', { class: 'vo-head' }, el('p', { class: 'vo-kicker', text: `${v.project.track} · ${v.project.company}` }), el('h1', { text: v.project.title }), el('p', { class: 'muted', text: `${L.role}: ${v.project.role}` }),
      el('div', { class: 'vo-meter', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(v.progress.total), 'aria-valuenow': String(v.progress.done) }, el('i', { style: `width:${Math.round((100 * v.progress.done) / v.progress.total)}%` }))),
    el('div', { class: 'vo-layout' }, el('div', { class: 'vo-main' }, thread, lower), side));
  return v;
}

function renderItem(item, roles, L) {
  if (item.type === 'step') return el('div', { class: 'vo-divider' }, el('span', { text: `${item.n} · ${item.title}` }));
  if (item.type === 'ask') return el('div', { class: 'vo-me' }, el('div', { class: 'vo-bubble me' }, el('span', { class: 'vo-meta', text: L.youAsked }), el('p', {}, ...rich(item.text))));
  if (item.type === 'msg') {
    const r = roles[item.from];
    return el('div', { class: `vo-msg${r.kind === 'ai' ? ' ai' : ''}` }, avatar(r, item.from),
      el('div', { class: 'vo-bubble' },
        el('div', { class: 'vo-meta' }, el('strong', { text: r.name }), el('span', { text: ` · ${r.title} · ${item.at}` })),
        r.kind === 'ai' ? el('span', { class: 'vo-ai-badge', text: `⚠ ${L.aiBadge}` }) : null,
        el('p', {}, ...rich(item.text)),
        item.code ? el('pre', { class: 'vo-code' }, el('code', { text: item.code })) : null));
  }
  if (item.type === 'result') {
    const icon = { best: '✓', partial: '◐', poor: '✗' }[item.verdict];
    const head = el('div', { class: `vo-verdict v-${item.verdict}` }, el('strong', {}, `${icon} ${L.verdict[item.verdict]}`));
    if (item.kind === 'choose') {
      return el('div', {}, el('div', { class: 'vo-me' }, el('div', { class: 'vo-bubble me' }, el('span', { class: 'vo-meta', text: L.chose }), el('p', {}, ...rich(item.picked[0])))),
        el('div', { class: `vo-feedback v-${item.verdict}` }, head, el('p', {}, ...rich(item.feedback))));
    }
    return el('div', { class: `vo-feedback v-${item.verdict}` }, head, el('p', { class: 'vo-meta', text: L.flagged }),
      el('ul', { class: 'vo-review' }, ...item.options.map((o) => {
        const state = o.picked ? (o.correct ? 'hit' : 'wrongPick') : (o.correct ? 'missed' : 'fine');
        return el('li', { class: `r-${state}` }, el('span', { class: 'vo-tag', text: L.mark[state] }), el('div', {}, el('p', {}, ...rich(o.text)), el('p', { class: 'muted small' }, ...rich(o.feedback))));
      })));
  }
  return el('div');
}

function task(v, L) {
  const c = v.current;
  const multi = c.kind === 'multi';
  const name = `opt-${c.id}`;
  const status = el('p', { class: 'small', role: 'status' });
  const send = el('button', { type: 'submit', class: 'btn primary', text: multi ? L.sendReview : L.send });
  const form = el('form', { class: 'card vo-task' },
    el('p', { class: 'vo-kicker', text: multi ? L.pickMany : L.pickOne }),
    el('h2', {}, ...rich(c.prompt)),
    el('fieldset', { class: 'vo-options' }, el('legend', { class: 'sr-only', text: c.prompt }),
      ...c.options.map((o) => el('label', { class: 'vo-option' }, el('input', { type: multi ? 'checkbox' : 'radio', name, value: o.id }), el('span', {}, ...rich(o.text))))),
    el('div', { class: 'row' }, send, status));
  form.onsubmit = async (e) => {
    e.preventDefault();
    const choices = [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
    if (!choices.length) { status.textContent = multi ? L.chooseSome : L.choose; return; }
    send.disabled = true;
    try {
      const next = await api('POST', `/api/office/${enc(v.project.id)}/answer`, { step: c.id, choices, lang: getLang() });
      await project(v.project.id, next);
      const results = main.querySelectorAll('.vo-feedback');
      results[results.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) { status.textContent = err.message; send.disabled = false; }
  };
  return form;
}

function debrief(v, L) {
  const d = v.debrief;
  const retry = el('button', { type: 'button', class: 'btn primary', text: L.retry });
  retry.onclick = async () => {
    retry.disabled = true;
    try { await project(v.project.id, await api('POST', `/api/office/${enc(v.project.id)}/restart`, { lang: getLang() })); window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { toast(e.message); retry.disabled = false; }
  };
  const icon = { best: '✓', partial: '◐', poor: '✗' };
  return el('section', { class: 'card vo-debrief', 'aria-labelledby': 'vo-debrief-h' },
    el('h2', { id: 'vo-debrief-h', text: L.debrief }),
    el('div', { class: 'vo-score' }, el('span', { class: 'vo-score-big', text: `${num(d.overall)}%` }), el('span', { class: 'muted', text: L.overall })),
    el('h3', { text: L.skillsTitle }), el('div', { class: 'vo-bars' }, ...d.skills.map((s) => bar(s.title, s.percent))),
    el('h3', { text: L.traps }),
    el('ol', { class: 'vo-traps' }, ...d.steps.map((s) => el('li', { class: `v-${s.verdict}` },
      el('div', { class: 'vo-trap-head' }, el('span', { class: 'vo-tag', text: L.trapKind[s.trapKind] }), el('strong', {}, `${icon[s.verdict]} ${s.n}. ${s.title}`)),
      el('p', {}, ...rich(s.trap)),
      el('p', { class: 'small' }, el('strong', { text: `${L.yours}: ` }), ...rich(s.yours.join(' · '))),
      s.verdict === 'best' ? null : el('p', { class: 'small' }, el('strong', { text: `${L.best}: ` }), ...rich(s.best.join(' · '))),
      el('p', { class: 'small vo-habit' }, el('strong', { text: `${L.habit}: ` }), s.lesson)))),
    el('div', { class: 'row' }, retry, el('a', { class: 'btn ghost', href: '/office.html', text: L.toOffice })));
}

async function premiumCard() {
  const L = t();
  const d = await api('GET', `/api/office?lang=${getLang()}`).catch(() => ({ unlock: null }));
  main.replaceChildren(el('a', { class: 'vo-back', href: '/office.html', text: L.back }),
    el('section', { class: 'card empty' }, el('h1', { text: L.premiumTitle }), el('p', { text: L.premiumBody }),
      d.unlock ? el('a', { class: 'btn primary', href: `/buy.html?course=${enc(d.unlock.id)}`, text: L.unlock }) : el('p', { class: 'muted', text: L.soon })));
}

async function load() {
  applyI18n(t());
  try { const id = projectId(); if (id) await project(id); else await lobby(); } catch (e) { errorBox(main, e.message, load); }
}

mountNav('office', load);
window.addEventListener('ll-auth', () => load());
load();
