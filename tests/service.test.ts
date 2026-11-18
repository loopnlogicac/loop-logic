import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { LearningService, AppError, type SessionView } from '../src/app/service.ts';
import { MemoryStore } from '../src/store/store.ts';
import { factsFor } from '../src/core/scenario.ts';

function setup() {
  const store = new MemoryStore();
  return { store, svc: new LearningService(store) };
}

async function correctAnswer(store: MemoryStore, sessionId: string) {
  const s = (await store.getSession(sessionId))!;
  const f = factsFor(s.current);
  return s.current.kind === 'l2_margin'
    ? { profit: f.profit / 100, marginPct: f.marginPct }
    : { salePrice: f.salePrice / 100, profit: f.profit / 100, marginPct: f.marginPct, decision: f.correctDecision };
}

let n = 0;
const k = () => `test-key-${++n}-xxxx`;
const rejectsWith = (code: string, status?: number) => (e: unknown) => e instanceof AppError && e.code === code && (status === undefined || e.status === status);

async function reachReady(svc: LearningService, store: MemoryStore, view: SessionView, learner: string): Promise<SessionView> {
  let v = view;
  for (let i = 0; i < 6 && !v.readyForTransfer; i++) {
    v = (await svc.submitAttempt(v.sessionId, learner, { idempotencyKey: k(), expectedRevision: v.revision, answer: await correctAnswer(store, v.sessionId) })).state;
  }
  return v;
}

test('duplicate submission with the same idempotency key records one attempt', async () => {
  const { svc, store } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  const input = { idempotencyKey: 'same-key-123', expectedRevision: v.revision, answer: { salePrice: 900, profit: 100, marginPct: 12.5, decision: 'accept' } };
  const r1 = await svc.submitAttempt(v.sessionId, 'a', input);
  const r2 = await svc.submitAttempt(v.sessionId, 'a', input);
  assert.equal(r1.attemptId, r2.attemptId);
  assert.equal((await store.events(v.sessionId)).filter((e) => e.type === 'attempt').length, 1);
});

test('stale revision is refused and nothing is recorded', async () => {
  const { svc, store } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  await assert.rejects(svc.submitAttempt(v.sessionId, 'a', { idempotencyKey: k(), expectedRevision: v.revision + 5, answer: {} }), rejectsWith('stale_state'));
  assert.equal((await store.events(v.sessionId)).length, 0);
});

test('missing answers are refused without recording an attempt', async () => {
  const { svc, store } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  await assert.rejects(svc.submitAttempt(v.sessionId, 'a', { idempotencyKey: k(), answer: { profit: 100 } }), rejectsWith('invalid_answer'));
  assert.equal((await store.events(v.sessionId)).length, 0);
});

test('another learner cannot read or act on a session', async () => {
  const { svc } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  await assert.rejects(svc.getState(v.sessionId, 'b'), rejectsWith('not_found'));
  await assert.rejects(svc.requestHelp(v.sessionId, 'b'), rejectsWith('not_found'));
  await assert.rejects(svc.receipt(v.sessionId, 'b'), rejectsWith('not_found'));
});

test('transfer cannot open before readiness', async () => {
  const { svc } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  await assert.rejects(svc.startTransfer(v.sessionId, 'a'), rejectsWith('not_ready'));
});

test('help makes the next correct answer "assisted" and it does not count towards readiness', async () => {
  const { svc, store } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  const help = await svc.requestHelp(v.sessionId, 'a');
  assert.equal(help.help.origin, 'reviewed_content');
  const r = await svc.submitAttempt(v.sessionId, 'a', { idempotencyKey: k(), answer: await correctAnswer(store, v.sessionId) });
  assert.equal(r.result.assisted, true);
  assert.equal(r.adaptation.action, 'fresh_check');
  assert.equal(r.adaptation.readyForTransfer, false);
});

test('sealed check: help and practice are refused server-side while it is open', async () => {
  const { svc, store } = setup();
  const ready = await reachReady(svc, store, await svc.startSession({ learnerId: 'a' }), 'a');
  assert.equal(ready.readyForTransfer, true);
  await svc.startTransfer(ready.sessionId, 'a');
  await assert.rejects(svc.requestHelp(ready.sessionId, 'a'), rejectsWith('assessment_open', 423));
  await assert.rejects(svc.submitAttempt(ready.sessionId, 'a', { idempotencyKey: k(), answer: {} }), rejectsWith('assessment_open'));
});

test('sealed check: no answer key appears in anything sent to the learner', async () => {
  const { svc, store } = setup();
  const ready = await reachReady(svc, store, await svc.startSession({ learnerId: 'a' }), 'a');
  const opened = await svc.startTransfer(ready.sessionId, 'a');
  const reloaded = await svc.getState(ready.sessionId, 'a');
  for (const payload of [opened, reloaded]) {
    assert.ok(!/"facts"|correctDecision|"minimumPrice":\s*\d|"margin":\s*\{/.test(JSON.stringify(payload)), 'key material leaked');
  }
  await assert.rejects(svc.trace(ready.sessionId, 'a', opened.transfer.itemId), rejectsWith('not_found'));
});

test('sealed check grades on the server, returns correctness only, then locks', async () => {
  const { svc, store } = setup();
  const ready = await reachReady(svc, store, await svc.startSession({ learnerId: 'a' }), 'a');
  await svc.startTransfer(ready.sessionId, 'a');
  const r = await svc.submitTransfer(ready.sessionId, 'a', { idempotencyKey: 'transfer-key-1', answer: { totalCost: 1, salePrice: 1, marginPct: 1, decision: 'accept', minimumPrice: 1 } });
  assert.equal(r.result.correct, false);
  for (const v of Object.values(r.result.fields)) assert.equal(typeof v, 'boolean');
  assert.equal(r.state.phase, 'complete');
  assert.deepEqual((await svc.submitTransfer(ready.sessionId, 'a', { idempotencyKey: 'transfer-key-1', answer: {} })).result, r.result);
  await assert.rejects(svc.submitTransfer(ready.sessionId, 'a', { idempotencyKey: 'transfer-key-2', answer: {} }), rejectsWith('no_transfer'));
});

test('sealed check survives a restart: the item is rebuilt from the session seed', async () => {
  const { svc, store } = setup();
  const ready = await reachReady(svc, store, await svc.startSession({ learnerId: 'a' }), 'a');
  const before = await svc.startTransfer(ready.sessionId, 'a');
  const restarted = new LearningService(store); // same data, new process
  const after = await restarted.getState(ready.sessionId, 'a');
  assert.deepEqual(after.transfer, before.transfer);
});

test('receipt statements reconcile with recorded events', async () => {
  const { svc, store } = setup();
  const v = await svc.startSession({ learnerId: 'a' });
  await svc.submitAttempt(v.sessionId, 'a', { idempotencyKey: k(), answer: { salePrice: 900, profit: 100, marginPct: 11.11, decision: 'accept' } });
  await svc.requestHelp(v.sessionId, 'a');
  let state = (await svc.submitAttempt(v.sessionId, 'a', { idempotencyKey: k(), answer: await correctAnswer(store, v.sessionId) })).state;
  state = await reachReady(svc, store, state, 'a');
  await svc.startTransfer(v.sessionId, 'a');
  const { receipt } = await svc.receipt(v.sessionId, 'a');
  const ids = new Set((await store.events(v.sessionId)).map((e) => e.id));
  for (const group of [receipt.demonstratedIndependently, receipt.completedWithHelp, receipt.stillUncertain, receipt.nextCheck]) {
    for (const line of group) for (const id of line.evidence) assert.ok(ids.has(id), `receipt cites unknown event ${id}`);
  }
  assert.equal(receipt.completedWithHelp.length, 1);
  assert.equal(receipt.basedOnEvents, (await store.events(v.sessionId)).length);
});

test('seeded demo replays the same task sequence for the same answers', async () => {
  const play = async () => {
    const { svc, store } = setup();
    let s = await svc.startSession({ learnerId: 'a', demo: true });
    const ids = [s.task!.id];
    for (let i = 0; i < 3; i++) {
      s = (await svc.submitAttempt(s.sessionId, 'a', { idempotencyKey: k(), answer: await correctAnswer(store, s.sessionId) })).state;
      ids.push(s.task?.id ?? s.phase);
    }
    return ids;
  };
  assert.deepEqual(await play(), await play());
});

test('teaching code never imports the assessment vault', () => {
  const root = join(import.meta.dirname, '..', 'src');
  for (const dir of ['core', 'content', 'ai', 'library', 'reading']) {
    for (const file of readdirSync(join(root, dir))) {
      const text = readFileSync(join(root, dir, file), 'utf8');
      assert.ok(!/(from|import\()\s*['"][^'"]*assessment\/vault/.test(text), `${dir}/${file} imports the vault`);
    }
  }
});
