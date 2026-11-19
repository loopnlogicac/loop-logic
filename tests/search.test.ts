import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { TutorialService } from '../src/app/tutorials.ts';
import { MemoryStore } from '../src/store/store.ts';
import { SearchService } from '../src/app/search.ts';
import { pageMeta, injectHead, robotsTxt, sitemapXml } from '../src/server/seo.ts';
import { setExtraCourses, type Course } from '../src/content/courses.ts';
import { setExtraVideos } from '../src/content/videos.ts';

const kit = join(dirname(fileURLToPath(import.meta.url)), '..', 'content-kit');
const tut = new TutorialService(new MemoryStore(), kit);
const search = new SearchService(tut, undefined, { ttlMs: 0 });
const types = (r: ReturnType<SearchService['search']>) => r.groups.map((g) => g.type);

test('search finds topics, labs and videos, best match first', () => {
  const r = search.search('linked list', 'en');
  assert.ok(types(r).includes('topic'));
  assert.match(r.groups[0]!.hits[0]!.title, /linked list/i);
  assert.ok(types(search.search('dijkstra', 'en')).includes('lab'));
  const loop = search.search('for loop', 'en');
  assert.ok(types(loop).includes('video') && types(loop).includes('topic'));
  // "for" must not match "format"
  assert.ok(!loop.groups.flatMap((g) => g.hits).some((h) => /^format/i.test(h.title)));
  assert.equal(search.search('x', 'en').total, 0);
});

test('Bangla mode finds Bangla titles and still matches English words', () => {
  assert.ok(search.search('লুপ', 'bn').total > 0);
  const r = search.search('pointer', 'bn');
  assert.ok(r.total > 0 && /[ঀ-৿]/.test(r.groups[0]!.hits[0]!.title));
});

test('locked videos of paid courses never appear in search or the sitemap', () => {
  setExtraVideos([{ id: 'PLpaid', title: 'Paid', videoIds: ['vSample01', 'vLocked01'] }], [
    { id: 'vSample01', title: 'Zebra sample lesson', duration: '5:00', seconds: 300, by: null },
    { id: 'vLocked01', title: 'Zebra secret lesson', duration: '5:00', seconds: 300, by: null },
  ]);
  const paid: Course = { id: 'zebra-paid', code: null, subject: 'cse', title: { en: 'Zebra course', bn: 'জেব্রা' }, blurb: { en: 'x', bn: 'x' }, playlists: [{ id: 'PLpaid', title: 'Paid', videos: 2 }], lessons: [], practice: false, access: 'paid', price: '৳ 499', sampleIds: ['vSample01'], dynamic: true };
  setExtraCourses([paid]);
  try {
    const hits = search.search('zebra', 'en').groups.flatMap((g) => g.hits);
    assert.ok(hits.some((h) => h.title === 'Zebra sample lesson'));
    assert.ok(!hits.some((h) => h.title === 'Zebra secret lesson'));
    const xml = sitemapXml('https://x.test', { tutorials: tut, search });
    assert.ok(xml.includes('vSample01') && !xml.includes('vLocked01'));
    const m = pageMeta('/watch.html', new URLSearchParams('course=zebra-paid&v=vLocked01'), 'https://x.test', { tutorials: tut, search });
    assert.ok(!JSON.stringify(m).includes('secret'));
  } finally { setExtraCourses([]); setExtraVideos([], []); }
});

test('sitemap lists every delivered topic once; robots keeps private pages out', () => {
  const xml = sitemapXml('https://x.test', { tutorials: tut, search });
  const topics = tut.allTopics('en').length;
  assert.equal((xml.match(/learn\.html\?track=[^<]*&amp;topic=/g) ?? []).length, topics);
  assert.ok(!xml.includes('admin.html'));
  const robots = robotsTxt('https://x.test');
  assert.match(robots, /Disallow: \/admin\.html/);
  assert.match(robots, /Sitemap: https:\/\/x\.test\/sitemap\.xml/);
});

test('topic pages get their own title, description, canonical link and structured data', () => {
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>Tutorials · Loop &amp; Logic</title><meta name="robots" content="noindex"></head><body></body></html>';
  const m = pageMeta('/learn.html', new URLSearchParams('track=c&topic=c-pointers-intro'), 'https://x.test', { tutorials: tut, search });
  const out = injectHead(html, m);
  assert.match(out, /<title>[^<]*Pointers[^<]*C Programming tutorial/);
  assert.match(out, /<link rel="canonical" href="https:\/\/x\.test\/learn\.html\?track=c&amp;topic=c-pointers-intro">/);
  assert.match(out, /og:image" content="https:\/\/x\.test\/og\.png"/);
  assert.match(out, /"@type":"LearningResource"/);
  assert.equal((out.match(/<title>/g) ?? []).length, 1);
  assert.ok(!out.includes('content="noindex"'), 'old robots tag removed');
  const admin = injectHead(html, pageMeta('/admin.html', new URLSearchParams(), 'https://x.test', { tutorials: tut, search }));
  assert.match(admin, /noindex, nofollow/);
  assert.ok(!admin.includes('rel="canonical"'));
  // no tag can be broken out of
  const evil = injectHead(html, { ...m, title: '"><script>x</script>' });
  assert.ok(!evil.includes('<script>x'));
});
