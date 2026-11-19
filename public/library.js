// Pro library preview (design: Library and Player artboards). Pro is not open yet, so the
// packs, materials and certificates are clearly labelled samples; "Continue watching" and the
// protected-player demo use real free videos and the visitor's own learner id.
import { api, getLang, applyI18n, mountNav, el, num } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', foot: 'Loop & Logic · every video and tutorial stays free',
    banner: 'Preview: this is how the Pro library will look. Pro is not open yet, so the packs and files below are samples.', join: 'Join the waitlist',
    hello: 'Pro library preview', h1: 'My library',
    stats: [['3', 'Pro packs (sample)'], ['MAT-101 final', 'countdown to your exam'], ['1 of 2', 'devices in use']],
    cont: 'CONTINUE WATCHING', resume: 'Resume', materials: 'Class materials', freeLbl: 'FREE COURSE', sampleNext: 'Mathematics I · free video course',
    mine: 'My Pro packs', sample: 'SAMPLE',
    packs: [{ kind: 'EXAM PACK', code: 'MAT-101', title: 'MAT-101 Final Revision Pack', meta: '14 lessons · 6 mock tests · 9 materials', pct: 50, done: '7 of 14 lessons', exp: 'Valid this semester', tint: '#d9ecf2' },
      { kind: 'EXAM PACK', code: 'PPS / SPL', title: 'PPS & SPL Exam Prep Pack', meta: '22 lessons · 8 mock tests · 15 materials', pct: 81, done: '18 of 22 lessons', exp: 'Valid this semester', tint: '#e6efb5' },
      { kind: 'LIVE BATCH', code: 'C → PS', title: 'C to Problem Solving: Live Batch', meta: 'Sun & Wed 9 pm · 16 classes · recordings', pct: 25, done: '4 of 16 classes', exp: 'Next class: Sunday', tint: '#f4e3c8' }],
    files: 'Recent class materials', open: 'Open',
    fileList: [['PDF', '#f3dcd6', 'Integration by parts: class notes.pdf', 'MAT-101 · Lesson 7 · 2.1 MB'], ['PDF', '#f3dcd6', 'DIU MAT-101 final, Fall 2024: solved.pdf', 'MAT-101 · Past papers · 4.8 MB'], ['ZIP', '#e5e0f4', 'Pointer practice: starter code.zip', 'PPS & SPL · Lesson 15 · 36 KB'], ['PPT', '#f4e3c8', 'Recursion slides.pptx', 'C to Problem Solving · Class 4 · 3.3 MB']],
    certH: 'Certificates', certP: 'Finish all lessons and pass the final test of a pack to get a certificate with a verification link.', certBox: 'PPS & SPL Exam Prep Pack', certSub: 'Final test unlocks at 80% progress',
    protH: 'How Pro videos are protected', protShield: 'Protected video (demo)', wm: (id) => `Student ${id} · demo watermark`,
    protList: ['Your name and phone number move across the video, so a recording points back to you.', 'Pro videos are hosted with DRM, not on YouTube; screen recordings show a black screen on supported phones and browsers.', 'Use it on up to 2 devices, one stream at a time.', 'PDFs you download carry your name, and download links expire after 10 minutes.'],
    protNote: 'The demo plays a free video with the moving watermark on top. Free videos stay on YouTube, unprotected.',
    upH: 'Instructors: upload class material', upTag: 'Only instructors see this', upDrop: 'Drop files here or choose files · PDF, PPTX, DOCX, ZIP, C/PY source, images · up to 50 MB',
    upNote: 'For Pro this goes live with payments. For free courses, instructors can already attach materials and quizzes on every video page (Edit materials).',
    semester: 'For your semester', pass: 'Semester Pass: all packs', unlock: 'Notify me', locked: [['PHY-102', 'PHY-102 Final Revision Pack', 'Electrostatics to quantum theory · solved past papers'], ['DLD', 'Digital Logic Design Exam Pack', 'K-maps, SOP/POS, sequential circuits · mock tests'], ['DS', 'Data Structures Midterm Pack', 'Linked lists, stacks, queues · previous questions']],
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', foot: 'লুপ অ্যান্ড লজিক · সব ভিডিও আর টিউটোরিয়াল ফ্রিই থাকবে',
    banner: 'প্রিভিউ: প্রো লাইব্রেরি দেখতে এমন হবে। প্রো এখনো চালু হয়নি, তাই নিচের প্যাক আর ফাইলগুলো নমুনা।', join: 'ওয়েটলিস্টে যোগ দাও',
    hello: 'প্রো লাইব্রেরি প্রিভিউ', h1: 'আমার লাইব্রেরি',
    stats: [['৩', 'প্রো প্যাক (নমুনা)'], ['MAT-101 ফাইনাল', 'পরীক্ষার কাউন্টডাউন'], ['২-এর মধ্যে ১', 'ডিভাইস ব্যবহৃত']],
    cont: 'দেখা চালিয়ে যাও', resume: 'আবার শুরু করো', materials: 'ক্লাস ম্যাটেরিয়াল', freeLbl: 'ফ্রি কোর্স', sampleNext: 'ম্যাথমেটিক্স I · ফ্রি ভিডিও কোর্স',
    mine: 'আমার প্রো প্যাক', sample: 'নমুনা',
    packs: [{ kind: 'পরীক্ষা প্যাক', code: 'MAT-101', title: 'MAT-101 ফাইনাল রিভিশন প্যাক', meta: '১৪টি পাঠ · ৬টি মক টেস্ট · ৯টি ম্যাটেরিয়াল', pct: 50, done: '১৪টির মধ্যে ৭টি পাঠ', exp: 'এই সেমিস্টার পর্যন্ত', tint: '#d9ecf2' },
      { kind: 'পরীক্ষা প্যাক', code: 'PPS / SPL', title: 'PPS ও SPL পরীক্ষা প্রস্তুতি প্যাক', meta: '২২টি পাঠ · ৮টি মক টেস্ট · ১৫টি ম্যাটেরিয়াল', pct: 81, done: '২২টির মধ্যে ১৮টি পাঠ', exp: 'এই সেমিস্টার পর্যন্ত', tint: '#e6efb5' },
      { kind: 'লাইভ ব্যাচ', code: 'C → PS', title: 'সি থেকে প্রবলেম সলভিং: লাইভ ব্যাচ', meta: 'রবি ও বুধ রাত ৯টা · ১৬টি ক্লাস · রেকর্ডিং', pct: 25, done: '১৬টির মধ্যে ৪টি ক্লাস', exp: 'পরের ক্লাস: রবিবার', tint: '#f4e3c8' }],
    files: 'সাম্প্রতিক ক্লাস ম্যাটেরিয়াল', open: 'খোলো',
    fileList: [['PDF', '#f3dcd6', 'ইন্টিগ্রেশন বাই পার্টস: ক্লাস নোট.pdf', 'MAT-101 · পাঠ ৭ · ২.১ MB'], ['PDF', '#f3dcd6', 'DIU MAT-101 ফাইনাল, ফল ২০২৪: সমাধান.pdf', 'MAT-101 · পুরোনো প্রশ্ন · ৪.৮ MB'], ['ZIP', '#e5e0f4', 'পয়েন্টার অনুশীলন: স্টার্টার কোড.zip', 'PPS ও SPL · পাঠ ১৫ · ৩৬ KB'], ['PPT', '#f4e3c8', 'রিকারশন স্লাইড.pptx', 'সি থেকে প্রবলেম সলভিং · ক্লাস ৪ · ৩.৩ MB']],
    certH: 'সার্টিফিকেট', certP: 'একটি প্যাকের সব পাঠ শেষ করে ফাইনাল টেস্টে পাস করলে যাচাই-লিংকসহ সার্টিফিকেট পাবে।', certBox: 'PPS ও SPL পরীক্ষা প্রস্তুতি প্যাক', certSub: '৮০% অগ্রগতিতে ফাইনাল টেস্ট খুলবে',
    protH: 'প্রো ভিডিও কীভাবে সুরক্ষিত', protShield: 'সুরক্ষিত ভিডিও (ডেমো)', wm: (id) => `শিক্ষার্থী ${id} · ডেমো ওয়াটারমার্ক`,
    protList: ['তোমার নাম আর ফোন নম্বর ভিডিওর ওপর ঘুরে বেড়ায়, তাই রেকর্ডিং করলে তা তোমার দিকেই ইঙ্গিত করে।', 'প্রো ভিডিও DRM দিয়ে হোস্ট করা, ইউটিউবে নয়; সমর্থিত ফোন ও ব্রাউজারে স্ক্রিন রেকর্ডিং কালো দেখায়।', 'সর্বোচ্চ ২টি ডিভাইসে, একবারে একটি স্ট্রিম।', 'ডাউনলোড করা PDF-এ তোমার নাম থাকে, আর ডাউনলোড লিংক ১০ মিনিটে মেয়াদোত্তীর্ণ হয়।'],
    protNote: 'ডেমোতে একটি ফ্রি ভিডিওর ওপর চলমান ওয়াটারমার্ক দেখানো হচ্ছে। ফ্রি ভিডিও ইউটিউবেই থাকবে, সুরক্ষা ছাড়া।',
    upH: 'শিক্ষকদের জন্য: ক্লাস ম্যাটেরিয়াল আপলোড', upTag: 'শুধু শিক্ষকেরা দেখেন', upDrop: 'ফাইল এখানে টেনে আনো বা বেছে নাও · PDF, PPTX, DOCX, ZIP, C/PY সোর্স, ছবি · ৫০ MB পর্যন্ত',
    upNote: 'প্রো-র জন্য এটি পেমেন্টের সঙ্গে চালু হবে। ফ্রি কোর্সে শিক্ষকেরা এখনই প্রতিটি ভিডিও পেজে ম্যাটেরিয়াল আর কুইজ যোগ করতে পারেন।',
    semester: 'তোমার সেমিস্টারের জন্য', pass: 'সেমিস্টার পাস: সব প্যাক', unlock: 'জানিয়ো', locked: [['PHY-102', 'PHY-102 ফাইনাল রিভিশন প্যাক', 'ইলেকট্রোস্ট্যাটিক্স থেকে কোয়ান্টাম তত্ত্ব · পুরোনো প্রশ্নের সমাধান'], ['DLD', 'ডিজিটাল লজিক ডিজাইন পরীক্ষা প্যাক', 'কে-ম্যাপ, SOP/POS, সিকোয়েনশিয়াল সার্কিট · মক টেস্ট'], ['DS', 'ডেটা স্ট্রাকচার মিডটার্ম প্যাক', 'লিংকড লিস্ট, স্ট্যাক, কিউ · পুরোনো প্রশ্ন']],
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const DEMO_VIDEO = '-fgct5BGUNU'; // Differentiation Formulas, MAT-101 (free)

async function render() {
  const L = t();
  applyI18n(L);
  document.title = `${L.h1} · Loop & Logic`;
  const [dash, me] = await Promise.all([api('GET', `/api/dashboard?lang=${getLang()}`).catch(() => null), api('GET', '/api/me').catch(() => ({}))]);
  const cw = dash?.continueWatching;
  const contHref = cw ? `/watch.html?course=${encodeURIComponent(cw.courseId)}&v=${encodeURIComponent(cw.videoId)}` : `/watch.html?course=mat-101&v=${DEMO_VIDEO}`;
  const contTitle = cw?.title ?? 'Differentiation Formulas & Solved Problems';
  const contSub = cw ? `${cw.courseTitle ?? ''}` : L.sampleNext;
  const thumbId = cw?.videoId ?? DEMO_VIDEO;
  const pct = cw ? Math.round((100 * cw.watched) / Math.max(cw.total, 1)) : 0;
  const shortId = String(me.learnerId ?? 'guest').replace(/[^a-z0-9]/gi, '').slice(-6) || 'guest';

  main.replaceChildren(
    el('div', { class: 'lib-banner' }, el('span', {}, el('strong', { text: 'PRO · ' }), L.banner), el('a', { class: 'btn-pro', href: '/pricing.html#waitlist', text: L.join })),
    el('div', { class: 'lib-head' },
      el('div', {}, el('p', { text: L.hello }), el('h1', { text: L.h1 })),
      el('div', { class: 'lib-stats' }, ...L.stats.map(([a, b]) => el('div', {}, el('strong', { text: a }), el('span', { text: b }))))),
    el('section', { class: 'lib-continue', 'aria-labelledby': 'cont-title' },
      el('a', { class: 'lib-thumb', href: contHref, style: `background-image:linear-gradient(rgba(10,30,26,.35),rgba(10,30,26,.55)),url(https://i.ytimg.com/vi/${thumbId}/hqdefault.jpg)`, 'aria-label': `${L.resume}: ${contTitle}` },
        el('span', { class: 'play', 'aria-hidden': 'true', text: '▶' }), el('span', { class: 'lbl', text: cw ? `${num(pct)}%` : L.freeLbl }), el('span', { class: 'bar' }, el('i', { style: `width:${pct}%` }))),
      el('div', { class: 'lib-cont-copy' },
        el('span', { class: 'k', text: L.cont }), el('h2', { id: 'cont-title', text: contTitle }), el('p', { text: contSub }),
        el('div', { class: 'acts' }, el('a', { class: 'btn-pro', href: contHref, text: L.resume }), el('a', { class: 'btn outline', href: contHref, text: L.materials })))),
    el('section', { class: 'lib-sec', 'aria-labelledby': 'mine-title' },
      el('div', { class: 'lib-sec-head' }, el('h2', { id: 'mine-title', text: L.mine }), el('span', { class: 'pill', text: L.sample })),
      el('div', { class: 'lib-grid' }, ...L.packs.map((c) => el('div', { class: 'lib-card' },
        el('span', { class: 'art', style: `background:${c.tint}` }, el('span', { class: 'kind', text: c.kind }), el('span', { class: 'code', text: c.code })),
        el('span', { class: 'body' }, el('strong', { text: c.title }), el('span', { class: 'meta', text: c.meta }), el('span', { class: 'prog' }, el('i', { style: `width:${c.pct}%` })), el('span', { class: 'foot' }, el('span', { text: c.done }), el('span', { text: c.exp }))))))),
    el('section', { class: 'lib-sec', 'aria-labelledby': 'prot-title' },
      el('h2', { id: 'prot-title', text: L.protH }),
      el('div', { class: 'lib-protect' },
        el('div', { class: 'lib-player' },
          el('iframe', { src: `https://www.youtube-nocookie.com/embed/${DEMO_VIDEO}?rel=0`, title: 'Protected player demo', allow: 'encrypted-media; picture-in-picture', allowfullscreen: true, loading: 'lazy', referrerpolicy: 'strict-origin-when-cross-origin' }),
          el('span', { class: 'lib-shield', text: `🛡 ${L.protShield}` }),
          el('span', { class: 'wm', text: L.wm(shortId) })),
        el('div', { class: 'lib-protect-copy' }, el('strong', { text: `🛡 ${L.protH}` }), el('ul', {}, ...L.protList.map((x) => el('li', { text: x }))), el('p', { class: 'small', style: 'margin:0;color:#9fb5ae', text: L.protNote })))),
    el('div', { class: 'lib-two' },
      el('section', { class: 'lib-files', 'aria-labelledby': 'files-title' },
        el('div', { class: 'lib-sec-head' }, el('h2', { id: 'files-title', text: L.files }), el('span', { class: 'pill', text: L.sample })),
        el('ul', {}, ...L.fileList.map(([ty, bg, nm, meta]) => el('li', {}, el('span', { class: 'ft', style: `background:${bg}`, text: ty }), el('span', { class: 'nm' }, el('strong', { text: nm }), el('span', { text: meta })), el('span', { class: 'chip', 'aria-disabled': 'true', text: L.open }))))),
      el('section', { class: 'lib-cert' }, el('h2', { text: L.certH }), el('p', { text: L.certP }), el('div', { class: 'box' }, el('strong', { text: L.certBox }), el('span', { class: 'small muted', text: L.certSub })))),
    el('section', { class: 'lib-upload', 'aria-labelledby': 'up-title' },
      el('div', { class: 'lib-sec-head' }, el('h2', { id: 'up-title', style: 'margin:0;font-size:20px', text: L.upH }), el('span', { class: 'pill', text: L.upTag })),
      el('div', { class: 'drop', text: L.upDrop }), el('p', { class: 'small muted', style: 'margin:0', text: L.upNote })),
    el('section', { class: 'lib-sec', 'aria-labelledby': 'sem-title' },
      el('div', { class: 'lib-sec-head' }, el('h2', { id: 'sem-title', text: L.semester }), el('a', { href: '/pricing.html', text: L.pass })),
      el('div', { class: 'lib-grid' }, ...L.locked.map(([code, title, meta]) => el('div', { class: 'lib-locked' },
        el('span', { class: 'row' }, el('span', { class: 'code', text: code }), el('span', { 'aria-hidden': 'true', text: '🔒' })),
        el('strong', { text: title }), el('span', { class: 'meta', text: meta }), el('a', { class: 'btn-pro', href: '/pricing.html#waitlist', text: L.unlock }))))));
}
mountNav('pricing', render);
render();
