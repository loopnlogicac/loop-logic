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

// ── sign-in (Supabase Auth) ──
// Tokens live in localStorage so a sign-in survives closing the tab; the access token
// (1 hour) is refreshed with the refresh token shortly before it expires.
const AUTH_KEY = 'll_auth';
function readAuth() { try { return JSON.parse(store.get(AUTH_KEY) ?? 'null'); } catch { return null; } }
function writeAuth(a) { if (a) store.set(AUTH_KEY, JSON.stringify(a)); else store.del(AUTH_KEY); store.del('ll_token', 'session'); }
function jwtClaims(token) { try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return {}; } }
export function currentUser() {
  const a = readAuth();
  if (!a?.access_token) return null;
  const c = jwtClaims(a.access_token);
  return { email: c.email ?? a.email ?? null, name: c.user_metadata?.full_name ?? c.user_metadata?.name ?? null, avatar: c.user_metadata?.avatar_url ?? null };
}

// After a Supabase redirect, tokens arrive in the URL hash (implicit flow).
function captureTokenFromHash() {
  if (!location.hash.includes('access_token=')) {
    if (location.hash.includes('error_description=')) { const p = new URLSearchParams(location.hash.slice(1)); store.set('ll_auth_error', p.get('error_description') ?? 'Sign-in failed', 'session'); history.replaceState(null, '', location.pathname + location.search); }
    return;
  }
  const p = new URLSearchParams(location.hash.slice(1));
  const access = p.get('access_token');
  if (access) {
    writeAuth({ access_token: access, refresh_token: p.get('refresh_token'), expires_at: Date.now() + Number(p.get('expires_in') ?? 3600) * 1000 });
    store.set('ll_claim', '1');
  }
  history.replaceState(null, '', location.pathname + location.search);
}
captureTokenFromHash();

let refreshing = null;
async function accessToken() {
  const a = readAuth();
  if (!a?.access_token) return null;
  if (a.expires_at && a.expires_at - Date.now() > 60_000) return a.access_token;
  if (!a.refresh_token) return a.access_token;
  refreshing ??= (async () => {
    const cfg = await getConfig();
    if (!cfg.supabaseUrl) return null;
    const r = await fetch(`${cfg.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: { 'content-type': 'application/json', apikey: cfg.supabaseAnonKey }, body: JSON.stringify({ refresh_token: a.refresh_token }) }).catch(() => null);
    if (!r?.ok) { writeAuth(null); return null; }
    const d = await r.json();
    writeAuth({ access_token: d.access_token, refresh_token: d.refresh_token, expires_at: Date.now() + Number(d.expires_in ?? 3600) * 1000 });
    return d.access_token;
  })().finally(() => { refreshing = null; });
  return refreshing;
}

export async function signOut() {
  const cfg = await getConfig();
  const token = readAuth()?.access_token;
  if (token && cfg.supabaseUrl) await fetch(`${cfg.supabaseUrl}/auth/v1/logout`, { method: 'POST', headers: { apikey: cfg.supabaseAnonKey, authorization: `Bearer ${token}` } }).catch(() => {});
  writeAuth(null);
  location.reload();
}

export class ApiError extends Error {
  constructor(code, message, status) { super(message); this.code = code; this.status = status; }
}

export async function api(method, path, body, extraHeaders = {}) {
  const headers = { 'content-type': 'application/json', ...extraHeaders };
  const token = await accessToken();
  if (token) headers.authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  } catch {
    throw new ApiError('network', getLang() === 'bn' ? 'সার্ভারে পৌঁছানো যায়নি। আবার চেষ্টা করো।' : 'Could not reach the server. Try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    writeAuth(null);
    const cfg = await getConfig();
    if (cfg.authMode === 'hybrid' && token) return api(method, path, body, extraHeaders); // expired sign-in: carry on as a guest
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
  if (!readAuth()?.access_token) await showSignIn();
}

export async function showSignIn(message) {
  const cfg = await getConfig();
  if (cfg.authMode === 'anonymous' || !cfg.supabaseUrl || document.getElementById('signin')) return;
  const required = cfg.authMode === 'supabase';
  const bn = getLang() === 'bn';
  const settings = await fetch(`${cfg.supabaseUrl}/auth/v1/settings`, { headers: { apikey: cfg.supabaseAnonKey } }).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  const google = Boolean(settings.external?.google);
  const redirect = location.origin + location.pathname + location.search;
  const msg = el('p', { class: 'muted', id: 'signin-msg', 'aria-live': 'polite', text: message ?? '' });
  const email = el('input', { id: 'email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@example.com' });
  const send = el('button', { class: 'btn primary', type: 'submit', text: bn ? 'লিংক পাঠাও' : 'Send link' });
  const form = el('form', { class: 'magic' }, el('label', { for: 'email', text: google ? (bn ? 'অথবা ইমেইলে সাইন-ইন লিংক নাও' : 'Or get a sign-in link by email') : (bn ? 'ইমেইলে সাইন-ইন লিংক নাও' : 'Get a sign-in link by email') }), el('div', { class: 'row' }, email, send));
  form.onsubmit = async (e) => {
    e.preventDefault();
    send.disabled = true;
    const res = await fetch(`${cfg.supabaseUrl}/auth/v1/otp?redirect_to=${encodeURIComponent(redirect)}`, { method: 'POST', headers: { 'content-type': 'application/json', apikey: cfg.supabaseAnonKey }, body: JSON.stringify({ email: email.value.trim(), create_user: true }) }).catch(() => null);
    const err = res && !res.ok ? await res.json().catch(() => ({})) : null;
    msg.textContent = res?.ok ? (bn ? 'ইমেইল দেখো: সাইন-ইন লিংক পাঠানো হয়েছে। লিংকে ক্লিক করলেই সাইন ইন হবে।' : 'Check your email and click the link to sign in. You can close this box.')
      : res?.status === 429 ? (bn ? 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করো।' : 'Too many sign-in emails right now. Please try again in a little while.')
      : (err?.msg || err?.error_description || (bn ? 'লিংক পাঠানো যায়নি। পরে আবার চেষ্টা করো।' : 'Could not send the link. Try again later.'));
    send.disabled = false;
  };
  const close = required ? null : el('button', { type: 'button', class: 'signin-x', 'aria-label': bn ? 'বন্ধ করো' : 'Close', text: '×', onclick: () => box.remove() });
  const card = el('div', { class: 'signin-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'signin-title' },
    close,
    el('h2', { id: 'signin-title', text: bn ? 'সাইন ইন করো' : 'Sign in to Loop & Logic' }),
    el('p', { class: 'muted', text: bn ? 'সাইন ইন করলে তোমার অগ্রগতি, কুইজ আর ভিডিও দেখার হিসাব সব ডিভাইসে থাকবে। সাইন ইন ছাড়াও শেখা যায়।' : 'Signing in keeps your progress, quiz scores and watched videos on every device. You can also keep learning without an account.' }),
    google ? el('a', { class: 'btn google', href: `${cfg.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirect)}` }, el('span', { class: 'g', 'aria-hidden': 'true', text: 'G' }), bn ? 'Google দিয়ে চালিয়ে যাও' : 'Continue with Google') : null,
    form, msg);
  const box = el('div', { id: 'signin', class: 'signin', onclick: (e) => { if (!required && e.target === box) box.remove(); } }, card);
  document.body.append(box);
  if (!required) document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', esc); } });
  (google ? card.querySelector('.google') : email).focus();
  if (required) return new Promise(() => {}); // page waits until the redirect returns
}

/** Header account control: "Sign in" for guests, an account menu when signed in. */
async function mountAccount(actions, bn) {
  const cfg = await getConfig().catch(() => ({}));
  actions.querySelector('.acct')?.remove();
  if (!cfg.supabaseUrl || cfg.authMode === 'anonymous') return;
  const user = currentUser();
  if (!user) { actions.insertBefore(el('button', { type: 'button', class: 'btn-signin acct', text: bn ? 'সাইন ইন' : 'Sign in', onclick: () => showSignIn() }), actions.querySelector('.btn-pro')); return; }
  const initials = (user.name || user.email || '?').split(/[\s@.]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const menu = el('div', { class: 'acct-menu', hidden: true },
    el('div', { class: 'acct-who' }, el('strong', { text: user.name || (bn ? 'সাইন ইন করা আছে' : 'Signed in') }), el('span', { text: user.email ?? '' })),
    el('a', { href: '/dashboard.html', text: bn ? 'ড্যাশবোর্ড' : 'My dashboard' }),
    el('a', { href: '/profile.html', text: bn ? 'প্রোফাইল ও ডেটা' : 'Profile and data' }),
    el('a', { href: '/instructor.html', text: bn ? 'শিক্ষকের পাতা' : 'Instructor area' }),
    el('button', { type: 'button', text: bn ? 'সাইন আউট' : 'Sign out', onclick: () => signOut() }));
  const btn = el('button', { type: 'button', class: 'acct-btn', 'aria-haspopup': 'true', 'aria-expanded': 'false', 'aria-label': bn ? 'তোমার অ্যাকাউন্ট' : 'Your account', text: initials,
    onclick: (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute('aria-expanded', String(!menu.hidden)); } });
  document.addEventListener('click', () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); });
  actions.append(el('div', { class: 'acct' }, btn, menu));
  if (store.get('ll_claim') === '1') { store.del('ll_claim'); api('POST', '/api/auth/claim').then((r) => { if (r.moved) toast(bn ? 'আগের অগ্রগতি তোমার অ্যাকাউন্টে যোগ হয়েছে।' : 'Your earlier progress was added to your account.'); }).catch(() => {}); }
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
      ['learn', '/learn.html', bn ? 'টিউটোরিয়াল' : 'Tutorials'],
      ['pricing', '/pricing.html', bn ? 'মূল্য' : 'Pricing'],
      ['practice', '/practice.html', bn ? 'অনুশীলন' : 'Practice'],
      ['profile', '/profile.html', bn ? 'প্রোফাইল' : 'Profile'],
    ];
    nav.replaceChildren(...links.map(([id, href, label]) => el('a', { href, class: id === active ? 'active' : '', 'aria-current': id === active ? 'page' : null, text: label })));
  }
  const brand = document.querySelector('.top .brand');
  if (brand && brand.tagName !== 'A') {
    const a = el('a', { href: '/', class: 'brand', 'aria-label': 'Loop & Logic home' });
    a.append(...brand.childNodes);
    brand.replaceWith(a);
  }
  const actions = document.querySelector('.top .top-actions');
  if (actions && !actions.querySelector('.top-search')) {
    const input = el('input', { type: 'search', name: 'q', placeholder: bn ? 'খোঁজো: পয়েন্টার, লুপ…' : 'Search: pointers, for loop…', 'aria-label': bn ? 'টিউটোরিয়াল খোঁজো' : 'Search tutorials' });
    const form = el('form', { class: 'top-search', role: 'search', action: '/learn.html', method: 'get' });
    form.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c6b67" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    form.append(input);
    actions.prepend(form);
    if (active !== 'pricing') actions.append(el('a', { class: 'btn-pro', href: '/pricing.html', text: bn ? 'প্রো নাও' : 'Go Pro' }));
  } else if (actions) {
    const input = actions.querySelector('.top-search input');
    if (input) { input.placeholder = bn ? 'খোঁজো: পয়েন্টার, লুপ…' : 'Search: pointers, for loop…'; }
    const pro = actions.querySelector('.btn-pro');
    if (pro) pro.textContent = bn ? 'প্রো নাও' : 'Go Pro';
  }
  if (actions) mountAccount(actions, bn);
  const authErr = store.get('ll_auth_error', 'session');
  if (authErr) { store.del('ll_auth_error', 'session'); setTimeout(() => toast(authErr), 300); }
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
