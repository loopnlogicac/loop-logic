// The public list of everything the AI Teacher is allowed to answer from
// (shown on /sources.html). Built from the same data the AI uses, so the page
// can never drift from what the AI actually reads.

import type { Lang } from '../content/pricing-pack.ts';
import type { Subject } from '../content/subjects.ts';
import { APPROVED_SITES, PASSAGES } from '../content/library.ts';
import { CHANNEL } from '../content/courses.ts';
import type { TutorialService } from './tutorials.ts';

const SUBJECT_NAMES: Record<Subject, { en: string; bn: string }> = {
  cs: { en: 'Computer science and programming', bn: 'কম্পিউটার সায়েন্স ও প্রোগ্রামিং' },
  ml: { en: 'Machine learning', bn: 'মেশিন লার্নিং' },
  ee: { en: 'Electrical and electronics', bn: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক্স' },
  business: { en: 'Business and pricing', bn: 'ব্যবসা ও দাম নির্ধারণ' },
};

export function trustedSources(tutorials: TutorialService, lang: Lang) {
  const books = new Map<string, { title: string; licence: string; passages: number; reviewed: number }>();
  for (const p of PASSAGES) {
    const b = books.get(p.sourceTitle) ?? { title: p.sourceTitle, licence: p.licence, passages: 0, reviewed: 0 };
    b.passages += 1;
    if (p.reviewed) b.reviewed += 1;
    books.set(p.sourceTitle, b);
  }
  return {
    tutorials: tutorials.sourceStats(lang),
    library: { passages: PASSAGES.length, sources: [...books.values()].sort((a, b) => b.passages - a.passages) },
    sites: (Object.keys(APPROVED_SITES) as Subject[]).map((s) => ({ subject: s, name: SUBJECT_NAMES[s]?.[lang] ?? s, sites: APPROVED_SITES[s].map((x) => ({ domain: x.domain, label: x.label, url: `https://${x.domain}` })) })),
    channel: { name: CHANNEL.name, url: CHANNEL.url },
  };
}
