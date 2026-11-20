// Shared page helpers: config, sign-in (Supabase mode), API calls, language.
import { navLinks } from './nav-links.js';

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
function writeAuth(a) {
  const was = Boolean(readAuth()?.access_token);
  if (a) store.set(AUTH_KEY, JSON.stringify(a)); else store.del(AUTH_KEY);
  store.del('ll_token', 'session');
  // Tell the top bar when someone signs in or out, so Dashboard and Profile appear or go without a reload.
  if (was !== Boolean(a?.access_token) && typeof window !== 'undefined') window.dispatchEvent(new Event('ll-auth'));
}
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
  // Pages with private data start over; public pages just update the top bar.
  if (/\/(dashboard|profile|instructor|admin|buy|custom-quiz)\.html$/.test(location.pathname)) location.reload();
}

export class ApiError extends Error {
  constructor(code, message, status) { super(message); this.code = code; this.status = status; }
}

export async function api(method, path, body, extraHeaders = {}, format = 'json') {
  const headers = { 'content-type': 'application/json', ...extraHeaders };
  const token = await accessToken();
  if (token) headers.authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: 'same-origin' });
  } catch {
    throw new ApiError('network', getLang() === 'bn' ? 'সার্ভারে পৌঁছানো যায়নি। আবার চেষ্টা করো।' : 'Could not reach the server. Try again.', 0);
  }
  const data = res.ok && format === 'text' ? await res.text() : await res.json().catch(() => ({}));
  if (res.status === 401) {
    writeAuth(null);
    const cfg = await getConfig();
    if (cfg.authMode === 'hybrid' && token) return api(method, path, body, extraHeaders, format); // expired sign-in: carry on as a guest
    await showSignIn(data.error?.message);
    throw new ApiError('unauthenticated', data.error?.message ?? 'Sign in to continue.', 401);
  }
  if (!res.ok) throw new ApiError(data.error?.code ?? 'error', (getLang() === 'bn' && data.error?.bn) || data.error?.message || res.statusText, res.status);
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
  if (!currentUser()) actions.querySelector('.notice-menu')?.remove(); // signed out: no bell
  if (!cfg.supabaseUrl || cfg.authMode === 'anonymous') return;
  const user = currentUser();
  if (!user) { actions.insertBefore(el('button', { type: 'button', class: 'btn-signin acct', text: bn ? 'সাইন ইন' : 'Sign in', onclick: () => showSignIn() }), actions.querySelector('.btn-pro')); return; }
  const { mountNotices } = await import('./notices.js');
  mountNotices(actions);
  const initials = (user.name || user.email || '?').split(/[\s@.]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const menu = el('div', { class: 'acct-menu', hidden: true },
    el('div', { class: 'acct-who' }, el('strong', { text: user.name || (bn ? 'সাইন ইন করা আছে' : 'Signed in') }), el('span', { text: user.email ?? '' })),
    el('a', { href: '/dashboard.html', text: bn ? 'ড্যাশবোর্ড' : 'My dashboard' }),
    el('a', { href: '/profile.html', text: bn ? 'প্রোফাইল ও ডেটা' : 'Profile and data' }),
    el('a', { href: '/instructor.html', text: bn ? 'শিক্ষকের পাতা' : 'Instructor area' }),
    el('button', { type: 'button', text: bn ? 'সাইন আউট' : 'Sign out', onclick: () => signOut() }));
  api('GET', '/api/me').then((me) => {
    if (me.role === 'admin' && !menu.querySelector('.acct-admin')) menu.insertBefore(el('a', { class: 'acct-admin', href: '/admin.html', text: bn ? 'অ্যাডমিন' : 'Admin site' }), menu.querySelector('button'));
  }).catch(() => {});
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

/**
 * Dashboard and Profile opened while signed out (an old link or a bookmark): show a clear sign-in card
 * instead of an empty page. Returns true when the card was shown. Sites without sign-in are left alone.
 */
export async function signInGate(container, title) {
  const cfg = await getConfig().catch(() => ({}));
  if (!cfg.supabaseUrl || cfg.authMode === 'anonymous' || currentUser()) return false;
  const bn = getLang() === 'bn';
  document.title = `${title} · Loop & Logic`;
  container.replaceChildren(el('section', { class: 'card signin-gate' },
    el('h1', { text: title }),
    el('p', { class: 'muted', text: bn ? 'তোমার অগ্রগতি, কুইজের নম্বর, ক্লাস আর কেনা কোর্স তোমার অ্যাকাউন্টে জমা থাকে।' : 'Your progress, quiz scores, classes and purchases are saved to your account.' }),
    el('button', { type: 'button', class: 'btn primary', text: bn ? 'সাইন ইন করো' : 'Sign in', onclick: () => showSignIn() })));
  return true;
}

/** Shared app nav: marks the current page and wires the language button. */
let navActive = '';
let navAuthMode;
let navWired = false;
function drawNavLinks() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const bn = getLang() === 'bn';
  nav.setAttribute('aria-label', bn ? 'প্রধান মেনু' : 'Main');
  nav.replaceChildren(...navLinks({ signedIn: Boolean(currentUser()), authMode: navAuthMode, lang: bn ? 'bn' : 'en' }).map(({ id, href, label }) =>
    el('a', { href, class: id === navActive ? 'active' : '', 'aria-current': id === navActive ? 'page' : null, text: label })));
  const toggle = document.querySelector('.top .nav-toggle');
  if (toggle) toggle.setAttribute('aria-label', bn ? 'মেনু' : 'Menu');
}
function wireNavMenu(nav) {
  const top = nav.closest('.top');
  if (!top || top.querySelector('.nav-toggle')) return;
  const toggle = el('button', { type: 'button', class: 'nav-toggle', 'aria-controls': 'nav', 'aria-expanded': 'false', 'aria-label': 'Menu', text: '☰' });
  const setOpen = (open) => { top.classList.toggle('nav-open', open); toggle.setAttribute('aria-expanded', String(open)); };
  toggle.onclick = () => setOpen(!top.classList.contains('nav-open'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && top.classList.contains('nav-open')) { setOpen(false); toggle.focus(); } });
  nav.before(toggle);
}
export function mountNav(active, onLang) {
  const nav = document.getElementById('nav');
  const bn = getLang() === 'bn';
  navActive = active;
  if (nav) {
    wireNavMenu(nav);
    drawNavLinks();
    if (navAuthMode === undefined) getConfig().then((cfg) => { navAuthMode = cfg.authMode ?? 'hybrid'; drawNavLinks(); }).catch(() => {});
  }
  if (!navWired) {
    navWired = true;
    const refresh = () => {
      drawNavLinks();
      const actions = document.querySelector('.top .top-actions');
      if (actions) mountAccount(actions, getLang() === 'bn');
    };
    window.addEventListener('ll-auth', refresh);
    window.addEventListener('storage', (e) => { if (e.key === AUTH_KEY) refresh(); }); // signed in or out in another tab
  }
  const brand = document.querySelector('.top .brand');
  if (brand && brand.tagName !== 'A') {
    const a = el('a', { href: '/', class: 'brand', 'aria-label': 'Loop & Logic home' });
    a.append(...brand.childNodes);
    brand.replaceWith(a);
  }
  const actions = document.querySelector('.top .top-actions');
  if (actions && !actions.querySelector('.top-search')) {
    actions.prepend(searchBox(bn));
    if (active !== 'pricing') actions.append(el('a', { class: 'btn-pro', href: '/pricing.html', text: bn ? 'প্রো নাও' : 'Go Pro' }));
  } else if (actions) {
    const input = actions.querySelector('.top-search input');
    if (input) { input.placeholder = searchHint(bn); input.setAttribute('aria-label', bn ? 'পুরো সাইটে খোঁজো' : 'Search the whole site'); }
    const pro = actions.querySelector('.btn-pro');
    if (pro) pro.textContent = bn ? 'প্রো নাও' : 'Go Pro';
  }
  if (actions) mountAccount(actions, bn);
  mountAnnouncement(active);
  mountAds();
  const authErr = store.get('ll_auth_error', 'session');
  if (authErr) { store.del('ll_auth_error', 'session'); setTimeout(() => toast(authErr), 300); }
  const btn = document.getElementById('lang');
  if (btn && onLang) btn.onclick = async () => { setLang(getLang() === 'en' ? 'bn' : 'en'); mountNav(active, onLang); await onLang(getLang()); };
}

const searchHint = (bn) => (bn ? 'খোঁজো: পয়েন্টার, লুপ, ভিডিও…' : 'Search topics, videos, labs…');
const HIT_ICON = { topic: '📘', lab: '🧪', course: '🎓', video: '▶', post: '📰' };

/** Top-bar search: suggestions while typing (topics, videos, labs, courses, posts); Enter opens the results page. */
function searchBox(bn) {
  const input = el('input', { type: 'search', name: 'q', autocomplete: 'off', placeholder: searchHint(bn), 'aria-label': bn ? 'পুরো সাইটে খোঁজো' : 'Search the whole site', role: 'combobox', 'aria-expanded': 'false', 'aria-controls': 'top-search-list', 'aria-autocomplete': 'list' });
  const list = el('div', { class: 'ts-list', id: 'top-search-list', role: 'listbox', hidden: true });
  const form = el('form', { class: 'top-search', role: 'search', action: '/search.html', method: 'get' });
  form.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c6b67" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  form.append(input, list);
  let timer = 0, seq = 0, active = -1;
  const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; };
  const items = () => [...list.querySelectorAll('a.ts-item')];
  const mark = (i) => { const all = items(); active = (i + all.length) % all.length; all.forEach((a, k) => a.setAttribute('aria-selected', k === active ? 'true' : 'false')); all[active]?.scrollIntoView({ block: 'nearest' }); };
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 2 && q.toLowerCase() !== 'c') return close();
    timer = setTimeout(async () => {
      const mine = ++seq;
      try {
        const r = await fetch(`/api/search?suggest=1&lang=${getLang()}&q=${encodeURIComponent(q)}`).then((x) => x.json());
        if (mine !== seq) return;
        const hits = r.groups?.[0]?.hits ?? [];
        const bnNow = getLang() === 'bn';
        list.replaceChildren(
          ...hits.map((h) => el('a', { class: 'ts-item', href: h.href, role: 'option', 'aria-selected': 'false' }, el('span', { class: 'ts-ico', 'aria-hidden': 'true', text: HIT_ICON[h.type] ?? '•' }), el('span', { class: 'ts-text' }, el('strong', { text: h.title }), el('small', { text: h.subtitle })))),
          el('a', { class: 'ts-all', href: `/search.html?q=${encodeURIComponent(q)}`, text: hits.length ? (bnNow ? `"${q}"-এর সব ফল দেখো →` : `See all results for "${q}" →`) : (bnNow ? `"${q}" পাওয়া যায়নি। অন্যভাবে খোঁজো →` : `Nothing for "${q}" yet. Search all →`) }));
        list.hidden = false; input.setAttribute('aria-expanded', 'true'); active = -1;
      } catch { close(); }
    }, 180);
  });
  input.addEventListener('keydown', (e) => {
    if (list.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); mark(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mark(active - 1); }
    else if (e.key === 'Escape') close();
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); location.href = items()[active].href; }
  });
  input.addEventListener('blur', () => setTimeout(() => { close(); if (!input.value.trim()) form.classList.remove('open'); }, 150));
  // phones: a search icon that opens into a full-width box
  form.addEventListener('click', () => { if (!form.classList.contains('open')) { form.classList.add('open'); input.focus(); } });
  input.addEventListener('focus', () => form.classList.add('open'));
  form.addEventListener('submit', (e) => { if (!input.value.trim()) e.preventDefault(); });
  // "/" focuses search from anywhere (not while typing in a field)
  if (!window.__llSlash) {
    window.__llSlash = true;
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const box = document.querySelector('.top-search input');
      if (box) { e.preventDefault(); box.focus(); }
    });
  }
  return form;
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


// ── announcement bar, page key and ad spots (all set from the admin site) ──

/** Which page this is, for page-specific ads: "home", "learn/<track>/<topic>", "course/<id>", "pricing"… */
export function pageKey() {
  const p = location.pathname.replace(/\/+$/, '') || '/';
  const q = new URLSearchParams(location.search);
  const parts = (...xs) => xs.filter(Boolean).map((x) => String(x).toLowerCase().replace(/[^a-z0-9_-]/g, '')).join('/');
  if (p === '/' || p === '/index.html') return 'home';
  if (p === '/learn.html') return parts('learn', q.get('track'), q.get('topic'));
  if (p === '/course.html') return parts('course', q.get('id'));
  if (p === '/watch.html') return parts('course', q.get('course'), 'watch');
  if (p === '/courses.html') return 'course';
  if (p === '/lab.html') return parts('labs', q.get('id'));
  if (p === '/post.html') return parts('blog', q.get('slug'));
  if (p === '/blog.html') return 'blog';
  return parts(p.replace(/^\//, '').replace(/\.html$/, '')) || 'home';
}

let siteInfo = null;
export async function getSite() {
  siteInfo ??= fetch(`/api/site?lang=${getLang()}`).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));
  return siteInfo;
}

const X_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

async function mountAnnouncement(active) {
  document.getElementById('promo-bar')?.remove();
  siteInfo = null; // language may have changed
  const site = await getSite();
  const a = site.announcement;
  if (!a || (!a.everyPage && active !== 'home') || store.get('ll_ann_closed') === a.version) return;
  const bn = getLang() === 'bn';
  let text = a.text;
  if (/\{(topics|labs)\}/.test(text)) {
    const totals = await fetch(`/api/learn?lang=${getLang()}`).then((r) => r.json()).then((d) => d.totals).catch(() => null);
    if (!totals) return;
    text = text.replace('{topics}', num(totals.topics)).replace('{labs}', num(totals.labs));
  }
  const close = el('button', { type: 'button', class: 'promo-x', 'aria-label': bn ? 'ঘোষণা বন্ধ করো' : 'Close announcement', onclick: () => { store.set('ll_ann_closed', a.version); bar.remove(); } });
  close.innerHTML = X_ICON;
  const bar = el('div', { id: 'promo-bar', class: 'promo', role: 'region', 'aria-label': bn ? 'ঘোষণা' : 'Announcement' },
    el('span', { class: 'promo-new', text: bn ? 'নতুন' : 'NEW' }), el('span', { text }), a.href && a.linkText ? el('a', { href: a.href, text: a.linkText }) : null, close);
  const old = document.getElementById('promo');
  if (old) old.replaceChildren(bar); else document.body.prepend(bar);
}

const adClosed = (ad) => {
  const at = Number(store.get(`ll_ad_${ad.id}`) ?? 0);
  return at && (ad.reshowDays === 0 || Date.now() - at < ad.reshowDays * 86_400_000);
};
const adEvent = (id, type) => fetch(`/api/ads/${encodeURIComponent(id)}/event`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type }), keepalive: true }).catch(() => {});

function adCard(ad, place) {
  const bn = getLang() === 'bn';
  const box = el('aside', { class: `ad ad-${place} ad-${ad.theme}`, 'aria-label': bn ? 'বিজ্ঞাপন' : 'Advertisement' });
  const close = el('button', { type: 'button', class: 'ad-x', 'aria-label': bn ? 'বিজ্ঞাপন বন্ধ করো' : 'Close ad', onclick: () => { store.set(`ll_ad_${ad.id}`, String(Date.now())); adEvent(ad.id, 'close'); box.remove(); } });
  close.innerHTML = X_ICON;
  box.append(el('span', { class: 'ad-tag', text: bn ? 'বিজ্ঞাপন' : 'AD' }), el('strong', { class: 'ad-head', text: ad.head }),
    el('a', { class: 'ad-cta', href: ad.href, text: ad.cta, onclick: () => adEvent(ad.id, 'click') }), close);
  adEvent(ad.id, 'view');
  return box;
}

let adsPromise = null;
/** Fills the page's ad spots: a bar under the main bar, and #ad-inline, #ad-side, #ad-video when the page has them. */
export async function mountAds() {
  document.querySelectorAll('.ad').forEach((n) => n.remove());
  adsPromise = api('GET', `/api/ads?page=${encodeURIComponent(pageKey())}&lang=${getLang()}`).catch(() => null);
  const ads = await adsPromise;
  if (!ads) return;
  const top = document.querySelector('header.top');
  if (ads.top && top && !adClosed(ads.top)) top.after(adCard(ads.top, 'top'));
  fillAdSlots();
}
/** Pages that draw their ad slots later call this after rendering. */
export async function fillAdSlots() {
  const ads = await (adsPromise ?? Promise.resolve(null));
  if (!ads) return;
  for (const place of ['inline', 'side', 'video']) {
    const slot = document.getElementById(`ad-${place}`);
    if (ads[place] && slot && !slot.firstChild && !adClosed(ads[place])) slot.append(adCard(ads[place], place));
  }
}
