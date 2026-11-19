// Site-wide search: tutorial topics, labs, video courses, videos and blog posts.
// Simple word matching in English and Bangla; the index is rebuilt every minute
// so admin changes (new courses, posts, topics) show up without a restart.
// Videos of paid courses are left out unless they are free samples.

import type { TutorialService } from './tutorials.ts';
import type { AdminService } from './admin.ts';
import { allCourses, type Course } from '../content/courses.ts';
import { getPlaylist, getVideo } from '../content/videos.ts';

type Lang = 'en' | 'bn';
export type HitType = 'topic' | 'lab' | 'course' | 'video' | 'post';
export interface SearchHit { type: HitType; title: string; subtitle: string; href: string }
interface Entry extends SearchHit { title_: string; keys: string; body: string; boost: number }

const words = (q: string) => q.toLowerCase().normalize('NFKC').split(/[^a-z0-9+#\u0980-\u09ff]+/).filter((w) => w.length >= 2 || w === 'c').slice(0, 8);

const B = '[^a-z0-9+#\\u0980-\\u09ff]';
const reCache = new Map<string, [RegExp, RegExp]>();
/** 2 = whole word, 1 = start of a word (or any part, for Bangla word endings), 0 = no match. One-letter words must stand alone. */
const has = (text: string, w: string): number => {
  let r = reCache.get(w);
  if (!r) { const e = w.replace(/[+#]/g, '\\$&'); r = [new RegExp(`(^|${B})${e}($|${B})`), new RegExp(`(^|${B})${e}`)]; reCache.set(w, r); }
  if (r[0].test(text)) return 2;
  return w.length > 1 && (r[1].test(text) || (/[\u0980-\u09ff]/.test(w) && text.includes(w))) ? 1 : 0;
};
const norm = (s: string) => s.toLowerCase().normalize('NFKC');
const pick = (b: { en: string; bn: string } | undefined, lang: Lang) => (b ? (lang === 'bn' && b.bn ? b.bn : b.en) : '');
const LIMIT: Record<HitType, number> = { topic: 20, video: 12, lab: 10, course: 6, post: 6 };

export class SearchService {
  private tutorials: TutorialService;
  private admin?: AdminService;
  private built = new Map<Lang, { at: number; entries: Entry[] }>();
  private ttlMs: number;

  constructor(tutorials: TutorialService, admin?: AdminService, opts: { ttlMs?: number } = {}) {
    this.tutorials = tutorials;
    this.admin = admin;
    this.ttlMs = opts.ttlMs ?? 60_000;
  }

  private index(lang: Lang): Entry[] {
    const hit = this.built.get(lang);
    if (hit && Date.now() - hit.at < this.ttlMs) return hit.entries;
    const entries: Entry[] = [];
    const add = (e: Omit<Entry, 'title_'>) => entries.push({ ...e, title_: norm(e.title) });

    // In Bangla, English titles still match (students often type "for loop").
    const other = lang === 'bn' ? new Map(this.tutorials.allTopics('en').map((t) => [`${t.track}/${t.topic}`, `${t.title} ${t.trackTitle}`])) : null;
    const otherLab = lang === 'bn' ? new Map(this.tutorials.allLabs('en').map((l) => [l.id, `${l.title} ${l.topicTitle}`])) : null;
    for (const t of this.tutorials.allTopics(lang)) {
      add({ type: 'topic', title: t.title, subtitle: t.trackTitle, href: `/learn.html?track=${encodeURIComponent(t.track)}&topic=${encodeURIComponent(t.topic)}`, keys: norm(`${t.keywords.join(' ')} ${t.trackTitle} ${other?.get(`${t.track}/${t.topic}`) ?? ''}`), body: norm(t.summary), boost: 1 });
    }
    for (const l of this.tutorials.allLabs(lang)) {
      add({ type: 'lab', title: l.title, subtitle: l.topicTitle, href: `/learn.html?track=${encodeURIComponent(l.track)}&topic=${encodeURIComponent(l.topic)}#lab-${encodeURIComponent(l.id)}`, keys: norm(`${l.topicTitle} ${otherLab?.get(l.id) ?? ''}`), body: norm(l.summary), boost: 0 });
    }
    const seen = new Set<string>();
    for (const c of allCourses()) {
      const title = pick(c.title, lang);
      add({ type: 'course', title, subtitle: c.access === 'paid' ? (lang === 'bn' ? `পেইড কোর্স · ${c.price ?? ''}` : `Paid course · ${c.price ?? ''}`) : (lang === 'bn' ? 'ফ্রি ভিডিও কোর্স' : 'Free video course'), href: `/course.html?id=${encodeURIComponent(c.id)}`, keys: norm(`${c.title.en} ${c.title.bn} ${c.code ?? ''}`), body: norm(pick(c.blurb, lang)), boost: 2 });
      for (const v of this.watchableVideos(c)) {
        if (seen.has(v)) continue;
        seen.add(v);
        const vid = getVideo(v);
        if (vid) add({ type: 'video', title: vid.title, subtitle: `${title} · ${vid.duration}`, href: `/watch.html?course=${encodeURIComponent(c.id)}&v=${encodeURIComponent(v)}`, keys: norm(title), body: '', boost: 0 });
      }
    }
    if (this.admin) {
      for (const p of this.admin.publicPosts(lang).posts) {
        add({ type: 'post', title: p.title, subtitle: lang === 'bn' ? 'ব্লগ' : 'Blog', href: `/post.html?slug=${encodeURIComponent(p.slug)}`, keys: norm((p.tags ?? []).join(' ')), body: norm(p.excerpt ?? ''), boost: 0 });
      }
    }
    this.built.set(lang, { at: Date.now(), entries });
    return entries;
  }

  /** Videos a visitor may open: all of a free course, only the samples of a paid one. */
  watchableVideos(c: Course): string[] {
    const ids = c.playlists.flatMap((p) => getPlaylist(p.id)?.videoIds ?? []);
    if (c.access !== 'paid') return ids;
    const samples = new Set(c.sampleIds ?? []);
    return ids.filter((id) => samples.has(id));
  }

  search(q: string, lang: Lang, opts: { limit?: number } = {}) {
    const ws = words(q.slice(0, 120));
    if (!ws.length) return { q, total: 0, groups: [] as { type: HitType; hits: SearchHit[] }[] };
    const scored: { e: Entry; score: number }[] = [];
    for (const e of this.index(lang)) {
      let score = 0, matched = 0;
      for (const w of ws) {
        const s = [0, 4, 6][has(e.title_, w)]! + [0, 2, 3][has(e.keys, w)]! + (has(e.body, w) ? 1 : 0);
        if (s) matched++;
        score += s;
      }
      if (!matched || matched < (ws.length <= 2 ? ws.length : Math.ceil(ws.length / 2)) || score < ws.length * 2) continue;
      if (e.title_.startsWith(ws[0]!)) score += 2;
      if (ws.length > 1 && e.title_.includes(ws.join(' '))) score += 4;
      scored.push({ e, score: score + e.boost });
    }
    scored.sort((a, b) => b.score - a.score || a.e.title.length - b.e.title.length);
    const strip = ({ type, title, subtitle, href }: Entry): SearchHit => ({ type, title, subtitle, href });
    if (opts.limit) {
      // quick suggestions: the best few across all types
      const hits = scored.slice(0, opts.limit).map((x) => strip(x.e));
      return { q, total: scored.length, groups: [{ type: 'topic' as HitType, hits }], mixed: true };
    }
    const order: HitType[] = ['topic', 'video', 'lab', 'course', 'post'];
    const groups = order.map((type) => ({ type, hits: scored.filter((x) => x.e.type === type).slice(0, LIMIT[type]).map((x) => strip(x.e)) })).filter((g) => g.hits.length);
    return { q, total: scored.length, groups };
  }
}
