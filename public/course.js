// One course: adaptive lessons (with progress), practice, and the video course (played in the site).
import { api, getLang, applyI18n, mountNav, el, num, ago, errorBox, ensureSignedIn } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    courses: 'Courses', lessons: 'Adaptive lessons', practice: 'Practice', videos: 'Video playlists', videosN: (n) => `${n} videos`,
    start: 'Start', resume: 'Continue', review: 'Review', labBtn: 'Lab', labDone: 'Lab done', labPart: (c, t) => `Lab ${c}/${t}`, labTime: (m) => `Lab · ${m} min`, vids: (n) => `${n} videos`, done: (p) => `${p}% read`, quiz: (c, t) => `${c} of ${t} quizzes correct`, last: 'last read',
    noLessons: 'Adaptive lessons for this course are on the way.', noLessonsSub: 'Until then, watch the full video course here, in Bangla.',
    practiceH: 'Judge the AI coworker', practiceP: 'Decide whether an AI’s pricing advice is right, see why you went wrong, then take a sealed check with no help.', practiceCta: 'Open practice',
    watch: 'Watch on YouTube', startWatching: 'Start watching', keepWatching: 'Continue watching', rewatch: 'Watch again', vcourse: 'Video course', watchedN: (a, b) => `${a} of ${b} watched`, hm: (h, m) => (h ? `${h} h ${m} min` : `${m} min`), by: (b) => `by ${b}`, ytLink: 'Playlist on YouTube ↗', adaptiveTag: 'Lessons + labs', videoTag: 'Video playlists', notFound: 'Course not found.', back: 'Back to courses',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    courses: 'কোর্স', lessons: 'অ্যাডাপটিভ পাঠ', practice: 'অনুশীলন', videos: 'ভিডিও প্লেলিস্ট', videosN: (n) => `${n}টি ভিডিও`,
    start: 'শুরু করো', resume: 'চালিয়ে যাও', review: 'আবার দেখো', labBtn: 'ল্যাব', labDone: 'ল্যাব সম্পন্ন', labPart: (c, t) => `ল্যাব ${c}/${t}`, labTime: (m) => `ল্যাব · ${m} মিনিট`, vids: (n) => `${n}টি ভিডিও`, done: (p) => `${p}% পড়া হয়েছে`, quiz: (c, t) => `${t}টির মধ্যে ${c}টি কুইজ ঠিক`, last: 'শেষ পড়া',
    noLessons: 'এই কোর্সের অ্যাডাপটিভ পাঠ আসছে।', noLessonsSub: 'ততদিন পুরো ভিডিও কোর্স এখানেই বাংলায় দেখো।',
    practiceH: 'এআই সহকর্মীর পরামর্শ যাচাই', practiceP: 'এআই-এর দামের পরামর্শ ঠিক কি না সিদ্ধান্ত নাও, কোথায় ভুল হলো দেখো, তারপর সাহায্য ছাড়া বন্ধ যাচাই দাও।', practiceCta: 'অনুশীলন খোলো',
    watch: 'ইউটিউবে দেখো', startWatching: 'দেখা শুরু করো', keepWatching: 'দেখা চালিয়ে যাও', rewatch: 'আবার দেখো', vcourse: 'ভিডিও কোর্স', watchedN: (a, b) => `${b}টির মধ্যে ${a}টি দেখা হয়েছে`, hm: (h, m) => (h ? `${h} ঘণ্টা ${m} মিনিট` : `${m} মিনিট`), by: (b) => `${b}-এর ভিডিও`, ytLink: 'ইউটিউবে প্লেলিস্ট ↗', adaptiveTag: 'পাঠ + ল্যাব', videoTag: 'ভিডিও প্লেলিস্ট', notFound: 'কোর্স পাওয়া যায়নি।', back: 'কোর্সে ফিরে যাও',
  },
};
const t = () => T[getLang()];
const id = new URLSearchParams(location.search).get('id') ?? '';
const main = document.getElementById('main');

function videoCard(c, v, L) {
  const watch = (id) => `/watch.html?course=${encodeURIComponent(c.id)}&v=${encodeURIComponent(id)}`;
  const p = v.progress;
  const label = p.watched === 0 ? L.startWatching : p.watched === p.total ? L.rewatch : L.keepWatching;
  return el('div', { class: 'card', id: 'videos' },
    el('div', { class: 'card-head' }, el('h2', { text: L.vcourse }), el('span', { class: 'muted small', text: `${L.videosN(num(p.total))} · ${L.hm(num(p.totalTime.hours), num(p.totalTime.minutes))}` })),
    el('div', { class: 'vcourse-head' },
      el('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(p.percent), 'aria-valuemin': '0', 'aria-valuemax': '100' }, el('i', { style: `width:${p.percent}%` })),
      el('span', { class: 'small muted', text: L.watchedN(num(p.watched), num(p.total)) }),
      p.nextUp ? el('a', { class: 'btn primary small', href: watch(p.nextUp), text: label }) : null),
    el('div', { class: 'vlist' }, ...v.sections.map((s, si) => el('details', { open: si === 0 && v.sections.length <= 3 },
      el('summary', {}, el('span', { text: s.title }), el('span', { text: `${num(s.items.filter((i) => i.watched).length)}/${num(s.items.length)}` })),
      el('ol', {}, ...s.items.map((i) => el('li', {}, el('a', { href: watch(i.id) },
        el('span', { class: `tick ${i.watched ? 'on' : ''}`, text: i.watched ? '✓' : num(i.n) }),
        el('span', {}, i.title, i.by ? el('span', { class: 'by', text: L.by(i.by) }) : null),
        el('span', { class: 'dur', text: i.duration }))))),
      el('p', { class: 'small', style: 'margin:6px 0 0' }, el('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', text: L.ytLink }))))));
}

function render(c, v) {
  const L = t();
  applyI18n(L);
  document.title = `${c.title} · Loop & Logic`;
  const nodes = [
    el('nav', { class: 'crumbs', 'aria-label': 'Breadcrumb' }, el('a', { href: '/courses.html', text: L.courses }), '›', el('span', { text: c.title })),
    el('div', { class: 'course-hero' },
      el('div', { class: 'page-head' },
        el('p', { class: 'kicker', text: [c.code, c.subjectName].filter(Boolean).join(' · ') }),
        el('h1', { text: c.title }),
        el('p', { text: c.blurb })),
      el('span', { class: `tag ${c.adaptive ? 'live' : ''}`, text: c.adaptive ? L.adaptiveTag : L.videoTag })),
  ];

  const left = el('div', { class: 'card' }, el('div', { class: 'card-head' }, el('h2', { text: L.lessons })));
  if (!c.lessonList.length) {
    left.append(el('div', { class: 'empty' }, el('h2', { text: L.noLessons }), el('p', { text: L.noLessonsSub }),
      v.progress.nextUp ? el('a', { class: 'btn primary', href: '#videos', text: L.vcourse + ' ↓' }) : null));
  } else {
    for (const l of c.lessonList) {
      const label = !l.started ? L.start : l.percent >= 100 ? L.review : L.resume;
      left.append(el('div', { class: 'lesson-row' },
        el('div', {},
          el('h3', { text: l.title }),
          el('p', { text: l.summary }),
          el('div', { class: 'mini-tags' },
            l.lab ? el('span', { class: `tag ${l.labDone ? 'live' : ''}`, text: l.labDone ? `✓ ${L.labDone}` : l.labChecksCorrect ? L.labPart(num(l.labChecksCorrect), num(l.labChecksTotal)) : L.labTime(num(l.lab.minutes)) }) : null,
            l.videos ? el('span', { class: 'tag', text: `▶ ${L.vids(num(l.videos))}` }) : null),
          l.started ? el('p', { class: 'small', text: [L.done(num(l.percent)), l.quizzesTotal ? L.quiz(num(l.quizzesCorrect), num(l.quizzesTotal)) : null, l.lastAt ? `${L.last} ${ago(l.lastAt)}` : null].filter(Boolean).join(' · ') }) : null,
          l.started ? el('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(l.percent), 'aria-valuemin': '0', 'aria-valuemax': '100' }, el('i', { style: `width:${l.percent}%` })) : null),
        el('div', { class: 'lesson-actions' },
          el('a', { class: `btn ${l.started ? 'secondary' : 'primary'}`, href: `/lesson.html?id=${encodeURIComponent(l.id)}`, text: label }),
          l.lab ? el('a', { class: 'btn ghost', href: `/lab.html?id=${encodeURIComponent(l.id)}`, text: L.labBtn }) : null)));
    }
  }
  if (c.practice) {
    left.append(el('div', { class: 'lesson-row' },
      el('div', {}, el('span', { class: 'tag', text: L.practice }), el('h3', { text: L.practiceH, style: 'margin-top:6px' }), el('p', { text: L.practiceP })),
      el('a', { class: 'btn secondary', href: '/practice.html', text: L.practiceCta })));
  }

  const right = videoCard(c, v, L);
  if (!c.lessonList.length && !c.practice) nodes.push(right);
  else nodes.push(el('div', { class: 'two-col' }, left, right));
  main.replaceChildren(...nodes);
}

async function load() {
  try {
    const [c, v] = await Promise.all([api('GET', `/api/courses/${encodeURIComponent(id)}?lang=${getLang()}`), api('GET', `/api/courses/${encodeURIComponent(id)}/videos?lang=${getLang()}`)]);
    render(c, v);
  } catch (e) {
    if (e.status === 404) {
      main.replaceChildren(el('div', { class: 'card empty' }, el('h2', { text: t().notFound }), el('a', { class: 'btn secondary', href: '/courses.html', text: t().back })));
    } else errorBox(main, e.message, load);
  }
}

await ensureSignedIn();
mountNav('courses', load);
applyI18n(t());
load();
