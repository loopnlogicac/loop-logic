// Instructor dashboard: classes that students join with a code, class insights
// built from real learner activity, assignments, announcements and exam packs.
//
// Privacy: a student's activity reaches their instructor only after the student
// joins the class (they are told this when joining). Class-wide figures are hidden
// when fewer than `minGroup` students contribute, as on the old instructor page.
// Questions asked to the AI are never shown as text, only counted by page.

import { masteryPairs } from './mastery.ts';
import { randomBytes, randomUUID } from 'node:crypto';
import { AppError } from './service.ts';
import { csv } from './csv.ts';
import type { DocRow, ReadingEventRow, Store } from '../store/store.ts';
import type { TutorialService } from './tutorials.ts';
import { QuestionBankService } from './question-bank.ts';
import { getCourse } from '../content/courses.ts';
import { getVideo } from '../content/videos.ts';
import { courseVideoOrder } from './watch.ts';
import { NoticeService } from './notices.ts';
import type { VideoExtrasService } from './video-extras.ts';

type Json = Record<string, any>;
type Lang = 'en' | 'bn';
export interface Staff { learnerId: string; email: string; role: 'admin' | 'instructor' }

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bad = (msg: string) => new AppError('bad_input', 400, msg);
const DAY = 86_400_000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => [...randomBytes(8)].map((b) => CODE_CHARS[b % CODE_CHARS.length]).join('').replace(/^(.{4})/, '$1-');

export class ClassService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  private readonly extras: VideoExtrasService;
  private readonly minGroup: number;
  private readonly now: () => Date;
  private readonly notices: NoticeService;

  constructor(store: Store, tutorials: TutorialService, extras: VideoExtrasService, opts: { minGroup?: number; now?: () => Date; notices?: NoticeService } = {}) {
    this.store = store;
    this.notices = opts.notices ?? new NoticeService(store);
    this.tutorials = tutorials;
    this.extras = extras;
    this.minGroup = opts.minGroup ?? 3;
    this.now = opts.now ?? (() => new Date());
  }

  private iso() { return this.now().toISOString(); }
  private async put(kind: string, id: string, data: Json) { await this.store.putDoc({ kind, id, data, updatedAt: this.iso() }); }
  private async audit(actor: string, action: string, target: string, detail: Json = {}) {
    await this.store.addAudit({ at: this.iso(), actor, action, target, detail }).catch(() => undefined);
  }

  // ── classes ──
  private async classOr404(id: string, staff?: Staff) {
    const d = await this.store.getDoc('class', id);
    if (!d || d.data.archived) throw new AppError('not_found', 404, 'No such class.');
    if (staff && staff.role !== 'admin' && d.data.ownerId !== staff.learnerId) throw new AppError('forbidden', 403, 'This is another instructor’s class.');
    return d;
  }
  async myClasses(staff: Staff) {
    const [classes, enrols] = await Promise.all([this.store.listDocs('class'), this.store.listDocs('enrol')]);
    return classes.filter((c) => !c.data.archived && (staff.role === 'admin' || c.data.ownerId === staff.learnerId)).map((c) => ({
      id: c.id, ...c.data,
      students: enrols.filter((e) => e.data.classId === c.id && e.data.status === 'active').length,
      pending: enrols.filter((e) => e.data.classId === c.id && e.data.status === 'pending').length,
      mine: c.data.ownerId === staff.learnerId,
    })).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }
  async saveClass(staff: Staff, body: Json, id?: string) {
    const prev = id ? await this.classOr404(id, staff) : undefined;
    const name = str(body.name, 120);
    if (!name) throw bad('Name the class, e.g. "CSE 2103 · Data Structures · Section A".');
    const track = str(body.track, 60) || null;
    if (track && !this.tutorials.adminTracks().some((t) => t.id === track)) throw bad('Choose a tutorial track.');
    const course = str(body.course, 80) || null;
    if (course && !getCourse(course)) throw bad('Choose a video course.');
    const data = {
      name, track, course, requireApproval: body.requireApproval === true,
      ownerId: prev?.data.ownerId ?? staff.learnerId, ownerEmail: prev?.data.ownerEmail ?? staff.email,
      code: prev?.data.code ?? await this.uniqueCode(), createdAt: prev?.data.createdAt ?? this.iso(), archived: false,
    };
    const cid = id ?? randomUUID();
    await this.put('class', cid, data);
    await this.audit(staff.email, id ? 'class.update' : 'class.create', cid, { name });
    return { id: cid, ...data };
  }
  private async uniqueCode() {
    const used = new Set((await this.store.listDocs('class')).map((c) => c.data.code));
    let code = newCode();
    while (used.has(code)) code = newCode();
    return code;
  }
  async newCode(staff: Staff, id: string) {
    const c = await this.classOr404(id, staff);
    const code = await this.uniqueCode();
    await this.put('class', id, { ...c.data, code });
    await this.audit(staff.email, 'class.code', id);
    return { code };
  }
  async archiveClass(staff: Staff, id: string) {
    const c = await this.classOr404(id, staff);
    await this.put('class', id, { ...c.data, archived: true });
    await this.audit(staff.email, 'class.archive', id);
    return { ok: true };
  }

  // ── students joining ──
  async join(learnerId: string, email: string | null, signedIn: boolean, codeIn: unknown) {
    if (!signedIn || !email) throw new AppError('unauthenticated', 401, 'Sign in first, so your instructor knows who you are.');
    const code = str(codeIn, 20).toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^(.{4})/, '$1-');
    const cls = (await this.store.listDocs('class')).find((c) => c.data.code === code && !c.data.archived);
    if (!cls) throw bad('No class has this code. Check it with your instructor.');
    const key = `${cls.id}:${learnerId}`;
    const prev = await this.store.getDoc('enrol', key);
    if (prev?.data.status === 'active') return { id: cls.id, name: cls.data.name, status: 'active', already: true };
    const status = cls.data.requireApproval ? 'pending' : 'active';
    await this.put('enrol', key, { classId: cls.id, learnerId, email: email.toLowerCase(), status, joinedAt: prev?.data.joinedAt ?? this.iso() });
    return { id: cls.id, name: cls.data.name, status };
  }
  async leave(learnerId: string, classId: string) {
    await this.store.deleteDoc('enrol', `${classId}:${learnerId}`);
    return { ok: true };
  }
  async approve(staff: Staff, classId: string, learnerId: string, ok: boolean) {
    await this.classOr404(classId, staff);
    const key = `${classId}:${learnerId}`;
    const e = await this.store.getDoc('enrol', key);
    if (!e) throw new AppError('not_found', 404, 'No such request.');
    if (ok) {
      await this.put('enrol', key, { ...e.data, status: 'active' });
      const c = await this.classOr404(classId, staff);
      await this.notices.emit(learnerId, 'join_approved', classId, { title: c.data.name, classId });
    }
    else await this.store.deleteDoc('enrol', key);
    await this.audit(staff.email, ok ? 'class.approve' : 'class.remove', classId, { student: e.data.email });
    return { ok: true };
  }

  // ── assignments, announcements ──
  async saveAssignment(staff: Staff, classId: string, body: Json, id?: string) {
    const c = await this.classOr404(classId, staff);
    const title = str(body.title, 140);
    if (!title) throw bad('Give the assignment a title.');
    const items = (Array.isArray(body.items) ? body.items : []).slice(0, 30).map((it: Json) => ({
      kind: ['read', 'quiz', 'lab', 'custom_quiz'].includes(it?.kind) ? it.kind : 'read', track: str(it?.track, 60) || c.data.track, topic: str(it?.topic, 80), lab: str(it?.lab, 80) || null, questionIds: it?.questionIds,
    })).filter((it: Json) => it.topic && (it.kind !== 'lab' || it.lab));
    if (!items.length) throw bad('Add at least one topic, quiz or lab.');
    const due = str(body.due, 40);
    if (due && !Number.isFinite(Date.parse(due))) throw bad('Choose a valid due date.');
    const aid = id ?? randomUUID();
    const prepared = [];
    for (const item of items) prepared.push(item.kind === 'custom_quiz' ? await new QuestionBankService(this.store, this.tutorials).prepare(staff, classId, aid, item, body.lang === 'bn' ? 'bn' : 'en') : { kind: item.kind, track: item.track, topic: item.topic, lab: item.lab });
    const data = { classId, title, items: prepared, due: due ? new Date(Date.parse(due)).toISOString() : null, marks: Math.max(0, Math.min(1000, Number(body.marks) || 0)), passMark: Math.max(0, Math.min(100, Number(body.passMark ?? 60))), hintsOnly: body.hintsOnly !== false, createdAt: this.iso(), by: staff.email };
    await this.put('assignment', aid, data);
    if (!id) await this.notices.forClass(classId, 'assignment', aid, title);
    await this.audit(staff.email, id ? 'assignment.update' : 'assignment.create', aid, { classId, title });
    return { id: aid, ...data };
  }
  async deleteAssignment(staff: Staff, classId: string, id: string) {
    await this.classOr404(classId, staff);
    await this.store.deleteDoc('assignment', id);
    await this.audit(staff.email, 'assignment.delete', id, { classId });
    return { ok: true };
  }
  async post(staff: Staff, classId: string, body: Json) {
    await this.classOr404(classId, staff);
    const title = str(body.title, 140);
    const text = str(body.body, 4000);
    if (!title || !text) throw bad('Write a title and a message.');
    const id = randomUUID();
    const data = { classId, title, body: text, pinned: body.pinned === true, at: this.iso(), by: staff.email };
    await this.put('classpost', id, data);
    await this.notices.forClass(classId, 'announcement', id, title);
    await this.audit(staff.email, 'class.post', classId, { title });
    return { id, ...data };
  }
  async deletePost(staff: Staff, classId: string, id: string) {
    await this.classOr404(classId, staff);
    await this.store.deleteDoc('classpost', id);
    return { ok: true };
  }

  // ── what the class did ──
  /** Topic views, quizzes, lab runs and AI questions of the given learners. */
  private async eventsOf(ids: Set<string>) {
    return (await this.store.readingEvents()).filter((e) => ids.has(e.learnerId));
  }
  private topicOf(e: ReadingEventRow) {
    const m = /^tutorial:([^:]+):(.+)$/.exec(e.lessonId);
    return m ? { track: m[1]!, topic: m[2]! } : null;
  }
  /** Per-student facts for one tutorial track. */
  private studentFacts(events: ReadingEventRow[], track: string | null) {
    const seen = new Set<string>(), labs = new Set<string>(), quizzes = new Map<string, { score: number; total: number; at: string }>(), customQuizzes = new Map<string, { score: number; total: number; at: string }>();
    let last = '';
    for (const e of events) {
      if (e.at > last) last = e.at;
      const t = this.topicOf(e);
      if (!t || (track && t.track !== track)) continue;
      if (e.type === 'view') seen.add(t.topic);
      if (e.type === 'quiz' && !e.payload.review && !(e.payload.adaptive && !e.payload.complete)) { seen.add(t.topic); (e.payload.customQuiz ? customQuizzes : quizzes).set(e.payload.customQuiz ? String(e.payload.customQuiz) : t.topic, { score: Number(e.payload.score) || 0, total: Number(e.payload.total) || 0, at: e.at }); }
      if (e.type === 'lab_check' && e.payload.lab) labs.add(`${t.topic}/${e.payload.lab}`);
    }
    const qs = [...quizzes.values(), ...customQuizzes.values()].filter((q) => q.total);
    return { seen, labs, quizzes, customQuizzes, quizAvg: qs.length ? qs.reduce((n, q) => n + q.score / q.total, 0) / qs.length : null, last: last || null };
  }
  private itemDone(item: Json, f: ReturnType<ClassService['studentFacts']>, passMark: number) {
    if (item.kind === 'read') return f.seen.has(item.topic);
    if (item.kind === 'custom_quiz') { const q = f.customQuizzes.get(item.quizId); return Boolean(q && q.total && 100 * q.score / q.total >= passMark); }
    if (item.kind === 'quiz') { const q = f.quizzes.get(item.topic); return Boolean(q && q.total && (100 * q.score) / q.total >= passMark); }
    return f.labs.has(`${item.topic}/${item.lab}`);
  }

  async gradebookCsv(staff: Staff, classId: string, lang: Lang = 'en') {
    const d = await this.dashboard(staff, classId, lang);
    const L = lang === 'bn' ? { student: 'শিক্ষার্থী', complete: 'সম্পন্ন', quiz: 'কুইজ (%)', overall: 'মোট সম্পন্ন (%)' } : { student: 'Student', complete: 'Complete', quiz: 'Quiz (%)', overall: 'Overall completion (%)' };
    return csv([
      [L.student, ...d.assignments.flatMap((a) => [`${a.title} · ${L.complete}`, `${a.title} · ${L.quiz}`]), L.overall],
      ...d.roster.map((student) => [student.email, ...d.assignments.flatMap((a) => {
        const r = student.assignments.find((r) => r.id === a.id)!;
        return [r.done === r.of ? '✓' : `${r.done}/${r.of}`, r.quizPercent ?? '—'];
      }), student.overallPercent ?? '—']),
    ]);
  }

  /** Everything the instructor dashboard shows for one class. */
  async dashboard(staff: Staff, classId: string, lang: Lang = 'en') {
    const c = await this.classOr404(classId, staff);
    const cls = { id: c.id, ...c.data };
    const [enrols, assignments, posts] = await Promise.all([this.store.listDocs('enrol'), this.store.listDocs('assignment'), this.store.listDocs('classpost')]);
    const mine = enrols.filter((e) => e.data.classId === classId);
    const active = mine.filter((e) => e.data.status === 'active');
    const ids = new Set(active.map((e) => e.data.learnerId as string));
    const events = await this.eventsOf(ids);
    const byStudent = new Map<string, ReadingEventRow[]>([...ids].map((id) => [id, []]));
    for (const e of events) byStudent.get(e.learnerId)?.push(e);
    const track = cls.track ? (() => { try { return this.tutorials.track(cls.track, lang); } catch { return null; } })() : null;
    const delivered = track ? track.modules.reduce((n: number, m: Json) => n + m.topics.filter((t: Json) => t.available).length, 0) : 0;
    const titleOf = new Map<string, string>(track ? track.modules.flatMap((m: Json) => m.topics.map((t: Json) => [t.id, t.title] as [string, string])) : []);
    const now = this.now().getTime();
    const myAssignments = assignments.filter((a) => a.data.classId === classId).sort((a, b) => String(a.data.due ?? 'z').localeCompare(String(b.data.due ?? 'z')));

    const roster = active.map((e) => {
      const f = this.studentFacts(byStudent.get(e.data.learnerId) ?? [], cls.track);
      const assignmentResults = myAssignments.map((a) => {
        const done = a.data.items.filter((it: Json) => this.itemDone(it, f, a.data.passMark)).length;
        const quizTopics = [...new Set(a.data.items.filter((it: Json) => it.kind === 'quiz').map((it: Json) => it.topic as string))];
        const scores = quizTopics.map((topic) => f.quizzes.get(topic)).filter((q) => q && q.total > 0);
        scores.push(...a.data.items.filter((it: Json) => it.kind === 'custom_quiz').map((it: Json) => f.customQuizzes.get(it.quizId)).filter((q: any) => q && q.total > 0));
        const quizPercent = scores.length ? Math.round(scores.reduce((n, q) => n + q!.score / q!.total, 0) / scores.length * 100) : null;
        return { id: a.id, done, of: a.data.items.length, quizPercent };
      });
      const asks = (byStudent.get(e.data.learnerId) ?? []).filter((x) => x.type === 'ask').length;
      const inactiveDays = f.last ? Math.floor((now - Date.parse(f.last)) / DAY) : null;
      const reasons: string[] = [];
      if (inactiveDays === null) reasons.push('Has not started yet');
      else if (inactiveDays >= 7) reasons.push(`Not active for ${inactiveDays} days`);
      if (f.quizAvg !== null && f.quizzes.size >= 2 && f.quizAvg < 0.5) reasons.push(`${Math.round(f.quizAvg * 100)}% quiz average`);
      return {
        learnerId: e.data.learnerId, email: e.data.email, joinedAt: e.data.joinedAt, done: f.seen.size, labs: f.labs.size,
        quizAvg: f.quizAvg === null ? null : Math.round(f.quizAvg * 100), lastActive: f.last, asks, reasons,
        assignments: assignmentResults,
        overallPercent: assignmentResults.length ? Math.round(assignmentResults.reduce((n, a) => n + a.done, 0) / assignmentResults.reduce((n, a) => n + a.of, 0) * 100) : null,
        modules: track ? track.modules.map((m: Json) => {
          const avail = m.topics.filter((t: Json) => t.available);
          return { id: m.id, title: m.title, pct: avail.length ? Math.round((100 * avail.filter((t: Json) => f.seen.has(t.id)).length) / avail.length) : null };
        }) : [],
      };
    }).sort((a, b) => a.email.localeCompare(b.email));

    const pairs = masteryPairs(events).filter((p) => !cls.track || p.track === cls.track);
    const masteryGain = [...new Set(pairs.map((p) => `${p.track}:${p.topic}`))].map((key) => {
      const rows = pairs.filter((p) => `${p.track}:${p.topic}` === key);
      const p = rows[0]!;
      return { track: p.track, topic: p.topic, title: this.tutorials.pageInfo(p.track, p.topic, lang)?.topicTitle ?? p.topic, students: rows.length, gain: Math.round(rows.reduce((n, r) => n + r.gain, 0) / rows.length * 100) / 100 };
    }).filter((r) => r.students >= this.minGroup);
    const enough = ids.size >= this.minGroup;
    // Quiz results: weakest topics, and the questions most often answered wrong.
    const topicScores = new Map<string, { sum: number; n: number; who: Set<string> }>();
    const qStats = new Map<string, { wrong: number; n: number; who: Set<string>; topic: string; qid: string }>();
    for (const e of events) {
      const t = this.topicOf(e);
      if (e.type !== 'quiz' || e.payload.customQuiz || e.payload.review || (e.payload.adaptive && !e.payload.complete) || !t || (cls.track && t.track !== cls.track)) continue;
      const s = topicScores.get(t.topic) ?? { sum: 0, n: 0, who: new Set() };
      if (Number(e.payload.total)) { s.sum += Number(e.payload.score) / Number(e.payload.total); s.n++; s.who.add(e.learnerId); }
      topicScores.set(t.topic, s);
      for (const [qid, right] of Object.entries((e.payload.correct ?? {}) as Record<string, boolean>)) {
        const k = `${t.topic}#${qid}`;
        const q = qStats.get(k) ?? { wrong: 0, n: 0, who: new Set(), topic: t.topic, qid };
        q.n++; if (!right) q.wrong++; q.who.add(e.learnerId);
        qStats.set(k, q);
      }
    }
    const hardTopics = [...topicScores].filter(([, s]) => s.who.size >= this.minGroup && s.n).map(([topic, s]) => ({ topic, title: titleOf.get(topic) ?? topic, avg: Math.round((100 * s.sum) / s.n), students: s.who.size })).sort((a, b) => a.avg - b.avg).slice(0, 6);
    const hardQuestions = [...qStats.values()].filter((q) => q.who.size >= this.minGroup).map((q) => {
      let prompt = q.qid;
      try { prompt = String(this.tutorials.topic(cls.track!, q.topic, lang).quiz.find((x: Json) => x.id === q.qid)?.prompt ?? q.qid); } catch { /* topic gone */ }
      return { topic: q.topic, title: titleOf.get(q.topic) ?? q.topic, prompt, correct: Math.round((100 * (q.n - q.wrong)) / q.n), answers: q.n };
    }).sort((a, b) => a.correct - b.correct).slice(0, 6);
    // Where students ask the AI for help (counted, never the question text).
    const askBy = new Map<string, Set<string>>();
    for (const e of events) if (e.type === 'ask') askBy.set(e.lessonId, (askBy.get(e.lessonId) ?? new Set()).add(e.learnerId));
    const asks = [...askBy].filter(([, who]) => who.size >= this.minGroup).map(([key, who]) => {
      const t = /^tutorial:([^:]+):(.+)$/.exec(key);
      return { page: key, title: t ? (titleOf.get(t[2]!) ?? t[2]!) : key.startsWith('course:') ? `Video course: ${getCourse(key.slice(7))?.title[lang] ?? key.slice(7)}` : key, students: who.size };
    }).sort((a, b) => b.students - a.students).slice(0, 8);
    // Module by module: share of students who opened every ready topic.
    const heat = track && enough ? track.modules.map((m: Json) => {
      const avail = m.topics.filter((t: Json) => t.available);
      if (!avail.length) return { id: m.id, title: m.title, pct: null };
      const doneBy = roster.filter((r) => { const f = this.studentFacts(byStudent.get(r.learnerId) ?? [], cls.track); return avail.every((t: Json) => f.seen.has(t.id)); }).length;
      return { id: m.id, title: m.title, pct: Math.round((100 * doneBy) / roster.length) };
    }) : null;
    // Labs: how many students ran each lab.
    const labRuns = new Map<string, Set<string>>();
    for (const e of events) { const t = this.topicOf(e); if (e.type === 'lab_check' && t && e.payload.lab && (!cls.track || t.track === cls.track)) labRuns.set(`${t.topic}/${e.payload.lab}`, (labRuns.get(`${t.topic}/${e.payload.lab}`) ?? new Set()).add(e.learnerId)); }
    const labs = [...labRuns].map(([k, who]) => ({ topic: k.split('/')[0]!, title: titleOf.get(k.split('/')[0]!) ?? k.split('/')[0]!, lab: k.split('/')[1]!, students: who.size })).sort((a, b) => b.students - a.students).slice(0, 10);
    // Video quizzes in the class's video course.
    const vq = new Map<string, { sum: number; n: number; who: Set<string> }>();
    for (const e of events) if (e.type === 'video_quiz' && cls.course && e.lessonId === `course:${cls.course}` && e.blockId && Number(e.payload.total)) {
      const s = vq.get(e.blockId) ?? { sum: 0, n: 0, who: new Set() };
      s.sum += Number(e.payload.score) / Number(e.payload.total); s.n++; s.who.add(e.learnerId);
      vq.set(e.blockId, s);
    }
    const videoQuizzes = [...vq].filter(([, s]) => s.who.size >= this.minGroup).map(([id, s]) => ({ videoId: id, title: getVideo(id)?.title ?? id, students: s.who.size, avg: Math.round((100 * s.sum) / s.n) }));

    const weekAgo = now - 7 * DAY;
    const quizAvgs = roster.map((r) => r.quizAvg).filter((v): v is number => v !== null);
    return {
      class: { ...cls, students: active.length },
      minGroup: this.minGroup, enough,
      kpis: {
        students: active.length, pending: mine.length - active.length,
        activeWeek: roster.filter((r) => r.lastActive && Date.parse(r.lastActive) > weekAgo).length,
        avgProgress: delivered && roster.length ? Math.round(roster.reduce((n, r) => n + Math.min(1, r.done / delivered), 0) / roster.length * 100) : null,
        quizAvg: enough && quizAvgs.length >= this.minGroup ? Math.round(quizAvgs.reduce((a, b) => a + b, 0) / quizAvgs.length) : null,
        needHelp: roster.filter((r) => r.reasons.length).length, delivered,
      },
      pending: mine.filter((e) => e.data.status === 'pending').map((e) => ({ learnerId: e.data.learnerId, email: e.data.email, at: e.data.joinedAt })),
      masteryGain, roster, hardTopics, hardQuestions, asks, heat, labs, videoQuizzes,
      assignments: myAssignments.map((a) => ({ id: a.id, ...a.data, items: a.data.items.map((it: Json) => ({ ...it, title: titleOf.get(it.topic) ?? it.topic })), submitted: roster.filter((r) => r.assignments.find((x) => x.id === a.id && x.done === x.of)).length })),
      posts: posts.filter((p) => p.data.classId === classId).map((p) => ({ id: p.id, ...p.data })).sort((a, b) => Number(b.pinned) - Number(a.pinned) || String(b.at).localeCompare(String(a.at))),
      track: track ? { id: track.id, title: track.title, modules: track.modules.map((m: Json) => ({ id: m.id, title: m.title, topics: m.topics.filter((t: Json) => t.available).map((t: Json) => ({ id: t.id, title: t.title, labs: t.labs })) })) } : null,
    };
  }

  /** The class's video course with each video's quiz and materials counts (content studio). */
  async studio(staff: Staff, classId: string, lang: Lang = 'en') {
    const c = await this.classOr404(classId, staff);
    const course = c.data.course ? getCourse(c.data.course) : null;
    if (!course) return { course: null, videos: [] };
    const marks = await this.extras.summary();
    return {
      course: { id: course.id, title: course.title[lang] },
      videos: courseVideoOrder(course).map((id, i) => ({ id, n: i + 1, title: getVideo(id)?.title ?? id, duration: getVideo(id)?.duration ?? '', quiz: marks.get(id)?.quiz ?? 0, materials: marks.get(id)?.materials ?? 0 })),
    };
  }

  // ── students' view ──
  async studentClasses(learnerId: string) {
    const enrols = (await this.store.listDocs('enrol')).filter((e) => e.data.learnerId === learnerId);
    if (!enrols.length) return { classes: [] };
    const [classes, assignments, posts, events] = await Promise.all([this.store.listDocs('class'), this.store.listDocs('assignment'), this.store.listDocs('classpost'), this.store.readingEvents(learnerId)]);
    const out = [];
    for (const e of enrols) {
      const c = classes.find((x) => x.id === e.data.classId && !x.data.archived);
      if (!c) continue;
      const f = this.studentFacts(events, c.data.track);
      const titleOf = (topic: string) => { try { return String(this.tutorials.topic(c.data.track ?? '', topic, 'en').topic.title); } catch { return topic; } };
      out.push({
        id: c.id, name: c.data.name, status: e.data.status, track: c.data.track, course: c.data.course, instructor: c.data.ownerEmail,
        posts: e.data.status === 'active' ? posts.filter((p) => p.data.classId === c.id).sort((a, b) => Number(b.data.pinned) - Number(a.data.pinned) || String(b.data.at).localeCompare(String(a.data.at))).slice(0, 5).map((p) => ({ title: p.data.title, body: p.data.body, at: p.data.at, pinned: p.data.pinned })) : [],
        assignments: e.data.status === 'active' ? assignments.filter((a) => a.data.classId === c.id).map((a) => ({
          id: a.id, title: a.data.title, due: a.data.due, marks: a.data.marks, passMark: a.data.passMark,
          items: a.data.items.map((it: Json) => ({ ...it, title: titleOf(it.topic), done: this.itemDone(it, f, a.data.passMark) })),
        })).sort((a, b) => String(a.due ?? 'z').localeCompare(String(b.due ?? 'z'))) : [],
      });
    }
    return { classes: out };
  }

  // ── exam packs (instructors write them; an admin approves them for Pro) ──
  async packs(staff: Staff, all = false) {
    return (await this.store.listDocs('pack')).filter((p) => all || staff.role === 'admin' || p.data.ownerId === staff.learnerId).map((p) => ({ id: p.id, ...p.data, updatedAt: p.updatedAt }));
  }
  async savePack(staff: Staff, body: Json, id?: string) {
    const prev = id ? await this.store.getDoc('pack', id) : undefined;
    if (id && !prev) throw new AppError('not_found', 404, 'No such pack.');
    if (prev && staff.role !== 'admin' && prev.data.ownerId !== staff.learnerId) throw new AppError('forbidden', 403, 'This is another instructor’s pack.');
    const title = str(body.title, 140);
    if (!title) throw bad('Name the pack.');
    const lines = (v: unknown, max: number) => (Array.isArray(v) ? v : String(v ?? '').split('\n')).map((x) => str(x, 200)).filter(Boolean).slice(0, max);
    const links = (Array.isArray(body.files) ? body.files : []).slice(0, 30).map((f: Json) => ({ name: str(f?.name, 120), url: str(f?.url, 400) })).filter((f: Json) => f.name && /^https:\/\//.test(f.url));
    const wantReview = body.submit === true;
    const data = {
      title, course: str(body.course, 80) || null, description: str(body.description, 2000), lessons: lines(body.lessons, 60), papers: lines(body.papers, 30),
      mockTests: Math.max(0, Math.min(50, Number(body.mockTests) || 0)), files: links,
      status: wantReview ? 'review' : prev?.data.status === 'approved' ? 'approved' : 'draft', note: prev?.data.note ?? null,
      ownerId: prev?.data.ownerId ?? staff.learnerId, ownerEmail: prev?.data.ownerEmail ?? staff.email, createdAt: prev?.data.createdAt ?? this.iso(),
    };
    const pid = id ?? randomUUID();
    await this.put('pack', pid, data);
    await this.audit(staff.email, wantReview ? 'pack.submit' : id ? 'pack.update' : 'pack.create', pid, { title });
    return { id: pid, ...data };
  }
  async reviewPack(admin: Staff, id: string, approve: boolean, note: unknown) {
    if (admin.role !== 'admin') throw new AppError('forbidden', 403, 'Only admins approve packs.');
    const p = await this.store.getDoc('pack', id);
    if (!p) throw new AppError('not_found', 404, 'No such pack.');
    await this.put('pack', id, { ...p.data, status: approve ? 'approved' : 'draft', note: approve ? null : str(note, 500) || 'Returned for changes.' });
    await this.audit(admin.email, approve ? 'pack.approve' : 'pack.return', id, { title: p.data.title });
    return { ok: true };
  }
}

export type { DocRow };
