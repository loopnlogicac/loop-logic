// Video course player: plays a course's YouTube playlists in order, inside the site.
import { api, getLang, applyI18n, mountNav, el, num, errorBox, toast, ensureSignedIn, getConfig } from './common.js';
import { tryNowButton, learnerSections, editLink, openEditor } from './video-extras.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · videos play from YouTube; views count on the channel',
    courses: 'Courses', contents: 'Course videos', of: (a, b) => `Video ${a} of ${b}`,
    watched: (a, b) => `${a} of ${b} watched`, prev: '← Previous', next: 'Next →', doneNext: '✓ Done, next video', markDone: '✓ Mark as watched', undo: 'Mark as not watched',
    finished: 'You have watched every video in this course.', onYt: 'Open on YouTube ↗', credit: (by) => `This video is by ${by}, from YouTube. It is part of the Loop & Logic playlist.`,
    by: (by) => `by ${by}`, repeat: 'also earlier in the course', notFound: 'Course not found.', back: 'Back to courses', saved: 'Saved',
    hm: (h, m) => (h ? `${h} h ${m} min` : `${m} min`), quizMark: 'quiz',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · ভিডিও চলে ইউটিউব থেকে; ভিউ চ্যানেলেই গোনা হয়',
    courses: 'কোর্স', contents: 'কোর্সের ভিডিও', of: (a, b) => `${b}টির মধ্যে ${a} নম্বর ভিডিও`,
    watched: (a, b) => `${b}টির মধ্যে ${a}টি দেখা হয়েছে`, prev: '← আগেরটি', next: 'পরেরটি →', doneNext: '✓ দেখা শেষ, পরের ভিডিও', markDone: '✓ দেখা হয়েছে', undo: 'দেখা হয়নি হিসেবে রাখো',
    finished: 'এই কোর্সের সব ভিডিও দেখা শেষ।', onYt: 'ইউটিউবে খোলো ↗', credit: (by) => `এই ভিডিওটি ${by}-এর, ইউটিউব থেকে। এটি লুপ অ্যান্ড লজিকের প্লেলিস্টে আছে।`,
    by: (by) => `${by}-এর ভিডিও`, repeat: 'কোর্সে আগেও আছে', notFound: 'কোর্স পাওয়া যায়নি।', back: 'কোর্সে ফিরে যাও', saved: 'সেভ হয়েছে',
    hm: (h, m) => (h ? `${h} ঘণ্টা ${m} মিনিট` : `${m} মিনিট`), quizMark: 'কুইজ',
  },
};
const t = () => T[getLang()];
const params = new URLSearchParams(location.search);
const courseId = params.get('course') ?? '';
const main = document.getElementById('main');
let view = null;
let config = null;
let editing = false;

const watchUrl = (v) => `/watch.html?course=${encodeURIComponent(courseId)}&v=${encodeURIComponent(v)}`;

function render() {
  const L = t();
  applyI18n(L);
  const { course, sections, progress, current: cur } = view;
  document.title = `${cur ? cur.title : course.title} · Loop & Logic`;
  const pct = progress.percent;

  const crumbs = el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' },
    el('a', { href: '/courses.html', text: L.courses }), '›',
    el('a', { href: `/course.html?id=${encodeURIComponent(course.id)}`, text: course.title }), '›',
    el('span', { text: cur ? L.of(num(cur.position), num(progress.total)) : '' }));

  const left = el('div', {});
  if (cur) {
    left.append(
      el('div', { class: 'player' },
        el('iframe', { src: cur.embedUrl, title: cur.title, allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share', allowfullscreen: true, referrerpolicy: 'strict-origin-when-cross-origin', loading: 'lazy' })),
      el('div', { class: 'now' },
        el('h1', { text: cur.title }),
        el('p', { class: 'meta', text: [L.of(num(cur.position), num(progress.total)), cur.duration].join(' · ') }),
        cur.by ? el('p', { class: 'credit', text: L.credit(cur.by) }) : null,
        el('div', { class: 'watch-actions' },
          cur.prev ? el('a', { class: 'btn ghost small', href: watchUrl(cur.prev), 'data-v': cur.prev, onclick: go, text: L.prev }) : null,
          cur.watched
            ? el('button', { class: 'btn ghost small', type: 'button', onclick: () => mark(cur.id, false), text: L.undo })
            : el('button', { class: 'btn primary small', type: 'button', onclick: () => mark(cur.id, true, cur.next), text: cur.next ? L.doneNext : L.markDone }),
          cur.next ? el('a', { class: 'btn secondary small', href: watchUrl(cur.next), 'data-v': cur.next, onclick: go, text: L.next }) : null,
          tryNowButton(cur.extras?.tryNow),
          el('a', { class: 'btn ghost small', href: cur.youtubeUrl, target: '_blank', rel: 'noopener noreferrer', text: L.onYt }))),
    );
    const extrasBox = el('div', { class: 'vx-stack' }, ...learnerSections(course.id, cur));
    left.append(extrasBox, el('p', { style: 'margin:10px 0 0' }, editLink(config, () => {
      editing = true;
      openEditor(extrasBox, cur, course, config, (changed) => { editing = false; load(cur.id); });
    })));
    if (progress.watched === progress.total) left.append(el('p', { class: 'tag live', style: 'margin-top:14px', text: L.finished }));
  }

  const list = el('div', { class: 'vlist' });
  for (const s of sections) {
    const done = s.items.filter((i) => i.watched).length;
    const holdsCurrent = cur && s.items.some((i) => i.id === cur.id && !i.repeat);
    list.append(el('details', { open: holdsCurrent || sections.length === 1 },
      el('summary', {}, el('span', { text: s.title }), el('span', { text: `${num(done)}/${num(s.items.length)}` })),
      el('ol', {}, ...s.items.map((i) => el('li', {},
        el('a', { href: watchUrl(i.id), 'data-v': i.id, onclick: go, 'aria-current': cur && i.id === cur.id && !i.repeat ? 'true' : null },
          el('span', { class: `tick ${i.watched ? 'on' : ''}`, 'aria-label': i.watched ? 'watched' : null, text: i.watched ? '✓' : num(i.n) }),
          el('span', {}, i.title, i.by ? el('span', { class: 'by', text: L.by(i.by) }) : null, i.repeat ? el('span', { class: 'by', style: 'color:var(--muted)', text: L.repeat }) : null,
            i.materials || i.quiz ? el('span', { class: 'marks', text: [i.materials ? `📎 ${num(i.materials)}` : null, i.quiz ? `📝 ${L.quizMark}` : null].filter(Boolean).join('  ') }) : null),
          el('span', { class: 'dur', text: i.duration })))))));
  }
  const right = el('aside', { class: 'card' },
    el('div', { class: 'card-head' }, el('h2', { text: L.contents })),
    el('div', { class: 'vcourse-head' },
      el('span', { class: 'small muted', text: `${L.watched(num(progress.watched), num(progress.total))} · ${L.hm(num(progress.totalTime.hours), num(progress.totalTime.minutes))}` }),
      el('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(pct), 'aria-valuemin': '0', 'aria-valuemax': '100' }, el('i', { style: `width:${pct}%` }))),
    list);

  main.replaceChildren(crumbs, el('div', { class: 'watch', style: 'margin-top:12px' }, left, right));
  main.querySelector('.vlist a[aria-current="true"]')?.scrollIntoView({ block: 'nearest' });
}

async function load(v, push = false) {
  try {
    const q = new URLSearchParams({ lang: getLang() });
    if (v) q.set('v', v);
    view = await api('GET', `/api/courses/${encodeURIComponent(courseId)}/videos?${q}`);
    if (view.current) {
      const url = watchUrl(view.current.id);
      if (push) history.pushState({ v: view.current.id }, '', url);
      else history.replaceState({ v: view.current.id }, '', url);
    }
    render();
  } catch (e) {
    if (e.status === 404) main.replaceChildren(el('div', { class: 'card empty' }, el('h2', { text: t().notFound }), el('a', { class: 'btn secondary', href: '/courses.html', text: t().back })));
    else errorBox(main, e.message, () => load(v));
  }
}

function go(ev) {
  if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button === 1) return; // let new-tab clicks through
  ev.preventDefault();
  load(ev.currentTarget.dataset.v, true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function mark(videoId, watched, then) {
  try {
    await api('POST', `/api/courses/${encodeURIComponent(courseId)}/videos/watched`, { videoId, watched });
    if (then) { await load(then, true); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else { await load(videoId); toast(t().saved); }
  } catch (e) {
    toast(e.message);
  }
}

window.addEventListener('popstate', (e) => load(e.state?.v ?? new URLSearchParams(location.search).get('v')));
await ensureSignedIn();
config = await getConfig().catch(() => null);
mountNav('courses', () => load(view?.current?.id));
applyI18n(t());
load(params.get('v'));
