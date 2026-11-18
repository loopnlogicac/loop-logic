// One course: adaptive lessons (with progress), practice, and the video playlists.
import { api, getLang, applyI18n, mountNav, el, num, ago, errorBox, ensureSignedIn } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · answers come only from reviewed notes and approved websites',
    courses: 'Courses', lessons: 'Adaptive lessons', practice: 'Practice', videos: 'Video playlists', videosN: (n) => `${n} videos`,
    start: 'Start', resume: 'Continue', review: 'Review', labBtn: 'Lab', labDone: 'Lab done', labPart: (c, t) => `Lab ${c}/${t}`, labTime: (m) => `Lab · ${m} min`, vids: (n) => `${n} videos`, done: (p) => `${p}% read`, quiz: (c, t) => `${c} of ${t} quizzes correct`, last: 'last read',
    noLessons: 'Adaptive lessons for this course are on the way.', noLessonsSub: 'Until then, the full course is on YouTube in Bangla.',
    practiceH: 'Judge the AI coworker', practiceP: 'Decide whether an AI’s pricing advice is right, see why you went wrong, then take a sealed check with no help.', practiceCta: 'Open practice',
    watch: 'Watch on YouTube', adaptiveTag: 'Lessons + labs', videoTag: 'Video playlists', notFound: 'Course not found.', back: 'Back to courses',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · উত্তর আসে শুধু পর্যালোচিত নোট আর অনুমোদিত ওয়েবসাইট থেকে',
    courses: 'কোর্স', lessons: 'অ্যাডাপটিভ পাঠ', practice: 'অনুশীলন', videos: 'ভিডিও প্লেলিস্ট', videosN: (n) => `${n}টি ভিডিও`,
    start: 'শুরু করো', resume: 'চালিয়ে যাও', review: 'আবার দেখো', labBtn: 'ল্যাব', labDone: 'ল্যাব সম্পন্ন', labPart: (c, t) => `ল্যাব ${c}/${t}`, labTime: (m) => `ল্যাব · ${m} মিনিট`, vids: (n) => `${n}টি ভিডিও`, done: (p) => `${p}% পড়া হয়েছে`, quiz: (c, t) => `${t}টির মধ্যে ${c}টি কুইজ ঠিক`, last: 'শেষ পড়া',
    noLessons: 'এই কোর্সের অ্যাডাপটিভ পাঠ আসছে।', noLessonsSub: 'ততদিন পুরো কোর্স ইউটিউবে বাংলায় আছে।',
    practiceH: 'এআই সহকর্মীর পরামর্শ যাচাই', practiceP: 'এআই-এর দামের পরামর্শ ঠিক কি না সিদ্ধান্ত নাও, কোথায় ভুল হলো দেখো, তারপর সাহায্য ছাড়া বন্ধ যাচাই দাও।', practiceCta: 'অনুশীলন খোলো',
    watch: 'ইউটিউবে দেখো', adaptiveTag: 'পাঠ + ল্যাব', videoTag: 'ভিডিও প্লেলিস্ট', notFound: 'কোর্স পাওয়া যায়নি।', back: 'কোর্সে ফিরে যাও',
  },
};
const t = () => T[getLang()];
const id = new URLSearchParams(location.search).get('id') ?? '';
const main = document.getElementById('main');

function render(c) {
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
      c.playlists[0] ? el('a', { class: 'btn primary', href: c.playlists[0].url, target: '_blank', rel: 'noopener noreferrer', text: L.watch }) : null));
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

  const right = el('div', { class: 'card' },
    el('div', { class: 'card-head' }, el('h2', { text: L.videos }), el('span', { class: 'muted small', text: L.videosN(num(c.videos)) })),
    el('ul', { class: 'pl-list' }, ...c.playlists.map((p) => el('li', {},
      el('a', { href: p.url, target: '_blank', rel: 'noopener noreferrer' }, el('span', { text: p.title }), el('span', { class: 'muted small', text: `${L.videosN(num(p.videos))} ↗` }))))));

  nodes.push(el('div', { class: 'two-col' }, left, right));
  main.replaceChildren(...nodes);
}

async function load() {
  try {
    render(await api('GET', `/api/courses/${encodeURIComponent(id)}?lang=${getLang()}`));
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
