import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { SupabaseStore } from '../src/store/supabase.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { NoteService } from '../src/app/notes.ts';
import { createApp } from '../src/server/app.ts';
import { allCourses } from '../src/content/courses.ts';
import { courseVideoOrder } from '../src/app/watch.ts';

const root = join(import.meta.dirname, '..');
const body = { bookmark: true, revisit: true, text: '<script>plain text</script> বাংলা' };
function setup(store = new MemoryStore()) {
  const tutorials = new TutorialService(store, join(root, 'content-kit'));
  const topic = tutorials.allTopics('en')[0]!;
  return { store, tutorials, notes: new NoteService(store, tutorials), key: `tutorial:${topic.track}:${topic.topic}` };
}

test('private saved state: CRUD, validation and catalog links', async () => {
  const { store, notes, key } = setup();
  await notes.put('a', key, { ...body, learnerId: 'b', href: 'javascript:1' }, 'en');
  assert.equal((await store.getDoc('note', `a:${key}`))!.data.learnerId, 'a');
  assert.equal((await notes.get('a', key, 'en')).text, body.text);
  assert.match((await notes.list('a', 'en')).notes[0]!.href, /^\/learn.html\?/);
  assert.equal((await notes.list('b', 'en')).notes.length, 0);
  assert.equal((await notes.get('b', key, 'en')).text, '');
  await notes.delete('b', key, 'en');
  assert.equal((await notes.list('a', 'en')).notes.length, 1);
  await assert.rejects(notes.put('a', key, { ...body, text: 'x'.repeat(2001) }, 'en'), /2,000/);
  await assert.rejects(notes.put('a', key, { ...body, bookmark: 'true' }, 'en'));
  await assert.rejects(notes.put('a', `a:${key}`, body, 'en'), /No such/);
  await notes.put('a', key, { ...body, text: 'x'.repeat(2000) }, 'bn');
  const course = allCourses().find((c) => courseVideoOrder(c).length)!;
  const videoKey = `video:${course.id}:${courseVideoOrder(course)[0]}`;
  assert.match((await notes.put('a', videoKey, body, 'en')).href, /^\/watch.html\?/);
  await notes.delete('a', key, 'en');
  assert.equal((await notes.get('a', key, 'en')).bookmark, false);
  await notes.put('a', videoKey, { bookmark: false, revisit: false, text: '' }, 'en');
  assert.equal((await notes.list('a', 'en')).notes.length, 0);
});

test('saved-item HTTP routes reject guests and isolate signed-in accounts', async () => {
  const { store, tutorials, notes, key } = setup();
  const app = createApp({ store, tutorials, notes, auth: { mode: 'hybrid', identify: async (req: any) => ({ learnerId: req.headers.authorization || 'guest', email: null, signedIn: Boolean(req.headers.authorization) }) }, publicDir: join(root, 'web'), config: {} } as any);
  await new Promise<void>((r) => app.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${(app.address() as any).port}`;
  const call = (method: string, path: string, who?: string, data?: unknown) => fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(who ? { authorization: who } : {}) }, body: data ? JSON.stringify(data) : undefined });
  const path = `/api/my-notes/${encodeURIComponent(key)}`;
  try {
    for (const method of ['GET', 'PUT', 'DELETE']) assert.equal((await call(method, path, undefined, method === 'PUT' ? body : undefined)).status, 401);
    assert.equal((await call('GET', '/api/my-notes')).status, 401);
    assert.equal((await call('PUT', path, 'alice', body)).status, 200);
    assert.equal((await (await call('GET', path, 'bob')).json()).text, '');
    assert.deepEqual((await (await call('GET', '/api/my-notes', 'bob')).json()).notes, []);
    await call('DELETE', path, 'bob');
    assert.equal((await (await call('GET', path, 'alice')).json()).text, body.text);
  } finally { await new Promise<void>((r) => app.close(() => r())); }
});

test('notes use the generic Supabase docs contract', async () => {
  const rows = new Map<string, any>();
  const fakeFetch = async (url: any, init: any) => {
    const u = new URL(String(url)); const id = u.searchParams.get('id')?.slice(3);
    if (init.method === 'POST') { const row = JSON.parse(init.body); rows.set(row.id, row); return new Response(null, { status: 201 }); }
    if (init.method === 'DELETE') { rows.delete(id!); return new Response(null, { status: 204 }); }
    return Response.json(id ? (rows.has(id) ? [rows.get(id)] : []) : [...rows.values()].slice(Number(u.searchParams.get('offset') ?? 0)));
  };
  const store = new SupabaseStore('https://test.invalid', 'test', fakeFetch as any);
  const tutorials = new TutorialService(store, join(root, 'content-kit'));
  const notes = new NoteService(store, tutorials); const topic = tutorials.allTopics('en')[0]!;
  const key = `tutorial:${topic.track}:${topic.topic}`;
  await notes.put('a', key, body, 'en');
  assert.equal((await notes.list('a', 'en')).notes.length, 1);
  await notes.delete('a', key, 'en');
  assert.equal((await notes.list('a', 'en')).notes.length, 0);
});
