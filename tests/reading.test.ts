import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStore } from '../src/store/store.ts';
import { ReadingService, quizOrder, prereqOrder } from '../src/reading/service.ts';
import { AiGateway, type Provider } from '../src/ai/gateway.ts';
import { LiveSearch } from '../src/library/live.ts';
import { LearningService, AppError } from '../src/app/service.ts';
import { LESSONS, getLesson } from '../src/content/lessons.ts';
import { applySignal, defaultProfile } from '../src/reading/profile.ts';
import { InstructorService, seedDemoData } from '../src/app/instructor.ts';

/** Position on screen of the correct quiz option / of a wrong prerequisite option. */
const rightChoice = (lessonId: string, blockId: string) => {
  const block = getLesson(lessonId)!.blocks.find((b) => b.id === blockId)!;
  return quizOrder(lessonId, block).indexOf(block.quiz!.answer);
};
const wrongPrereq = (concept: string) => prereqOrder(concept).indexOf(1);

const offline = () => new AiGateway([]);
const noLive = () => new LiveSearch({ apiKey: null });
function setup(gateway = offline()) {
  const store = new MemoryStore();
  return { store, reading: new ReadingService(store, gateway, noLive()), learning: new LearningService(store) };
}
const provider = (text: string): Provider & { calls: number } => {
  const p = { name: 'fake', model: 'm', calls: 0, async call() { p.calls++; return { text, provider: 'fake', model: 'm', inputTokens: 100, outputTokens: 30 }; } };
  return p;
};

test('every lesson block is complete in both languages, and locked facts appear in every version', () => {
  for (const lesson of LESSONS) {
    for (const b of lesson.blocks) {
      for (const lvl of [1, 2, 3] as const) {
        assert.ok(b.text[lvl].en.length > 5 && b.text[lvl].bn.length > 5, `${b.id} L${lvl}`);
        for (const a of b.anchors) {
          if (/^[৳\d]/.test(a)) assert.ok(b.text[lvl].en.includes(a), `${b.id} L${lvl} lost locked fact ${a}`);
        }
      }
      if (b.quiz) assert.ok(b.quiz.answer < b.quiz.options.length);
    }
  }
});

test('lesson starts at the standard version; non-text blocks never change', async () => {
  const { reading } = setup();
  const l = await reading.getLesson('margin-basics', 'u', { lang: 'en' });
  assert.equal(l.level, 2);
  const formula = l.blocks.find((b) => b.type === 'formula')!;
  assert.equal(formula.text, 'Margin = Profit ÷ Selling price × 100');
  assert.equal(l.blocks.find((b) => b.type === 'interactive')!.interactive, 'margin_calculator');
});

test('selecting a glossary term answers from the glossary with no AI call; three terms switch on term help and simpler text', async () => {
  const p = provider('{}');
  const { reading } = setup(new AiGateway([p]));
  const a = await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-2', text: 'markup', action: 'understand', lang: 'en' });
  assert.equal(a.kind, 'answer');
  assert.equal((a as { origin: string }).origin, 'glossary');
  await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'margin', action: 'understand', lang: 'en' });
  await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-1', text: 'profit', action: 'understand', lang: 'en' });
  assert.equal(p.calls, 0);
  const l = await reading.getLesson('margin-basics', 'u', { lang: 'en' });
  assert.equal(l.level, 1);
  assert.ok(l.blocks.some((b) => b.terms.length > 0));
  assert.ok(l.profile.whyTailored[0]!.includes('terms'));
  const original = await reading.getLesson('margin-basics', 'u', { lang: 'en', original: true });
  assert.equal(original.level, 2);
  assert.equal(original.personalised, false);
});

test('prerequisite check appears once, only without evidence, and a wrong answer adds a refresher', async () => {
  const { reading } = setup();
  const q = await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'Margin expresses the same profit as a share', action: 'understand', lang: 'en' });
  assert.equal(q.kind, 'prereq');
  const a = await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'Margin expresses the same profit as a share', action: 'understand', lang: 'en', prereqAnswer: wrongPrereq('margin'), depth: 'enough' });
  assert.equal(a.kind, 'answer');
  assert.ok((a as { refresher: string | null }).refresher);
  assert.equal((a as { origin: string }).origin, 'reviewed');
  const again = await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'Margin expresses the same profit as a share', action: 'understand', lang: 'en' });
  assert.equal(again.kind, 'answer', 'not asked twice');
});

test('AI answer is used only when cited and grounded, and is cached', async () => {
  const good = provider(JSON.stringify({ explanation: 'Margin divides the ৳100 profit by the ৳900 selling price, which is about 11.1%.', citations: ['lib-margin'], insufficient_evidence: false }));
  const { reading } = setup(new AiGateway([good]));
  const input = { lessonId: 'margin-basics', blockId: 'mb-4', text: 'Margin expresses the same profit', action: 'understand' as const, lang: 'en' as const, skipPrereq: true };
  const a1 = await reading.help('u', input);
  const a2 = await reading.help('u2', input);
  assert.equal((a1 as { origin: string }).origin, 'ai_checked');
  assert.equal((a2 as { text: string }).text, (a1 as { text: string }).text);
  assert.equal(good.calls, 1, 'second learner served from cache');

  const invented = provider(JSON.stringify({ explanation: 'Margin here is about 37% of the price.', citations: ['lib-margin'], insufficient_evidence: false }));
  const { reading: r2 } = setup(new AiGateway([invented]));
  const a3 = await r2.help('u', input);
  assert.equal((a3 as { origin: string }).origin, 'reviewed', 'invented number falls back to the passage');
});

test('search returns cited library passages; quiz checks update the profile (stretch rule)', async () => {
  const { reading } = setup();
  const s = await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'margin selling price', action: 'search', lang: 'bn' });
  assert.equal(s.kind, 'search');
  assert.ok((s as { results: { id: string }[] }).results.some((r) => r.id === 'lib-margin'));
  for (const blockId of ['mb-1', 'mb-2', 'mb-4']) {
    const r = await reading.checkQuiz('u', { lessonId: 'margin-basics', blockId, choice: rightChoice('margin-basics', blockId), lang: 'en' });
    assert.equal(r.answer, rightChoice('margin-basics', blockId));
    assert.equal(r.correct, true);
  }
  const l = await reading.getLesson('margin-basics', 'u', { lang: 'en' });
  assert.equal(l.level, 3);
});

test('struggle (long active time AND a look-up on the same paragraph) shows the extra example', async () => {
  const { reading } = setup();
  await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'Margin', action: 'search', lang: 'en' });
  await reading.recordEvents('u', [{ type: 'active_time', lessonId: 'margin-basics', blockId: 'mb-4', seconds: 120 }]);
  const l = await reading.getLesson('margin-basics', 'u', { lang: 'en' });
  assert.ok(l.blocks.find((b) => b.id === 'mb-4')!.extraExample);
});

test('display changes are suggested, not imposed; settings apply when the learner chooses', async () => {
  let p = defaultProfile();
  p = applySignal(applySignal(p, { kind: 'zoom' }), { kind: 'zoom' });
  assert.equal(p.display.large, false);
  assert.equal(p.suggestions[0]!.id, 'large');
  p = applySignal(p, { kind: 'setting', display: { large: true } });
  assert.equal(p.display.large, true);
  assert.equal(p.suggestions.length, 0);
});

test('selection help is refused while the learner has a sealed check open', async () => {
  const { reading, learning, store } = setup();
  const v = await learning.startSession({ learnerId: 'u' });
  const s = (await store.getSession(v.sessionId))!;
  await store.commit({ ...s, phase: 'assessment', revision: s.revision + 1 }, s.revision, []);
  await assert.rejects(
    reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'margin', action: 'understand', lang: 'en' }),
    (e: unknown) => e instanceof AppError && e.code === 'assessment_open',
  );
});

test('instructor overview: seeded data, suppression of small groups, heatmap, AI log', async () => {
  const { reading, learning, store } = setup();
  await seedDemoData(learning, reading, 6);
  const o = await new InstructorService(store, { minGroup: 3 }).overview();
  assert.equal(o.learners, 6);
  assert.equal(o.syntheticLearners, 6);
  assert.ok(o.practice.attempts > 6);
  assert.ok(o.difficulties.length > 0);
  const top = o.heatmap[0]!;
  assert.equal(top.blockId, 'mb-4');
  assert.equal(top.suppressed, false);
  const strict = await new InstructorService(store, { minGroup: 50 }).overview();
  assert.ok(strict.heatmap.every((h) => h.value === 0 || h.suppressed));
  assert.ok(strict.difficulties.every((d) => d.suppressed));
});

test('learner dashboard, course progress, profile view, export and reset', async () => {
  const { LearnerService } = await import('../src/app/learner.ts');
  const { reading, learning, store } = setup();
  const learner = new LearnerService(store, reading, learning);
  const fresh = await learner.dashboard('u', 'en');
  assert.equal(fresh.isNew, true);
  assert.equal(fresh.continueReading, null);

  await reading.help('u', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'margin selling price', action: 'search', lang: 'en' });
  await reading.checkQuiz('u', { lessonId: 'margin-basics', blockId: 'mb-1', choice: rightChoice('margin-basics', 'mb-1'), lang: 'en' });
  await reading.recordEvents('u', [{ type: 'active_time', lessonId: 'margin-basics', blockId: 'mb-4', seconds: 120 }]);
  const v = await learning.startSession({ learnerId: 'u' });
  await learning.submitAttempt(v.sessionId, 'u', { idempotencyKey: 'k-1234567', expectedRevision: v.revision, answer: { salePrice: 900, profit: 100, marginPct: 11.11, decision: 'accept' } });

  const d = await learner.dashboard('u', 'bn');
  assert.equal(d.isNew, false);
  assert.equal(d.continueReading!.lessonId, 'margin-basics');
  assert.ok(d.continueReading!.percent > 0 && d.continueReading!.percent < 100);
  assert.equal(d.continueReading!.courseId, 'basic-accounting');
  assert.equal(d.practice.totals.attempts, 1);
  assert.equal(d.practice.commonMistakes[0]!.code, 'ai_over_reliance');
  assert.ok(d.focus.some((f) => f.concept === 'margin' && f.name === 'মার্জিন'), 'struggle shows up as a focus area');

  const c = await learner.course('basic-accounting', 'u', 'en');
  assert.equal(c.lessonList[0]!.id, 'margin-basics');
  assert.ok(c.lessonList[0]!.started);
  assert.match(c.playlists[0]!.url, /^https:\/\/www\.youtube\.com\/playlist\?list=/);
  await assert.rejects(learner.course('nope', 'u', 'en'), (e: unknown) => e instanceof AppError && e.status === 404);

  const cat = learner.catalog('en');
  assert.ok(cat.courses.length >= 20);
  assert.equal(cat.courses.filter((x) => x.adaptive).length, 8);

  const p = await learner.profileView('u', 'en');
  assert.ok(p.reasons.length > 0);
  assert.ok(p.data.readingEvents >= 3);
  const ex = await learner.exportData('u');
  assert.equal(ex.practice.length, 1);
  assert.ok(!JSON.stringify(ex).includes('"answerKey"'));

  // another learner's data is untouched by a reset
  await reading.help('u2', { lessonId: 'margin-basics', blockId: 'mb-4', text: 'margin', action: 'search', lang: 'en' });
  await learner.reset('u', 'reading');
  assert.equal((await learner.dashboard('u', 'en')).continueReading, null);
  assert.equal((await learner.dashboard('u', 'en')).practice.totals.sessions, 1);
  await learner.reset('u', 'practice');
  assert.equal((await learner.dashboard('u', 'en')).isNew, true);
  assert.ok((await learner.dashboard('u2', 'en')).continueReading);
  await assert.rejects(learner.reset('u', 'everything'), (e: unknown) => e instanceof AppError && e.code === 'bad_scope');
});
