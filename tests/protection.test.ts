// Premium video protection: device limit, watermark data, new batch playlists
// (progress carries over) and leak tracing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { MemoryStore } from '../src/store/store.ts';
import { TutorialService } from '../src/app/tutorials.ts';
import { WatchService } from '../src/app/watch.ts';
import { AdminService, type YtFetch } from '../src/app/admin.ts';
import { DeviceGuard, viewerCode, deviceLabel } from '../src/app/devices.ts';

const kit = join(import.meta.dirname, '..', 'content-kit');
const BATCHES: Record<string, string[]> = { PLbatch000001: ['a', 'b', 'c', 'd'], PLbatch000002: ['e', 'f', 'g', 'h'] };
const yt: YtFetch = async (url) => {
  const u = new URL(url);
  const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
  if (u.pathname.endsWith('/playlists')) return ok({ items: [{ snippet: { title: 'DS batch', channelId: 'UC1' } }] });
  if (u.pathname.endsWith('/playlistItems')) return ok({ items: (BATCHES[u.searchParams.get('playlistId') ?? ''] ?? []).map((x) => ({ contentDetails: { videoId: `vid0000000${x}` }, status: { privacyStatus: 'unlisted' } })) });
  return ok({ items: (u.searchParams.get('id') ?? '').split(',').map((id) => ({ id, snippet: { title: id, channelId: 'UC1' }, contentDetails: { duration: 'PT10M' } })) });
};

async function setup(max = 2) {
  const store = new MemoryStore();
  const tutorials = new TutorialService(store, kit);
  const watch = new WatchService(store);
  const devices = new DeviceGuard(store, { max });
  watch.setDeviceGuard(devices);
  const admin = new AdminService(store, tutorials, watch, { adminEmails: ['boss@example.com'], youtubeKey: 'k', fetchImpl: yt, timers: false });
  await admin.init();
  const course = await admin.saveCourse('boss@example.com', { access: 'paid', title: { en: 'DS Premium' }, price: 900, playlist: 'PLbatch000001', batch: 'Batch JAN-26', published: true });
  await store.putDoc({ kind: 'member', id: 's-1', data: { email: 'rafi@gmail.com', firstSeen: 'x', lastSeen: 'x' }, updatedAt: 'x' });
  await admin.grantAccess('boss@example.com', course.id, 'rafi@gmail.com');
  return { store, admin, watch, devices, course };
}
const viewer = (deviceId: string, staff = false) => ({ email: 'rafi@gmail.com', deviceId, userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/130.0 Mobile Safari/537.36', staff });

test('device limit: two devices play, a third is refused until an admin resets them', async () => {
  const { watch, devices, course } = await setup();
  await watch.view(course.id, 's-1', 'en', null, viewer('device-phone-01'));
  await watch.view(course.id, 's-1', 'en', null, viewer('device-laptop-02'));
  await watch.view(course.id, 's-1', 'en', null, viewer('device-phone-01')); // a known device is fine
  await assert.rejects(watch.view(course.id, 's-1', 'en', null, viewer('device-friend-03')), (e: any) => e.code === 'device_limit' && e.status === 403 && /2 devices/.test(e.message) && /ডিভাইস/.test(e.bn));
  await assert.rejects(watch.view(course.id, 's-1', 'en', null, viewer('')), (e: any) => e.code === 'device_missing');
  assert.equal((await devices.list('s-1'))[0]!.label, 'Chrome on Android');
  await devices.reset('s-1');
  await watch.view(course.id, 's-1', 'en', null, viewer('device-friend-03'));
  await watch.view(course.id, 's-1', 'en', null, viewer('device-x-04', true)); // staff are not limited
  assert.equal((await devices.list('s-1')).length, 1);
});

test('device limit applies only to bought premium courses; samples and free courses need no device', async () => {
  const { watch, course } = await setup(1);
  const guest = await watch.view(course.id, 'guest-1', 'en', null, viewer('')); // not bought: samples only, no check
  assert.equal(guest.protect, null);
  assert.ok(guest.sections[0]!.items.some((i: any) => i.locked));
  const free = await watch.view('c-programming', 'guest-1', 'en', null, viewer(''));
  assert.equal(free.protect, null);
  assert.doesNotMatch(free.current!.embedUrl, /fs=0/);
});

test('watermark: bought premium videos carry the email and account code; YouTube fullscreen and keys are off', async () => {
  const { watch, course } = await setup();
  const v = await watch.view(course.id, 's-1', 'en', null, viewer('device-phone-01'));
  assert.equal(v.protect!.code, viewerCode('s-1'));
  assert.match(v.protect!.code, /^[0-9A-F]{6}$/);
  assert.equal(v.protect!.mark, `rafi@gmail.com · ${viewerCode('s-1')}`);
  assert.match(v.current!.embedUrl, /fs=0&disablekb=1/);
  assert.equal(v.current!.youtubeUrl, null);
  assert.equal(deviceLabel('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit Version/17.0 Mobile Safari/604.1'), 'Safari on iPhone');
});

test('new batch: a fresh playlist takes the old videos\' places; samples, progress and history carry over', async () => {
  const { admin, watch, course } = await setup();
  const before = await admin.getCourse(course.id);
  assert.deepEqual(before.videos.filter((v: any) => v.sample).map((v: any) => v.id), ['vid0000000a', 'vid0000000b']);
  await watch.mark(course.id, 's-1', { videoId: 'vid0000000c', watched: true });

  const after = await admin.saveCourse('boss@example.com', { ...before, playlist: 'PLbatch000002', batch: 'Batch APR-26', videos: before.videos }, course.id);
  assert.deepEqual(after.videos.map((v: any) => v.id), ['vid0000000e', 'vid0000000f', 'vid0000000g', 'vid0000000h']);
  assert.deepEqual(after.videos.filter((v: any) => v.sample).map((v: any) => v.id), ['vid0000000e', 'vid0000000f'], 'samples kept by position');
  assert.equal(after.batches.length, 1);
  assert.equal(after.batches[0].label, 'Batch JAN-26');
  assert.deepEqual(after.aliases.vid0000000g, ['vid0000000c']);

  const v = await watch.view(course.id, 's-1', 'en', null, viewer('device-phone-01'));
  const items = v.sections[0]!.items as any[];
  assert.equal(items.find((i) => i.id === 'vid0000000g')!.watched, true, 'progress on the old video counts for its replacement');
  assert.ok(!items.some((i) => i.id === 'vid0000000c'), 'old batch ids are no longer served');

  // Leak tracing
  const old = admin.traceVideo('https://youtu.be/vid0000000c');
  assert.equal(old.hits[0]!.batch, 'Batch JAN-26');
  assert.equal(old.hits[0]!.current, false);
  assert.equal(admin.traceVideo('https://www.youtube.com/watch?v=vid0000000h').hits[0]!.batch, 'Batch APR-26');
  assert.deepEqual(admin.traceVideo('zzzzzzzzzzz').hits, []);
  const who = await admin.findViewer(viewerCode('s-1').toLowerCase());
  assert.equal(who.found, true);
  assert.equal(who.email, 'rafi@gmail.com');
  assert.equal(who.courses![0]!.id, course.id);
  assert.equal((await admin.findViewer('000000')).found, false);
  await assert.rejects(admin.findViewer('12'), /6-character/);
});
