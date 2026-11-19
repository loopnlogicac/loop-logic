import { savedStrings, savedEditor } from './saved.js';
// Tutorials: track list → topic list → topic page (lesson, runnable examples, labs,
// quiz graded on the server, practice with solutions, exam questions).
import { fillAdSlots, api, getLang, applyI18n, mountNav, el, num, errorBox, toast } from './common.js';
import { mountLab, renderFigure } from './lab-player.js';
import { codeRunner, runnerStatus } from './runner.js';

let RUN = { enabled: false, languages: [] };

const T = {
  en: {
    ...savedStrings.en,
    tagline: 'Learn with purpose', foot: 'Loop & Logic · every example in these tutorials was compiled and run before publishing',
    title: 'Tutorials', sub: (t, l) => `Step-by-step written lessons with runnable code, interactive labs, quizzes and practice. ${t} topics and ${l} labs so far, with more added every week.`,
    topics: 'topics', labs: 'labs', of: 'of', soon: 'Coming soon', start: 'Start', open: 'Open', inProgress: 'Being written',
    levels: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' },
    kinds: { lesson: 'Lesson', theory: 'Concepts', project: 'Project', 'question-bank': 'Practice sheet' },
    min: (m) => `${m} min`, lab: 'Lab', freeTag: 'FREE', ready: (a, b) => `${a} of ${b} topics ready`, all: 'All tutorials', contents: 'Contents', onPage: 'On this page',
    example: 'Example', output: 'Output', copy: 'Copy', copied: 'Copied', tryNow: 'Try now', tryNowTip: 'Code copied. Paste it into the online compiler.',
    keyPoints: 'Key points', quiz: 'Check yourself', submit: 'Check my answers', score: (s, n) => `${s} of ${n} correct`, answerAll: 'Answer at least one question first.', retry: 'Try again',
    practice: 'Practice problems', tryOwn: '✎ Write and run your own solution', tryOwnHint: 'The sample input is filled in. Press Run and we compare your output with the expected output.', hints: 'Hints', solution: 'Show solution', written: 'Show worked answer', tests: 'Sample test', input: 'Input', expected: 'Expected output',
    exam: 'Exam-style questions', showAnswer: 'Show answer', videos: 'Watch the video', refs: 'Read more', prev: 'Previous', next: 'Next',
    results: (n, s) => `${n} topics match “${s}”`, noResults: (s) => `No topic matches “${s}” yet. Try another word, or browse the tutorials below.`,
    noBn: 'The full Bangla version of this lesson is coming. You are reading the English text; key points and quiz help are in Bangla where available.',
    bnAvail: 'This lesson is also available in Bangla. Switch with the EN · বাংলা button.', course: 'Video course', notReady: 'not yet written',
  },
  bn: {
    ...savedStrings.bn,
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · এই টিউটোরিয়ালের প্রতিটি উদাহরণ প্রকাশের আগে কম্পাইল করে চালানো হয়েছে',
    title: 'টিউটোরিয়াল', sub: (t, l) => `ধাপে ধাপে লেখা পাঠ, চালানো যায় এমন কোড, ইন্টারঅ্যাকটিভ ল্যাব, কুইজ আর অনুশীলন। এখন পর্যন্ত ${t}টি টপিক আর ${l}টি ল্যাব; প্রতি সপ্তাহে আরও যোগ হচ্ছে।`,
    topics: 'টপিক', labs: 'ল্যাব', of: '/', soon: 'শিগগিরই আসছে', start: 'শুরু করো', open: 'খোলো', inProgress: 'লেখা চলছে',
    levels: { beginner: 'শুরুর স্তর', intermediate: 'মাঝারি', advanced: 'উচ্চতর' },
    kinds: { lesson: 'পাঠ', theory: 'ধারণা', project: 'প্রজেক্ট', 'question-bank': 'অনুশীলন শিট' },
    min: (m) => `${m} মিনিট`, lab: 'ল্যাব', freeTag: 'ফ্রি', ready: (a, b) => `${b}টির মধ্যে ${a}টি টপিক তৈরি`, all: 'সব টিউটোরিয়াল', contents: 'সূচিপত্র', onPage: 'এই পাতায়',
    example: 'উদাহরণ', output: 'আউটপুট', copy: 'কপি', copied: 'কপি হয়েছে', tryNow: 'এখনই চালাও', tryNowTip: 'কোড কপি হয়েছে। অনলাইন কম্পাইলারে পেস্ট করো।',
    keyPoints: 'মূল কথা', quiz: 'নিজেকে যাচাই করো', submit: 'উত্তর মিলিয়ে দেখো', score: (s, n) => `${n}টির মধ্যে ${s}টি সঠিক`, answerAll: 'আগে অন্তত একটি প্রশ্নের উত্তর দাও।', retry: 'আবার চেষ্টা',
    practice: 'অনুশীলনী', tryOwn: '✎ নিজের সমাধান লিখে চালাও', tryOwnHint: 'নমুনা ইনপুট দেওয়া আছে। চালাও চাপলে তোমার আউটপুট প্রত্যাশিত আউটপুটের সঙ্গে মিলিয়ে দেখাব।', hints: 'ইঙ্গিত', solution: 'সমাধান দেখাও', written: 'পূর্ণ উত্তর দেখাও', tests: 'নমুনা টেস্ট', input: 'ইনপুট', expected: 'প্রত্যাশিত আউটপুট',
    exam: 'পরীক্ষার ধাঁচের প্রশ্ন', showAnswer: 'উত্তর দেখাও', videos: 'ভিডিও দেখো', refs: 'আরও পড়ো', prev: 'আগের', next: 'পরের',
    results: (n, s) => `“${s}”-এর সঙ্গে ${n}টি টপিক মিলেছে`, noResults: (s) => `“${s}”-এর সঙ্গে এখনো কোনো টপিক মেলেনি। অন্য শব্দে খোঁজো, অথবা নিচের টিউটোরিয়াল দেখো।`,
    noBn: 'এই পাঠের পূর্ণ বাংলা সংস্করণ আসছে। এখন ইংরেজি লেখা দেখছ; মূল কথা আর কুইজের সাহায্য যেখানে আছে বাংলায় পাবে।',
    bnAvail: 'এই পাঠ বাংলাতেও আছে। EN · বাংলা বোতাম দিয়ে বদলাও।', course: 'ভিডিও কোর্স', notReady: 'এখনো লেখা হয়নি',
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const q = new URLSearchParams(location.search);
const trackId = q.get('track');
const topicId = q.get('topic');
const searchQ = (q.get('q') ?? '').trim();
const href = (track, topic) => `/learn.html?track=${encodeURIComponent(track)}${topic ? `&topic=${encodeURIComponent(topic)}` : ''}`;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);

async function copyText(s) { try { await navigator.clipboard.writeText(s); return true; } catch { return false; } }

// ── overview ──
async function renderOverview() {
  const L = t();
  const d = await api('GET', `/api/learn?lang=${getLang()}`);
  document.title = `${L.title} · Loop & Logic`;
  main.replaceChildren(
    el('div', { class: 'page-head' }, el('h1', { text: L.title }), el('p', { text: L.sub(num(d.totals.topics), num(d.totals.labs)) })),
    el('div', { class: 'tut-grid' }, ...d.tracks.map((tr) => {
      const card = el(tr.available ? 'a' : 'div', { class: `tut-card${tr.available ? '' : ' off'}`, href: tr.available ? href(tr.id) : null },
        el('div', { class: 'tut-card-top' }, el('span', { class: `tut-ico i-${tr.id}`, 'aria-hidden': 'true', text: icon(tr.id) }), tr.labs ? el('span', { class: 'tag live', text: `${num(tr.labs)} ${L.labs}` }) : null),
        el('h3', { text: tr.title }), el('p', { text: tr.blurb }),
        el('div', { class: 'tut-prog' }, el('div', { style: `width:${pct(tr.delivered, tr.planned)}%` })),
        el('div', { class: 'meta' }, el('span', { text: tr.available ? `${num(tr.delivered)} ${L.of} ${num(tr.planned)} ${L.topics}` : L.soon }), tr.available ? el('span', { class: 'go', text: `${L.open} →` }) : null));
      return card;
    })));
}
function icon(id) { return { c: 'C', 'data-structures': 'DS', algorithms: 'ALG', 'oop-java': 'OOP', python: 'PY', dbms: 'DB', 'compiler-design': 'CD', 'machine-learning': 'ML' }[id] ?? '•'; }

// ── search ──
async function renderSearch() {
  const L = t();
  const r = await api('GET', `/api/learn-search?q=${encodeURIComponent(searchQ)}&lang=${getLang()}`);
  document.title = `${searchQ} · ${L.title}`;
  const box = el('section', { class: 'tut-search' },
    el('h2', { text: r.results.length ? L.results(num(r.results.length), searchQ) : L.noResults(searchQ) }),
    r.results.length ? el('ol', { class: 'tut-results' }, ...r.results.map((x) => el('li', {},
      el('a', { href: href(x.track, x.topic) }, el('strong', { text: x.title }), el('span', { class: 'muted small', text: ` · ${x.trackTitle}` })),
      el('p', { class: 'small muted', text: x.summary })))) : null);
  await renderOverview();
  main.querySelector('.page-head')?.after(box);
  const input = document.querySelector('.top-search input');
  if (input) input.value = searchQ;
}

// ── one track ──
async function renderTrack() {
  const L = t();
  const d = await api('GET', `/api/learn/${encodeURIComponent(trackId)}?lang=${getLang()}`);
  document.title = `${d.title} · ${L.title}`;
  const first = d.modules.flatMap((m) => m.topics).find((x) => x.available);
  main.replaceChildren(
    el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, el('a', { href: '/learn.html', text: L.all }), ' / ', el('span', { text: d.title })),
    el('div', { class: 'tut-hero' },
      el('div', {}, el('h1', { text: d.title }), el('p', { text: d.blurb }),
        el('p', { class: 'small muted', text: `${num(d.delivered)} ${L.topics} · ${d.language?.toUpperCase() ?? ''}${d.version ? ` · v${d.version}` : ''}` })),
      el('div', { class: 'tut-hero-act' }, first ? el('a', { class: 'btn primary', href: href(d.id, first.id), text: `${L.start} →` }) : null,
        d.course ? el('a', { class: 'btn ghost', href: `/course.html?id=${d.course}`, text: `▶ ${L.course}` }) : null)),
    el('div', { class: 'tut-modules' }, ...d.modules.map((m, mi) => {
      const ready = m.topics.filter((x) => x.available).length;
      return el('section', { class: 'tut-module' },
        el('div', { class: 'tut-module-head' }, el('span', { class: 'tut-num', text: mi + 1 }), el('div', {}, el('h2', { text: m.title }), el('p', { class: 'muted small', text: m.summary })),
          el('span', { class: `tag ${ready === m.topics.length ? 'live' : ''}`, text: ready ? `${num(ready)}/${num(m.topics.length)}` : L.inProgress })),
        el('ol', { class: 'tut-topics' }, ...m.topics.map((x) => el('li', { class: x.available ? '' : 'off' },
          x.available ? el('a', { href: href(d.id, x.id), text: x.title }) : el('span', { text: x.title }),
          el('span', { class: 'tut-badges' },
            x.kind !== 'lesson' ? el('span', { class: 'tb', text: L.kinds[x.kind] ?? x.kind }) : null,
            x.labs ? el('span', { class: 'tb lab', text: `◆ ${L.lab}` }) : null,
            el('span', { class: `tb lv-${x.level}`, text: L.levels[x.level] ?? x.level }),
            x.available ? null : el('span', { class: 'tb soon', text: L.soon }))))));
    })));
}

// ── one topic ──
async function renderTopic() {
  const L = t();
  const [d, tr, rs] = await Promise.all([
    api('GET', `/api/learn/${encodeURIComponent(trackId)}/${encodeURIComponent(topicId)}?lang=${getLang()}`),
    api('GET', `/api/learn/${encodeURIComponent(trackId)}?lang=${getLang()}`),
    runnerStatus(),
  ]);
  RUN = rs;
  document.title = `${d.topic.title} · ${d.track.title}`;
  const body = el('article', { class: `tut-body lang-${d.topic.bodyLang}`, lang: d.topic.bodyLang });
  body.innerHTML = d.topic.bodyHtml; // sanitised on the server (tag and attribute whitelist)
  wireBody(body, d);

  const quiz = d.quiz.length ? quizBlock(d) : null;
  const practice = d.practice.length ? practiceBlock(d) : null;
  const exam = d.examQuestions.length ? el('section', { class: 'tut-extra', id: 'exam' }, el('h2', { text: L.exam }),
    ...d.examQuestions.map((x, i) => el('div', { class: 'exam-q' }, el('p', {}, el('strong', { text: `${i + 1}. ` }), x.question, x.marks ? el('span', { class: 'muted small', text: ` (${x.marks})` }) : null),
      x.figure ? renderFigure(x.figure) : null,
      el('details', {}, el('summary', { text: L.showAnswer }), htmlBox(x.answerHtml))))) : null;

  const lang = getLang();
  const langNote = lang === 'bn' && !d.topic.hasBangla ? el('div', { class: 'callout note small' }, el('p', { text: L.noBn }))
    : lang === 'en' && d.topic.hasBangla ? el('div', { class: 'callout tip small' }, el('p', { text: L.bnAvail })) : null;

  const avail = tr.modules.flatMap((m) => m.topics).filter((x) => x.available).length;
  const total = tr.modules.reduce((n, m) => n + m.topics.length, 0);
  const side = el('aside', { class: 'tut-side' }, el('h4', { text: tr.title }),
    el('p', { class: 'small muted', style: 'margin:0', text: L.ready(num(avail), num(total)) }),
    el('div', { class: 'tut-prog', style: 'margin:6px 0 10px' }, el('div', { style: `width:${pct(avail, total)}%` })),
    ...tr.modules.map((m) => {
      const open = m.id === d.module.id;
      return el('details', { open: open || null }, el('summary', { text: m.title }),
        el('ol', {}, ...m.topics.map((x) => el('li', { class: `${x.id === d.topic.id ? 'on' : ''}${x.available ? '' : ' off'}` },
          x.available ? el('a', { href: href(d.track.id, x.id), text: x.title }) : el('span', { text: x.title })))));
    }));
  const heads = [...body.querySelectorAll('h2[id]')];
  const toc = heads.length ? el('nav', { class: 'tut-toc', 'aria-label': L.onPage }, el('strong', { text: L.onPage }),
    ...heads.map((h) => el('a', { href: `#${h.id}`, text: h.textContent })),
    quiz ? el('a', { href: '#quiz', text: L.quiz }) : null, practice ? el('a', { href: '#practice', text: L.practice }) : null, exam ? el('a', { href: '#exam', text: L.exam }) : null) : null;

  const meta = el('div', { class: 'tut-meta' },
    el('span', { class: 'tb free', text: L.freeTag }),
    el('span', { class: `tb lv-${d.topic.level}`, text: L.levels[d.topic.level] ?? d.topic.level }),
    el('span', { class: 'tb', text: L.kinds[d.topic.kind] ?? d.topic.kind }),
    d.topic.minutes ? el('span', { class: 'tb', text: L.min(d.topic.minutes) }) : null,
    d.labs.length ? el('span', { class: 'tb lab', text: `◆ ${d.labs.length} ${L.lab}` }) : null,
    d.topic.standards?.minimum ? el('span', { class: 'tb', text: String(d.topic.standards.minimum).toUpperCase() }) : null);

  const keyPts = d.keyPoints.length ? el('section', { class: 'tut-extra key' }, el('h2', { text: L.keyPoints }), el('ul', {}, ...d.keyPoints.map((k) => el('li', { text: k })))) : null;
  const videos = d.videos.length ? el('section', { class: 'tut-extra' }, el('h2', { text: L.videos }), el('ul', { class: 'tut-links' }, ...d.videos.map((v) => el('li', {}, el('a', { href: tr.course ? `/watch.html?course=${tr.course}&v=${v.videoId}` : `https://www.youtube.com/watch?v=${v.videoId}`, text: `▶ ${v.title}` }))))) : null;
  const refs = d.references.length ? el('section', { class: 'tut-extra' }, el('h2', { text: L.refs }), el('ul', { class: 'tut-links' }, ...d.references.map((r) => el('li', {}, el('a', { href: r.url, target: '_blank', rel: 'noopener', text: r.title }))))) : null;
  const pager = el('nav', { class: 'tut-pager' },
    d.prev ? el('a', { class: 'btn ghost', href: href(d.track.id, d.prev.id) }, `← ${d.prev.title}`) : el('span'),
    d.next ? el('a', { class: 'btn primary', href: href(d.track.id, d.next.id) }, `${d.next.title} →`) : el('span'));

  main.replaceChildren(
    el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, el('a', { href: '/learn.html', text: L.all }), ' / ', el('a', { href: href(d.track.id), text: d.track.title }), ' / ', el('span', { text: d.module.title })),
    el('div', { class: 'tut-layout' }, side,
      el('div', { class: 'tut-main' },
        el('header', { class: 'tut-title' },
          el('div', { class: 'tut-title-top' }, meta, el('div', { class: 'tut-mini-pager' },
            d.prev ? el('a', { class: 'btn ghost small', href: href(d.track.id, d.prev.id), title: d.prev.title, text: `← ${L.prev}` }) : null,
            d.next ? el('a', { class: 'btn primary small', href: href(d.track.id, d.next.id), title: d.next.title, text: `${L.next} →` }) : null)),
          el('h1', { text: d.topic.title }), el('p', { class: 'lead', text: d.topic.summary })),
        savedEditor(`tutorial:${d.track.id}:${d.topic.id}`, L), langNote, toc, el('div', { id: 'ad-side', class: 'ad-slot' }), body, el('div', { id: 'ad-inline', class: 'ad-slot' }), keyPts, quiz, practice, exam, videos, refs, pager)));
  fillAdSlots();
  api('POST', '/api/learn-activity', { kind: 'view', track: d.track.id, topic: d.topic.id }).catch(() => {});
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

function htmlBox(html) { const div = el('div', { class: 'tut-html' }); div.innerHTML = html; return div; }

function wireBody(body, d) {
  const L = t();
  for (const a of body.querySelectorAll('a[href^="topic:"]')) {
    const [id, frag] = a.getAttribute('href').slice(6).split('#');
    const info = d.links[id];
    if (info?.available) a.setAttribute('href', href(info.track, id) + (frag ? `#${frag}` : ''));
    else { const span = el('span', { class: 'dead-link', title: L.notReady, text: a.textContent }); a.replaceWith(span); }
  }
  for (const a of body.querySelectorAll('a[href^="https://"]')) { a.target = '_blank'; a.rel = 'noopener'; }
  for (const img of body.querySelectorAll('img[src^="assets/"]')) { img.src = `/learn-assets/${d.track.id}/${d.topic.id}/${img.getAttribute('src').slice(7)}`; img.loading = 'lazy'; }
  for (const slot of body.querySelectorAll('div[data-example]')) {
    const ex = d.examples.find((e) => e.id === slot.dataset.example);
    if (ex) slot.replaceWith(exampleBlock(ex, d)); else slot.remove();
  }
  for (const slot of body.querySelectorAll('div[data-lab]')) {
    const host = el('div', { class: 'lp-host', id: `lab-${slot.dataset.lab}` });
    slot.replaceWith(host);
    mountLab(host, { track: d.track.id, topic: d.topic.id, labId: slot.dataset.lab });
  }
}

function codeBox(code, language, tryNowUrl) {
  const L = t();
  const copyBtn = el('button', { type: 'button', class: 'chip small', text: L.copy, onclick: async () => { if (await copyText(code)) { copyBtn.textContent = L.copied; setTimeout(() => (copyBtn.textContent = L.copy), 1500); } } });
  const tryBtn = tryNowUrl ? el('a', { class: 'chip small try', href: tryNowUrl, target: '_blank', rel: 'noopener', text: `▶ ${L.tryNow}`, onclick: async () => { if (await copyText(code)) toast(L.tryNowTip); } }) : null;
  return el('div', { class: 'tut-code' }, el('div', { class: 'tut-code-bar' }, el('span', { text: language.toUpperCase() }), el('span', {}, copyBtn, tryBtn)), el('pre', {}, el('code', { class: `language-${language}`, text: code })));
}

const canRun = (language, runnable) => RUN.enabled && runnable && RUN.languages.includes(language);

function exampleBlock(ex, d) {
  const L = t();
  const runner = canRun(ex.language, ex.runnable);
  const staticOut = ex.output !== null ? el('div', { class: 'tut-out' }, el('span', { class: 'small muted', text: L.output }), el('pre', { text: ex.output })) : ex.outputNote ? el('p', { class: 'small muted', text: ex.outputNote }) : null;
  return el('figure', { class: 'tut-example', id: ex.id },
    el('figcaption', {}, el('span', { class: 'pill', text: `${L.example} ${ex.id.replace('ex-', '')}` }), ' ', ex.title),
    runner ? codeRunner({
      code: ex.code, language: ex.language, stdin: ex.stdin, ref: { track: d.track.id, topic: d.topic.id, example: ex.id }, tryNowUrl: ex.tryNowUrl,
      // the run shows its own output, so the printed one steps aside until Reset
      onRun: () => { if (staticOut) staticOut.hidden = true; }, onReset: () => { if (staticOut) staticOut.hidden = false; },
    }) : codeBox(ex.code, ex.language, ex.tryNowUrl),
    !runner && ex.stdin ? el('div', { class: 'tut-out' }, el('span', { class: 'small muted', text: L.input }), el('pre', { class: 'tut-in', text: ex.stdin })) : null,
    staticOut,
    ex.explanationHtml ? htmlBox(ex.explanationHtml) : null);
}

const STARTER = {
  c: '#include <stdio.h>\n\nint main(void) {\n    // write your solution here\n\n    return 0;\n}\n',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // write your solution here\n\n    return 0;\n}\n',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        // write your solution here\n\n    }\n}\n',
  python: '# write your solution here\n',
};

function quizBlock(d) {
  const L = t();
  const chosen = {};
  const items = d.quiz.map((x, i) => {
    const opts = x.options.map((o, k) => el('label', { class: 'opt' }, el('input', { type: 'radio', name: x.id, value: k, onchange: () => { chosen[x.id] = k; } }), el('span', { text: o })));
    return el('div', { class: 'quiz-item', id: `quiz-${x.id}` },
      el('p', { class: 'qp' }, el('strong', { text: `${i + 1}. ` }), x.prompt),
      x.figure ? renderFigure(x.figure) : null,
      x.code ? el('pre', { class: 'qcode' }, el('code', { text: x.code })) : null,
      el('div', { class: 'opts' }, ...opts), el('div', { class: 'qfb' }));
  });
  const result = el('p', { class: 'quiz-score', 'aria-live': 'polite' });
  const btn = el('button', { type: 'button', class: 'btn primary', text: L.submit });
  btn.onclick = async () => {
    if (!Object.keys(chosen).length) { result.textContent = L.answerAll; return; }
    btn.disabled = true;
    try {
      const r = await api('POST', `/api/learn/${d.track.id}/${d.topic.id}/quiz`, { answers: chosen, lang: getLang() });
      result.textContent = L.score(r.score, r.answered);
      for (const [qid, res] of Object.entries(r.results)) {
        const box = document.getElementById(`quiz-${qid}`);
        box.classList.toggle('ok', res.correct); box.classList.toggle('bad', !res.correct);
        box.querySelectorAll('.opt').forEach((lab, k) => { lab.classList.toggle('right', k === res.answer); lab.classList.toggle('wrong', k === res.chosen && !res.correct); });
        box.querySelector('.qfb').replaceChildren(el('p', { text: `${res.correct ? '✓' : '✗'} ${res.explanation}` }));
      }
    } catch (e) { result.textContent = e.message; }
    btn.disabled = false;
  };
  return el('section', { class: 'tut-extra', id: 'quiz' }, el('h2', { text: L.quiz }), ...items, el('div', { class: 'quiz-actions' }, btn, result));
}

function practiceBlock(d) {
  const L = t();
  return el('section', { class: 'tut-extra', id: 'practice' }, el('h2', { text: L.practice }),
    ...d.practice.map((p, i) => {
      const out = el('div', { class: 'sol' });
      const btn = el('button', { type: 'button', class: 'btn ghost small', text: p.type === 'written' ? L.written : L.solution });
      btn.onclick = async () => {
        btn.disabled = true;
        try {
          const s = await api('GET', `/api/learn/${d.track.id}/${d.topic.id}/practice/${p.id}?lang=${getLang()}`);
          out.replaceChildren(s.type === 'written' ? htmlBox(s.answerHtml) : el('div', {}, codeBox(s.code, s.language, s.tryNowUrl),
            ...s.tests.slice(0, 1).map((tc) => el('div', { class: 'tc' }, el('strong', { class: 'small', text: L.tests }),
              tc.stdin ? el('div', {}, el('span', { class: 'small muted', text: L.input }), el('pre', { text: tc.stdin })) : null,
              el('div', {}, el('span', { class: 'small muted', text: L.expected }), el('pre', { text: tc.output }))))));
          btn.remove();
        } catch (e) { out.textContent = e.message; btn.disabled = false; }
      };
      const tryIt = p.type === 'code' && p.sample && canRun(p.language, p.runnable)
        ? el('details', { class: 'prac-try' }, el('summary', { text: L.tryOwn }),
          el('p', { class: 'small muted', text: L.tryOwnHint }),
          codeRunner({ code: STARTER[p.language] ?? '', language: p.language, stdin: p.sample.stdin, expected: p.sample.output }))
        : null;
      return el('div', { class: 'prac' },
        el('h3', {}, el('span', { class: `tb d-${p.difficulty}`, text: p.difficulty }), ` ${i + 1}. ${p.title}`),
        htmlBox(p.statementHtml), p.figure ? renderFigure(p.figure) : null,
        p.hints.length ? el('details', {}, el('summary', { text: L.hints }), el('ol', {}, ...p.hints.map((h) => el('li', { text: h })))) : null,
        tryIt, btn, out);
    }));
}

async function render() {
  applyI18n(t());
  try {
    if (trackId && topicId) await renderTopic();
    else if (trackId) await renderTrack();
    else if (searchQ) await renderSearch();
    else await renderOverview();
  } catch (e) { errorBox(main, e.message, render); }
}
mountNav('learn', render);
render();
