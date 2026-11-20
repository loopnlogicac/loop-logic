import { el, api, getLang } from './common.js';
import { renderFigure } from './lab-player.js';

export const masteryStrings = {
  en: { beforeCheck: 'Before you start (optional)', afterCheck: 'After the lesson: mastery check', startCheck: 'Start quick check', finishCheck: 'Check answers', checkScore: (s, n) => `${s} of ${n} correct`, checkGain: (a, b) => `You went from ${a}% to ${b}%`, checkHelp: 'Try this before reading to see what you already know. You can also go straight to the lesson.', checkAfterHelp: 'After reading, check what you learned. Questions differ from the before check as far as the quiz allows.', checksTitle: 'Before and after, by track', checksEmpty: 'Complete both checks on a topic to see your progress here.', checksError: 'Could not load your checks. Try again.', answerCheck: 'Answer every question.', checkTopics: (n) => `${n} topics`, checkRetry: 'Try again', checkClosed: 'The before check is closed.', checkPreOpen: 'Finish the before check above first.' },
  bn: { beforeCheck: 'শুরুর আগে (ইচ্ছা হলে)', afterCheck: 'পাঠের পরে: শেখা যাচাই', startCheck: 'ছোট চেক শুরু করো', finishCheck: 'উত্তর যাচাই করো', checkScore: (s, n) => `${n}টির মধ্যে ${s}টি ঠিক`, checkGain: (a, b) => `আগে ছিল ${a}%, এখন ${b}%`, checkHelp: 'পড়ার আগে কতটা জানো দেখে নাও। চাইলে সরাসরি পাঠও পড়তে পারো।', checkAfterHelp: 'পড়া শেষে কী শিখলে যাচাই করো। কুইজে যতটা সম্ভব, আগের চেকের থেকে আলাদা প্রশ্ন থাকবে।', checksTitle: 'ট্র্যাক অনুযায়ী আগে ও পরে', checksEmpty: 'অগ্রগতি দেখতে কোনো টপিকের দুই চেকই শেষ করো।', checksError: 'চেকের তথ্য আসেনি। আবার চেষ্টা করো।', answerCheck: 'সব প্রশ্নের উত্তর দাও।', checkTopics: (n) => `${n}টি টপিক`, checkRetry: 'আবার চেষ্টা করো', checkClosed: 'আগের চেক এখন বন্ধ।', checkPreOpen: 'আগে উপরের চেক শেষ করো।' },
};

export async function topicChecks(track, topic, L) {
  const base = `/api/learn/${encodeURIComponent(track)}/${encodeURIComponent(topic)}/checks`;
  const before = el('section', { class: 'tut-extra' });
  const after = el('section', { class: 'tut-extra' });
  const comparison = el('p', { class: 'callout tip', role: 'status' });
  let state;
  const refresh = (s) => {
    state = s;
    for (const [phase, box] of [['pre', before], ['post', after]]) {
      const a = state[phase];
      box.replaceChildren(el('h2', { text: phase === 'pre' ? L.beforeCheck : L.afterCheck }));
      if (a?.result) { box.append(el('p', { text: L.checkScore(a.result.score, a.result.total) })); continue; }
      if (!a && (phase === 'pre' && state.preClosed || phase === 'post' && state.pre && !state.pre.result)) { box.append(el('p', { text: phase === 'pre' ? L.checkClosed : L.checkPreOpen })); continue; }
      const status = el('p', { role: 'status' });
      if (a) {
        const chosen = {};
        const form = el('form', {}, ...a.questions.map((q, i) => el('fieldset', { class: 'quiz-item' }, el('legend', { text: `${i + 1}. ${q.prompt}` }), q.figure ? renderFigure(q.figure) : null, q.code ? el('pre', {}, el('code', { text: q.code })) : null,
          ...q.options.map((o, k) => el('label', { class: 'opt' }, el('input', { type: 'radio', name: `${phase}-${q.id}`, required: true, onchange: () => { chosen[q.id] = k; } }), el('span', { text: o }))))));
        const submit = el('button', { type: 'submit', class: 'btn primary', text: L.finishCheck });
        form.append(submit, status);
        form.onsubmit = async (e) => {
          e.preventDefault();
          if (Object.keys(chosen).length !== a.questions.length) { status.textContent = L.answerCheck; return; }
          submit.disabled = true;
          try { refresh(await api('POST', `${base}/${phase}/submit`, { answers: chosen, lang: getLang() })); }
          catch (err) { status.textContent = err.message; submit.disabled = false; }
        };
        box.append(form);
      } else {
        const start = el('button', { type: 'button', class: 'btn secondary', text: L.startCheck });
        start.onclick = async () => { start.disabled = true; try { refresh(await api('POST', `${base}/${phase}`, { lang: getLang() })); } catch (err) { status.textContent = err.message; start.disabled = false; } };
        box.append(el('p', { text: phase === 'pre' ? L.checkHelp : L.checkAfterHelp }), start, status);
      }
    }
    const pre = state.pre?.result, post = state.post?.result;
    comparison.hidden = !pre || !post;
    comparison.textContent = pre && post ? L.checkGain(Math.round(100 * pre.score / pre.total), Math.round(100 * post.score / post.total)) : '';
  };
  try { const s = await api('GET', `${base}?lang=${getLang()}`); if (!s.available) return { before: null, after: null }; refresh(s); }
  catch { before.replaceChildren(el('p', { text: L.checksError })); }
  return { before, after: el('div', {}, after, comparison) };
}

export function masteryDashboard(L) {
  const box = el('section', { class: 'card' }, el('h2', { text: L.checksTitle }));
  api('GET', `/api/my-mastery?lang=${getLang()}`).then(({ tracks }) => box.append(...(tracks.length ? tracks.map((r) => el('p', {}, el('a', { href: `/learn.html?track=${encodeURIComponent(r.track)}`, text: r.title }), el('span', { text: ` · ${L.checkGain(r.pre, r.post)} · ${L.checkTopics(r.topics)}` }))) : [el('p', { text: L.checksEmpty })]))).catch(() => box.append(el('p', { text: L.checksError })));
  return box;
}
