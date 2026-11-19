import { studyPlanStrings, studyPlan } from './study-plan.js';
import { masteryStrings, masteryDashboard } from './mastery.js';
// Learner dashboard: continue reading, progress, practice, focus areas, receipts.
import { api, getLang, applyI18n, mountNav, el, num, ago, errorBox, ensureSignedIn, currentUser, showSignIn, toast } from './common.js';
import { savedStrings, savedList } from './saved.js';

const T = {
  en: {
    ...savedStrings.en,
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    hello: 'Your learning', helloSub: 'Pick up where you left off. Everything here comes from what you did on Loop & Logic.',
    welcome: 'Welcome to Loop & Logic', welcomeSub: 'Start with a five-minute lesson. Select any line you don’t understand — you’ll get a short answer with its source.',
    tryMl: 'Machine-learning lesson', tryBiz: 'Accounting lesson', browse: 'Browse all courses',
    continue: 'Continue reading', contWatch: 'Continue watching', watchedN: (a, b) => `${a} of ${b} videos watched`, play: 'Play next', read: (p) => `${p}% read`, resume: 'Continue', last: 'last read',
    sLessons: 'Lessons started', sQuiz: 'Quizzes correct', sHelp: 'Labs completed', labDone: 'Lab done', labBtn: 'Lab', more: (n) => `${n} more lessons in Courses`, sPractice: 'Practice tasks',
    ...studyPlanStrings.en,
    lessons: 'Your lessons', notStarted: 'Not started', start: 'Start', open: 'Open',
    practice: 'Practice and sealed check', noPractice: 'You haven’t practised yet.', noPracticeSub: 'Judge an AI coworker’s pricing advice, then prove it on a fresh task with no help.', practiceCta: 'Start practice',
    phase: { practice: 'Practising', assessment: 'Sealed check open', complete: 'Completed' },
    customQuiz: 'Custom quiz',
    attempts: (a, c, i) => `${a} attempts · ${c} correct · ${i} without help`, ready: 'Ready for the sealed check', keepGoing: 'Get two right without help to unlock the sealed check.', go: 'Go to practice',
    mistakes: 'Mistakes you make most', focus: 'Worth another look', focusNone: 'Nothing flagged. When a paragraph takes you a long time and you ask about it, it shows up here.', reread: 'Re-read',
    receipts: 'Evidence receipts', shown: 'Shown alone', notYet: 'Not yet shown', withHelp: 'With help', noReceipts: 'Finish a sealed check to get your first receipt.',
    ...masteryStrings.en,
  },
  bn: {
    ...savedStrings.bn,
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    hello: 'তোমার শেখা', helloSub: 'যেখানে থেমেছিলে সেখান থেকে শুরু করো। এখানের সবকিছু লুপ অ্যান্ড লজিকে তোমার কাজ থেকে।',
    welcome: 'লুপ অ্যান্ড লজিকে স্বাগতম', welcomeSub: 'পাঁচ মিনিটের একটা পাঠ দিয়ে শুরু করো। যে লাইন বোঝোনি তা সিলেক্ট করো — উৎসসহ ছোট উত্তর পাবে।',
    tryMl: 'মেশিন লার্নিং পাঠ', tryBiz: 'অ্যাকাউন্টিং পাঠ', browse: 'সব কোর্স দেখো',
    continue: 'পড়া চালিয়ে যাও', contWatch: 'দেখা চালিয়ে যাও', watchedN: (a, b) => `${b}টির মধ্যে ${a}টি ভিডিও দেখা হয়েছে`, play: 'পরেরটি চালাও', read: (p) => `${p}% পড়া হয়েছে`, resume: 'চালিয়ে যাও', last: 'শেষ পড়া',
    sLessons: 'শুরু করা পাঠ', sQuiz: 'ঠিক কুইজ', sHelp: 'সম্পন্ন ল্যাব', labDone: 'ল্যাব সম্পন্ন', labBtn: 'ল্যাব', more: (n) => `কোর্সে আরও ${n}টি পাঠ আছে`, sPractice: 'অনুশীলনী প্রশ্ন',
    ...studyPlanStrings.bn,
    lessons: 'তোমার পাঠ', notStarted: 'শুরু হয়নি', start: 'শুরু করো', open: 'খোলো',
    practice: 'অনুশীলন ও বন্ধ যাচাই', noPractice: 'এখনো অনুশীলন করোনি।', noPracticeSub: 'এআই সহকর্মীর দামের পরামর্শ যাচাই করো, তারপর সাহায্য ছাড়া নতুন প্রশ্নে প্রমাণ দাও।', practiceCta: 'অনুশীলন শুরু করো',
    phase: { practice: 'অনুশীলন চলছে', assessment: 'বন্ধ যাচাই খোলা', complete: 'সম্পন্ন' },
    customQuiz: 'নিজের তৈরি কুইজ',
    attempts: (a, c, i) => `${a}টি চেষ্টা · ${c}টি ঠিক · ${i}টি সাহায্য ছাড়া`, ready: 'বন্ধ যাচাইয়ের জন্য প্রস্তুত', keepGoing: 'সাহায্য ছাড়া দুটি ঠিক করলে বন্ধ যাচাই খুলবে।', go: 'অনুশীলনে যাও',
    mistakes: 'সবচেয়ে বেশি যে ভুল হয়', focus: 'আরেকবার দেখা ভালো', focusNone: 'কিছু চিহ্নিত হয়নি। কোনো অনুচ্ছেদে অনেক সময় লাগলে আর সেটা নিয়ে প্রশ্ন করলে এখানে দেখাবে।', reread: 'আবার পড়ো',
    receipts: 'প্রমাণপত্র', shown: 'একা দেখিয়েছ', notYet: 'এখনো দেখানো হয়নি', withHelp: 'সাহায্য নিয়ে', noReceipts: 'বন্ধ যাচাই শেষ করলে প্রথম প্রমাণপত্র পাবে।',
    ...masteryStrings.bn,
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const stat = (label, value) => el('div', { class: 'stat' }, el('span', { text: label }), el('b', { text: value }));

function welcome(L) {
  return el('div', { class: 'card empty' },
    el('h2', { text: L.welcome }), el('p', { text: L.welcomeSub }),
    el('div', { class: 'row', style: 'justify-content:center' },
      el('a', { class: 'btn primary', href: '/lesson.html?id=classification-threshold', text: L.tryMl }),
      el('a', { class: 'btn secondary', href: '/lesson.html?id=margin-basics', text: L.tryBiz }),
      el('a', { class: 'btn ghost', href: '/courses.html', text: L.browse })));
}

function render(d) {
  const L = t();
  applyI18n(L);
  document.title = `${L.hello} · Loop & Logic`;
  const nodes = [el('div', { class: 'page-head' }, el('h1', { text: L.hello }), el('p', { text: L.helloSub })), purchasesBox(), classesBox(), savedList(L)];

  if (d.isNew) nodes.push(welcome(L));
  nodes.push(masteryDashboard(L));

  if (d.continueReading) {
    const c = d.continueReading;
    nodes.push(el('section', { class: 'continue', 'aria-label': L.continue },
      el('div', {},
        el('p', { class: 'kicker', style: 'color:#d9e8a6', text: [L.continue, c.courseTitle].filter(Boolean).join(' · ') }),
        el('h2', { text: c.title }),
        el('p', { text: `${L.read(num(c.percent))}${c.lastAt ? ` · ${L.last} ${ago(c.lastAt)}` : ''}` }),
        el('div', { class: 'progress' }, el('i', { style: `width:${c.percent}%` }))),
      el('a', { class: 'btn primary', href: `/lesson.html?id=${encodeURIComponent(c.lessonId)}`, text: L.resume })));
  }

  if (d.continueWatching) {
    const w = d.continueWatching;
    const pct = Math.round((w.watched / w.total) * 100);
    nodes.push(el('section', { class: 'continue', 'aria-label': L.contWatch },
      el('div', {},
        el('p', { class: 'kicker', style: 'color:#d9e8a6', text: `${L.contWatch} · ${w.courseTitle}` }),
        el('h2', { text: w.title }),
        el('p', { text: `${L.watchedN(num(w.watched), num(w.total))} · ${w.duration}` }),
        el('div', { class: 'progress' }, el('i', { style: `width:${pct}%` }))),
      el('a', { class: 'btn primary', href: `/watch.html?course=${encodeURIComponent(w.courseId)}&v=${encodeURIComponent(w.videoId)}`, text: `▶ ${L.play}` })));
  }

  if (!d.isNew) {
    nodes.push(el('div', { class: 'stat-row' },
      stat(L.sLessons, `${num(d.stats.lessonsStarted)} / ${num(d.lessons.length)}`),
      stat(L.sQuiz, `${num(d.stats.quizzesCorrect)} / ${num(d.stats.quizzesTotal)}`),
      stat(L.sHelp, `${num(d.stats.labsDone)} / ${num(d.stats.labsTotal)}`),
      stat(L.sPractice, num(d.practice.totals.attempts))));
  }

  // left column: lessons + practice
  const lessons = el('section', { class: 'card' }, el('div', { class: 'card-head' }, el('h2', { text: L.lessons })));
  const startedLessons = d.lessons.filter((l) => l.started);
  const fresh = d.lessons.filter((l) => !l.started);
  const shown = [...startedLessons, ...fresh.slice(0, Math.max(0, 4 - startedLessons.length))];
  for (const l of shown) {
    lessons.append(el('div', { class: 'lesson-row' },
      el('div', {},
        el('h3', { text: l.title }),
        el('p', { text: l.courseTitle ?? '' }),
        l.started ? el('div', { class: 'progress' }, el('i', { style: `width:${l.percent}%` })) : el('p', { class: 'small', text: L.notStarted }),
        l.labDone ? el('div', { class: 'mini-tags' }, el('span', { class: 'tag live', text: `✓ ${L.labDone}` })) : null),
      el('div', { class: 'lesson-actions' },
        el('a', { class: `btn ${l.started ? 'secondary' : 'primary'} small`, href: `/lesson.html?id=${encodeURIComponent(l.id)}`, text: l.started ? L.open : L.start }),
        l.hasLab && l.started ? el('a', { class: 'btn ghost small', href: `/lab.html?id=${encodeURIComponent(l.id)}`, text: L.labBtn }) : null)));
  }
  if (d.lessons.length > shown.length) lessons.append(el('p', { style: 'margin:12px 0 0' }, el('a', { href: '/courses.html', text: L.more(num(d.lessons.length - shown.length)) })));

  const p = d.practice;
  const practice = el('section', { class: 'card' }, el('div', { class: 'card-head' }, el('h2', { text: L.practice })));
  if (!p.latest) {
    practice.append(el('p', { text: L.noPractice }), el('p', { class: 'muted small', text: L.noPracticeSub }), el('a', { class: 'btn primary', href: '/practice.html', text: L.practiceCta }));
  } else {
    const s = p.latest;
    const pct = s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0;
    practice.append(el('div', { class: 'practice-state' },
      el('div', { class: 'ring', style: `--p:${pct}`, 'aria-label': `${pct}%` }, el('b', { text: `${num(pct)}%` })),
      el('div', {},
        el('span', { class: `tag ${s.phase === 'complete' ? 'live' : ''}`, text: L.phase[s.phase] }),
        el('p', { style: 'margin:6px 0 0', text: L.attempts(num(s.attempts), num(s.correct), num(s.independent)) }),
        s.phase === 'practice' ? el('p', { class: 'muted small', style: 'margin:4px 0 0', text: s.readyForTransfer ? L.ready : L.keepGoing }) : null)),
      el('div', { class: 'row' }, el('a', { class: 'btn secondary', href: '/practice.html', text: L.go })));
    if (p.commonMistakes.length) {
      practice.append(el('h3', { class: 'small muted', style: 'margin:16px 0 8px;text-transform:uppercase;letter-spacing:.06em', text: L.mistakes }),
        el('ul', { class: 'mistake-list' }, ...p.commonMistakes.map((m) => el('li', {}, el('span', { text: m.name }), el('b', { text: `×${num(m.count)}` })))));
    }
  }

  // right column: focus + receipts
  const focus = el('section', { class: 'card' }, el('div', { class: 'card-head' }, el('h2', { text: L.focus })));
  if (!d.focus.length) focus.append(el('p', { class: 'muted small', text: L.focusNone }));
  else focus.append(el('ul', { class: 'focus-list' }, ...d.focus.map((f) => el('li', {}, el('span', { text: f.name }),
    f.lessonId ? el('a', { class: 'btn ghost small', href: `/lesson.html?id=${encodeURIComponent(f.lessonId)}`, text: L.reread }) : null))));

  const receipts = el('section', { class: 'card' }, el('div', { class: 'card-head' }, el('h2', { text: L.receipts })));
  if (!p.receipts.length) receipts.append(el('p', { class: 'muted small', text: L.noReceipts }));
  for (const r of p.receipts) {
    receipts.append(el('div', { class: 'receipt-mini' },
      el('span', { class: 'muted small', text: ago(r.at) }),
      ...r.shown.map((x) => el('span', {}, el('span', { class: 'ok', text: '✓ ' }), x)),
      ...r.notYet.map((x) => el('span', {}, el('span', { class: 'no', text: '○ ' }), x)),
      ...r.withHelp.map((x) => el('span', { class: 'muted small', text: `${L.withHelp}: ${x}` }))));
  }

  nodes.push(el('div', { class: 'dash-grid' },
    el('div', { style: 'display:grid;gap:20px' }, lessons, practice),
    el('div', { style: 'display:grid;gap:20px' }, focus, receipts)));
  nodes.splice(1, 0, studyPlan(L));
  main.replaceChildren(...nodes);
}

// ── My classes: join with the code from your instructor; see posts and assignments ──
const C = {
  en: { h: 'My classes', join: 'Join a class', code: 'Class code from your instructor', go: 'Join', signIn: 'Sign in to join your class', note: 'When you join, your instructor sees your progress in their class: topics opened, quiz scores and labs run. Your questions to the AI stay private.', pending: 'Waiting for your instructor to accept you', due: 'due', noDue: 'no due date', done: 'Done', todo: 'To do', read: 'Read', quiz: 'Pass the quiz', lab: 'Run the lab', leave: 'Leave class', left: 'You left the class.', joined: 'You joined', waiting: 'Request sent to', none: 'No assignments yet.', by: 'Instructor' },
  bn: { h: 'আমার ক্লাস', join: 'ক্লাসে যোগ দাও', code: 'শিক্ষকের দেওয়া ক্লাস কোড', go: 'যোগ দাও', signIn: 'ক্লাসে যোগ দিতে সাইন ইন করো', note: 'যোগ দিলে তোমার শিক্ষক তাঁর ক্লাসে তোমার অগ্রগতি দেখবেন: কোন টপিক খুলেছ, কুইজের নম্বর আর কোন ল্যাব চালিয়েছ। এআই-কে করা প্রশ্ন গোপন থাকবে।', pending: 'শিক্ষকের অনুমোদনের অপেক্ষায়', due: 'জমার শেষ দিন', noDue: 'শেষ দিন নেই', done: 'সম্পন্ন', todo: 'বাকি', read: 'পড়ো', quiz: 'কুইজে পাস করো', lab: 'ল্যাব চালাও', leave: 'ক্লাস ছাড়ো', left: 'তুমি ক্লাস ছেড়েছ।', joined: 'যোগ দিয়েছ', waiting: 'অনুরোধ পাঠানো হয়েছে', none: 'এখনো কোনো অ্যাসাইনমেন্ট নেই।', by: 'শিক্ষক' },
};
function classesBox() {
  const L = C[getLang()];
  const box = el('section', { class: 'card my-classes', 'aria-labelledby': 'mc-h' }, el('h2', { id: 'mc-h', text: L.h }), el('div', { class: 'skeleton' }));
  const fill = async () => {
    if (!currentUser()) {
      box.replaceChildren(el('h2', { id: 'mc-h', text: L.h }), el('p', { class: 'muted small', text: L.note }), el('button', { type: 'button', class: 'btn secondary', text: L.signIn, onclick: () => showSignIn() }));
      return;
    }
    const { classes } = await api('GET', '/api/my-classes').catch(() => ({ classes: [] }));
    const input = el('input', { type: 'text', id: 'mc-code', placeholder: 'ABCD-EFGH', autocomplete: 'off', style: 'text-transform:uppercase' });
    const joinBtn = el('button', { type: 'submit', class: 'btn primary', text: L.go });
    const form = el('form', { class: 'mc-join' }, el('label', { for: 'mc-code', text: L.code }), el('div', { class: 'row' }, input, joinBtn));
    form.onsubmit = async (e) => {
      e.preventDefault(); joinBtn.disabled = true;
      try { const r = await api('POST', '/api/classes/join', { code: input.value }); toast(`${r.status === 'pending' ? L.waiting : L.joined}: ${r.name}`); fill(); } catch (err) { toast(err.message); } finally { joinBtn.disabled = false; }
    };
    const kind = { read: L.read, quiz: L.quiz, lab: L.lab, custom_quiz: T[getLang()].customQuiz };
    box.replaceChildren(el('h2', { id: 'mc-h', text: L.h }),
      ...classes.map((c) => el('div', { class: 'mc-class' },
        el('div', { class: 'mc-head' }, el('strong', { text: c.name }), el('span', { class: 'muted small', text: `${L.by}: ${c.instructor}` })),
        c.status === 'pending' ? el('p', { class: 'tag', text: L.pending }) : null,
        ...c.posts.slice(0, 2).map((p) => el('div', { class: 'mc-post' }, el('strong', { text: `${p.pinned ? '📌 ' : ''}${p.title}` }), el('p', { text: p.body }), el('span', { class: 'muted small', text: ago(p.at) }))),
        c.status === 'active' ? (c.assignments.length ? el('div', { class: 'mc-assign' }, ...c.assignments.map((a) => {
          const done = a.items.filter((i) => i.done).length;
          return el('details', { open: done < a.items.length || null },
            el('summary', {}, el('span', { text: a.title }), el('span', { class: `tag ${done === a.items.length ? 'live' : ''}`, text: `${num(done)}/${num(a.items.length)} · ${a.due ? `${L.due} ${new Date(a.due).toLocaleDateString(getLang() === 'bn' ? 'bn-BD' : 'en-GB')}` : L.noDue}` })),
            el('ul', {}, ...a.items.map((i) => el('li', {}, el('span', { class: i.done ? 'ok' : 'todo', text: i.done ? '✓' : '○' }), ' ', `${kind[i.kind]}: `,
              el('a', { href: i.kind === 'custom_quiz' ? `/custom-quiz.html?id=${encodeURIComponent(i.quizId)}` : `/learn.html?track=${encodeURIComponent(i.track)}&topic=${encodeURIComponent(i.topic)}${i.lab ? `#lab-${i.lab}` : ''}`, text: i.title })))));
        })) : el('p', { class: 'muted small', text: L.none })) : null,
        el('button', { type: 'button', class: 'linkish small', text: L.leave, onclick: async () => { if (!confirm(`${L.leave}: ${c.name}?`)) return; await api('POST', `/api/classes/${c.id}/leave`); toast(L.left); fill(); } }))),
      el('details', { class: 'mc-joinbox', open: !classes.length || null }, el('summary', { text: L.join }), el('p', { class: 'muted small', text: L.note }), form));
  };
  fill().catch(() => {});
  return box;
}

/** Payments for paid courses, while any is waiting or recently decided. */
function purchasesBox() {
  const bn = getLang() === 'bn';
  const box = el('div');
  if (!currentUser()) return box;
  api('GET', '/api/my-orders').then(({ orders }) => {
    if (!orders.length) return;
    const st = { pending: bn ? 'যাচাই চলছে' : 'Being checked', approved: bn ? 'অনুমোদিত' : 'Approved', rejected: bn ? 'গ্রহণ করা হয়নি' : 'Not accepted', cancelled: bn ? 'বাতিল' : 'Cancelled' };
    box.replaceWith(el('section', { class: 'card my-classes' }, el('h2', { text: bn ? 'আমার কেনাকাটা' : 'My purchases' }),
      ...orders.slice(0, 5).map((o) => el('div', { class: 'mc-head' }, el('strong', { text: o.courseTitle }), el('span', { class: `tag ${o.status === 'approved' ? 'live' : ''}`, text: st[o.status] ?? o.status }),
        el('span', { class: 'muted small', text: `৳ ${num(o.total)} · ${ago(o.createdAt)}${o.reason ? ` · ${o.reason}` : ''}` }),
        el('a', { href: o.status === 'approved' ? `/watch.html?course=${encodeURIComponent(o.courseId)}` : `/buy.html?course=${encodeURIComponent(o.courseId)}`, text: o.status === 'approved' ? (bn ? 'দেখো' : 'Watch') : (bn ? 'খোলো' : 'Open') })))));
  }).catch(() => {});
  return box;
}

async function load() {
  try { render(await api('GET', `/api/dashboard?lang=${getLang()}`)); } catch (e) { errorBox(main, e.message, load); }
}

await ensureSignedIn();
mountNav('dashboard', load);
applyI18n(t());
load();
