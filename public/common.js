// Shared page helpers: config, sign-in (Supabase mode), API calls, language.

const store = {
  get(k, area = 'local') { try { return (area === 'session' ? sessionStorage : localStorage).getItem(k); } catch { return null; } },
  set(k, v, area = 'local') { try { (area === 'session' ? sessionStorage : localStorage).setItem(k, v); } catch { /* unavailable */ } },
  del(k, area = 'local') { try { (area === 'session' ? sessionStorage : localStorage).removeItem(k); } catch { /* unavailable */ } },
};
export { store };

let config = null;
export async function getConfig() {
  if (!config) config = await fetch('/api/config').then((r) => r.json());
  return config;
}

export const getLang = () => store.get('ll_lang') ?? 'en';
export const setLang = (l) => store.set('ll_lang', l);

// After a Supabase redirect, tokens arrive in the URL hash (implicit flow).
function captureTokenFromHash() {
  if (!location.hash.includes('access_token=')) return;
  const params = new URLSearchParams(location.hash.slice(1));
  const token = params.get('access_token');
  if (token) store.set('ll_token', token, 'session');
  history.replaceState(null, '', location.pathname + location.search);
}
captureTokenFromHash();

export class ApiError extends Error {
  constructor(code, message, status) { super(message); this.code = code; this.status = status; }
}

export async function api(method, path, body, extraHeaders = {}) {
  const headers = { 'content-type': 'application/json', ...extraHeaders };
  const token = store.get('ll_token', 'session');
  if (token) headers.authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  } catch {
    throw new ApiError('network', getLang() === 'bn' ? 'সার্ভারে পৌঁছানো যায়নি। আবার চেষ্টা করো।' : 'Could not reach the server. Try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    store.del('ll_token', 'session');
    await showSignIn(data.error?.message);
    throw new ApiError('unauthenticated', data.error?.message ?? 'Sign in to continue.', 401);
  }
  if (!res.ok) throw new ApiError(data.error?.code ?? 'error', data.error?.message ?? res.statusText, res.status);
  return data;
}

/** In Supabase mode, make sure the learner is signed in before the page starts. */
export async function ensureSignedIn() {
  const cfg = await getConfig();
  if (cfg.authMode !== 'supabase') return;
  if (!store.get('ll_token', 'session')) await showSignIn();
}

async function showSignIn(message) {
  const cfg = await getConfig();
  if (cfg.authMode !== 'supabase' || document.getElementById('signin')) return new Promise(() => {});
  const bn = getLang() === 'bn';
  const box = document.createElement('div');
  box.id = 'signin';
  box.className = 'signin';
  box.innerHTML = `
    <div class="signin-card" role="dialog" aria-modal="true" aria-labelledby="signin-title">
      <h2 id="signin-title">${bn ? 'সাইন ইন করো' : 'Sign in to keep your progress'}</h2>
      <p class="muted" id="signin-msg"></p>
      <a class="primary block" id="google">${bn ? 'Google দিয়ে সাইন ইন' : 'Continue with Google'}</a>
      <form id="magic" class="magic">
        <label for="email">${bn ? 'অথবা ইমেইলে লিংক নাও' : 'Or get a sign-in link by email'}</label>
        <div class="row"><input id="email" type="email" required autocomplete="email"><button class="secondary" type="submit">${bn ? 'লিংক পাঠাও' : 'Send link'}</button></div>
      </form>
    </div>`;
  document.body.append(box);
  box.querySelector('#signin-msg').textContent = message ?? '';
  const redirect = location.origin + location.pathname + location.search;
  box.querySelector('#google').href = `${cfg.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}`;
  box.querySelector('#magic').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = box.querySelector('#email').value.trim();
    const res = await fetch(`${cfg.supabaseUrl}/auth/v1/otp?redirect_to=${encodeURIComponent(redirect)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: cfg.supabaseAnonKey },
      body: JSON.stringify({ email, create_user: true }),
    }).catch(() => null);
    box.querySelector('#signin-msg').textContent = res?.ok
      ? (bn ? 'ইমেইল দেখো: সাইন-ইন লিংক পাঠানো হয়েছে।' : 'Check your email for the sign-in link.')
      : (bn ? 'লিংক পাঠানো যায়নি। পরে আবার চেষ্টা করো।' : 'Could not send the link. Try again later.');
  });
  return new Promise(() => {}); // page waits until the redirect returns
}

export const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return node;
}

/** Shared app nav: marks the current page and wires the language button. */
export function mountNav(active, onLang) {
  const nav = document.getElementById('nav');
  const bn = getLang() === 'bn';
  if (nav) {
    const links = [
      ['dashboard', '/dashboard.html', bn ? 'ড্যাশবোর্ড' : 'Dashboard'],
      ['courses', '/courses.html', bn ? 'কোর্স' : 'Courses'],
      ['practice', '/practice.html', bn ? 'অনুশীলন' : 'Practice'],
      ['profile', '/profile.html', bn ? 'প্রোফাইল' : 'Profile'],
      ['instructor', '/instructor.html', bn ? 'শিক্ষক' : 'Instructor'],
    ];
    nav.replaceChildren(...links.map(([id, href, label]) => el('a', { href, class: id === active ? 'active' : '', 'aria-current': id === active ? 'page' : null, text: label })));
  }
  const brand = document.querySelector('.top .brand');
  if (brand && brand.tagName !== 'A') {
    const a = el('a', { href: '/', class: 'brand', 'aria-label': 'Loop & Logic home' });
    a.append(...brand.childNodes);
    brand.replaceWith(a);
  }
  const btn = document.getElementById('lang');
  if (btn && onLang) btn.onclick = async () => { setLang(getLang() === 'en' ? 'bn' : 'en'); mountNav(active, onLang); await onLang(getLang()); };
}

/** Fill every [data-i18n] element from a {key: text} dictionary. */
export function applyI18n(dict) {
  document.documentElement.lang = getLang();
  for (const node of document.querySelectorAll('[data-i18n]')) {
    const v = dict[node.dataset.i18n];
    if (typeof v === 'string') node.textContent = v;
  }
  for (const node of document.querySelectorAll('[data-i18n-placeholder]')) {
    const v = dict[node.dataset.i18nPlaceholder];
    if (typeof v === 'string') node.placeholder = v;
  }
}

export const digits = (v) => (getLang() === 'bn' ? String(v).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]) : String(v));
export const num = (n) => digits(Number(n).toLocaleString('en-US'));

export function ago(iso) {
  if (!iso) return '';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const bn = getLang() === 'bn';
  const [v, u] = s < 60 ? [0, 'now'] : s < 3600 ? [Math.round(s / 60), 'm'] : s < 86400 ? [Math.round(s / 3600), 'h'] : [Math.round(s / 86400), 'd'];
  if (u === 'now') return bn ? 'এইমাত্র' : 'just now';
  const word = { m: bn ? 'মিনিট' : 'min', h: bn ? 'ঘণ্টা' : 'h', d: bn ? 'দিন' : 'd' }[u];
  return bn ? `${digits(v)} ${word} আগে` : `${v} ${word} ago`;
}

export function toast(text) {
  const t = el('div', { class: 'toast', role: 'status', text });
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

export function errorBox(target, message, retry) {
  target.replaceChildren(el('div', { class: 'card empty' },
    el('h2', { text: getLang() === 'bn' ? 'লোড করা যায়নি' : 'Couldn’t load this' }),
    el('p', { text: message }),
    retry ? el('button', { class: 'btn secondary', type: 'button', text: getLang() === 'bn' ? 'আবার চেষ্টা' : 'Try again', onclick: retry }) : null));
}
