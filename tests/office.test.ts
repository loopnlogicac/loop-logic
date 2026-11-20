import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStore } from '../src/store/store.ts';
import { OfficeService, gradeStep, type OfficeAccess } from '../src/app/office.ts';
import { PROJECTS, ROLES, type Bi, type Step } from '../src/content/office.ts';

const BANGLA = /[ঀ-৿]/;
const open: OfficeAccess = { unlocked: true, course: null };
const locked: OfficeAccess = { unlocked: false, course: { id: 'vo-pack', price: 499 } };

function bis(o: unknown, out: Bi[] = []): Bi[] {
  if (Array.isArray(o)) { for (const x of o) bis(x, out); return out; }
  if (o && typeof o === 'object') {
    const r = o as Record<string, unknown>;
    if (typeof r.en === 'string' && typeof r.bn === 'string' && Object.keys(r).length === 2) out.push(r as Bi);
    else for (const v of Object.values(r)) bis(v, out);
  }
  return out;
}

test('every project is complete, bilingual and gradeable', () => {
  assert.equal(PROJECTS.length, 3);
  assert.equal(PROJECTS.filter((p) => p.free).length, 1, 'one free sample project');
  for (const p of PROJECTS) {
    const ids = new Set<string>();
    for (const s of p.steps) {
      assert.ok(!ids.has(s.id), `${p.id}: duplicate step ${s.id}`); ids.add(s.id);
      assert.ok(s.options.length >= 3, `${p.id}/${s.id}: at least three options`);
      assert.equal(new Set(s.options.map((o) => o.id)).size, s.options.length, `${p.id}/${s.id}: option ids unique`);
      for (const m of [...s.messages, ...(s.after ?? []), ...s.options.flatMap((o) => o.replies ?? [])]) assert.ok(ROLES[m.from], `${p.id}/${s.id}: unknown role ${m.from}`);
      if (s.kind === 'choose') {
        const best = s.options.filter((o) => s.skills.every((k) => o.score?.[k] === 2));
        assert.equal(best.length, 1, `${p.id}/${s.id}: exactly one best-practice option`);
        if (s !== p.steps.at(-1)) assert.ok(s.options.every((o) => o.replies?.length), `${p.id}/${s.id}: every choice moves the story on`);
      } else {
        assert.ok(s.options.some((o) => o.correct) && s.options.some((o) => !o.correct), `${p.id}/${s.id}: true and false findings`);
      }
    }
    const kinds = new Set(p.steps.map((s) => s.trap.kind));
    for (const k of ['incomplete', 'conflict', 'ai', 'quality', 'update']) assert.ok(kinds.has(k as Step['trap']['kind']), `${p.id}: has a ${k} trap`);
    for (const b of bis(p)) {
      assert.ok(b.en.trim() && b.bn.trim(), `${p.id}: empty text`);
      assert.ok(BANGLA.test(b.bn), `${p.id}: Bangla missing in "${b.en.slice(0, 40)}"`);
    }
  }
});

test('grading: best, partial and poor answers; multi-select penalises wrong picks', () => {
  const brief = PROJECTS[0]!.steps[0]!;
  assert.equal(gradeStep(brief, ['ask']).verdict, 'best');
  assert.equal(gradeStep(brief, ['vague']).verdict, 'partial');
  assert.equal(gradeStep(brief, ['code']).verdict, 'poor');
  const review = PROJECTS[0]!.steps.find((s) => s.id === 'ai-code')!;
  const right = review.options.filter((o) => o.correct).map((o) => o.id);
  assert.equal(gradeStep(review, right).verdict, 'best');
  assert.equal(gradeStep(review, [right[0]!]).verdict, 'partial');
  assert.equal(gradeStep(review, review.options.map((o) => o.id)).points.verify! < 2, true, 'picking everything is not full marks');
  assert.equal(gradeStep(review, review.options.filter((o) => !o.correct).map((o) => o.id)).verdict, 'poor');
  assert.equal(gradeStep(review, [right[0]!, review.options.find((o) => !o.correct)!.id]).verdict, 'partial', 'one catch plus one false alarm still earns something');
});

test('the browser never sees scores, right answers or feedback before answering', async () => {
  const svc = new OfficeService(new MemoryStore());
  const v = await svc.open('a', 'cgpa-portal', 'en', locked);
  const json = JSON.stringify(v);
  assert.ok(v.current && v.current.id === 'brief');
  assert.ok(!/"score"|"correct"|"feedback"|"replies"|"lesson"|"trap"/.test(json), 'no keys leak');
  assert.equal(v.debrief, null);
});

test('a full run: answers in order, consequences appear, debrief and best score saved', async () => {
  const svc = new OfficeService(new MemoryStore());
  const p = PROJECTS[0]!;
  await svc.open('a', p.id, 'en', open);
  await assert.rejects(svc.answer('a', p.id, { step: 'retake', choices: ['thread'] }, 'en', open), /already been answered|Reload/);
  await assert.rejects(svc.answer('a', p.id, { step: 'brief', choices: [] }, 'en', open), /Choose one/);
  await assert.rejects(svc.answer('a', p.id, { step: 'brief', choices: ['ask', 'code'] }, 'bn', open), (e: any) => BANGLA.test(e.bn));
  let v: any;
  for (const s of p.steps) {
    const best = s.kind === 'choose' ? [s.options.find((o) => s.skills.every((k) => o.score?.[k] === 2))!.id] : s.options.filter((o) => o.correct).map((o) => o.id);
    v = await svc.answer('a', p.id, { step: s.id, choices: best }, 'en', open);
  }
  assert.equal(v.current, null);
  assert.equal(v.debrief.overall, 100);
  assert.equal(v.debrief.steps.length, p.steps.length);
  assert.ok(v.thread.some((x: any) => x.type === 'msg' && /registrar policy wins/.test(x.text)), 'the reply to the best choice is in the thread');
  await assert.rejects(svc.answer('a', p.id, { step: 'update', choices: ['clear'] }, 'en', open), /finished/);
  const again = await svc.restart('a', p.id, 'en', open);
  assert.equal(again.progress.done, 0); assert.equal(again.progress.best, 100); assert.equal(again.progress.attempts, 2);
  const lobby = await svc.lobby('a', 'en', open);
  assert.equal(lobby.projects[0]!.best, 100);
  assert.ok(lobby.report.length >= 4 && lobby.report.every((r) => r.percent === 100));
  assert.equal((await svc.lobby('b', 'en', open)).report.length, 0, 'another intern sees none of it');
});

test('premium projects are locked without access; the free sample stays open', async () => {
  const svc = new OfficeService(new MemoryStore());
  const lobby = await svc.lobby('a', 'bn', locked);
  assert.deepEqual(lobby.projects.map((p) => p.locked), [false, true, true]);
  assert.deepEqual(lobby.unlock, { id: 'vo-pack', price: 499 });
  assert.ok(BANGLA.test(lobby.projects[0]!.title));
  await assert.rejects(svc.open('a', 'sales-report', 'en', locked), (e: any) => e.status === 403 && e.code === 'premium');
  assert.ok((await svc.open('a', 'sales-report', 'en', open)).current);
  await assert.rejects(svc.open('a', 'nope', 'en', open), (e: any) => e.status === 404);
});
