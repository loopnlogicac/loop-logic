// Instructor overview: aggregated, read-only, with small-group suppression.
// Shows supported difficulties, assisted vs independent outcomes, sealed-check
// results, the most-selected paragraphs, and AI usage and cost signals.

import { getLesson, LESSONS } from '../content/lessons.ts';
import { CONCEPTS } from '../content/pricing-pack.ts';
import type { Store } from '../store/store.ts';
import type { LearningService } from './service.ts';
import type { ReadingService } from '../reading/service.ts';
import { factsFor } from '../core/scenario.ts';
import { openTransfer } from '../assessment/vault.ts';

export class InstructorService {
  private readonly store: Store;
  private readonly minGroup: number;

  constructor(store: Store, options: { minGroup?: number } = {}) {
    this.store = store;
    this.minGroup = options.minGroup ?? 3;
  }

  /** Hide a count when fewer than `minGroup` distinct learners contribute to it. */
  private guard(count: number, learners: Set<string>) {
    return learners.size >= this.minGroup ? { value: count, suppressed: false } : { value: null, suppressed: true };
  }

  async overview() {
    const [sessions, events, reading, calls] = await Promise.all([this.store.listSessions(), this.store.allEvents(), this.store.readingEvents(), this.store.llmCalls()]);
    const learners = new Set(sessions.map((s) => s.learnerId));
    const synthetic = [...learners].filter((l) => l.startsWith('synthetic-')).length;

    // Diagnoses on practice attempts (supported difficulties).
    const diag = new Map<string, Set<string>>();
    const diagCount = new Map<string, number>();
    for (const e of events.filter((e) => e.type === 'attempt' && e.diagnosis && e.diagnosis !== 'correct')) {
      diag.set(e.diagnosis!, (diag.get(e.diagnosis!) ?? new Set()).add(e.learnerId));
      diagCount.set(e.diagnosis!, (diagCount.get(e.diagnosis!) ?? 0) + 1);
    }
    const difficulties = [...diagCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({ code, ...this.guard(count, diag.get(code)!), learners: this.guard(diag.get(code)!.size, diag.get(code)!).value }));

    // Assisted vs independent.
    const attempts = events.filter((e) => e.type === 'attempt');
    const independentCorrect = attempts.filter((e) => e.correct && !e.assisted);
    const assistedCorrect = attempts.filter((e) => e.correct && e.assisted);
    const transfers = events.filter((e) => e.type === 'transfer_attempt');
    const transferLearners = new Set(transfers.map((e) => e.learnerId));

    // Sealed-check results per concept.
    const conceptRows = new Map<string, { shown: number; missed: number }>();
    for (const t of transfers) {
      for (const c of (t.detail.conceptsShown as string[]) ?? []) conceptRows.set(c, { ...(conceptRows.get(c) ?? { shown: 0, missed: 0 }), shown: (conceptRows.get(c)?.shown ?? 0) + 1 });
      for (const c of (t.detail.conceptsMissed as string[]) ?? []) conceptRows.set(c, { ...(conceptRows.get(c) ?? { shown: 0, missed: 0 }), missed: (conceptRows.get(c)?.missed ?? 0) + 1 });
    }
    const concepts = [...conceptRows.entries()].map(([id, r]) => ({
      id,
      name: CONCEPTS[id as keyof typeof CONCEPTS]?.name.en ?? id,
      shown: transferLearners.size >= this.minGroup ? r.shown : null,
      missed: transferLearners.size >= this.minGroup ? r.missed : null,
      total: transferLearners.size >= this.minGroup ? r.shown + r.missed : null,
    }));

    // Most-selected paragraphs (authors' heatmap).
    const perBlock = new Map<string, { lessonId: string; count: number; learners: Set<string> }>();
    for (const r of reading.filter((r) => r.type === 'help' && r.blockId)) {
      const k = `${r.lessonId}:${r.blockId}`;
      const row = perBlock.get(k) ?? { lessonId: r.lessonId, count: 0, learners: new Set<string>() };
      row.count += 1;
      row.learners.add(r.learnerId);
      perBlock.set(k, row);
    }
    const heatmap = LESSONS.flatMap((lesson) =>
      lesson.blocks
        .filter((b) => b.type !== 'interactive')
        .map((b) => {
          const row = perBlock.get(`${lesson.id}:${b.id}`);
          return {
            lessonId: lesson.id,
            lessonTitle: lesson.title.en,
            blockId: b.id,
            preview: b.text[2].en.slice(0, 90),
            ...(row ? this.guard(row.count, row.learners) : { value: 0, suppressed: false }),
          };
        }),
    ).sort((a, b) => (b.value ?? -1) - (a.value ?? -1));

    // AI usage and cost signals.
    const aiCalls = calls.filter((c) => c.purpose !== 'live_search');
    const live = calls.filter((c) => c.purpose === 'live_search');
    const ok = aiCalls.filter((c) => c.outcome === 'ok');
    const hits = aiCalls.filter((c) => c.outcome === 'cache_hit');
    const fallbacks = aiCalls.filter((c) => c.outcome.startsWith('fallback_'));
    const answered = ok.length + hits.length;

    return {
      generatedAt: new Date().toISOString(),
      minGroup: this.minGroup,
      learners: learners.size,
      syntheticLearners: synthetic,
      sessions: sessions.length,
      practice: {
        attempts: attempts.length,
        independentCorrect: independentCorrect.length,
        assistedCorrect: assistedCorrect.length,
        helpRequests: events.filter((e) => e.type === 'help').length,
      },
      sealed: {
        opened: events.filter((e) => e.type === 'transfer_opened').length,
        submitted: transfers.length,
        passed: transfers.filter((t) => t.correct).length,
      },
      difficulties,
      concepts,
      heatmap,
      ai: {
        calls: ok.length,
        cacheHits: hits.length,
        cacheHitRate: answered ? Math.round((hits.length / answered) * 100) : null,
        fallbacks: fallbacks.length,
        fallbackRate: ok.length + fallbacks.length ? Math.round((fallbacks.length / (ok.length + fallbacks.length)) * 100) : null,
        inputTokens: ok.reduce((n, c) => n + c.inputTokens, 0),
        outputTokens: ok.reduce((n, c) => n + c.outputTokens, 0),
        avgLatencyMs: ok.length ? Math.round(ok.reduce((n, c) => n + c.latencyMs, 0) / ok.length) : null,
        byPurpose: Object.entries(
          aiCalls.reduce<Record<string, number>>((acc, c) => ((acc[`${c.purpose}:${c.outcome}`] = (acc[`${c.purpose}:${c.outcome}`] ?? 0) + 1), acc), {}),
        ).map(([k, v]) => ({ key: k, count: v })),
        liveSearches: live.filter((c) => c.outcome === 'ok').length,
        liveCacheHits: live.filter((c) => c.outcome === 'cache_hit').length,
      },
    };
  }
}

/** Creates labelled synthetic learners so the instructor view can be demonstrated. */
export async function seedDemoData(learning: LearningService, reading: ReadingService, count = 8): Promise<{ created: number }> {
  const answerFor = async (sessionId: string, mode: 'correct' | 'follow_ai' | 'markup') => {
    const s = (await learning.store.getSession(sessionId))!;
    const f = factsFor(s.current);
    if (s.current.kind === 'l2_margin') return mode === 'correct' ? { profit: f.profit / 100, marginPct: f.marginPct } : { profit: f.profit / 100, marginPct: f.markupPct };
    if (mode === 'follow_ai') return { salePrice: f.salePrice / 100, profit: f.profit / 100, marginPct: f.marginPct, decision: 'accept' };
    if (mode === 'markup') return { salePrice: f.salePrice / 100, profit: f.profit / 100, marginPct: f.markupPct, decision: f.correctDecision };
    return { salePrice: f.salePrice / 100, profit: f.profit / 100, marginPct: f.marginPct, decision: f.correctDecision };
  };
  const lesson = getLesson('margin-basics')!;
  for (let i = 0; i < count; i++) {
    const learner = `synthetic-${i + 1}`;
    const v = await learning.startSession({ learnerId: learner, lang: i % 3 === 0 ? 'bn' : 'en', demo: true });
    const first: 'follow_ai' | 'markup' | 'correct' = i % 3 === 0 ? 'follow_ai' : i % 3 === 1 ? 'markup' : 'correct';
    let key = 0;
    await learning.submitAttempt(v.sessionId, learner, { idempotencyKey: `seed-${learner}-${key++}`, answer: await answerFor(v.sessionId, first) });
    if (first !== 'correct') await learning.requestHelp(v.sessionId, learner);
    for (let n = 0; n < 6; n++) {
      const s = (await learning.store.getSession(v.sessionId))!;
      if (s.readyForTransfer) break;
      await learning.submitAttempt(v.sessionId, learner, { idempotencyKey: `seed-${learner}-${key++}`, answer: await answerFor(v.sessionId, 'correct') });
    }
    const s = (await learning.store.getSession(v.sessionId))!;
    if (s.readyForTransfer && i % 4 !== 3) {
      await learning.startTransfer(v.sessionId, learner);
      const good = i % 2 === 0;
      await learning.submitTransfer(v.sessionId, learner, {
        idempotencyKey: `seed-${learner}-t`,
        answer: good ? seededTransferAnswer() : { totalCost: 1, salePrice: 1, marginPct: 1, decision: 'accept', minimumPrice: 1 },
      });
    }
    // Reading: most learners get stuck on the margin paragraph and the worked example.
    for (const blockId of ['mb-4', 'mb-4', 'mb-5', i % 2 ? 'mb-2' : 'mb-7']) {
      await reading.help(learner, { lessonId: lesson.id, blockId, action: 'understand', lang: 'en', skipPrereq: true });
    }
  }
  return { created: count };
}

// The demo transfer seed is fixed (999), so a correct answer can be computed from the public task.
function seededTransferAnswer() {
  const t = openTransfer(999, 'en');
  const num = (label: string) => Number(t.givens.find((g) => g.label.startsWith(label))!.value.replace(/[৳,%]/g, ''));
  const total = num('Cost') + num('Delivery fee');
  const sale = Math.round(num('List price') * (100 - num('Proposed discount'))) / 100;
  const margin = ((sale - total) / sale) * 100;
  const req = num('Minimum margin rule');
  return { totalCost: total, salePrice: sale, marginPct: margin.toFixed(2), decision: margin >= req ? 'accept' : 'reject', minimumPrice: Math.ceil(total / (1 - req / 100)) };
}
