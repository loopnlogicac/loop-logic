// Turns "where the learner is" into context for the Ask AI chat: a label for
// the prompt, the subject (which approved websites to search), and evidence
// the page itself provides (instructor materials, lesson passages).

import type { ChatPage } from '../reading/service.ts';
import type { Subject } from '../reading/profile.ts';
import type { Lang } from '../content/pricing-pack.ts';
import { getCourse, courseForLesson, type Course } from '../content/courses.ts';
import { getVideo } from '../content/videos.ts';
import { getLesson } from '../content/lessons.ts';
import type { VideoExtrasService } from './video-extras.ts';
import type { TutorialService } from './tutorials.ts';

const ML_COURSES = new Set(['machine-learning', 'artificial-intelligence']);

/** Which approved-site list a course uses. Maths, physics and science share the general list (OpenStax, MIT OCW). */
export function courseSubject(c: Course | undefined): Subject {
  if (!c) return 'cs';
  if (ML_COURSES.has(c.id)) return 'ml';
  if (c.subject === 'business') return 'business';
  if (c.subject === 'eee') return 'ee';
  return 'cs';
}

const str = (v: unknown, max = 80) => (typeof v === 'string' ? v.slice(0, max) : '');

export async function chatPage(raw: unknown, lang: Lang, extras: VideoExtrasService, tutorials?: TutorialService, question = ''): Promise<ChatPage> {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const kind = str(r.kind, 10);

  if (kind === 'tutorial' && tutorials) {
    const c = tutorials.chatContext(str(r.track, 40), str(r.topic, 80), question);
    if (c) return { kind: 'tutorial', key: `tutorial:${str(r.track, 40)}:${str(r.topic, 80)}`, label: `Tutorial topic "${c.title}"`, subject: c.track === 'machine-learning' ? 'ml' : 'cs', evidence: c.evidence };
  }

  const lessonId = str(r.lessonId);
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  if (lesson && (kind === 'lesson' || kind === 'lab')) {
    return {
      kind: kind === 'lab' ? 'lab' : 'lesson',
      key: lesson.id,
      label: `${kind === 'lab' ? 'Lab for lesson' : 'Lesson'} "${lesson.title[lang]}"${courseForLesson(lesson.id) ? ` in the course ${courseForLesson(lesson.id)!.title.en}` : ''}`,
      subject: lesson.subject,
      concepts: [...new Set(lesson.blocks.flatMap((b) => b.concepts))],
      passageIds: [...new Set(lesson.blocks.flatMap((b) => b.passages))].slice(0, 2),
      evidence: [],
    };
  }

  const course = getCourse(str(r.courseId));
  const video = getVideo(str(r.videoId, 20));
  if (course && video && kind === 'video') {
    const { extras: x } = await extras.get(video.id);
    const evidence = x.materials
      .filter((m) => m.code)
      .slice(0, 3)
      .map((m) => ({ id: `material:${m.id}`, title: `Instructor material: ${m.title}`, location: video.title, text: m.code!.slice(0, 1500), url: m.url ?? undefined }));
    return {
      kind: 'video',
      key: `course:${course.id}`,
      label: `Video "${video.title}" in the course ${course.title.en}${video.by ? ` (video by ${video.by})` : ''}`,
      subject: courseSubject(course),
      evidence,
    };
  }
  if (course) {
    return { kind: 'course', key: `course:${course.id}`, label: `Course page for ${course.title.en}`, subject: courseSubject(course), evidence: [] };
  }
  return { kind: 'page', key: 'site', label: 'Loop & Logic learning site', subject: 'cs', evidence: [] };
}
