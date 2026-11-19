// Admin site: roles, courses from a (fake) YouTube playlist, paid-course locks,
// posts, ads, coupons, the announcement bar, admin-written topics and the HTTP guard.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import type { IncomingMessage } from 'node:http';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService, isoSeconds, playlistIdFrom, type YtFetch } from '../src/app/admin.ts';
import { getCourse } from '../src/content/courses.ts';
import { markdownToHtml } from '../src/app/markdown.ts';
import type { Authenticator } from '../src/server/auth.ts';

const kit = join(import.meta.dirname, '..', 'content-kit');

/** Answers the three YouTube Data API calls the import makes. */
function fakeYouTube(videoCount = 4) {
  const calls: string[] = [];
  const ids = Array.from({ length: videoCount }, (_, i) => `vid${String(i).padStart(8, '0')}`);
  const fetchImpl: YtFetch = async (url) => {
    calls.push(url);
    const u = new URL(url);
    const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
    if (u.pathname.endsWith('/playlists')) return u.searchParams.get('id') === 'PLmissing0000' ? ok({ items: [] }) : ok({ items: [{ snippet: { title: 'Computer Networks in Bangla', channelId: 'UC1', channelTitle: 'Loop & Logic' } }] });
    if (u.pathname.endsWith('/playlistItems')) return ok({ items: ids.map((id) => ({ contentDetails: { videoId: id }, status: { privacyStatus: 'public' } })) });
    if (u.pathname.endsWith('/videos')) return ok({ items: (u.searchParams.get('id') ?? '').split(',').map((id, i) => ({ id, snippet: { title: `Lesson ${id.slice(-2)}`, channelId: 'UC1' }, contentDetails: { duration: `PT${10 + i}M5S` } })) });
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return { fetchImpl, calls, ids };
}

function setup(opts: { key?: string | null; videos?: number } = {}) {
  const store = new MemoryStore();
  const tutorials = new TutorialService(store, kit);
  const watch = new WatchService(store);
  const yt = fakeYouTube(opts.videos);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['Boss@Example.com'], youtubeKey: opts.key === undefined ? 'test-key' : opts.key, fetchImpl: yt.fetchImpl, timers: false });
  return { store, tutorials, watch, admin, yt };
}

test('playlist links and durations are read correctly', () => {
  assert.equal(playlistIdFrom('https://www.youtube.com/playlist?list=PL66eeXZhO4z4Alloq0LhOoXnov8_mvEz0'), 'PL66eeXZhO4z4Alloq0LhOoXnov8_mvEz0');
  assert.equal(playlistIdFrom('PL66eeXZhO4z4Alloq0LhOoXnov8_mvEz0'), 'PL66eeXZhO4z4Alloq0LhOoXnov8_mvEz0');
  assert.equal(playlistIdFrom('https://evil.example.com/?list=PL66eeXZhO4z4Alloq'), null);
  assert.equal(isoSeconds('PT1H2M3S'), 3723);
  assert.equal(isoSeconds('PT45S'), 45);
});

test('admins come from ADMIN_EMAILS and from roles; env admins cannot be changed', async () => {
  const { admin } = setup();
  await admin.init();
  assert.equal(admin.roleOf('boss@example.com'), 'admin');
  assert.equal(admin.roleOf('someone@example.com'), 'learner');
  await admin.setRole('boss@example.com', 'teacher@uni.edu.bd', 'instructor');
  assert.equal(admin.roleOf('teacher@uni.edu.bd'), 'instructor');
  await assert.rejects(admin.setRole('boss@example.com', 'boss@example.com', 'learner'), /ADMIN_EMAILS/);
  await admin.setRole('boss@example.com', 'second@example.com', 'admin');
  await assert.rejects(admin.setRole('second@example.com', 'second@example.com', 'learner'), /own admin role/);
  const log = await admin.auditLog();
  assert.ok(log.entries.some((e) => e.action === 'role.set' && e.target === 'teacher@uni.edu.bd'));
});

test('a free course is built from its playlist and shows every video', async () => {
  const { admin, watch } = setup();
  await admin.init();
  await assert.rejects(admin.saveCourse('boss@example.com', { access: 'free', title: { en: 'Networks' } }), /playlist link/);
  const c = await admin.saveCourse('boss@example.com', { access: 'free', title: { en: 'Computer Networks', bn: 'কম্পিউটার নেটওয়ার্ক' }, code: 'CSE-3201', playlist: 'https://www.youtube.com/playlist?list=PLnetworks0001', published: true });
  assert.equal(c.counts.videos, 4);
  assert.equal(c.playlistTitle, 'Computer Networks in Bangla');
  const course = getCourse(c.id)!;
  assert.ok(course, 'the course joins the public catalog');
  const view = await watch.view(c.id, 'learner-1', 'en');
  assert.equal(view.progress.total, 4);
  assert.ok(view.current?.embedUrl.includes('vid00000000'));
  assert.ok(view.sections[0]!.url?.includes('PLnetworks0001'), 'a free course links to its real YouTube playlist');
});

test('a paid course shows only its free samples until access is given', async () => {
  const { admin, watch, store } = setup({ videos: 5 });
  await admin.init();
  await assert.rejects(admin.saveCourse('boss@example.com', { access: 'paid', title: { en: 'MAT-101' }, playlist: 'PLpaid00000001' }), /price/);
  const ids = (await admin.importPlaylist('PLpaid00000001')).videos.map((v) => v.id);
  const c = await admin.saveCourse('boss@example.com', { access: 'paid', title: { en: 'MAT-101 Complete' }, price: 499, playlist: 'PLpaid00000001', published: true, videos: ids.map((id, i) => ({ id, sample: i === 0 || i === 3 })) });
  assert.equal(c.counts.samples, 2);
  const v = await watch.view(c.id, 'buyer-1', 'en');
  assert.equal(v.course.owned, false);
  assert.equal(v.course.locked, 3);
  const items = v.sections[0]!.items;
  assert.deepEqual(items.filter((i) => !i.locked).map((i) => i.id), [ids[0], ids[3]]);
  assert.ok(items.filter((i) => i.locked).every((i) => i.id.startsWith('locked-')), 'locked video ids are never sent');
  assert.equal(v.sections[0]!.url, null, 'no YouTube playlist link for a paid course');
  assert.equal(v.current?.youtubeUrl, null);
  await assert.rejects(watch.mark(c.id, 'buyer-1', { videoId: ids[1], watched: true }), /Buy the course/);
  // the buyer signs in once, an admin gives access
  await admin.touchMember('buyer-1', 'buyer@example.com');
  await admin.grantAccess('boss@example.com', c.id, 'buyer@example.com');
  const after = await watch.view(c.id, 'buyer-1', 'en');
  assert.equal(after.course.owned, true);
  assert.equal(after.course.locked, 0);
  assert.equal((await store.listDocs('grant')).length, 1);
});

test('without a YouTube key the admin is told what to set', async () => {
  const { admin } = setup({ key: null });
  await assert.rejects(admin.importPlaylist('PLanything00001'), /YOUTUBE_API_KEY/);
  const { admin: a2 } = setup();
  await assert.rejects(a2.importPlaylist('PLmissing0000'), /could not find/);
});

test('posts go live when published or when their time comes', async () => {
  let now = new Date('2026-11-20T10:00:00Z');
  const store = new MemoryStore();
  const tutorials = new TutorialService(store, kit);
  const admin = new AdminService(store, tutorials, new WatchService(store), { adminEmails: ['a@x.com'], youtubeKey: null, timers: false, now: () => now });
  await admin.init();
  await admin.savePost('a@x.com', { title: { en: 'Round 4 is live' }, body: { en: '## What is new\n\n**365** topics. <script>alert(1)</script>' }, status: 'published' });
  await admin.savePost('a@x.com', { title: { en: 'Midterm guide' }, body: { en: 'Soon' }, status: 'scheduled', publishAt: '2026-11-22T03:00:00Z' });
  assert.deepEqual(admin.publicPosts('en').posts.map((p) => p.slug), ['round-4-is-live']);
  const p = admin.publicPost('round-4-is-live', 'en');
  assert.ok(p.bodyHtml.includes('<strong>365</strong>'));
  assert.ok(!p.bodyHtml.includes('<script'), 'typed HTML is escaped');
  now = new Date('2026-11-22T04:00:00Z');
  assert.equal(admin.publicPosts('en').posts.length, 2);
  await assert.rejects(admin.savePost('a@x.com', { title: { en: 'Round 4 is live' }, body: { en: 'x' } }), /web address/);
});

test('ads show only on the pages they target, one per spot', async () => {
  const { admin } = setup();
  await admin.init();
  const ds = await admin.saveAd('boss@example.com', { head: { en: 'DS Midterm Pack, 25% off' }, cta: { en: 'Use MIDTERM25' }, href: '/pricing.html', placement: 'top', pages: ['learn/data-structures', 'course/data-structures'], status: 'running' });
  await admin.saveAd('boss@example.com', { head: { en: 'Join the waitlist' }, href: '/pricing.html', placement: 'side', pages: ['*'], status: 'running', audience: 'anonymous' });
  await admin.saveAd('boss@example.com', { head: { en: 'Draft ad' }, href: '/', placement: 'inline', pages: ['*'], status: 'draft' });
  const onDs = admin.publicAds('learn/data-structures/ds-stack-array', false, 'en');
  assert.equal(onDs.top?.id, ds.id);
  assert.ok(onDs.side, 'the every-page side card shows to visitors who are not signed in');
  assert.equal(onDs.inline, null, 'drafts never show');
  assert.equal(admin.publicAds('learn/algorithms/algo-bfs', false, 'en').top, null);
  assert.equal(admin.publicAds('learn/data-structures/x', true, 'en').side, null, 'audience: not signed in');
  await assert.rejects(admin.saveAd('boss@example.com', { head: { en: 'x' }, href: 'javascript:alert(1)', pages: ['*'] }), /button must open/);
  admin.adEvent(ds.id, 'click');
  admin.adEvent(ds.id, 'view');
  await admin.flushCounters();
  assert.deepEqual(admin.ads().find((a) => a.id === ds.id)!.stats, { views: 1, clicks: 1, closes: 0 });
});

test('coupon codes are checked for dates, uses, target and email', async () => {
  const { admin } = setup();
  await admin.init();
  await admin.saveCoupon('boss@example.com', { code: 'midterm25', kind: 'percent', value: 25, appliesTo: 'course:mat-101', maxUses: 10 });
  await admin.saveCoupon('boss@example.com', { code: 'CAMPUS20', kind: 'percent', value: 20, eduOnly: true });
  assert.equal(admin.checkCoupon('MIDTERM25', 'course:mat-101', null).ok, true);
  assert.equal(admin.checkCoupon('MIDTERM25', 'course:other', null).ok, false);
  assert.equal(admin.checkCoupon('CAMPUS20', 'all', 'a@gmail.com').ok, false);
  assert.equal(admin.checkCoupon('CAMPUS20', 'all', 'a@uiu.edu.bd').ok, true);
  await assert.rejects(admin.saveCoupon('boss@example.com', { code: 'MIDTERM25', value: 5 }), /already exists/);
});

test('the announcement bar and hidden tracks reach the public side', async () => {
  const { admin, tutorials } = setup();
  await admin.init();
  assert.equal(admin.publicSite('en').announcement, null);
  await admin.saveAnnouncement('boss@example.com', { on: true, text: { en: 'New labs are live', bn: 'নতুন ল্যাব এসেছে' }, href: '/learn.html', linkText: { en: 'Start' } });
  assert.equal(admin.publicSite('bn').announcement?.text, 'নতুন ল্যাব এসেছে');
  await admin.setBuiltInHidden('boss@example.com', 'track', 'dbms', true);
  assert.ok(!tutorials.list('en').tracks.some((t) => t.id === 'dbms'));
  assert.throws(() => tutorials.track('dbms', 'en'), /not available/);
  await admin.setBuiltInHidden('boss@example.com', 'track', 'dbms', false);
  assert.ok(tutorials.list('en').tracks.some((t) => t.id === 'dbms'));
});

test('an admin-written topic is checked, then appears in its track when published', async () => {
  const { admin, tutorials } = setup();
  await admin.init();
  const draft = await admin.saveTopic('boss@example.com', { track: 'data-structures', module: 'hashing', title: { en: 'Cuckoo Hashing' }, body: { en: 'Short.' } });
  assert.equal(draft.status, 'draft');
  assert.ok(draft.issues.some((i) => i.level === 'error' && /quiz/.test(i.text)));
  await assert.rejects(admin.saveTopic('boss@example.com', { ...draft, publish: true }, draft.id), /Fix these first/);
  const body = '## The idea\n\nCuckoo hashing gives every key two possible homes. If both are taken, the new key pushes the old one out, and the old key moves to its other home. Lookups check only two places.';
  const quiz = [0, 1, 2].map((i) => ({ prompt: `Question ${i}?`, options: ['A', 'B', 'C'], answer: 1, explanation: 'Because.' }));
  const done = await admin.saveTopic('boss@example.com', { track: 'data-structures', module: 'hashing', title: { en: 'Cuckoo Hashing', bn: 'কাকু হ্যাশিং' }, body: { en: body }, quiz, examples: [{ title: 'Two hashes', code: 'int main(void){return 0;}', output: '' }], publish: true }, draft.id);
  assert.equal(done.status, 'published');
  const track = tutorials.track('data-structures', 'en');
  const hashing = track.modules.find((m) => m.id === 'hashing')!;
  assert.ok(hashing.topics.some((t) => t.id === done.id && t.available), JSON.stringify([done.id, hashing.topics.map((t) => t.id)]));
  const page = tutorials.topic('data-structures', done.id, 'en');
  assert.ok(page.topic.bodyHtml.includes('<h2 id="the-idea">'));
  assert.equal(page.quiz.length, 3);
  const graded = await tutorials.gradeQuiz('data-structures', done.id, 'l1', { 'q-1': 1, 'q-2': 0 }, 'en');
  assert.equal(graded.score, 1);
  await admin.deleteTopic('boss@example.com', done.id);
  assert.throws(() => tutorials.topic('data-structures', done.id, 'en'), /not available/);
});

test('a new track can be started and filled from the admin site', async () => {
  const { admin, tutorials } = setup();
  await admin.init();
  const tr = await admin.saveTrack('boss@example.com', { title: { en: 'Operating Systems', bn: 'অপারেটিং সিস্টেম' }, language: 'c', modules: [{ title: { en: 'Processes' } }, { title: { en: 'Scheduling' } }] });
  assert.equal(tr.id, 'operating-systems');
  assert.ok(!tutorials.list('en').tracks.find((t) => t.id === 'operating-systems')?.available, 'an empty track is not shown as available');
  const body = 'A process is a program that is running. '.repeat(6);
  const quiz = [0, 1, 2].map(() => ({ prompt: 'Q?', options: ['x', 'y'], answer: 0 }));
  await admin.saveTopic('boss@example.com', { track: 'operating-systems', module: 'processes', title: { en: 'What Is a Process?' }, body: { en: body }, quiz, publish: true });
  const list = tutorials.list('en').tracks.find((t) => t.id === 'operating-systems')!;
  assert.equal(list.delivered, 1);
  assert.equal(list.available, true);
});

test('the lab index groups a track\'s labs by topic in course order', () => {
  const store = new MemoryStore();
  const tutorials = new TutorialService(store, kit);
  const idx = tutorials.labIndex('data-structures', 'en');
  assert.ok(idx.labs >= 19);
  assert.ok(idx.topics.every((t) => t.labs.length > 0 && t.labs.every((l) => l.title && l.kind)));
});

test('markdown is escaped and only safe links are kept', () => {
  const html = markdownToHtml('Click [here](javascript:alert(1)) or [docs](https://docs.python.org)\n\n```c\nint x = 1 < 2;\n```\n\n- one\n- two');
  assert.ok(!html.includes('href="javascript'), 'unsafe links stay plain text');
  assert.ok(html.includes('<a href="https://docs.python.org">docs</a>'));
  assert.ok(html.includes('1 &lt; 2'));
  assert.ok(html.includes('<ul><li>one</li><li>two</li></ul>'));
});

test('admin endpoints need a signed-in admin', async () => {
  const { createApp } = await import('../src/server/app.ts');
  const { admin, tutorials, watch } = setup();
  await admin.init();
  const auth: Authenticator = {
    mode: 'hybrid',
    async identify(req: IncomingMessage) {
      const h = String(req.headers.authorization ?? '');
      if (h === 'Bearer boss') return { learnerId: 'u-boss', email: 'boss@example.com', signedIn: true };
      if (h === 'Bearer pupil') return { learnerId: 'u-pupil', email: 'pupil@example.com', signedIn: true };
      return { learnerId: 'anon-1', email: null };
    },
  };
  const app = createApp({ tutorials, watch, admin, auth, labModelFile: join(kit, 'tools', 'lab-model.mjs'), publicDir: join(import.meta.dirname, '..', 'public'), config: { supabaseUrl: null, supabaseAnonKey: null, aiDescription: 'test', liveSearch: false, storeKind: 'memory', instructorKey: null, editLocked: false, allowSeed: false } } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', () => r()));
  const port = (app.address() as { port: number }).port;
  const call = (path: string, who?: string) => fetch(`http://127.0.0.1:${port}${path}`, { headers: who ? { authorization: `Bearer ${who}` } : {} });
  try {
    assert.equal((await call('/api/admin/overview')).status, 401);
    assert.equal((await call('/api/admin/overview', 'pupil')).status, 403);
    const ok = await call('/api/admin/overview', 'boss');
    assert.equal(ok.status, 200);
    const body = await ok.json();
    assert.ok(body.kpis.topics > 300);
    assert.equal((await call('/api/site')).status, 200);
    assert.equal((await call('/api/learn-labs/algorithms')).status, 200);
  } finally {
    app.close();
  }
});
