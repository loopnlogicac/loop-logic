// Under each video: materials, Try now, quiz (learners) and the editor (instructors).
import { api, getLang, el, num, toast, store } from './common.js';

const T = {
  en: {
    materials: 'Materials used in this video', copy: 'Copy', copied: 'Copied', open: 'Open ↗', show: 'Show',
    tryNow: (l) => `▶ Try now in ${l}`, tryCopied: 'Code copied. Paste it into the compiler (Ctrl+V), then press Run.', tryHint: (l) => `Opens an online ${l} compiler in a new tab and copies this code for you.`, tryCode: 'Code to try', tryStarter: 'Starter program',
    quiz: 'Quiz', quizN: (n) => `${n} question${n === 1 ? '' : 's'}`, submit: 'Check my answers', again: 'Try again', score: (a, b) => `You got ${a} of ${b} right`, last: (a, b) => `Last time: ${a}/${b}`,
    right: 'Correct', wrong: 'Not quite', answerWas: 'Correct answer:', unanswered: 'Answer every question first', why: 'Why',
    edit: '✎ Edit materials, quiz & Try now', editTitle: 'Edit this video', locked: 'Editing is off on this site until an instructor key is set.',
    keyAsk: 'Instructor key', keyWrong: 'That instructor key was not accepted.',
    mTitle: 'Title', mUrl: 'Link (Google Drive, GitHub, PDF…)', mCode: 'Code or notes (optional)', addM: '+ Add material', remove: 'Remove',
    tTitle: 'Try now', tMode: 'Show the Try now button', tDefault: (l) => (l ? `Course default (on, ${l})` : 'Course default (off)'), tOn: 'On', tOff: 'Off', tLang: 'Language', tCode: 'Starter code (leave empty for a Hello World program)',
    qTitle: 'Quiz questions', qPrompt: 'Question', qOption: (n) => `Option ${n}`, qCorrect: 'Correct', qExpl: 'Explanation shown after answering (optional)', addQ: '+ Add question', addO: '+ Option',
    save: 'Save', cancel: 'Cancel', saved: 'Saved', export: 'Download all video materials (JSON)', lostWarn: 'Note: this site has no database yet, so saved content is lost when the server restarts. Download the JSON to keep a copy.',
    savedAt: (t) => `Last saved ${t}`, fromSeed: 'Showing the built-in version', qLabel: (n) => `Question ${n}`, mLabel: (n) => `Material ${n}`,
  },
  bn: {
    materials: 'এই ভিডিওতে ব্যবহৃত উপকরণ', copy: 'কপি', copied: 'কপি হয়েছে', open: 'খোলো ↗', show: 'দেখো',
    tryNow: (l) => `▶ ${l}-এ নিজে চালিয়ে দেখো`, tryCopied: 'কোড কপি হয়েছে। কম্পাইলারে পেস্ট করো (Ctrl+V), তারপর Run চাপো।', tryHint: (l) => `নতুন ট্যাবে অনলাইন ${l} কম্পাইলার খুলবে আর এই কোড কপি হয়ে যাবে।`, tryCode: 'চালানোর কোড', tryStarter: 'শুরুর প্রোগ্রাম',
    quiz: 'কুইজ', quizN: (n) => `${n}টি প্রশ্ন`, submit: 'উত্তর যাচাই করো', again: 'আবার চেষ্টা করো', score: (a, b) => `${b}টির মধ্যে ${a}টি ঠিক`, last: (a, b) => `আগেরবার: ${a}/${b}`,
    right: 'ঠিক', wrong: 'হয়নি', answerWas: 'সঠিক উত্তর:', unanswered: 'আগে সব প্রশ্নের উত্তর দাও', why: 'কেন',
    edit: '✎ উপকরণ, কুইজ ও "নিজে চালাও" সম্পাদনা', editTitle: 'এই ভিডিও সম্পাদনা', locked: 'ইন্সট্রাক্টর কী সেট না করা পর্যন্ত এই সাইটে সম্পাদনা বন্ধ।',
    keyAsk: 'ইন্সট্রাক্টর কী', keyWrong: 'ইন্সট্রাক্টর কী গ্রহণ করা হয়নি।',
    mTitle: 'শিরোনাম', mUrl: 'লিংক (গুগল ড্রাইভ, গিটহাব, পিডিএফ…)', mCode: 'কোড বা নোট (ঐচ্ছিক)', addM: '+ উপকরণ যোগ করো', remove: 'সরাও',
    tTitle: 'নিজে চালাও', tMode: '"নিজে চালাও" বোতাম দেখাও', tDefault: (l) => (l ? `কোর্সের নিয়ম (চালু, ${l})` : 'কোর্সের নিয়ম (বন্ধ)'), tOn: 'চালু', tOff: 'বন্ধ', tLang: 'ভাষা', tCode: 'শুরুর কোড (খালি রাখলে Hello World প্রোগ্রাম)',
    qTitle: 'কুইজের প্রশ্ন', qPrompt: 'প্রশ্ন', qOption: (n) => `অপশন ${n}`, qCorrect: 'সঠিক', qExpl: 'উত্তরের পর দেখানো ব্যাখ্যা (ঐচ্ছিক)', addQ: '+ প্রশ্ন যোগ করো', addO: '+ অপশন',
    save: 'সেভ করো', cancel: 'বাতিল', saved: 'সেভ হয়েছে', export: 'সব ভিডিওর উপকরণ ডাউনলোড (JSON)', lostWarn: 'খেয়াল রাখো: এই সাইটে এখনো ডাটাবেস নেই, তাই সার্ভার রিস্টার্ট হলে সেভ করা কনটেন্ট মুছে যায়। কপি রাখতে JSON ডাউনলোড করো।',
    savedAt: (t) => `শেষ সেভ ${t}`, fromSeed: 'সাইটের সঙ্গে আসা সংস্করণ দেখাচ্ছে', qLabel: (n) => `প্রশ্ন ${n}`, mLabel: (n) => `উপকরণ ${n}`,
  },
};
const t = () => T[getLang()];
const keyHeader = () => { const k = store.get('ll_ikey', 'session'); return k ? { 'x-instructor-key': k } : {}; };

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
const copyBtn = (text) => el('button', { class: 'btn ghost small', type: 'button', onclick: async (e) => { if (await copyText(text)) { e.currentTarget.textContent = t().copied; } }, text: t().copy });

/** The Try now button for the action row (or null). */
export function tryNowButton(tryNow) {
  if (!tryNow) return null;
  const L = t();
  return el('a', {
    class: 'btn secondary small', href: tryNow.url, target: '_blank', rel: 'noopener noreferrer', title: L.tryHint(tryNow.label),
    onclick: (e) => {
      // start the copy while this tab still has focus, then open the compiler
      e.preventDefault();
      const copying = copyText(tryNow.code);
      window.open(tryNow.url, '_blank', 'noopener');
      copying.then((ok) => ok && toast(L.tryCopied));
    },
    text: L.tryNow(tryNow.label),
  });
}

/** Learner sections under the player. */
export function learnerSections(courseId, video) {
  const L = t();
  const x = video.extras;
  if (!x) return [];
  const out = [];

  if (x.tryNow) {
    out.push(el('details', { class: 'card vx' },
      el('summary', {}, el('strong', { text: `${x.tryNow.starter ? L.tryStarter : L.tryCode} · ${x.tryNow.label}` }), el('span', { class: 'muted small', text: L.tryHint(x.tryNow.label) })),
      el('pre', { class: 'code' }, el('code', { text: x.tryNow.code })),
      el('div', { class: 'watch-actions' }, copyBtn(x.tryNow.code), tryNowButton(x.tryNow))));
  }

  if (x.materials.length) {
    out.push(el('section', { class: 'card vx' },
      el('div', { class: 'card-head' }, el('h2', { text: L.materials })),
      el('ul', { class: 'mat-list' }, ...x.materials.map((m) => el('li', {},
        el('div', { class: 'mat-head' },
          el('span', { text: `${m.url ? '🔗' : '📄'} ${m.title}` }),
          m.url ? el('a', { class: 'btn ghost small', href: m.url, target: '_blank', rel: 'noopener noreferrer', text: L.open }) : null),
        m.code ? el('details', {}, el('summary', { class: 'small', text: L.show }), el('pre', { class: 'code' }, el('code', { text: m.code })), copyBtn(m.code)) : null)))));
  }

  if (x.quiz.length) out.push(quizCard(courseId, video, L));
  return out;
}

function quizCard(courseId, video, L) {
  const x = video.extras;
  const card = el('section', { class: 'card vx' });
  const answers = {};
  const draw = (result) => {
    const byId = new Map((result?.results ?? []).map((r) => [r.id, r]));
    card.replaceChildren(
      el('div', { class: 'card-head' }, el('h2', { text: L.quiz }),
        el('span', { class: 'muted small', text: result ? L.score(num(result.score), num(result.total)) : x.lastQuiz ? L.last(num(x.lastQuiz.score), num(x.lastQuiz.total)) : L.quizN(num(x.quiz.length)) })),
      ...x.quiz.map((q, qi) => {
        const r = byId.get(q.id);
        return el('fieldset', { class: `quiz-q ${r ? (r.correct ? 'ok' : 'bad') : ''}` },
          el('legend', { text: `${num(qi + 1)}. ${q.prompt}` }),
          ...q.options.map((o, oi) => el('label', { class: `opt ${r && oi === r.answer ? 'is-answer' : ''}` },
            el('input', { type: 'radio', name: `q-${q.id}`, value: String(oi), checked: answers[q.id] === oi, disabled: Boolean(r), onchange: () => { answers[q.id] = oi; } }),
            el('span', { text: o }))),
          r ? el('p', { class: 'small fb' }, el('strong', { text: r.correct ? `✓ ${L.right}` : `✗ ${L.wrong}` }),
            !r.correct ? ` · ${L.answerWas} ${q.options[r.answer]}` : '', r.explanation ? el('span', { class: 'expl', text: `${L.why}: ${r.explanation}` }) : null) : null);
      }),
      el('div', { class: 'watch-actions' }, result
        ? el('button', { class: 'btn secondary small', type: 'button', onclick: () => { for (const k of Object.keys(answers)) delete answers[k]; draw(null); }, text: L.again })
        : el('button', { class: 'btn primary small', type: 'button', onclick: submit, text: L.submit })));
  };
  async function submit() {
    if (x.quiz.some((q) => answers[q.id] === undefined)) return toast(L.unanswered);
    try {
      draw(await api('POST', `/api/courses/${encodeURIComponent(courseId)}/videos/${encodeURIComponent(video.id)}/quiz`, { answers }));
    } catch (e) { toast(e.message); }
  }
  draw(null);
  return card;
}

/** "Edit" link for instructors; opens the editor in place of the learner sections. */
export function editLink(config, onOpen) {
  if (!config || config.editing === 'locked') return null;
  return el('button', { class: 'linkish small', type: 'button', onclick: onOpen, text: t().edit });
}

/** Loads the full extras (asking for the instructor key if needed) and renders the editor. */
export async function openEditor(target, video, course, config, onDone) {
  const L = t();
  if (config.editing === 'key' && !store.get('ll_ikey', 'session')) {
    const k = window.prompt(L.keyAsk);
    if (!k) return;
    store.set('ll_ikey', k.trim(), 'session');
  }
  let data;
  try {
    data = await api('GET', `/api/videos/${encodeURIComponent(video.id)}/extras`, undefined, keyHeader());
  } catch (e) {
    if (e.status === 403 && e.code === 'forbidden') { store.del('ll_ikey', 'session'); toast(L.keyWrong); } else toast(e.message);
    return;
  }
  const d = structuredClone(data.extras);
  const box = el('section', { class: 'card vx editor' });
  const errorLine = el('p', { class: 'small err', role: 'alert' });

  const input = (value, onInput, attrs = {}) => el('input', { type: 'text', value: value ?? '', oninput: (e) => onInput(e.target.value), ...attrs });
  const area = (value, onInput, attrs = {}) => { const a = el('textarea', { rows: '4', oninput: (e) => onInput(e.target.value), ...attrs }); a.value = value ?? ''; return a; };
  const field = (label, control) => el('label', { class: 'fld' }, el('span', { text: label }), control);

  function draw() {
    const mats = d.materials.map((m, i) => el('div', { class: 'ed-item' },
      el('div', { class: 'ed-row' }, el('strong', { text: L.mLabel(num(i + 1)) }), el('button', { class: 'linkish small', type: 'button', onclick: () => { d.materials.splice(i, 1); draw(); }, text: L.remove })),
      field(L.mTitle, input(m.title, (v) => { m.title = v; }, { maxlength: '200' })),
      field(L.mUrl, input(m.url, (v) => { m.url = v; }, { type: 'url', placeholder: 'https://' })),
      field(L.mCode, area(m.code, (v) => { m.code = v; }, { class: 'mono', spellcheck: 'false' }))));

    const tn = d.tryNow;
    const tryBox = el('div', { class: 'ed-item' },
      field(L.tMode, el('select', { onchange: (e) => { tn.mode = e.target.value; draw(); } },
        ...[['default', L.tDefault(course.tryNowDefault)], ['on', L.tOn], ['off', L.tOff]].map(([v, label]) => el('option', { value: v, selected: tn.mode === v, text: label })))),
      tn.mode === 'on' ? field(L.tLang, el('select', { onchange: (e) => { tn.language = e.target.value; } },
        ...data.languages.map((l) => el('option', { value: l.id, selected: tn.language === l.id, text: l.label })))) : null,
      tn.mode !== 'off' ? field(L.tCode, area(tn.code, (v) => { tn.code = v; }, { class: 'mono', spellcheck: 'false', rows: '6' })) : null);

    const qs = d.quiz.map((q, i) => el('div', { class: 'ed-item' },
      el('div', { class: 'ed-row' }, el('strong', { text: L.qLabel(num(i + 1)) }), el('button', { class: 'linkish small', type: 'button', onclick: () => { d.quiz.splice(i, 1); draw(); }, text: L.remove })),
      field(L.qPrompt, area(q.prompt, (v) => { q.prompt = v; }, { rows: '2' })),
      ...q.options.map((o, oi) => el('div', { class: 'ed-opt' },
        el('label', { class: 'small' }, el('input', { type: 'radio', name: `ans-${i}`, checked: q.answer === oi, onchange: () => { q.answer = oi; } }), ` ${L.qCorrect}`),
        input(o, (v) => { q.options[oi] = v; }, { placeholder: L.qOption(oi + 1), 'aria-label': L.qOption(oi + 1) }),
        q.options.length > 2 ? el('button', { class: 'linkish small', type: 'button', 'aria-label': L.remove, onclick: () => { q.options.splice(oi, 1); if (q.answer >= q.options.length) q.answer = 0; else if (q.answer > oi) q.answer -= 1; draw(); }, text: '✕' }) : null)),
      q.options.length < 6 ? el('button', { class: 'linkish small', type: 'button', onclick: () => { q.options.push(''); draw(); }, text: L.addO }) : null,
      field(L.qExpl, area(q.explanation, (v) => { q.explanation = v; }, { rows: '2' }))));

    box.replaceChildren(
      el('div', { class: 'card-head' }, el('h2', { text: L.editTitle }),
        el('span', { class: 'muted small', text: data.source === 'seed' ? L.fromSeed : data.updatedAt ? L.savedAt(new Date(data.updatedAt).toLocaleString()) : '' })),
      config.store === 'memory' ? el('p', { class: 'small warnline', text: L.lostWarn }) : null,
      el('h3', { text: L.materials }), ...mats,
      el('button', { class: 'btn ghost small', type: 'button', onclick: () => { d.materials.push({ title: '', url: '', code: '' }); draw(); }, text: L.addM }),
      el('h3', { text: L.tTitle }), tryBox,
      el('h3', { text: L.qTitle }), ...qs,
      el('button', { class: 'btn ghost small', type: 'button', onclick: () => { d.quiz.push({ prompt: '', options: ['', ''], answer: 0, explanation: '' }); draw(); }, text: L.addQ }),
      errorLine,
      el('div', { class: 'watch-actions', style: 'margin-top:14px' },
        el('button', { class: 'btn primary', type: 'button', onclick: save, text: L.save }),
        el('button', { class: 'btn ghost', type: 'button', onclick: () => onDone(false), text: L.cancel }),
        el('button', { class: 'linkish small', type: 'button', onclick: exportAll, text: L.export })));
  }

  async function save() {
    errorLine.textContent = '';
    try {
      await api('POST', `/api/videos/${encodeURIComponent(video.id)}/extras`, d, keyHeader());
      toast(L.saved);
      onDone(true);
    } catch (e) {
      errorLine.textContent = e.message;
    }
  }

  async function exportAll() {
    try {
      const all = await api('GET', '/api/instructor/video-extras', undefined, keyHeader());
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const a = el('a', { href: URL.createObjectURL(blob), download: `loop-logic-video-materials-${all.exportedAt.slice(0, 10)}.json` });
      document.body.append(a); a.click(); a.remove();
    } catch (e) { toast(e.message); }
  }

  draw();
  target.replaceChildren(box);
  box.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
