import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { navLinks } from '../public/nav-links.js';
import { courseAccess, paidCourses } from '../public/course-access.js';
import { TutorialService } from '../src/app/tutorials.ts';
import { MemoryStore } from '../src/store/store.ts';
import { SearchService } from '../src/app/search.ts';
import { pageMeta, injectHead, sitemapXml } from '../src/server/seo.ts';

const root = join(import.meta.dirname, '..');
const ids = (o: Parameters<typeof navLinks>[0]) => navLinks(o).map((l) => l.id);

test('top bar: four links for everyone, Dashboard and Profile only for signed-in students', () => {
  assert.deepEqual(ids({ signedIn: false, authMode: 'hybrid' }), ['home', 'courses', 'paid', 'blog']);
  assert.deepEqual(ids({ signedIn: true, authMode: 'hybrid' }), ['home', 'courses', 'paid', 'blog', 'dashboard', 'profile']);
  assert.deepEqual(ids({ signedIn: true, authMode: 'supabase' }), ['home', 'courses', 'paid', 'blog', 'dashboard', 'profile']);
  assert.deepEqual(ids({ signedIn: true, authMode: 'anonymous' }), ['home', 'courses', 'paid', 'blog'], 'no sign-in on the site: no personal links');
  assert.deepEqual(ids({ signedIn: true }), ['home', 'courses', 'paid', 'blog', 'dashboard', 'profile'], 'before the config arrives');
  const bn = navLinks({ signedIn: true, authMode: 'hybrid', lang: 'bn' });
  assert.ok(bn.every((l) => /[ঀ-৿]/.test(l.label)), 'every label has Bangla');
  assert.deepEqual(navLinks({ signedIn: false, authMode: 'hybrid' }).map((l) => l.href), ['/', '/courses.html', '/paid-courses.html', '/blog.html']);
});

test('one paid-course rule: Free, the price, or PRO when a paid course has no price', () => {
  assert.deepEqual(courseAccess({ access: 'free' }), { paid: false, price: null, label: 'Free' });
  assert.equal(courseAccess({ access: 'free' }, 'bn').label, 'ফ্রি');
  assert.deepEqual(courseAccess({ access: 'paid', price: '৳ 499' }), { paid: true, price: '৳ 499', label: '৳ 499' });
  assert.deepEqual(courseAccess({ access: 'paid', price: null }), { paid: true, price: null, label: 'PRO' });
  assert.deepEqual(courseAccess({ access: 'paid', price: '  ' }), { paid: true, price: null, label: 'PRO' });
  assert.deepEqual(courseAccess({}), { paid: false, price: null, label: 'Free' });
  assert.deepEqual(courseAccess(undefined), { paid: false, price: null, label: 'Free' });
  assert.deepEqual(paidCourses([{ id: 'a', access: 'free' }, { id: 'b', access: 'paid' }, { id: 'c' }]).map((c: any) => c.id), ['b']);
  assert.deepEqual(paidCourses(undefined), []);
});

test('Paid courses page: own title, canonical, in the sitemap; dashboard and profile stay noindex', () => {
  const tut = new TutorialService(new MemoryStore(), join(root, 'content-kit'));
  const deps = { tutorials: tut, search: new SearchService(tut, undefined, { ttlMs: 0 }) };
  const html = readFileSync(join(root, 'public', 'paid-courses.html'), 'utf8');
  assert.match(html, /src="\/paid-courses\.js"/);
  const out = injectHead(html, pageMeta('/paid-courses.html', new URLSearchParams(), 'https://x.test', deps));
  assert.match(out, /<title>Paid courses · Loop &amp; Logic<\/title>/);
  assert.match(out, /<link rel="canonical" href="https:\/\/x\.test\/paid-courses\.html">/);
  assert.match(sitemapXml('https://x.test', deps), /<loc>https:\/\/x\.test\/paid-courses\.html<\/loc>/);
  for (const page of ['/dashboard.html', '/profile.html']) assert.match(injectHead(html, pageMeta(page, new URLSearchParams(), 'https://x.test', deps)), /noindex, nofollow/);
});

test('every page with a top bar gets the shared nav, and the new page has no inline script', () => {
  const html = readFileSync(join(root, 'public', 'paid-courses.html'), 'utf8');
  assert.match(html, /<nav id="nav" class="nav"/);
  assert.ok(!/<script>(?!<\/script>)/.test(html) && !/\son[a-z]+="/.test(html));
});
