// Admin site: who is an admin, and everything admins create — courses (free from a
// YouTube playlist, or paid with free samples), posts, ad banners, coupon codes,
// the announcement bar, hidden tracks and admin-written tutorial topics.
// Everything lives in the store as one JSON document per item (ll_docs), cached
// here so public pages never wait on the database. Every change is audited.

import { randomUUID } from 'node:crypto';
import { AppError } from './service.ts';
import type { DocRow, Store } from '../store/store.ts';
import type { TutorialService, CustomTopicDef, CustomTrackDef } from './tutorials.ts';
import type { WatchService } from './watch.ts';
import { COURSES, allCourses, isBuiltInCourse, setExtraCourses, SUBJECTS, type Course, type CourseSubject } from '../content/courses.ts';
import { setExtraVideos, formatDuration, VIDEOS, type ChannelPlaylist, type ChannelVideo } from '../content/videos.ts';
import { markdownToHtml, markdownText, slugify } from './markdown.ts';
import { cleanHtml } from './tutorials.ts';
import { courseVideoOrder } from './watch.ts';

type Lang = 'en' | 'bn';
type Bi = { en: string; bn: string };
type Json = Record<string, any>;
export type Role = 'admin' | 'instructor' | 'learner';

export type YtFetch = (url: string) => Promise<{ ok: boolean; status: number; json(): Promise<any> }>;

export interface AdminOptions {
  /** Comma-separated in ADMIN_EMAILS. These people are always admins. */
  adminEmails: string[];
  /** YOUTUBE_API_KEY: reads playlists when a course is added or synced. */
  youtubeKey: string | null;
  fetchImpl?: YtFetch;
  now?: () => Date;
  /** Background work (nightly sync, counter flushing). Off in tests. */
  timers?: boolean;
}

// ── input helpers ──
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const bi = (v: unknown, max = 200): Bi => {
  const o = (v && typeof v === 'object' ? v : {}) as Json;
  return { en: str(o.en, max), bn: str(o.bn, max) };
};
const int = (v: unknown, min: number, max: number, dflt: number) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : dflt;
};
const bool = (v: unknown) => v === true;
const isoOrNull = (v: unknown) => {
  const s = str(v, 40);
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
};
const bad = (msg: string) => new AppError('bad_input', 400, msg);
const TINTS = ['#e6efb5', '#d9ecf2', '#f4e3c8', '#e5e0f4', '#f3dcd6', '#dcefe4'];
const mask = (email: string) => {
  const [u, d] = email.split('@');
  return u && d ? `${u[0]}${'•'.repeat(Math.max(2, Math.min(6, u.length - 1)))}@${d}` : email;
};

/** "PL…" from a playlist link or a bare id. */
export function playlistIdFrom(input: string): string | null {
  const s = input.trim();
  let id = s;
  try {
    const u = new URL(s);
    if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(u.hostname)) return null;
    id = u.searchParams.get('list') ?? '';
  } catch { /* a bare id */ }
  return /^[A-Za-z0-9_-]{10,64}$/.test(id) ? id : null;
}

/** ISO 8601 duration (PT1H2M3S) → seconds. */
export function isoSeconds(d: string): number {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(d ?? '');
  if (!m) return 0;
  return (Number(m[1] ?? 0) * 86400) + (Number(m[2] ?? 0) * 3600) + (Number(m[3] ?? 0) * 60) + Number(m[4] ?? 0);
}

interface ImportedVideo { id: string; title: string; seconds: number; duration: string; by: string | null }
interface Imported { playlistId: string; title: string; channel: string; videos: ImportedVideo[]; at: number }

/** The page key every public page sends with ad requests, e.g. "learn/data-structures/ds-stack". */
const pageMatches = (key: string, targets: string[]) => targets.some((t) => t === '*' || key === t || key.startsWith(t.replace(/\/$/, '') + '/'));

export class AdminService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  private readonly watch: WatchService;
  private readonly opts: AdminOptions;
  private readonly fetchImpl: YtFetch;
  private readonly now: () => Date;
  private cache = new Map<string, DocRow[]>();
  private imports = new Map<string, Imported>();
  private grants = new Map<string, boolean>();
  private touched = new Map<string, number>();
  private counters = new Map<string, Json>(); // "ad:<id>" / "post:<id>" → pending counter increments
  private lastSync = 0;

  constructor(store: Store, tutorials: TutorialService, watch: WatchService, opts: AdminOptions) {
    this.store = store;
    this.tutorials = tutorials;
    this.watch = watch;
    this.opts = { ...opts, adminEmails: opts.adminEmails.map((e) => e.trim().toLowerCase()).filter(Boolean) };
    this.fetchImpl = opts.fetchImpl ?? (globalThis.fetch as unknown as YtFetch);
    this.now = opts.now ?? (() => new Date());
    watch.setAccessCheck((learnerId, courseId) => this.hasAccess(learnerId, courseId));
  }

  static readonly KINDS = ['course', 'post', 'ad', 'coupon', 'site', 'track', 'topic', 'role'] as const;

  async init() {
    for (const k of AdminService.KINDS) this.cache.set(k, await this.store.listDocs(k).catch(() => []));
    this.apply();
    if (this.opts.timers !== false) {
      setInterval(() => void this.flushCounters(), 60_000).unref();
      setInterval(() => void this.nightlySync(), 60 * 60_000).unref();
    }
  }

  private docs(kind: string) { return this.cache.get(kind) ?? []; }
  private doc(kind: string, id: string) { return this.docs(kind).find((d) => d.id === id); }
  private async put(kind: string, id: string, data: Json) {
    const row: DocRow = { kind, id, data, updatedAt: this.now().toISOString() };
    await this.store.putDoc(row);
    this.cache.set(kind, [row, ...this.docs(kind).filter((d) => d.id !== id)]);
    return row;
  }
  private async remove(kind: string, id: string) {
    await this.store.deleteDoc(kind, id);
    this.cache.set(kind, this.docs(kind).filter((d) => d.id !== id));
  }
  private async audit(actor: string, action: string, target: string, detail: Json = {}) {
    await this.store.addAudit({ at: this.now().toISOString(), actor, action, target, detail }).catch((e) => console.warn('audit:', (e as Error).message));
  }
  private settings(): Json { return this.doc('site', 'settings')?.data ?? {}; }

  /** Pushes admin content into the catalogs the public pages read. */
  private apply() {
    const s = this.settings();
    const playlists: ChannelPlaylist[] = [];
    const videos: ChannelVideo[] = [];
    const courses: Course[] = [];
    for (const d of this.docs('course')) {
      const c = d.data;
      if (!c.published) continue;
      const shown = (c.videos ?? []).filter((v: Json) => !v.hidden);
      const plId = `admin-${d.id}`;
      playlists.push({ id: plId, title: c.playlistTitle || c.title.en, videoIds: shown.map((v: Json) => v.id) });
      for (const v of shown) if (!VIDEOS.has(v.id) && !videos.some((x) => x.id === v.id)) videos.push({ id: v.id, title: v.title, duration: v.duration, seconds: v.seconds, by: v.by ?? null });
      courses.push({
        id: d.id, code: c.code || null, subject: c.subject as CourseSubject, title: c.title, blurb: c.blurb,
        playlists: [{ id: plId, title: c.playlistTitle || c.title.en, videos: shown.length, youtubeId: c.access === 'paid' ? undefined : c.playlistId }],
        lessons: [], practice: false, access: c.access, price: c.access === 'paid' ? `৳ ${c.price}` : null,
        sampleIds: shown.filter((v: Json) => v.sample).map((v: Json) => v.id), tint: c.tint ?? null, dynamic: true,
      });
    }
    setExtraVideos(playlists, videos);
    setExtraCourses(courses, (s.hiddenCourses ?? []) as string[]);
    this.tutorials.setHiddenTracks((s.hiddenTracks ?? []) as string[]);
    const tracks = this.docs('track').filter((d) => d.data.published !== false).map((d) => ({ ...d.data, id: d.id }) as CustomTrackDef);
    const topics = this.docs('topic').filter((d) => d.data.status === 'published').map((d) => ({ ...d.data, id: d.id }) as CustomTopicDef);
    this.tutorials.applyCustom(tracks, topics);
  }

  // ── people ──
  roleOf(email: string | null | undefined): Role {
    const e = (email ?? '').toLowerCase();
    if (!e) return 'learner';
    if (this.opts.adminEmails.includes(e)) return 'admin';
    const r = this.doc('role', e)?.data.role;
    return r === 'admin' || r === 'instructor' ? r : 'learner';
  }
  isAdmin(email: string | null | undefined) { return this.roleOf(email) === 'admin'; }

  /** Remembers signed-in people for the Users list (at most once an hour per person). */
  async touchMember(learnerId: string, email: string | null) {
    if (!email) return;
    const last = this.touched.get(learnerId) ?? 0;
    if (Date.now() - last < 3_600_000) return;
    this.touched.set(learnerId, Date.now());
    const now = this.now().toISOString();
    const prev = await this.store.getDoc('member', learnerId).catch(() => undefined);
    await this.store.putDoc({ kind: 'member', id: learnerId, data: { email: email.toLowerCase(), firstSeen: prev?.data.firstSeen ?? now, lastSeen: now }, updatedAt: now }).catch(() => undefined);
  }

  async users() {
    const members = await this.store.listDocs('member');
    const rows = members.map((m) => ({ id: m.id, email: m.data.email as string, role: this.roleOf(m.data.email), firstSeen: m.data.firstSeen, lastSeen: m.data.lastSeen, fixed: this.opts.adminEmails.includes(m.data.email) }));
    for (const r of this.docs('role')) if (!rows.some((x) => x.email === r.id)) rows.push({ id: '', email: r.id, role: this.roleOf(r.id), firstSeen: null, lastSeen: null, fixed: false });
    for (const e of this.opts.adminEmails) if (!rows.some((x) => x.email === e)) rows.push({ id: '', email: e, role: 'admin', firstSeen: null, lastSeen: null, fixed: true });
    rows.sort((a, b) => String(b.lastSeen ?? '').localeCompare(String(a.lastSeen ?? '')));
    return { users: rows, counts: { total: members.length, admins: rows.filter((r) => r.role === 'admin').length, instructors: rows.filter((r) => r.role === 'instructor').length } };
  }

  async setRole(actor: string, emailIn: unknown, roleIn: unknown) {
    const email = str(emailIn, 254).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) throw bad('Enter a valid email address.');
    const role = roleIn === 'admin' || roleIn === 'instructor' ? roleIn : 'learner';
    if (this.opts.adminEmails.includes(email)) throw bad('This person is an admin in the server settings (ADMIN_EMAILS) and cannot be changed here.');
    if (email === actor.toLowerCase() && role !== 'admin') throw bad('You cannot remove your own admin role.');
    if (role === 'learner') await this.remove('role', email); else await this.put('role', email, { role });
    await this.audit(actor, 'role.set', email, { role });
    return { email, role };
  }

  // ── paid course access ──
  private grantKey = (courseId: string, learnerId: string) => `${courseId}:${learnerId}`;
  async hasAccess(learnerId: string, courseId: string) {
    const key = this.grantKey(courseId, learnerId);
    if (this.grants.has(key)) return this.grants.get(key)!;
    const d = await this.store.getDoc('grant', key).catch(() => undefined);
    const ok = Boolean(d && (!d.data.until || Date.parse(d.data.until) > Date.now()));
    this.grants.set(key, ok);
    return ok;
  }
  async grantAccess(actor: string, courseId: string, emailIn: unknown) {
    const course = this.doc('course', courseId);
    if (!course || course.data.access !== 'paid') throw bad('Access can only be given for a paid course.');
    const email = str(emailIn, 254).toLowerCase();
    const member = (await this.store.listDocs('member')).find((m) => m.data.email === email);
    if (!member) throw bad('Nobody with this email has signed in yet. Ask them to sign in once, then try again.');
    const months = Number(course.data.accessMonths) || 0;
    const until = months ? new Date(this.now().getTime() + months * 30 * 86400_000).toISOString() : null;
    await this.store.putDoc({ kind: 'grant', id: this.grantKey(courseId, member.id), data: { courseId, learnerId: member.id, email, until, by: actor, at: this.now().toISOString() }, updatedAt: this.now().toISOString() });
    this.grants.delete(this.grantKey(courseId, member.id));
    await this.audit(actor, 'course.grant', courseId, { email, until });
    return { ok: true, email, until };
  }
  async revokeAccess(actor: string, courseId: string, learnerId: string) {
    await this.store.deleteDoc('grant', this.grantKey(courseId, learnerId));
    this.grants.delete(this.grantKey(courseId, learnerId));
    await this.audit(actor, 'course.revoke', courseId, { learnerId });
    return { ok: true };
  }
  async courseGrants(courseId: string) {
    return (await this.store.listDocs('grant')).filter((g) => g.data.courseId === courseId).map((g) => ({ learnerId: g.data.learnerId, email: g.data.email, until: g.data.until, at: g.data.at }));
  }

  // ── YouTube ──
  async importPlaylist(input: unknown): Promise<Imported> {
    const playlistId = playlistIdFrom(str(input, 300));
    if (!playlistId) throw bad('Paste a YouTube playlist link (it contains "list=").');
    const hit = this.imports.get(playlistId);
    if (hit && Date.now() - hit.at < 10 * 60_000) return hit;
    const key = this.opts.youtubeKey;
    if (!key) throw new AppError('youtube_key_missing', 503, 'Reading playlists needs a YouTube Data API key. Add YOUTUBE_API_KEY in the server settings, then try again.');
    const api = (path: string) => `https://www.googleapis.com/youtube/v3/${path}&key=${encodeURIComponent(key)}`;
    const get = async (url: string) => {
      const r = await this.fetchImpl(url);
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        const reason = body?.error?.errors?.[0]?.reason ?? body?.error?.message ?? r.status;
        throw new AppError('youtube_error', 502, r.status === 404 || reason === 'playlistNotFound' ? 'YouTube could not find this playlist. Check the link, and make sure the playlist is public or unlisted (not private).' : `YouTube refused the request (${reason}).`);
      }
      return r.json();
    };
    const meta = await get(api(`playlists?part=snippet&id=${encodeURIComponent(playlistId)}`));
    const pl = meta.items?.[0];
    if (!pl) throw new AppError('youtube_error', 404, 'YouTube could not find this playlist. Check the link, and make sure the playlist is public or unlisted (not private).');
    const ids: string[] = [];
    let page = '';
    for (let i = 0; i < 20; i++) { // at most 1,000 videos
      const r = await get(api(`playlistItems?part=contentDetails,status&maxResults=50&playlistId=${encodeURIComponent(playlistId)}${page ? `&pageToken=${encodeURIComponent(page)}` : ''}`));
      for (const it of r.items ?? []) {
        const vid = it.contentDetails?.videoId;
        if (vid && it.status?.privacyStatus !== 'private' && !ids.includes(vid)) ids.push(vid);
      }
      page = r.nextPageToken ?? '';
      if (!page) break;
    }
    const videos: ImportedVideo[] = [];
    for (let i = 0; i < ids.length; i += 50) {
      const r = await get(api(`videos?part=snippet,contentDetails&id=${ids.slice(i, i + 50).map(encodeURIComponent).join(',')}`));
      const byId = new Map((r.items ?? []).map((v: Json) => [v.id, v]));
      for (const id of ids.slice(i, i + 50)) {
        const v = byId.get(id) as Json | undefined;
        if (!v) continue; // deleted or private
        const seconds = isoSeconds(v.contentDetails?.duration ?? '');
        videos.push({ id, title: str(v.snippet?.title, 200) || id, seconds, duration: formatDuration(seconds), by: v.snippet?.channelId && v.snippet.channelId !== pl.snippet?.channelId ? str(v.snippet?.channelTitle, 80) || null : null });
      }
    }
    if (!videos.length) throw bad('This playlist has no videos that can be shown (they may be private or deleted).');
    const out: Imported = { playlistId, title: str(pl.snippet?.title, 200), channel: str(pl.snippet?.channelTitle, 120), videos, at: Date.now() };
    this.imports.set(playlistId, out);
    return out;
  }

  // ── courses ──
  adminCourses() {
    const hidden = new Set((this.settings().hiddenCourses ?? []) as string[]);
    return {
      builtIn: COURSES.map((c) => ({ id: c.id, title: c.title.en, code: c.code, videos: courseVideoOrder(c).length, hidden: hidden.has(c.id) })),
      added: this.docs('course').map((d) => this.courseOut(d)),
      youtubeKey: Boolean(this.opts.youtubeKey),
    };
  }
  private courseOut(d: DocRow) {
    const c = d.data;
    const shown = (c.videos ?? []).filter((v: Json) => !v.hidden);
    return { id: d.id, ...c, counts: { videos: shown.length, samples: shown.filter((v: Json) => v.sample).length, seconds: shown.reduce((n: number, v: Json) => n + (v.seconds || 0), 0) }, updatedAt: d.updatedAt };
  }
  getCourse(id: string) {
    const d = this.doc('course', id);
    if (!d) throw new AppError('not_found', 404, 'No such course.');
    return this.courseOut(d);
  }

  async saveCourse(actor: string, body: Json, existingId?: string) {
    const prev = existingId ? this.doc('course', existingId) : undefined;
    if (existingId && !prev) throw new AppError('not_found', 404, 'No such course.');
    const access = body.access === 'paid' ? 'paid' : body.access === 'free' ? 'free' : null;
    if (!access) throw bad('Choose whether the course is free or paid.');
    const title = bi(body.title, 120);
    if (!title.en) throw bad('Give the course an English name.');
    const subject = (Object.keys(SUBJECTS).includes(body.subject) ? body.subject : 'cse') as CourseSubject;
    let price = 0;
    if (access === 'paid') {
      price = int(body.price, 0, 1_000_000, 0);
      if (!price) throw bad('Enter the price in taka for a paid course.');
    }
    const link = str(body.playlist, 300) || prev?.data.playlistId || '';
    if (!link) throw bad(access === 'free' ? 'A free course needs its YouTube playlist link.' : 'Add the unlisted YouTube playlist that holds the course videos.');
    const imported = await this.importPlaylist(link);
    const flags = new Map<string, Json>();
    for (const v of (Array.isArray(body.videos) ? body.videos : prev?.data.videos ?? []) as Json[]) if (v && typeof v.id === 'string') flags.set(v.id, v);
    const order: string[] = Array.isArray(body.videos) ? (body.videos as Json[]).map((v) => String(v.id)).filter((id) => imported.videos.some((x) => x.id === id)) : [];
    const ordered = [...order, ...imported.videos.map((v) => v.id).filter((id) => !order.includes(id))];
    const videos = ordered.map((id) => {
      const v = imported.videos.find((x) => x.id === id)!;
      const f = flags.get(id);
      return { ...v, hidden: f?.hidden === true, sample: access === 'paid' && f?.sample === true };
    });
    if (access === 'paid' && !videos.some((v) => v.sample && !v.hidden)) videos.filter((v) => !v.hidden).slice(0, 2).forEach((v) => (v.sample = true));
    const id = existingId ?? this.newCourseId(title.en, str(body.code, 30));
    const data = {
      access, title, blurb: bi(body.blurb, 400), code: str(body.code, 30), subject, instructor: str(body.instructor, 120), linkedTrack: str(body.linkedTrack, 60) || null,
      tint: TINTS.includes(body.tint) ? body.tint : TINTS[1], playlistId: imported.playlistId, playlistTitle: imported.title, channel: imported.channel,
      videos, nightlySync: body.nightlySync !== false, price: access === 'paid' ? price : null, accessMonths: access === 'paid' ? int(body.accessMonths, 0, 120, 6) : null,
      includedInPro: access === 'paid' ? body.includedInPro !== false : null, couponsAllowed: access === 'paid' ? body.couponsAllowed !== false : null,
      published: body.published === true, syncedAt: this.now().toISOString(), createdAt: prev?.data.createdAt ?? this.now().toISOString(),
    };
    await this.put('course', id, data);
    this.apply();
    await this.audit(actor, existingId ? 'course.update' : 'course.create', id, { access, published: data.published, videos: videos.length });
    return this.getCourse(id);
  }
  private newCourseId(title: string, code: string) {
    const base = slugify(code ? `${code}-${title}` : title).replace(/[^a-z0-9-]/g, '') || 'course';
    let id = base, n = 2;
    while (isBuiltInCourse(id) || this.doc('course', id)) id = `${base}-${n++}`;
    return id;
  }
  async deleteCourse(actor: string, id: string) {
    if (!this.doc('course', id)) throw new AppError('not_found', 404, 'No such course.');
    await this.remove('course', id);
    this.apply();
    await this.audit(actor, 'course.delete', id);
    return { ok: true };
  }
  async syncCourse(actor: string, id: string) {
    const d = this.doc('course', id);
    if (!d) throw new AppError('not_found', 404, 'No such course.');
    this.imports.delete(d.data.playlistId);
    const before = (d.data.videos ?? []).length;
    const out = await this.saveCourse(actor, { ...d.data, playlist: d.data.playlistId, videos: d.data.videos }, id);
    return { ...out, added: out.videos.length - before };
  }
  private async nightlySync() {
    if (Date.now() - this.lastSync < 23 * 3_600_000 || !this.opts.youtubeKey) return;
    this.lastSync = Date.now();
    for (const d of this.docs('course')) if (d.data.nightlySync) await this.syncCourse('system (nightly sync)', d.id).catch((e) => console.warn(`sync ${d.id}:`, (e as Error).message));
  }
  async setBuiltInHidden(actor: string, kind: 'course' | 'track', id: string, hidden: boolean) {
    const s = { ...this.settings() };
    const key = kind === 'course' ? 'hiddenCourses' : 'hiddenTracks';
    const set = new Set<string>((s[key] ?? []) as string[]);
    if (hidden) set.add(id); else set.delete(id);
    s[key] = [...set];
    await this.put('site', 'settings', s);
    this.apply();
    await this.audit(actor, `${kind}.${hidden ? 'hide' : 'show'}`, id);
    return { id, hidden };
  }

  // ── admin-written tutorials ──
  tutorialsAdmin() {
    return {
      tracks: this.tutorials.adminTracks(),
      customTracks: this.docs('track').map((d) => ({ id: d.id, ...d.data, updatedAt: d.updatedAt })),
      topics: this.docs('topic').map((d) => ({ id: d.id, track: d.data.track, module: d.data.module, title: d.data.title, status: d.data.status, issues: this.topicIssues(d.data), updatedAt: d.updatedAt })),
    };
  }
  getTopic(id: string) {
    const d = this.doc('topic', id);
    if (!d) throw new AppError('not_found', 404, 'No such topic.');
    return { id, ...d.data, issues: this.topicIssues(d.data) };
  }
  /** The admin version of the content checker: errors block publishing, warnings do not. */
  topicIssues(t: Json) {
    const out: { level: 'error' | 'warning' | 'ok'; text: string }[] = [];
    const push = (ok: boolean, level: 'error' | 'warning', good: string, badText: string) => out.push(ok ? { level: 'ok', text: good } : { level, text: badText });
    push(Boolean(t.title?.en), 'error', 'English title', 'Needs an English title');
    push(Boolean(t.title?.bn), 'warning', 'Bangla title', 'No Bangla title yet (the English one will be shown)');
    push(markdownText(t.body?.en ?? '').length >= 150, 'error', 'English text', 'The English text is too short (at least 150 characters)');
    push(Boolean(markdownText(t.body?.bn ?? '')), 'warning', 'Bangla text', 'Bangla text not written yet (the English text will be shown)');
    const quiz: Json[] = t.quiz ?? [];
    push(quiz.length >= 3, 'error', `${quiz.length} quiz questions`, `Needs at least 3 quiz questions (has ${quiz.length})`);
    const badQ = quiz.findIndex((q) => !q.prompt || (q.options ?? []).filter(Boolean).length < 2 || !(q.answer >= 0 && q.answer < (q.options ?? []).length));
    if (badQ >= 0) out.push({ level: 'error', text: `Quiz question ${badQ + 1} needs a question, at least 2 options and a correct answer` });
    const ex: Json[] = t.examples ?? [];
    if (ex.some((e) => e.code && !e.output)) out.push({ level: 'warning', text: 'An example has code but no output' });
    if (!ex.length) out.push({ level: 'warning', text: 'No code example' });
    return out;
  }
  async saveTopic(actor: string, body: Json, existingId?: string) {
    const prev = existingId ? this.doc('topic', existingId) : undefined;
    if (existingId && !prev) throw new AppError('not_found', 404, 'No such topic.');
    const track = str(body.track, 60);
    const tr = this.tutorials.adminTracks().find((t) => t.id === track);
    if (!tr) throw bad('Choose a track.');
    const module = str(body.module, 60);
    if (!tr.modules.some((m: Json) => m.id === module)) throw bad('Choose a module of that track.');
    const title = bi(body.title, 120);
    const data: Json = {
      track, module, title, summary: bi(body.summary, 300), level: ['beginner', 'intermediate', 'advanced'].includes(body.level) ? body.level : 'beginner',
      minutes: int(body.minutes, 1, 240, 10), body: bi(body.body, 60_000),
      examples: (Array.isArray(body.examples) ? body.examples : []).slice(0, 10).map((e: Json) => ({ title: str(e?.title, 120), language: str(e?.language, 20) || tr.language || 'c', code: str(e?.code, 20_000), output: str(e?.output, 20_000) })).filter((e: Json) => e.code),
      quiz: (Array.isArray(body.quiz) ? body.quiz : []).slice(0, 20).map((q: Json) => ({ prompt: str(q?.prompt, 500), options: (Array.isArray(q?.options) ? q.options : []).slice(0, 6).map((o: unknown) => str(o, 300)), answer: int(q?.answer, 0, 5, 0), explanation: str(q?.explanation, 1000) })),
      status: prev?.data.status ?? 'draft', createdAt: prev?.data.createdAt ?? this.now().toISOString(),
    };
    const wantPublish = body.publish === true;
    if (wantPublish) {
      const errors = this.topicIssues(data).filter((i) => i.level === 'error');
      if (errors.length) throw new AppError('not_ready', 400, `Fix these first: ${errors.map((e) => e.text).join('; ')}.`);
      data.status = 'published';
    } else if (body.publish === false) data.status = 'draft';
    const id = existingId ?? this.newTopicId(track, title.en);
    await this.put('topic', id, data);
    this.apply();
    await this.audit(actor, existingId ? 'topic.update' : 'topic.create', id, { track, status: data.status });
    return this.getTopic(id);
  }
  private newTopicId(track: string, title: string) {
    const base = `${track.slice(0, 12)}-${slugify(title).replace(/[^a-z0-9-]/g, '')}`.replace(/-+$/, '') || `${track}-topic`;
    let id = base, n = 2;
    const exists = (x: string) => Boolean(this.doc('topic', x)) || this.tutorials.adminTracks().some((t) => t.id === x);
    while (exists(id)) id = `${base}-${n++}`;
    return id;
  }
  async deleteTopic(actor: string, id: string) {
    if (!this.doc('topic', id)) throw new AppError('not_found', 404, 'No such topic.');
    await this.remove('topic', id);
    this.apply();
    await this.audit(actor, 'topic.delete', id);
    return { ok: true };
  }
  async saveTrack(actor: string, body: Json, existingId?: string) {
    const title = bi(body.title, 120);
    if (!title.en) throw bad('Give the track an English name.');
    const modules = (Array.isArray(body.modules) ? body.modules : []).slice(0, 30).map((m: Json) => ({ id: slugify(str(m?.id, 60) || str(m?.title?.en, 60)).replace(/[^a-z0-9-]/g, ''), title: bi(m?.title, 120) })).filter((m: Json) => m.id && m.title.en);
    if (!modules.length) throw bad('Add at least one module.');
    const id = existingId ?? (() => {
      const base = slugify(title.en).replace(/[^a-z0-9-]/g, '') || 'track';
      let x = base, n = 2;
      while (this.doc('track', x) || this.tutorials.adminTracks().some((t) => t.id === x)) x = `${base}-${n++}`;
      return x;
    })();
    if (existingId && !this.doc('track', existingId)) throw new AppError('not_found', 404, 'No such track.');
    const data: CustomTrackDef & Json = { id, title, blurb: bi(body.blurb, 300), language: ['c', 'python', 'java', 'sql', 'none'].includes(body.language) ? body.language : 'c', course: str(body.course, 60) || null, modules, published: true };
    await this.put('track', id, data);
    this.apply();
    await this.audit(actor, existingId ? 'track.update' : 'track.create', id, { modules: modules.length });
    return data;
  }

  // ── posts ──
  posts() { return this.docs('post').map((d) => ({ id: d.id, ...d.data, updatedAt: d.updatedAt })).sort((a, b) => String(b.publishAt ?? b.createdAt).localeCompare(String(a.publishAt ?? a.createdAt))); }
  getPost(id: string) {
    const d = this.doc('post', id);
    if (!d) throw new AppError('not_found', 404, 'No such post.');
    return { id, ...d.data };
  }
  async savePost(actor: string, body: Json, existingId?: string) {
    const prev = existingId ? this.doc('post', existingId) : undefined;
    if (existingId && !prev) throw new AppError('not_found', 404, 'No such post.');
    const title = bi(body.title, 160);
    if (!title.en) throw bad('Give the post an English title.');
    const slug = slugify(str(body.slug, 80) || title.en).replace(/[^a-z0-9-]/g, '');
    if (!slug) throw bad('The web address can only use letters, numbers and dashes.');
    const clash = this.docs('post').find((d) => d.data.slug === slug && d.id !== existingId);
    if (clash) throw bad('Another post already uses this web address.');
    const status = ['draft', 'published', 'scheduled'].includes(body.status) ? body.status : 'draft';
    const publishAt = status === 'scheduled' ? isoOrNull(body.publishAt) : status === 'published' ? prev?.data.publishAt ?? this.now().toISOString() : null;
    if (status === 'scheduled' && !publishAt) throw bad('Choose when the post should go live.');
    const data = {
      slug, title, body: bi(body.body, 100_000), excerpt: bi(body.excerpt, 300), type: ['blog', 'news', 'changelog', 'exam-notice'].includes(body.type) ? body.type : 'blog',
      tags: (Array.isArray(body.tags) ? body.tags : String(body.tags ?? '').split(',')).map((t: unknown) => str(t, 40)).filter(Boolean).slice(0, 10),
      author: str(body.author, 80) || 'Loop & Logic team', status, publishAt, views: prev?.data.views ?? 0, createdAt: prev?.data.createdAt ?? this.now().toISOString(),
    };
    const id = existingId ?? slug;
    await this.put('post', id, data);
    await this.audit(actor, existingId ? 'post.update' : 'post.create', id, { status });
    return this.getPost(id);
  }
  async deletePost(actor: string, id: string) {
    if (!this.doc('post', id)) throw new AppError('not_found', 404, 'No such post.');
    await this.remove('post', id);
    await this.audit(actor, 'post.delete', id);
    return { ok: true };
  }
  private live(p: Json) { return (p.status === 'published' || p.status === 'scheduled') && p.publishAt && Date.parse(p.publishAt) <= this.now().getTime(); }
  publicPosts(lang: Lang) {
    return {
      posts: this.docs('post').filter((d) => this.live(d.data)).sort((a, b) => String(b.data.publishAt).localeCompare(String(a.data.publishAt))).map((d) => {
        const p = d.data;
        return { slug: p.slug, type: p.type, title: p.title[lang] || p.title.en, excerpt: (p.excerpt[lang] || p.excerpt.en) || markdownText(p.body[lang] || p.body.en).slice(0, 220), author: p.author, publishedAt: p.publishAt, tags: p.tags };
      }),
    };
  }
  publicPost(slug: string, lang: Lang) {
    const d = this.docs('post').find((x) => x.data.slug === slug && this.live(x.data));
    if (!d) throw new AppError('not_found', 404, lang === 'bn' ? 'এই লেখাটি পাওয়া যায়নি।' : 'This post could not be found.');
    const p = d.data;
    const useBn = lang === 'bn' && Boolean(p.body.bn?.trim());
    this.bump(`post:${d.id}`, 'views');
    return { slug: p.slug, type: p.type, title: (useBn ? p.title.bn : '') || p.title.en, author: p.author, publishedAt: p.publishAt, tags: p.tags, bodyLang: useBn ? 'bn' : 'en', bodyHtml: cleanHtml(markdownToHtml(useBn ? p.body.bn : p.body.en)) };
  }

  // ── ad banners ──
  ads() { return this.docs('ad').map((d) => ({ id: d.id, ...d.data, updatedAt: d.updatedAt })); }
  async saveAd(actor: string, body: Json, existingId?: string) {
    const prev = existingId ? this.doc('ad', existingId) : undefined;
    if (existingId && !prev) throw new AppError('not_found', 404, 'No such ad.');
    const head = bi(body.head, 140);
    if (!head.en) throw bad('Write the headline in English.');
    const href = str(body.href, 300);
    if (!/^(\/[^\s]*|https:\/\/[^\s]+)$/.test(href)) throw bad('The button must open a page on this site (starting with /) or an https:// link.');
    const pages = (Array.isArray(body.pages) ? body.pages : []).map((p: unknown) => str(p, 120).replace(/^\/+/, '')).filter((p: string) => p === '*' || /^[a-z0-9][a-z0-9/_-]*$/.test(p)).slice(0, 40);
    if (!pages.length) throw bad('Choose at least one page (or "Every page").');
    const data = {
      name: str(body.name, 80) || head.en.slice(0, 60), head, cta: bi(body.cta, 40), href,
      theme: ['ink', 'lime', 'gold', 'teal'].includes(body.theme) ? body.theme : 'ink',
      placement: ['top', 'inline', 'side', 'video'].includes(body.placement) ? body.placement : 'top',
      pages, audience: ['everyone', 'signedIn', 'anonymous'].includes(body.audience) ? body.audience : 'everyone',
      start: isoOrNull(body.start), end: isoOrNull(body.end), priority: ['turns', 'high', 'low'].includes(body.priority) ? body.priority : 'turns',
      reshowDays: int(body.reshowDays, 0, 365, 3), status: ['draft', 'running', 'stopped'].includes(body.status) ? body.status : 'draft',
      stats: prev?.data.stats ?? { views: 0, clicks: 0, closes: 0 }, createdAt: prev?.data.createdAt ?? this.now().toISOString(),
    };
    const id = existingId ?? `ad-${randomUUID().slice(0, 8)}`;
    await this.put('ad', id, data);
    await this.audit(actor, existingId ? 'ad.update' : 'ad.create', id, { status: data.status, placement: data.placement, pages });
    return { id, ...data };
  }
  async deleteAd(actor: string, id: string) {
    if (!this.doc('ad', id)) throw new AppError('not_found', 404, 'No such ad.');
    await this.remove('ad', id);
    await this.audit(actor, 'ad.delete', id);
    return { ok: true };
  }
  /** At most one ad per spot for a page. */
  publicAds(pageKey: string, signedIn: boolean, lang: Lang) {
    const key = str(pageKey, 200).replace(/^\/+/, '') || 'home';
    const now = this.now().getTime();
    const live = this.docs('ad').filter((d) => {
      const a = d.data;
      if (a.status !== 'running') return false;
      if (a.start && Date.parse(a.start) > now) return false;
      if (a.end && Date.parse(a.end) + 86_400_000 <= now) return false;
      if (a.audience === 'signedIn' && !signedIn) return false;
      if (a.audience === 'anonymous' && signedIn) return false;
      return pageMatches(key, a.pages ?? []);
    });
    const out: Record<string, Json | null> = { top: null, inline: null, side: null, video: null };
    for (const place of Object.keys(out)) {
      const here = live.filter((d) => d.data.placement === place);
      if (!here.length) continue;
      const high = here.filter((d) => d.data.priority === 'high');
      const pool = high.length ? high : here.filter((d) => d.data.priority !== 'low').length ? here.filter((d) => d.data.priority !== 'low') : here;
      const d = pool[Math.floor(Math.random() * pool.length)]!;
      const a = d.data;
      out[place] = { id: d.id, head: (lang === 'bn' && a.head.bn) || a.head.en, cta: (lang === 'bn' && a.cta.bn) || a.cta.en || (lang === 'bn' ? 'দেখো' : 'Learn more'), href: a.href, theme: a.theme, reshowDays: a.reshowDays, version: d.updatedAt };
    }
    return out;
  }
  adEvent(id: string, type: unknown) {
    if (!this.doc('ad', id)) return { ok: false };
    const t = type === 'click' ? 'clicks' : type === 'close' ? 'closes' : 'views';
    this.bump(`ad:${id}`, t);
    return { ok: true };
  }
  private bump(key: string, field: string) {
    const c = this.counters.get(key) ?? {};
    c[field] = (c[field] ?? 0) + 1;
    this.counters.set(key, c);
  }
  async flushCounters() {
    const pending = [...this.counters];
    this.counters.clear();
    for (const [key, inc] of pending) {
      const [kind, id] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
      const d = this.doc(kind, id);
      if (!d) continue;
      const data = { ...d.data };
      if (kind === 'ad') data.stats = { views: (data.stats?.views ?? 0) + (inc.views ?? 0), clicks: (data.stats?.clicks ?? 0) + (inc.clicks ?? 0), closes: (data.stats?.closes ?? 0) + (inc.closes ?? 0) };
      if (kind === 'post') data.views = (data.views ?? 0) + (inc.views ?? 0);
      const row: DocRow = { kind, id, data, updatedAt: d.updatedAt }; // keep updatedAt: stats are not edits
      await this.store.putDoc(row).catch((e) => console.warn('counters:', (e as Error).message));
      this.cache.set(kind, this.docs(kind).map((x) => (x.id === id ? row : x)));
    }
  }

  // ── coupons ──
  coupons() { return this.docs('coupon').map((d) => ({ code: d.id, ...d.data, updatedAt: d.updatedAt })); }
  async saveCoupon(actor: string, body: Json, existingCode?: string) {
    const code = (existingCode ?? str(body.code, 24)).toUpperCase();
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) throw bad('A code is 3–24 letters, numbers, dashes or underscores.');
    const prev = this.doc('coupon', code);
    if (!existingCode && prev) throw bad('This code already exists.');
    if (existingCode && !prev) throw new AppError('not_found', 404, 'No such code.');
    const kind = body.kind === 'fixed' ? 'fixed' : 'percent';
    const value = int(body.value, 1, kind === 'percent' ? 100 : 1_000_000, 0);
    if (!value) throw bad(kind === 'percent' ? 'Enter a discount between 1 and 100 percent.' : 'Enter the discount in taka.');
    const appliesTo = str(body.appliesTo, 80) || 'all';
    const data = {
      kind, value, appliesTo, maxUses: int(body.maxUses, 0, 1_000_000, 0), perPerson: int(body.perPerson, 1, 100, 1), start: isoOrNull(body.start), end: isoOrNull(body.end),
      waitlistOnly: bool(body.waitlistOnly), eduOnly: bool(body.eduOnly), firstOnly: bool(body.firstOnly), active: body.active !== false, used: prev?.data.used ?? 0,
      createdAt: prev?.data.createdAt ?? this.now().toISOString(),
    };
    await this.put('coupon', code, data);
    await this.audit(actor, existingCode ? 'coupon.update' : 'coupon.create', code, { kind, value, appliesTo });
    return { code, ...data };
  }
  async deleteCoupon(actor: string, code: string) {
    if (!this.doc('coupon', code)) throw new AppError('not_found', 404, 'No such code.');
    await this.remove('coupon', code);
    await this.audit(actor, 'coupon.delete', code);
    return { ok: true };
  }
  /** Is this code valid for this purchase? (Used by checkout.) */
  checkCoupon(codeIn: unknown, target: string, email: string | null) {
    const code = str(codeIn, 24).toUpperCase();
    const d = this.doc('coupon', code);
    const no = (reason: string) => ({ ok: false as const, reason });
    if (!d || !d.data.active) return no('This code does not exist.');
    const c = d.data;
    const now = this.now().getTime();
    if (c.start && Date.parse(c.start) > now) return no('This code is not active yet.');
    if (c.end && Date.parse(c.end) + 86_400_000 <= now) return no('This code has expired.');
    if (c.maxUses && c.used >= c.maxUses) return no('This code has been used up.');
    if (c.appliesTo !== 'all' && c.appliesTo !== target) return no('This code is for something else.');
    if (c.eduOnly && !/\.edu(\.[a-z]{2})?$/i.test((email ?? '').split('@')[1] ?? '')) return no('This code needs a university email address.');
    return { ok: true as const, code, kind: c.kind, value: c.value };
  }

  // ── site: announcement bar, homepage, settings ──
  /** Until an admin saves one, the bar shows the tutorials launch message ({topics} and {labs} are filled in on the page). */
  static readonly DEFAULT_ANNOUNCEMENT = {
    on: true, everyPage: false, href: '/learn.html', version: 'tut-1',
    text: { en: 'Written tutorials are live: {topics} topics and {labs} interactive labs, free for every student.', bn: 'লিখিত টিউটোরিয়াল চালু হয়েছে: {topics}টি টপিক আর {labs}টি ইন্টারঅ্যাকটিভ ল্যাব, সব শিক্ষার্থীর জন্য ফ্রি।' },
    linkText: { en: 'Start learning', bn: 'শেখা শুরু করো' },
  };
  announcementAdmin() {
    return this.doc('site', 'announcement')?.data ?? AdminService.DEFAULT_ANNOUNCEMENT;
  }
  async saveAnnouncement(actor: string, body: Json) {
    const text = bi(body.text, 220);
    const href = str(body.href, 300);
    if (body.on === true && !text.en) throw bad('Write the announcement in English.');
    if (href && !/^(\/[^\s]*|https:\/\/[^\s]+)$/.test(href)) throw bad('The link must start with / or https://.');
    const prev = this.doc('site', 'announcement')?.data ?? {};
    const data = { on: body.on === true, text, linkText: bi(body.linkText, 40), href: href || null, everyPage: body.everyPage === true, version: body.resetClosed === true || !prev.version ? this.now().toISOString() : prev.version };
    await this.put('site', 'announcement', data);
    await this.audit(actor, 'announcement.save', 'announcement', { on: data.on, everyPage: data.everyPage });
    return data;
  }
  publicSite(lang: Lang) {
    const a = this.announcementAdmin() as Json;
    return {
      announcement: a?.on ? { text: (lang === 'bn' && a.text.bn) || a.text.en, linkText: (lang === 'bn' && a.linkText?.bn) || a.linkText?.en || null, href: a.href, everyPage: a.everyPage, version: a.version } : null,
      hubTabs: (this.settings().hubTabs ?? ['tutorials', 'courses', 'labs', 'exam']) as string[],
    };
  }
  async saveHubTabs(actor: string, tabs: unknown) {
    const allowed = ['tutorials', 'courses', 'labs', 'exam'];
    const list = (Array.isArray(tabs) ? tabs : []).filter((t): t is string => allowed.includes(t as string)).filter((t, i, a) => a.indexOf(t) === i);
    if (!list.length) throw bad('Keep at least one tab.');
    await this.put('site', 'settings', { ...this.settings(), hubTabs: list });
    await this.audit(actor, 'hub.tabs', 'homepage', { tabs: list });
    return { hubTabs: list };
  }

  // ── overview, AI, waitlist, audit ──
  async overview() {
    const [members, waitlist, events, calls] = await Promise.all([
      this.store.listDocs('member').catch(() => []), this.store.waitlistCount().catch(() => 0), this.store.readingEvents().catch(() => []), this.store.llmCalls().catch(() => []),
    ]);
    const day = (iso: string) => iso.slice(0, 10);
    const today = this.now();
    const days = Array.from({ length: 14 }, (_, i) => day(new Date(today.getTime() - (13 - i) * 86_400_000).toISOString()));
    const perDay = new Map(days.map((d) => [d, new Set<string>()]));
    for (const e of events) perDay.get(day(e.at))?.add(e.learnerId);
    const t = this.tutorials.list('en');
    const weekAgo = today.getTime() - 7 * 86_400_000;
    const attention: { tag: string; text: string; go: string }[] = [];
    const drafts = this.docs('topic').filter((d) => d.data.status !== 'published').length;
    if (drafts) attention.push({ tag: 'Draft', text: `${drafts} tutorial topic${drafts > 1 ? 's are' : ' is'} still a draft`, go: 'content' });
    const scheduled = this.docs('post').filter((d) => d.data.status === 'scheduled' && !this.live(d.data)).length;
    if (scheduled) attention.push({ tag: 'Posts', text: `${scheduled} post${scheduled > 1 ? 's are' : ' is'} scheduled`, go: 'posts' });
    if (!this.opts.youtubeKey) attention.push({ tag: 'Setup', text: 'YOUTUBE_API_KEY is not set, so courses cannot be added from playlists yet', go: 'settings' });
    const feedback = events.filter((e) => e.type === 'feedback' && Date.parse(e.at) > weekAgo && /wrong|bad|unclear|not/i.test(String(e.payload.value ?? ''))).length;
    if (feedback) attention.push({ tag: 'Feedback', text: `${feedback} learner${feedback > 1 ? 's' : ''} marked an explanation as unhelpful this week`, go: 'ai' });
    return {
      kpis: {
        activeToday: perDay.get(day(today.toISOString()))?.size ?? 0,
        activeWeek: new Set(events.filter((e) => Date.parse(e.at) > weekAgo).map((e) => e.learnerId)).size,
        members: members.length, newMembersWeek: members.filter((m) => Date.parse(m.data.firstSeen ?? '') > weekAgo).length,
        aiToday: calls.filter((c) => day(c.at) === day(today.toISOString())).length, waitlist,
        topics: t.totals.topics, labs: t.totals.labs, courses: allCourses().length,
      },
      activeByDay: days.map((d) => ({ day: d, learners: perDay.get(d)!.size })),
      tracks: t.tracks.map((x) => ({ id: x.id, title: x.title, delivered: x.delivered, planned: x.planned })),
      attention,
    };
  }
  async ai() {
    const [calls, events] = await Promise.all([this.store.llmCalls().catch(() => []), this.store.readingEvents().catch(() => [])]);
    const monthAgo = this.now().getTime() - 30 * 86_400_000;
    const recent = calls.filter((c) => Date.parse(c.at) > monthAgo);
    const byPurpose = new Map<string, number>();
    for (const c of recent) byPurpose.set(c.purpose, (byPurpose.get(c.purpose) ?? 0) + 1);
    const feedback = events.filter((e) => e.type === 'feedback').slice(-50).reverse().map((e) => ({ at: e.at, where: e.lessonId, block: e.blockId, value: e.payload.value ?? null }));
    const asks = events.filter((e) => e.type === 'ask').slice(-30).reverse().map((e) => ({ at: e.at, where: e.lessonId, question: String(e.payload.question ?? '').slice(0, 300) })).filter((a) => a.question);
    return {
      month: { calls: recent.length, inputTokens: recent.reduce((n, c) => n + c.inputTokens, 0), outputTokens: recent.reduce((n, c) => n + c.outputTokens, 0), cached: recent.filter((c) => c.cached).length, failed: recent.filter((c) => c.outcome !== 'ok').length },
      byPurpose: [...byPurpose].map(([purpose, n]) => ({ purpose, n })).sort((a, b) => b.n - a.n),
      feedback, asks,
    };
  }
  async waitlist(full = false) {
    const rows = await this.store.listWaitlist(full ? 5000 : 200);
    return rows.map((r) => ({ email: full ? r.email : mask(r.email), plan: r.plan, lang: r.lang, at: r.createdAt }));
  }
  async waitlistCsv(actor: string) {
    const rows = await this.waitlist(true);
    await this.audit(actor, 'waitlist.export', 'waitlist', { rows: rows.length });
    return 'email,plan,lang,joined\n' + rows.map((r) => [r.email, r.plan, r.lang, r.at].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  }
  async auditLog() { return { entries: await this.store.listAudit(300) }; }
  config() { return { youtubeKey: Boolean(this.opts.youtubeKey), adminEmails: this.opts.adminEmails.length, store: this.store.kind }; }
}
