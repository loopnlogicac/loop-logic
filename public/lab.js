// Lab page: what you need, setup checklist, starter material, tasks,
// expected result and server-checked questions. Never personalised.
import { api, getLang, applyI18n, mountNav, el, num, errorBox, ensureSignedIn, toast } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · labs are the same for every learner, and every starter was run before it was published',
    courses: 'Courses', lab: 'Lab', kicker: (m, k) => `Hands-on lab · about ${m} minutes · ${k}`,
    kinds: { code: 'code', simulator: 'simulator', spreadsheet: 'spreadsheet' },
    need: 'What you need', online: 'In the browser', install: 'On your computer', open: 'Open',
    watch: 'Watch first', readFirst: 'Read the lesson first', backLesson: 'Back to the lesson',
    setup: 'Set up', setupSub: 'Tick each step as you finish it. Your ticks are kept on this device.',
    starter: 'Starter', copy: 'Copy', copied: 'Copied', download: 'Download', copyFail: 'Select the text and copy it by hand.',
    tasks: 'Your tasks', expected: 'Expected result', showExpected: 'Show the expected result',
    check: 'Check your result', checkSub: 'Answer from what you saw on your own screen. Answers are checked on the server.',
    progress: (c, t) => `${c} of ${t} checks done`, right: 'Correct.', wrong: 'Not yet. Look at your output again and try another answer.',
    trouble: 'If something goes wrong', further: 'Go further',
    done: 'Lab complete', doneSub: 'You set it up, ran it and checked your results yourself.', toCourse: 'Back to the course', toDash: 'Go to my dashboard',
    notFound: 'There is no lab for this lesson yet.', back: 'Back to courses',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · ল্যাব সব শিক্ষার্থীর জন্য একই, আর প্রতিটি স্টার্টার প্রকাশের আগে চালিয়ে দেখা হয়েছে',
    courses: 'কোর্স', lab: 'ল্যাব', kicker: (m, k) => `হাতে-কলমে ল্যাব · প্রায় ${m} মিনিট · ${k}`,
    kinds: { code: 'কোড', simulator: 'সিমুলেটর', spreadsheet: 'স্প্রেডশিট' },
    need: 'যা লাগবে', online: 'ব্রাউজারে', install: 'তোমার কম্পিউটারে', open: 'খোলো',
    watch: 'আগে দেখে নাও', readFirst: 'আগে পাঠটি পড়ো', backLesson: 'পাঠে ফিরে যাও',
    setup: 'সেটআপ', setupSub: 'প্রতিটি ধাপ শেষ হলে টিক দাও। টিকগুলো এই ডিভাইসেই থাকে।',
    starter: 'স্টার্টার', copy: 'কপি', copied: 'কপি হয়েছে', download: 'ডাউনলোড', copyFail: 'লেখাটি সিলেক্ট করে নিজে কপি করো।',
    tasks: 'তোমার কাজ', expected: 'প্রত্যাশিত ফল', showExpected: 'প্রত্যাশিত ফল দেখাও',
    check: 'তোমার ফল যাচাই করো', checkSub: 'নিজের স্ক্রিনে যা দেখেছ তা থেকে উত্তর দাও। উত্তর সার্ভারে যাচাই হয়।',
    progress: (c, t) => `${t}টির মধ্যে ${c}টি যাচাই শেষ`, right: 'ঠিক।', wrong: 'এখনো হয়নি। তোমার আউটপুট আবার দেখে অন্য উত্তর চেষ্টা করো।',
    trouble: 'কিছু ভুল হলে', further: 'আরেক ধাপ এগোও',
    done: 'ল্যাব সম্পন্ন', doneSub: 'তুমি নিজে সেটআপ করেছ, চালিয়েছ আর নিজের ফল যাচাই করেছ।', toCourse: 'কোর্সে ফিরে যাও', toDash: 'আমার ড্যাশবোর্ডে যাও',
    notFound: 'এই পাঠের জন্য এখনো ল্যাব নেই।', back: 'কোর্সে ফিরে যাও',
  },
};
const t = () => T[getLang()];
const id = new URLSearchParams(location.search).get('id') ?? '';
const main = document.getElementById('main');
const tickKey = `ll_lab_setup_${id}`;
let lab = null;

const readTicks = () => { try { return JSON.parse(localStorage.getItem(tickKey) ?? '[]'); } catch { return []; } };
const saveTicks = (list) => { try { localStorage.setItem(tickKey, JSON.stringify(list)); } catch { /* storage unavailable: ticks last for this visit only */ } };

async function copyText(text, button) {
  const L = t();
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = L.copied;
    setTimeout(() => { button.textContent = L.copy; }, 1600);
  } catch { toast(L.copyFail); }
}

function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const a = el('a', { href: url, download: filename });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const section = (n, title, sub, ...children) => el('section', { class: 'card lab-section' },
  el('div', { class: 'lab-head' }, el('span', { class: 'lab-num', 'aria-hidden': 'true', text: num(n) }), el('div', {}, el('h2', { text: title }), sub ? el('p', { class: 'muted small', text: sub }) : null)),
  ...children);

function progressBar() {
  const L = t();
  const p = lab.progress;
  const pct = p.checksTotal ? Math.round((p.checksCorrect / p.checksTotal) * 100) : 0;
  return el('div', { class: 'lab-progress', id: 'lab-progress' },
    el('span', { text: L.progress(num(p.checksCorrect), num(p.checksTotal)) }),
    el('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(pct), 'aria-valuemin': '0', 'aria-valuemax': '100' }, el('i', { style: `width:${pct}%` })));
}

function doneBanner() {
  const L = t();
  return el('section', { class: 'continue lab-done', id: 'lab-done' },
    el('div', {}, el('h2', { text: `✓ ${L.done}` }), el('p', { text: L.doneSub })),
    el('div', { class: 'row', style: 'margin:0' },
      lab.course ? el('a', { class: 'btn primary', href: `/course.html?id=${encodeURIComponent(lab.course.id)}`, text: L.toCourse }) : null,
      el('a', { class: 'btn ghost', style: 'color:#fff;border-color:rgb(255 255 255 / .4)', href: '/dashboard.html', text: L.toDash })));
}

function checkCard(c, index) {
  const L = t();
  const result = el('p', { class: 'check-result', role: 'status' });
  const opts = el('div', { class: 'opts' });
  const card = el('div', { class: `lab-check ${c.done ? 'is-done' : ''}` }, el('p', { class: 'check-q' }, el('b', { text: `${num(index + 1)}. ` }), c.question), opts, result);
  c.options.forEach((text, i) => {
    opts.append(el('button', { type: 'button', text, onclick: async (e) => {
      const btn = e.currentTarget;
      for (const b of opts.children) b.disabled = true;
      try {
        const r = await api('POST', `/api/labs/${encodeURIComponent(id)}/check`, { checkId: c.id, choice: i, lang: getLang() });
        lab.progress = r.progress;
        if (r.correct) {
          btn.classList.add('right');
          card.classList.add('is-done');
          result.textContent = `${L.right} ${r.explanation}`;
        } else {
          btn.classList.add('wrong');
          result.textContent = L.wrong;
          for (const b of opts.children) if (b !== btn && !b.classList.contains('wrong')) b.disabled = false;
        }
        document.getElementById('lab-progress').replaceWith(progressBar());
        if (r.progress.done && !document.getElementById('lab-done')) { main.append(doneBanner()); toast(L.done); }
      } catch (err) {
        result.textContent = err.message;
        for (const b of opts.children) b.disabled = false;
      }
    } }));
  });
  if (c.done) { result.textContent = `✓ ${L.right}`; for (const b of opts.children) b.disabled = true; }
  return card;
}

function render() {
  const L = t();
  applyI18n(L);
  document.title = `${lab.title} · Loop & Logic`;
  const lessonHref = `/lesson.html?id=${encodeURIComponent(lab.lessonId)}`;
  const ticks = new Set(readTicks());

  const head = [
    el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
      el('a', { href: '/courses.html', text: L.courses }), '›',
      lab.course ? el('a', { href: `/course.html?id=${encodeURIComponent(lab.course.id)}`, text: lab.course.title }) : null, lab.course ? '›' : null,
      el('a', { href: lessonHref, text: lab.lessonTitle }), '›', el('span', { text: L.lab })),
    el('div', { class: 'page-head' },
      el('p', { class: 'kicker', text: L.kicker(num(lab.minutes), L.kinds[lab.kind]) }),
      el('h1', { text: lab.title }),
      el('p', { text: lab.goal })),
    progressBar(),
  ];

  // side column
  const tools = (kind, label) => {
    const list = lab.tools.filter((x) => x.kind === kind);
    if (!list.length) return null;
    return el('div', {}, el('h3', { class: 'side-label', text: label }),
      el('ul', { class: 'tool-list' }, ...list.map((x) => el('li', {},
        el('div', { class: 'tool-top' }, el('b', { text: x.name }), x.url ? el('a', { class: 'btn secondary small', href: x.url, target: '_blank', rel: 'noopener noreferrer', text: `${L.open} ↗` }) : null),
        el('span', { class: 'muted small', text: x.note })))));
  };
  const side = el('aside', { class: 'lab-side' },
    el('section', { class: 'card' }, el('h2', { text: L.need }), tools('online', L.online), tools('install', L.install)),
    el('section', { class: 'card' }, el('h2', { text: L.watch }),
      el('ul', { class: 'pl-list' },
        el('li', {}, el('a', { href: lessonHref }, el('span', { text: `${L.readFirst}: ${lab.lessonTitle}` }), el('span', { class: 'muted small', text: '→' }))),
        ...lab.videos.map((v) => el('li', {}, el('a', { href: v.url, target: '_blank', rel: 'noopener noreferrer' }, el('span', { text: `▶ ${v.title}` }), el('span', { class: 'muted small', text: '↗' })))))));

  // main column
  const sections = [];
  let n = 1;
  sections.push(section(n++, L.setup, L.setupSub,
    el('ol', { class: 'checklist' }, ...lab.setup.map((step, i) => {
      const box = el('input', { type: 'checkbox', id: `step-${i}`, checked: ticks.has(i) || null, onchange: (e) => {
        if (e.target.checked) ticks.add(i); else ticks.delete(i);
        saveTicks([...ticks]);
      } });
      return el('li', {}, box, el('label', { for: `step-${i}`, text: step }));
    }))));

  if (lab.starter) {
    const copyBtn = el('button', { type: 'button', class: 'btn secondary small', text: L.copy });
    copyBtn.onclick = () => copyText(lab.starter.code, copyBtn);
    const ext = lab.starter.language === 'formulas' ? `${lab.starter.filename}.txt` : lab.starter.filename;
    sections.push(section(n++, L.starter, lab.starter.note,
      el('div', { class: 'codebox' },
        el('div', { class: 'codebar' }, el('span', { text: ext }), el('div', { class: 'row', style: 'margin:0' }, copyBtn,
          el('button', { type: 'button', class: 'btn secondary small', text: L.download, onclick: () => downloadText(ext, lab.starter.code) }))),
        el('pre', { tabindex: '0', dir: 'ltr' }, el('code', { text: lab.starter.code })))));
  }

  sections.push(section(n++, L.tasks, null, el('ol', { class: 'task-list' }, ...lab.tasks.map((x) => el('li', { text: x })))));

  if (lab.expected) {
    sections.push(section(n++, L.expected, lab.expected.caption,
      el('details', { class: 'reveal' }, el('summary', { text: L.showExpected }), el('pre', { class: 'output', tabindex: '0', dir: 'ltr' }, el('code', { text: lab.expected.output })))));
  }

  sections.push(section(n++, L.check, L.checkSub, ...lab.checks.map(checkCard)));

  sections.push(el('section', { class: 'card lab-section' }, el('h2', { text: L.trouble }),
    el('div', { class: 'faq' }, ...lab.troubleshooting.map((x) => el('details', {}, el('summary', { text: x.problem }), el('p', { text: x.fix }))))));
  sections.push(el('section', { class: 'card lab-section further' }, el('h2', { text: L.further }), el('p', { text: lab.extension })));

  main.replaceChildren(...head, el('div', { class: 'lab-grid' }, el('div', { class: 'lab-main' }, ...sections), side));
  if (lab.progress.done) main.append(doneBanner());
}

async function load() {
  try {
    lab = await api('GET', `/api/labs/${encodeURIComponent(id)}?lang=${getLang()}`);
    render();
  } catch (e) {
    if (e.status === 404) main.replaceChildren(el('div', { class: 'card empty' }, el('h2', { text: t().notFound }), el('a', { class: 'btn secondary', href: '/courses.html', text: t().back })));
    else errorBox(main, e.message, load);
  }
}

await ensureSignedIn();
mountNav('courses', load);
applyI18n(t());
load();
