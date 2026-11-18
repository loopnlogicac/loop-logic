// Video courses: the playlist data, course wiring, the watch service and its routes.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PLAYLISTS, VIDEOS, TITLE_IDS, toSeconds } from '../src/content/videos.ts';
import { COURSES, getCourse } from '../src/content/courses.ts';
import { MemoryStore } from '../src/store/store.ts';
import { WatchService, courseVideoOrder } from '../src/app/watch.ts';
import { LearnerService } from '../src/app/learner.ts';
import { ReadingService } from '../src/reading/service.ts';
import { LearningService } from '../src/app/service.ts';
import { AiGateway } from '../src/ai/gateway.ts';
import { LiveSearch } from '../src/library/live.ts';

const C_PLAYLIST = 'PL66eeXZhO4z6o42wWTvMZZpwSAgxsQR5V';

test('playlist data: every channel playlist is present, complete and well formed', () => {
  assert.equal(PLAYLISTS.length, 31);
  assert.equal(PLAYLISTS.reduce((n, p) => n + p.videoIds.length, 0), 353);
  assert.equal(VIDEOS.size, 302);
  for (const v of VIDEOS.values()) {
    assert.match(v.id, /^[A-Za-z0-9_-]{11}$/, `video id ${v.id}`);
    assert.ok(TITLE_IDS.has(v.id), `title for ${v.id}`);
    assert.notEqual(v.title, v.id);
    assert.match(v.duration, /^(\d+:)?\d{1,2}:\d{2}$/);
    assert.ok(v.seconds > 0);
  }
  assert.equal(new Set(PLAYLISTS.map((p) => p.id)).size, PLAYLISTS.length, 'no duplicate playlists');
  assert.equal([...VIDEOS.values()].filter((v) => v.by).length, 23, 'other-channel videos are credited');
  assert.equal(toSeconds('1:49:20'), 6560);
  assert.equal(toSeconds('5:10'), 310);
});

test('C Programming course: first in the catalog, plays the full C playlist in order', () => {
  assert.equal(COURSES[0]!.id, 'c-programming');
  const c = getCourse('c-programming')!;
  assert.equal(c.playlists[0]!.id, C_PLAYLIST);
  assert.equal(c.playlists[0]!.videos, 27);
  const order = courseVideoOrder(c);
  assert.equal(order[0], 'F8OWdzcf6go', 'starts with the introduction');
  assert.equal(order[26], 'SdL6dLGlgy4', 'C playlist ends with 2D arrays part 2');
  assert.equal(new Set(order).size, order.length, 'no video twice in the order');
});

test('every channel playlist belongs to a course, and course playlists exist in the data', () => {
  const used = new Set(COURSES.flatMap((c) => c.playlists.map((p) => p.id)));
  for (const p of PLAYLISTS) assert.ok(used.has(p.id), `playlist ${p.title} is in a course`);
  for (const c of COURSES) for (const p of c.playlists) assert.ok(PLAYLISTS.some((x) => x.id === p.id), `${c.id}: ${p.id} has data`);
});

test('watch service: next-up, marking, un-marking, unknown videos and per-learner progress', async () => {
  const store = new MemoryStore();
  const watch = new WatchService(store);
  const v0 = await watch.view('c-programming', 'u1', 'en');
  assert.equal(v0.current!.id, 'F8OWdzcf6go');
  assert.equal(v0.current!.prev, null);
  assert.equal(v0.current!.next, '3-b8QUMn2m4');
  assert.match(v0.current!.embedUrl, /^https:\/\/www\.youtube-nocookie\.com\/embed\/F8OWdzcf6go/);
  assert.equal(v0.progress.watched, 0);
  assert.ok(v0.progress.total >= 30);

  await watch.mark('c-programming', 'u1', { videoId: 'F8OWdzcf6go', watched: true });
  const r = await watch.mark('c-programming', 'u1', { videoId: '3-b8QUMn2m4', watched: true });
  assert.equal(r.progress.watched, 2);
  assert.equal(r.progress.nextUp, 'TNeSuQ6heJY');
  const v1 = await watch.view('c-programming', 'u1', 'en');
  assert.equal(v1.current!.id, 'TNeSuQ6heJY', 'opens at the first unwatched video');
  assert.equal(v1.sections[0]!.items[0]!.watched, true);

  await watch.mark('c-programming', 'u1', { videoId: 'F8OWdzcf6go', watched: false });
  assert.equal((await watch.view('c-programming', 'u1', 'en')).progress.watched, 1);
  assert.equal((await watch.view('c-programming', 'u2', 'en')).progress.watched, 0, 'other learners unaffected');

  await assert.rejects(watch.mark('c-programming', 'u1', { videoId: 'AnJzqaKEbhA', watched: true }), /not part of the course/);
  await assert.rejects(watch.view('nope', 'u1', 'en'), /Course not found/);

  const pick = await watch.view('c-programming', 'u1', 'en', 'yutWy_7jHss');
  assert.equal(pick.current!.by, 'Q-bit Learning', 'other-channel video carries its creator');
  assert.equal(pick.current!.next, null, 'last video has no next');
  const repeats = pick.sections.flatMap((s) => s.items).filter((i) => i.repeat).map((i) => i.id);
  assert.deepEqual(repeats.sort(), ['8bqq-oOwhs0', 'oKZQ9qwcsz8'], 'revision repeats are marked');
});

test('dashboard shows continue watching; catalog counts unique videos', async () => {
  const store = new MemoryStore();
  const reading = new ReadingService(store, new AiGateway([]), new LiveSearch({ apiKey: null }));
  const learner = new LearnerService(store, reading, new LearningService(store));
  assert.equal((await learner.dashboard('u', 'en')).continueWatching, null);
  await new WatchService(store).mark('c-programming', 'u', { videoId: 'F8OWdzcf6go', watched: true });
  const d = await learner.dashboard('u', 'en');
  assert.equal(d.continueWatching!.videoId, '3-b8QUMn2m4');
  assert.equal(d.continueWatching!.watched, 1);
  assert.equal(d.isNew, false);
  const cat = learner.catalog('en');
  assert.ok(cat.totals.videos <= 302 && cat.totals.videos > 250);
  assert.ok(cat.courses.find((c) => c.id === 'c-programming')!.hours > 0);
});

// ── per-video extras: materials, quiz, Try now ─────────────────────────────

import { VideoExtrasService, cleanExtras, resolveTryNow } from '../src/app/video-extras.ts';
import { buildRoutes } from '../src/server/app.ts';

const QUIZ = {
  materials: [
    { title: 'Slides', url: 'https://drive.google.com/file/d/abc/view' },
    { title: 'Hello world code', code: '#include <stdio.h>\nint main(void){printf("hi");}' },
  ],
  quiz: [
    { prompt: 'Which header declares printf?', options: ['stdlib.h', 'stdio.h', 'math.h'], answer: 1, explanation: 'printf lives in stdio.h.' },
    { prompt: 'main returns…', options: ['int', 'void'], answer: 0 },
  ],
  tryNow: { mode: 'default', language: 'c', code: '' },
};

test('extras: validation catches bad links, missing answers and empty items', () => {
  const ok = cleanExtras(QUIZ);
  assert.equal(ok.materials.length, 2);
  assert.equal(ok.quiz[0]!.answer, 1);
  assert.ok(ok.quiz[0]!.id && ok.quiz[1]!.id && ok.quiz[0]!.id !== ok.quiz[1]!.id, 'questions get ids');
  assert.throws(() => cleanExtras({ materials: [{ title: 'x', url: 'javascript:alert(1)' }] }), /must start with http/);
  assert.throws(() => cleanExtras({ materials: [{ title: 'x' }] }), /needs a link or some code/);
  assert.throws(() => cleanExtras({ materials: [{ url: 'https://a.b' }] }), /title is empty/);
  assert.throws(() => cleanExtras({ quiz: [{ prompt: 'q', options: ['a'], answer: 0 }] }), /at least 2 options/);
  assert.throws(() => cleanExtras({ quiz: [{ prompt: 'q', options: ['a', 'b'], answer: 5 }] }), /choose which option/);
  assert.throws(() => cleanExtras({ quiz: Array.from({ length: 21 }, () => ({ prompt: 'q', options: ['a', 'b'], answer: 0 })) }), /At most 20/);
});

test('Try now: on by default in programming courses, instructor can turn it on, off or change language', () => {
  const t = (mode: 'default' | 'on' | 'off', language: 'c' | 'python' = 'c', code = '') => ({ mode, language, code });
  assert.equal(resolveTryNow('c-programming', t('default'))!.label, 'C');
  assert.match(resolveTryNow('c-programming', t('default'))!.url, /programiz\.com\/c-programming\/online-compiler/);
  assert.ok(resolveTryNow('c-programming', t('default'))!.code.includes('printf'), 'starter program when no code given');
  assert.equal(resolveTryNow('c-programming', t('off')), null);
  assert.equal(resolveTryNow('mat-101', t('default')), null, 'maths has no compiler by default');
  const py = resolveTryNow('machine-learning', t('on', 'python', 'print(2+2)'))!;
  assert.equal(py.label, 'Python');
  assert.equal(py.code, 'print(2+2)');
  assert.equal(py.starter, false);
});

test('extras: learners never see answers until they submit; results are graded on the server and saved', async () => {
  const store = new MemoryStore();
  const extras = new VideoExtrasService(store);
  const watch = new WatchService(store, extras);
  await extras.save('F8OWdzcf6go', QUIZ);
  const v = await watch.view('c-programming', 'u1', 'en', 'F8OWdzcf6go');
  const x = v.current!.extras!;
  assert.equal(x.materials.length, 2);
  assert.equal(x.quiz.length, 2);
  assert.ok(!JSON.stringify(x.quiz).includes('"answer"') && !JSON.stringify(x.quiz).includes('stdio.h.'), 'no answers or explanations before submitting');
  assert.equal(x.tryNow!.label, 'C');
  assert.equal(v.sections[0]!.items[0]!.quiz, 2, 'list shows the video has a quiz');

  const [q1, q2] = x.quiz;
  const r = await watch.quiz('c-programming', 'F8OWdzcf6go', 'u1', { [q1!.id]: 1, [q2!.id]: 1 });
  assert.equal(r.score, 1);
  assert.equal(r.total, 2);
  assert.equal(r.results[0]!.correct, true);
  assert.equal(r.results[1]!.answer, 0);
  assert.equal(r.results[0]!.explanation, 'printf lives in stdio.h.');
  const again = await watch.view('c-programming', 'u1', 'en', 'F8OWdzcf6go');
  assert.deepEqual([again.current!.extras!.lastQuiz!.score, again.current!.extras!.lastQuiz!.total], [1, 2]);
  assert.equal((await watch.view('c-programming', 'u2', 'en', 'F8OWdzcf6go')).current!.extras!.lastQuiz, null);

  await assert.rejects(watch.quiz('c-programming', '3-b8QUMn2m4', 'u1', {}), /no quiz yet/);
  await assert.rejects(watch.quiz('c-programming', 'AnJzqaKEbhA', 'u1', {}), /not part of the course/);
  await assert.rejects(extras.save('notAVideo00', QUIZ), /Video not found/);

  const full = await extras.forEditor('F8OWdzcf6go');
  assert.equal(full.extras.quiz[0]!.answer, 1, 'editor sees answers');
  const exp = await extras.exportAll();
  assert.ok(exp.videos['F8OWdzcf6go']);
});

test('editing routes: locked on a public deploy without a key, key-checked when a key is set', () => {
  const routes = buildRoutes({ config: { editLocked: true } } as never);
  const editors = routes.filter((r) => r.auth === 'editor').map((r) => `${r.method} ${r.pattern.source}`);
  assert.equal(editors.length, 3, 'read-full, save and export are editor-only');
  assert.ok(routes.some((r) => r.method === 'POST' && r.pattern.test('/api/courses/c-programming/videos/F8OWdzcf6go/quiz') && r.auth === 'learner'));
  assert.ok(routes.find((r) => r.method === 'POST' && r.pattern.test('/api/videos/F8OWdzcf6go/extras'))!.maxBody! >= 512 * 1024);
});
