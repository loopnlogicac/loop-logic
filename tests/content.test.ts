// Content integrity for lessons, library, courses and labs, plus the lab service.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, PREREQ_CHECKS, getLesson } from '../src/content/lessons.ts';
import { PASSAGES, GLOSSARY, APPROVED_SITES, getPassage, glossarySubject } from '../src/content/library.ts';
import { COURSES } from '../src/content/courses.ts';
import { LABS, getLab } from '../src/content/labs.ts';
import { LESSON_SUBJECTS } from '../src/content/subjects.ts';
import { MemoryStore } from '../src/store/store.ts';
import { LabService, labCheckOrder } from '../src/app/labs.ts';
import { LearnerService } from '../src/app/learner.ts';
import { ReadingService, quizOrder } from '../src/reading/service.ts';
import { LearningService, AppError } from '../src/app/service.ts';
import { AiGateway } from '../src/ai/gateway.ts';
import { LiveSearch } from '../src/library/live.ts';
import { normalizeProfile } from '../src/reading/profile.ts';
import { optionOrder } from '../src/core/options.ts';

const bothLanguages = (b: { en: string; bn: string }, what: string) => {
  assert.ok(b.en.trim().length >= 1, `${what}: English missing`);
  assert.ok(b.bn.trim().length >= 1, `${what}: Bangla missing`);
  assert.ok(/[ঀ-৿]/.test(b.bn) || !/[A-Za-z]{4,}/.test(b.bn.replace(/NAND|XNOR|FCFS|Overflow|Underflow|False|True/g, '')), `${what}: Bangla text has no Bangla letters`);
};

test('lessons: unique ids, known subjects, passages exist, videos and quizzes are well formed', () => {
  const blockIds = new Set<string>();
  assert.equal(new Set(LESSONS.map((l) => l.id)).size, LESSONS.length);
  assert.ok(LESSONS.length >= 9);
  for (const lesson of LESSONS) {
    assert.ok((LESSON_SUBJECTS as readonly string[]).includes(lesson.subject), `${lesson.id}: subject`);
    bothLanguages(lesson.title, `${lesson.id} title`);
    bothLanguages(lesson.summary, `${lesson.id} summary`);
    assert.ok((lesson.videos ?? []).length >= 1, `${lesson.id}: needs a channel video`);
    for (const v of lesson.videos ?? []) assert.match(v.id, /^[\w-]{11}$/, `${lesson.id}: video id ${v.id}`);
    assert.ok(lesson.blocks.some((b) => b.quiz), `${lesson.id}: needs at least one quiz`);
    for (const b of lesson.blocks) {
      assert.ok(!blockIds.has(b.id), `duplicate block id ${b.id}`);
      blockIds.add(b.id);
      for (const id of b.passages) {
        const p = getPassage(id);
        assert.ok(p, `${b.id}: unknown passage ${id}`);
        assert.equal(p!.subject, lesson.subject, `${b.id}: passage ${id} is from another subject`);
      }
      if (b.type !== 'interactive') assert.ok(b.passages.length > 0, `${b.id}: needs a passage so help can cite a source`);
      if (b.quiz) {
        assert.ok(b.quiz.options.length >= 3, `${b.id}: quiz needs 3 options`);
        bothLanguages(b.quiz.question, `${b.id} quiz`);
        bothLanguages(b.quiz.explanation, `${b.id} quiz explanation`);
        b.quiz.options.forEach((o, i) => bothLanguages(o, `${b.id} option ${i}`));
        assert.equal(new Set(b.quiz.options.map((o) => o.en)).size, b.quiz.options.length, `${b.id}: duplicate options`);
      }
      if (b.extraExample) bothLanguages(b.extraExample, `${b.id} extra example`);
    }
  }
});

test('library: passages and glossary are complete, and every subject has approved sites', () => {
  assert.equal(new Set(PASSAGES.map((p) => p.id)).size, PASSAGES.length);
  for (const p of PASSAGES) bothLanguages(p.text, p.id);
  assert.equal(new Set(GLOSSARY.map((g) => g.id)).size, GLOSSARY.length);
  for (const g of GLOSSARY) {
    assert.ok(glossarySubject(g), `${g.id}: passage ${g.passage} missing`);
    bothLanguages(g.definition, g.id);
    assert.ok(g.aliases.every((a) => a === a.toLowerCase() && a.length >= 3), `${g.id}: aliases must be lowercase and at least 3 characters`);
  }
  for (const s of LESSON_SUBJECTS) assert.ok(APPROVED_SITES[s].length > 0, `${s}: no approved sites`);
  const concepts = new Set(LESSONS.flatMap((l) => l.blocks.flatMap((b) => b.concepts)));
  for (const [concept, check] of Object.entries(PREREQ_CHECKS)) {
    assert.ok(concepts.has(concept), `prerequisite check for unused concept ${concept}`);
    assert.equal(check.options.at(-1)!.en, 'Not sure');
    bothLanguages(check.refresher, `${concept} refresher`);
  }
});

test('courses point at real lessons, and every lesson belongs to exactly one course', () => {
  const used = COURSES.flatMap((c) => c.lessons);
  for (const id of used) assert.ok(getLesson(id), `course lesson ${id} does not exist`);
  assert.deepEqual([...used].sort(), LESSONS.map((l) => l.id).sort());
});

test('labs: one per lesson, complete in both languages, with checkable results', () => {
  assert.deepEqual(LABS.map((l) => l.lessonId).sort(), LESSONS.map((l) => l.id).sort());
  for (const lab of LABS) {
    const at = `lab ${lab.lessonId}`;
    bothLanguages(lab.title, at); bothLanguages(lab.goal, at); bothLanguages(lab.extension, at);
    assert.ok(lab.minutes >= 10 && lab.minutes <= 60);
    assert.ok(lab.tools.some((t) => t.kind === 'online'), `${at}: needs a no-install option`);
    for (const t of lab.tools) { bothLanguages(t.note, `${at} tool`); if (t.url) assert.match(t.url, /^https:\/\//); }
    assert.ok(lab.setup.length >= 4 && lab.tasks.length >= 3 && lab.troubleshooting.length >= 2, `${at}: setup, tasks, troubleshooting`);
    [...lab.setup, ...lab.tasks].forEach((s) => bothLanguages(s, at));
    lab.troubleshooting.forEach((t) => { bothLanguages(t.problem, at); bothLanguages(t.fix, at); });
    assert.equal(lab.checks.length, 3, `${at}: three checks`);
    for (const c of lab.checks) {
      assert.equal(c.options.length, 3);
      bothLanguages(c.question, at); bothLanguages(c.explanation, at);
      c.options.forEach((o) => bothLanguages(o, at));
    }
    if (lab.starter) assert.ok(lab.starter.code.trim().length > 40 && !lab.starter.code.includes('\t'));
    assert.ok(lab.expected && lab.expected.output.length > 5, `${at}: expected result`);
  }
});

test('answer options are shuffled the same way every time, and the correct one is not always first', () => {
  assert.deepEqual(optionOrder('k', 4), optionOrder('k', 4));
  assert.deepEqual([...optionOrder('k', 4)].sort(), [0, 1, 2, 3]);
  assert.equal(optionOrder('k', 3, 1)[2], 2, 'kept-last option stays last');
  const quizPositions = LESSONS.flatMap((l) => l.blocks.filter((b) => b.quiz).map((b) => quizOrder(l.id, b).indexOf(b.quiz!.answer)));
  assert.ok(new Set(quizPositions).size >= 3, 'quiz answers appear in several positions');
  const labPositions = LABS.flatMap((l) => l.checks.map((c) => labCheckOrder(l.lessonId, c.id, 3).indexOf(0)));
  assert.ok(new Set(labPositions).size >= 3, 'lab answers appear in several positions');
});

const setup = () => {
  const store = new MemoryStore();
  const reading = new ReadingService(store, new AiGateway([]), new LiveSearch({ apiKey: null }));
  const learning = new LearningService(store);
  return { store, reading, learning, labs: new LabService(store), learner: new LearnerService(store, reading, learning) };
};
const rightChoice = (lessonId: string, checkId: string) => labCheckOrder(lessonId, checkId, 3).indexOf(0);

test('lab service: answers stay on the server, wrong tries reveal nothing, progress is per learner', async () => {
  const { labs, learner } = setup();
  const lab = await labs.get('cpu-scheduling', 'u', 'en');
  assert.equal(lab.course!.id, 'operating-systems');
  assert.equal(lab.checks.length, 3);
  assert.ok(lab.starter!.code.includes('sjf_order'));
  assert.ok(lab.videos.every((v) => v.url.startsWith('https://www.youtube.com/watch?v=')));
  const sent = JSON.stringify(lab);
  assert.ok(!sent.includes('explanation') && !sent.includes('answer'), 'no answers or explanations in the lab payload');

  const wrong = await labs.check('cpu-scheduling', 'u', { checkId: 'c1', choice: (rightChoice('cpu-scheduling', 'c1') + 1) % 3, lang: 'en' });
  assert.deepEqual([wrong.correct, wrong.explanation, wrong.progress.checksCorrect], [false, null, 0]);

  for (const id of ['c1', 'c2', 'c3']) {
    const r = await labs.check('cpu-scheduling', 'u', { checkId: id, choice: rightChoice('cpu-scheduling', id), lang: 'bn' });
    assert.equal(r.correct, true);
    assert.match(r.explanation!, /[ঀ-৿]/);
  }
  assert.equal((await labs.get('cpu-scheduling', 'u', 'en')).progress.done, true);
  assert.equal((await labs.get('cpu-scheduling', 'other', 'en')).progress.checksCorrect, 0);

  const d = await learner.dashboard('u', 'en');
  assert.equal(d.stats.labsDone, 1);
  assert.equal(d.stats.labsTotal, LESSONS.length);
  const course = await learner.course('operating-systems', 'u', 'en');
  assert.equal(course.lessonList[0]!.labDone, true);
  assert.equal(course.labs, 1);

  await assert.rejects(labs.get('nope', 'u', 'en'), (e: unknown) => e instanceof AppError && e.status === 404);
  await assert.rejects(labs.check('cpu-scheduling', 'u', { checkId: 'zz', choice: 0, lang: 'en' }), (e: unknown) => e instanceof AppError && e.code === 'bad_check');
  await assert.rejects(labs.check('cpu-scheduling', 'u', { checkId: 'c1', choice: 7, lang: 'en' }), (e: unknown) => e instanceof AppError && e.code === 'bad_choice');
});

test('new subjects work end to end: lesson, glossary, cited help, quiz, video and lab link', async () => {
  const { reading } = setup();
  const lesson = await reading.getLesson('cpu-scheduling', 'u', { lang: 'bn' });
  assert.equal(lesson.subject, 'cs');
  assert.equal(lesson.level, 2);
  assert.equal(lesson.videos[0]!.id, 'KysOSB4ZxYo');
  assert.ok(lesson.lab && lesson.lab.minutes > 0);

  const term = await reading.help('u', { lessonId: 'cpu-scheduling', blockId: 'cs-2', text: 'FCFS', action: 'understand', lang: 'en' });
  assert.equal((term as { origin: string }).origin, 'glossary');
  // a term from another subject is not answered from the wrong glossary
  const foreign = await reading.help('u', { lessonId: 'cpu-scheduling', blockId: 'cs-2', text: 'margin', action: 'understand', lang: 'en', skipPrereq: true });
  assert.notEqual((foreign as { origin?: string }).origin, 'glossary');

  const search = await reading.help('u', { lessonId: 'ohms-law', blockId: 'oh-4', text: 'parallel resistance', action: 'search', lang: 'en' });
  assert.ok((search as { results: { id: string }[] }).results.some((r) => r.id === 'lib-ec-parallel'));
  assert.ok((search as { results: { id: string }[] }).results.every((r) => getPassage(r.id)!.subject === 'ee'));

  const block = getLesson('ohms-law')!.blocks.find((b) => b.id === 'oh-1')!;
  const r = await reading.checkQuiz('u', { lessonId: 'ohms-law', blockId: 'oh-1', choice: quizOrder('ohms-law', block).indexOf(0), lang: 'en' });
  assert.equal(r.correct, true);
});

test('a profile saved before new subjects existed still loads', () => {
  const old = { enabled: true, level: { business: 1, ml: 3 }, termHelp: { business: true, ml: false }, counters: { termSelections: { business: 3, ml: 0 }, tooLong: 1, quizStreak: { business: 0, ml: 2 }, lateReads: 0, zooms: 0 } };
  const p = normalizeProfile(old as never);
  assert.deepEqual([p.level.business, p.level.ml, p.level.cs, p.level.ee], [1, 3, 2, 2]);
  assert.equal(p.termHelp.cs, false);
  assert.equal(p.counters.quizStreak.ee, 0);
  assert.equal(p.counters.tooLong, 1);
  assert.equal(p.depthAsked.cs, null);
});
