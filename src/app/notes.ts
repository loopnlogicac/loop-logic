import { AppError } from './service.ts';
import type { Store } from '../store/store.ts';
import type { TutorialService } from './tutorials.ts';
import { getCourse } from '../content/courses.ts';
import { getVideo } from '../content/videos.ts';
import { courseVideoOrder } from './watch.ts';

/** Private saved state. Client-supplied owners, titles and links are never stored. */
export class NoteService {
  private readonly store: Store;
  private readonly tutorials: TutorialService;
  constructor(store: Store, tutorials: TutorialService) { this.store = store; this.tutorials = tutorials; }

  private item(key: string, lang: 'en' | 'bn') {
    const m = /^(tutorial|video):([a-z0-9-]+):([A-Za-z0-9_-]+)$/.exec(key);
    if (m?.[1] === 'tutorial') {
      const info = this.tutorials.pageInfo(m[2]!, m[3]!, lang);
      if (info?.topicTitle) return { title: info.topicTitle, href: `/learn.html?track=${encodeURIComponent(m[2]!)}&topic=${encodeURIComponent(m[3]!)}` };
    } else if (m?.[1] === 'video') {
      const course = getCourse(m[2]!); const video = getVideo(m[3]!);
      if (course && video && courseVideoOrder(course).includes(video.id)) return { title: video.title, href: `/watch.html?course=${encodeURIComponent(course.id)}&v=${encodeURIComponent(video.id)}` };
    }
    throw new AppError('not_found', 404, lang === 'bn' ? 'এই টপিক বা ভিডিও পাওয়া যায়নি।' : 'No such topic or video.');
  }
  async get(learnerId: string, key: string, lang: 'en' | 'bn') {
    const item = this.item(key, lang);
    const row = await this.store.getDoc('note', `${learnerId}:${key}`);
    return { key, ...item, bookmark: row?.data.bookmark === true, revisit: row?.data.revisit === true, text: String(row?.data.text ?? ''), updatedAt: row?.updatedAt ?? null };
  }
  async list(learnerId: string, lang: 'en' | 'bn') {
    const notes = [];
    for (const row of await this.store.listDocs('note')) {
      if (!row.id.startsWith(`${learnerId}:`) || row.data.learnerId !== learnerId) continue;
      const key = row.id.slice(learnerId.length + 1);
      try { notes.push({ key, ...this.item(key, lang), bookmark: row.data.bookmark === true, revisit: row.data.revisit === true, text: String(row.data.text ?? ''), updatedAt: row.updatedAt }); } catch { /* removed content */ }
    }
    return { notes: notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)) };
  }
  async put(learnerId: string, key: string, body: Record<string, unknown>, lang: 'en' | 'bn') {
    this.item(key, lang);
    if (typeof body.text !== 'string' || body.text.length > 2000 || typeof body.bookmark !== 'boolean' || typeof body.revisit !== 'boolean') {
      throw new AppError('bad_input', 400, lang === 'bn' ? 'নোট সর্বোচ্চ ২,০০০ অক্ষরের হবে।' : 'Use a plain text note of at most 2,000 characters.');
    }
    if (!body.bookmark && !body.revisit && !body.text.trim()) return this.delete(learnerId, key, lang);
    await this.store.putDoc({ kind: 'note', id: `${learnerId}:${key}`, data: { learnerId, bookmark: body.bookmark, revisit: body.revisit, text: body.text }, updatedAt: new Date().toISOString() });
    return this.get(learnerId, key, lang);
  }
  async delete(learnerId: string, key: string, lang: 'en' | 'bn') {
    this.item(key, lang);
    await this.store.deleteDoc('note', `${learnerId}:${key}`);
    return this.get(learnerId, key, lang);
  }
}
