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
