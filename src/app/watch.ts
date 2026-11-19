// Video courses: a course's playlists, played in order inside the site
// (YouTube embed), with per-learner "watched" progress.

import { randomUUID } from 'node:crypto';
import type { Store, ReadingEventRow } from '../store/store.ts';
import { AppError } from './service.ts';
import { allCourses, getCourse, coursePlaylistUrl, type Course } from '../content/courses.ts';
import { getPlaylist, getVideo } from '../content/videos.ts';
import type { Lang } from '../content/pricing-pack.ts';
import { VideoExtrasService, COURSE_TRY_NOW, LANGUAGES } from './video-extras.ts';

const courseKey = (courseId: string) => `course:${courseId}`;

/** Latest watched/unwatched mark per video for one course. */
export function watchedSet(courseId: string, events: ReadingEventRow[]): Set<string> {
  const state = new Map<string, boolean>();
  for (const e of events) {
    if (e.type === 'video' && e.lessonId === courseKey(courseId) && e.blockId) state.set(e.blockId, e.payload.watched === true);
  }
  return new Set([...state].filter(([, w]) => w).map(([id]) => id));
}

/** The course's videos in order: playlists in course order, videos in playlist order, first appearance only. */
export function courseVideoOrder(course: Course): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const p of course.playlists) {
    for (const id of getPlaylist(p.id)?.videoIds ?? []) {
      if (!seen.has(id)) { seen.add(id); order.push(id); }
    }
  }
  return order;
}

const hm = (seconds: number) => ({ hours: Math.floor(seconds / 3600), minutes: Math.round((seconds % 3600) / 60) });

export class WatchService {
  private readonly store: Store;
  private readonly extras: VideoExtrasService;
  private canWatch: (learnerId: string, courseId: string) => Promise<boolean> = async () => false;
  constructor(store: Store, extras?: VideoExtrasService) {
    this.store = store;
    this.extras = extras ?? new VideoExtrasService(store);
  }

  /** Who has bought a paid course (set by the admin service). */
  setAccessCheck(fn: (learnerId: string, courseId: string) => Promise<boolean>) {
    this.canWatch = fn;
  }

  /** For a paid course the learner has not bought: true for every video that is not a free sample. */
  private async lockFor(course: Course, learnerId: string): Promise<(id: string) => boolean> {
    if (course.access !== 'paid') return () => false;
    if (await this.canWatch(learnerId, course.id)) return () => false;
    const samples = new Set(course.sampleIds ?? []);
    return (id: string) => !samples.has(id);
  }

  async quiz(courseId: string, videoId: string, learnerId: string, answers: unknown) {
    const course = this.courseOr404(courseId);
    if (!courseVideoOrder(course).includes(videoId)) throw new AppError('bad_video', 400, 'This video is not part of the course');
    if ((await this.lockFor(course, learnerId))(videoId)) throw new AppError('locked', 403, 'Buy the course to open this video.');
    return this.extras.gradeQuiz(course.id, videoId, learnerId, answers);
  }

  private courseOr404(id: string): Course {
    const c = getCourse(id);
    if (!c) throw new AppError('not_found', 404, 'Course not found');
    return c;
  }

  /** Sections and progress for a course page or the player. */
  async view(courseId: string, learnerId: string, lang: Lang, current?: string | null) {
    const course = this.courseOr404(courseId);
    const [events, marks, locked] = await Promise.all([this.store.readingEvents(learnerId), this.extras.summary(), this.lockFor(course, learnerId)]);
    const watched = watchedSet(course.id, events);
    const order = courseVideoOrder(course);
    const playable = order.filter((id) => !locked(id));
    const shown = new Set<string>();
    let lockedN = 0;
    const sections = course.playlists.map((p) => {
      const data = getPlaylist(p.id);
      return {
        playlistId: course.access === 'paid' ? null : p.id,
        title: p.title || data?.title,
        url: coursePlaylistUrl(course, p),
        items: (data?.videoIds ?? []).map((id, i) => {
          const v = getVideo(id)!;
          const repeat = shown.has(id);
          shown.add(id);
          // A locked video's YouTube id is never sent: it would let anyone watch it on YouTube.
          if (locked(id)) return { id: `locked-${++lockedN}`, n: i + 1, title: v.title, duration: v.duration, by: v.by, watched: false, repeat, materials: 0, quiz: 0, locked: true, sample: false };
          return { id, n: i + 1, title: v.title, duration: v.duration, by: v.by, watched: watched.has(id), repeat, materials: marks.get(id)?.materials ?? 0, quiz: marks.get(id)?.quiz ?? 0, locked: false, sample: course.access === 'paid' && (course.sampleIds ?? []).includes(id) };
        }),
      };
    });
    const totalSeconds = order.reduce((n, id) => n + (getVideo(id)?.seconds ?? 0), 0);
    const watchedSeconds = playable.filter((id) => watched.has(id)).reduce((n, id) => n + (getVideo(id)?.seconds ?? 0), 0);
    const nextUp = playable.find((id) => !watched.has(id)) ?? playable[0] ?? null;
    const currentId = current && playable.includes(current) ? current : nextUp;
    const idx = currentId ? playable.indexOf(currentId) : -1;
    const cur = currentId ? getVideo(currentId)! : null;
    const extras = cur ? await this.extras.forLearner(course.id, cur.id, learnerId) : null;
    const owned = course.access === 'paid' ? !locked('\u0000') : true;
    return {
      course: {
        id: course.id, title: course.title[lang], code: course.code, hasLessons: course.lessons.length > 0, tryNowDefault: COURSE_TRY_NOW[course.id] ? LANGUAGES[COURSE_TRY_NOW[course.id]!].label : null,
        access: course.access ?? 'free', price: course.access === 'paid' ? course.price ?? null : null, owned, samples: course.access === 'paid' ? (course.sampleIds ?? []).length : null, locked: lockedN,
      },
      sections,
      progress: {
        total: order.length,
        watched: playable.filter((id) => watched.has(id)).length,
        totalTime: hm(totalSeconds),
        watchedTime: hm(watchedSeconds),
        percent: order.length ? Math.round((playable.filter((id) => watched.has(id)).length / order.length) * 100) : 0,
        nextUp,
      },
      current: cur
        ? {
            id: cur.id,
            title: cur.title,
            duration: cur.duration,
            by: cur.by,
            watched: watched.has(cur.id),
            position: order.indexOf(cur.id) + 1,
            embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(cur.id)}?rel=0&modestbranding=1`,
            youtubeUrl: course.access === 'paid' ? null : `https://www.youtube.com/watch?v=${encodeURIComponent(cur.id)}`,
            prev: idx > 0 ? playable[idx - 1]! : null,
            next: idx >= 0 && idx < playable.length - 1 ? playable[idx + 1]! : null,
            extras,
          }
        : null,
    };
  }

  async mark(courseId: string, learnerId: string, input: { videoId: unknown; watched: unknown }) {
    const course = this.courseOr404(courseId);
    const videoId = String(input.videoId ?? '');
    if (!courseVideoOrder(course).includes(videoId)) throw new AppError('bad_video', 400, 'This video is not part of the course');
    if ((await this.lockFor(course, learnerId))(videoId)) throw new AppError('locked', 403, 'Buy the course to open this video.');
    const watched = input.watched !== false;
    await this.store.addReadingEvents([{ id: randomUUID(), learnerId, lessonId: courseKey(course.id), blockId: videoId, type: 'video', payload: { watched }, at: new Date().toISOString() }]);
    const events = await this.store.readingEvents(learnerId);
    const set = watchedSet(course.id, events);
    const order = courseVideoOrder(course);
    return { videoId, watched, progress: { total: order.length, watched: order.filter((id) => set.has(id)).length, nextUp: order.find((id) => !set.has(id)) ?? null } };
  }

  /** Most recently watched course with something left to watch (for the dashboard). */
  async continueWatching(learnerId: string, lang: Lang) {
    const events = (await this.store.readingEvents(learnerId)).filter((e) => e.type === 'video');
    const latest = [...events].reverse().find((e) => e.lessonId.startsWith('course:'));
    if (!latest) return null;
    const course = getCourse(latest.lessonId.slice('course:'.length));
    if (!course) return null;
    const set = watchedSet(course.id, events);
    const locked = await this.lockFor(course, learnerId);
    const order = courseVideoOrder(course).filter((id) => !locked(id));
    const next = order.find((id) => !set.has(id));
    if (!next) return null;
    return {
      courseId: course.id,
      courseTitle: course.title[lang],
      videoId: next,
      title: getVideo(next)!.title,
      duration: getVideo(next)!.duration,
      watched: order.filter((id) => set.has(id)).length,
      total: order.length,
      lastAt: latest.at,
    };
  }

  /** Total videos and hours across all courses (for the catalog and landing page). */
  static totals() {
    const ids = new Set(allCourses().flatMap((c) => courseVideoOrder(c)));
    const seconds = [...ids].reduce((n, id) => n + (getVideo(id)?.seconds ?? 0), 0);
    return { videos: ids.size, hours: Math.round(seconds / 3600) };
  }
}
