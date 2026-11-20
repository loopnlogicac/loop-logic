import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { navLinks } from '../web/nav-links.js';
import { courseAccess, paidCourses } from '../web/course-access.js';
import { TutorialService } from '../src/app/tutorials.ts';
import { MemoryStore } from '../src/store/store.ts';
import { SearchService } from '../src/app/search.ts';
import { pageMeta, injectHead, sitemapXml } from '../src/server/seo.ts';

const root = join(import.meta.dirname, '..');
const ids = (o: Parameters<typeof navLinks>[0]) => navLinks(o).map((l) => l.id);

test('top bar: six links for everyone, My learning only for signed-in students', () => {
  const all = ['home', 'learn', 'courses', 'office', 'paid', 'blog'];
  assert.deepEqual(ids({ signedIn: false, authMode: 'hybrid' }), all);
  assert.deepEqual(ids({ signedIn: true, authMode: 'hybrid' }), [...all, 'dashboard']);
  assert.deepEqual(ids({ signedIn: true, authMode: 'supabase' }), [...all, 'dashboard']);
  assert.deepEqual(ids({ signedIn: true, authMode: 'anonymous' }), all, 'no sign-in on the site: no personal links');
  assert.deepEqual(ids({ signedIn: true }), [...all, 'dashboard'], 'before the config arrives');
  assert.deepEqual(navLinks({ signedIn: true, authMode: 'hybrid' }).map((l) => l.label), ['Home', 'Tutorials', 'Courses', 'Virtual Office', 'Premium', 'Blog', 'My learning']);
  const bn = navLinks({ signedIn: true, authMode: 'hybrid', lang: 'bn' });
  assert.ok(bn.every((l) => /[ঀ-৿]/.test(l.label)), 'every label has Bangla');
  assert.deepEqual(navLinks({ signedIn: false, authMode: 'hybrid' }).map((l) => l.href), ['/', '/learn.html', '/courses.html', '/office.html', '/paid-courses.html', '/blog.html']);
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

test('Premium courses page: own title, canonical, in the sitemap; dashboard and profile stay noindex', () => {
  const tut = new TutorialService(new MemoryStore(), join(root, 'content-kit'));
  const deps = { tutorials: tut, search: new SearchService(tut, undefined, { ttlMs: 0 }) };
  const html = readFileSync(join(root, 'web', 'paid-courses.html'), 'utf8');
  assert.match(html, /src="\/paid-courses\.js"/);
  const out = injectHead(html, pageMeta('/paid-courses.html', new URLSearchParams(), 'https://x.test', deps));
  assert.match(out, /<title>Premium courses · Loop &amp; Logic<\/title>/);
  assert.match(out, /<link rel="canonical" href="https:\/\/x\.test\/paid-courses\.html">/);
  assert.match(sitemapXml('https://x.test', deps), /<loc>https:\/\/x\.test\/paid-courses\.html<\/loc>/);
  for (const page of ['/dashboard.html', '/profile.html']) assert.match(injectHead(html, pageMeta(page, new URLSearchParams(), 'https://x.test', deps)), /noindex, nofollow/);
});

test('every page with a top bar gets the shared nav, and the new page has no inline script', () => {
  const html = readFileSync(join(root, 'web', 'paid-courses.html'), 'utf8');
  assert.match(html, /<nav id="nav" class="nav"/);
  assert.ok(!/<script>(?!<\/script>)/.test(html) && !/\son[a-z]+="/.test(html));
});

test('pages are served by the app with versioned scripts and styles, so a deploy shows at once', async () => {
  const { createApp, versionAssets } = await import('../src/server/app.ts');
  const { MemoryStore } = await import('../src/store/store.ts');
  const { TutorialService } = await import('../src/app/tutorials.ts');
  assert.equal(versionAssets('<link rel="stylesheet" href="/styles.css"><script type="module" src="/learn.js"></script><link href="https://fonts.googleapis.com/x.css"><script src="//cdn.example/x.js"></script><a href="/learn.html">', 'b1'),
    '<link rel="stylesheet" href="/v/b1/styles.css"><script type="module" src="/v/b1/learn.js"></script><link href="https://fonts.googleapis.com/x.css"><script src="//cdn.example/x.js"></script><a href="/learn.html">');
  const tutorials = new TutorialService(new MemoryStore(), join(root, 'content-kit'));
  const app = createApp({ tutorials, search: { watchableVideos: () => [] }, publicDir: join(root, 'web'), build: 'b42', config: {}, auth: { mode: 'hybrid', identify: async () => ({ learnerId: 'g', email: null }) } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
  const base = `http://127.0.0.1:${(app.address() as { port: number }).port}`;
  try {
    const page = await fetch(`${base}/sources.html`);
    assert.equal(page.headers.get('cache-control'), 'no-cache');
    const html = await page.text();
    assert.match(html, /src="\/v\/b42\/sources\.js"/);
    assert.match(html, /href="\/v\/b42\/site\.css"/);
    const js = await fetch(`${base}/v/b42/sources.js`);
    assert.equal(js.status, 200);
    assert.match(js.headers.get('cache-control')!, /immutable/);
    assert.match(js.headers.get('content-type')!, /javascript/);
    assert.equal((await fetch(`${base}/v/b42/common.js`)).status, 200, 'relative imports resolve under the same build');
    assert.equal((await fetch(`${base}/sources.js`)).headers.get('cache-control'), 'no-cache', 'plain addresses still work');
    assert.equal((await fetch(`${base}/v/b42/../src/server/app.ts`)).status, 404);
  } finally { app.close(); }
});
