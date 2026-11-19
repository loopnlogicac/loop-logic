import { el, api, getLang } from './common.js';
import { renderFigure } from './lab-player.js';
export const adaptiveStrings = {
  en: { adaptive: 'Adaptive mode', normalQuiz: 'Normal mode', adaptiveTitle: 'Adaptive quiz', adaptiveHint: 'Correct answers move toward harder questions; mistakes move toward easier ones. When that level runs out, the closest remaining level is used.', adaptiveSubmit: 'Answer and continue', adaptivePick: 'Choose an answer first.', adaptiveError: 'Could not load the adaptive quiz. Try again.', adaptiveScore: (s, n) => `${s} of ${n} correct`, adaptivePath: 'Difficulty path', adaptiveLevels: { easy: 'Easy', medium: 'Medium', hard: 'Hard' }, adaptiveCorrect: 'Correct', adaptiveWrong: 'Not quite', adaptiveDone: 'Adaptive quiz complete' },
  bn: { adaptive: 'Adaptive mode', normalQuiz: 'সাধারণ মোড', adaptiveTitle: 'মানিয়ে নেওয়া কুইজ', adaptiveHint: 'ঠিক হলে কঠিনের দিকে, ভুল হলে সহজের দিকে যাবে। ওই স্তরের প্রশ্ন শেষ হলে কাছাকাছি স্তরের বাকি প্রশ্ন আসবে।', adaptiveSubmit: 'উত্তর দিয়ে এগোও', adaptivePick: 'আগে একটি উত্তর বেছে নাও।', adaptiveError: 'কুইজ আসেনি। আবার চেষ্টা করো।', adaptiveScore: (s, n) => `${n}টির মধ্যে ${s}টি ঠিক`, adaptivePath: 'প্রশ্নের কঠিনতার ধাপ', adaptiveLevels: { easy: 'সহজ', medium: 'মাঝারি', hard: 'কঠিন' }, adaptiveCorrect: 'ঠিক হয়েছে', adaptiveWrong: 'এবার ঠিক হয়নি', adaptiveDone: 'কুইজ শেষ হয়েছে' },
};
export function adaptiveQuiz(d, L, onMode) {
  const button = el('button', { type: 'button', class: 'btn secondary', text: L.adaptive });
  const panel = el('section', { class: 'card', hidden: true });
  const base = `/api/learn/${encodeURIComponent(d.track.id)}/${encodeURIComponent(d.topic.id)}/adaptive`;
  const render = (r) => {
    panel.replaceChildren(el('h3', { text: L.adaptiveTitle }), el('p', { text: L.adaptiveHint }), el('p', { text: L.adaptiveScore(r.score, r.answered) }));
    if (r.feedback) panel.append(el('p', { role: 'status', text: `${r.feedback.correct ? L.adaptiveCorrect : L.adaptiveWrong}: ${r.feedback.explanation}` }));
    if (r.difficultyPath.length) panel.append(el('p', { class: 'small', text: `${L.adaptivePath}: ${r.difficultyPath.map((v) => L.adaptiveLevels[v]).join(' → ')}` }));
    if (r.done) { panel.append(el('p', { text: L.adaptiveDone })); return; }
    const q = r.question; let choice = null;
    const submit = el('button', { type: 'submit', class: 'btn primary', text: L.adaptiveSubmit });
    const status = el('p', { role: 'status' });
    const form = el('form', {}, el('fieldset', { class: 'quiz-item' }, el('legend', { text: q.prompt }), el('span', { class: 'tag', text: L.adaptiveLevels[q.difficulty] }), q.figure ? renderFigure(q.figure) : null, q.code ? el('pre', {}, el('code', { text: q.code })) : null,
      ...q.options.map((o, i) => el('label', { class: 'opt' }, el('input', { type: 'radio', required: true, name: `adaptive-${q.id}`, onchange: () => { choice = i; } }), el('span', { text: o })))), submit, status);
    form.onsubmit = async (e) => {
      e.preventDefault(); if (choice === null) { status.textContent = L.adaptivePick; return; }
      submit.disabled = true;
      try { render(await api('POST', `${base}/answer`, { runId: r.runId, questionId: q.id, choice, lang: getLang() })); }
      catch { status.textContent = L.adaptiveError; submit.disabled = false; }
    };
    panel.append(form);
  };
  button.onclick = async () => {
    if (!panel.hidden) { panel.hidden = true; button.textContent = L.adaptive; onMode(false); return; }
    button.disabled = true;
    try { const r = await api('POST', base, { lang: getLang() }); panel.hidden = false; render(r); button.textContent = L.normalQuiz; onMode(true); }
    catch { panel.hidden = false; panel.replaceChildren(el('p', { role: 'status', text: L.adaptiveError })); }
    finally { button.disabled = false; }
  };
  return { button, panel };
}
