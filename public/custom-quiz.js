import { api, el, getLang, mountNav, ensureSignedIn, currentUser, showSignIn } from './common.js';
const T = {
  en: { title: 'Custom quiz', signIn: 'Sign in to open your assignment', submit: 'Check answers', back: 'My classes', score: (s, n) => `${s} of ${n} correct`, correct: 'Correct', wrong: 'Not quite', error: 'This assignment is not available to your account.', pick: 'Answer every question.' },
  bn: { title: 'নিজের তৈরি কুইজ', signIn: 'অ্যাসাইনমেন্ট খুলতে সাইন ইন করো', submit: 'উত্তর যাচাই করো', back: 'আমার ক্লাস', score: (s, n) => `${n}টির মধ্যে ${s}টি ঠিক`, correct: 'ঠিক হয়েছে', wrong: 'এবার ঠিক হয়নি', error: 'তোমার অ্যাকাউন্টে এই অ্যাসাইনমেন্ট খোলা যাচ্ছে না।', pick: 'সব প্রশ্নের উত্তর দাও।' },
};
const main = document.getElementById('main'), id = new URLSearchParams(location.search).get('id');
async function load() {
  const L = T[getLang()]; document.title = `${L.title} · Loop & Logic`;
  if (!currentUser()) { main.replaceChildren(el('button', { type: 'button', class: 'btn primary', text: L.signIn, onclick: () => showSignIn() })); return; }
  try {
    const d = await api('GET', `/api/custom-quizzes/${encodeURIComponent(id)}?lang=${getLang()}`); const answers = {};
    const fields = d.questions.map((q) => el('fieldset', { class: 'card' }, el('legend', { text: q.prompt }), ...q.options.map((o, i) => el('label', { class: 'opt' }, el('input', { type: 'radio', name: q.id, required: true, onchange: () => { answers[q.id] = i; } }), el('span', { text: o })))));
    const submit = el('button', { type: 'submit', class: 'btn primary', text: L.submit }), status = el('div', { role: 'status' });
    const form = el('form', {}, ...fields, submit, status);
    form.onsubmit = async (e) => { e.preventDefault(); if (Object.keys(answers).length !== d.questions.length) { status.textContent = L.pick; return; } submit.disabled = true; try { const r = await api('POST', `/api/custom-quizzes/${encodeURIComponent(id)}/grade`, { answers, lang: getLang() }); status.replaceChildren(el('h2', { text: L.score(r.score, r.total) }), ...d.questions.map((q) => el('p', { text: `${q.prompt}: ${r.results[q.id].correct ? L.correct : L.wrong} — ${r.results[q.id].explanation}` }))); } catch { status.textContent = L.error; } finally { submit.disabled = false; } };
    main.replaceChildren(el('h1', { text: d.title }), el('a', { href: '/dashboard.html#mc-h', text: L.back }), form);
  } catch { main.replaceChildren(el('p', { role: 'status', text: L.error })); }
}
await ensureSignedIn(); mountNav('dashboard', load); load();
