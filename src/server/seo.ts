// Search-engine basics: robots.txt, sitemap.xml, and a real <title>, description,
// canonical link, share preview (Open Graph / Twitter) and structured data on
// every page, written into the HTML on the server so crawlers and chat apps see
// them without running our JavaScript.

import type { TutorialService } from '../app/tutorials.ts';
import type { AdminService } from '../app/admin.ts';
import type { SearchService } from '../app/search.ts';
import { allCourses, getCourse } from '../content/courses.ts';
import { getVideo } from '../content/videos.ts';

export interface SeoDeps { tutorials: TutorialService; admin?: AdminService; search: SearchService }

const SITE = 'Loop & Logic';
const DEFAULT_DESC = 'Free C, Data Structures, Algorithms, Java, Python, DBMS, Compiler Design and Machine Learning tutorials in Bangla and English, with interactive labs, quizzes and video courses for university students in Bangladesh.';

/** Pages that are personal or private: never indexed. */
const PRIVATE = new Set(['/admin.html', '/instructor.html', '/dashboard.html', '/profile.html', '/buy.html', '/library.html', '/search.html']);

const STATIC: Record<string, { title: string; description: string }> = {
  '/': { title: `${SITE} · Programming and CSE tutorials in Bangla and English`, description: DEFAULT_DESC },
  '/learn.html': { title: `Tutorials · ${SITE}`, description: 'Written tutorials for C, Data Structures, Algorithms, Java OOP, Python, DBMS, Compiler Design and Machine Learning, with examples you can run, quizzes and visual labs.' },
  '/courses.html': { title: `Video courses · ${SITE}`, description: 'Free video courses from the Loop & Logic YouTube channel, organised by subject, plus paid courses with free samples.' },
  '/paid-courses.html': { title: `Premium courses · ${SITE}`, description: 'Premium Loop & Logic video courses you can buy with bKash or Nagad, with free sample videos to watch first.' },
  '/office.html': { title: `Virtual Office · ${SITE}`, description: 'Internship practice in a simulated software company: role-based messages, incomplete and conflicting instructions, and an AI assistant that is sometimes wrong. Learn to ask the right questions and check the work.' },
  '/pricing.html': { title: `Pricing · ${SITE}`, description: 'What is free on Loop & Logic and what the paid plans add.' },
  '/blog.html': { title: `Blog · ${SITE}`, description: 'News, study guides and announcements from Loop & Logic.' },
  '/privacy.html': { title: `Privacy policy · ${SITE}`, description: 'What Loop & Logic collects, why, and the choices you have.' },
  '/terms.html': { title: `Terms of use · ${SITE}`, description: 'The terms for using Loop & Logic.' },
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const short = (s: string, n = 160) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length <= n ? t : `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…`; };
/** JSON for a <script> tag: no "</" can close it early. */
const ldJson = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');

export function siteBase(headers: Record<string, string | string[] | undefined>, configured?: string | null) {
  if (configured) return configured.replace(/\/+$/, '');
  const host = String(headers['x-forwarded-host'] ?? headers.host ?? 'localhost');
  const proto = String(headers['x-forwarded-proto'] ?? (/^(localhost|127\.|\[::1\])/.test(host) ? 'http' : 'https')).split(',')[0]!.trim();
  return `${proto}://${host}`;
}

export function robotsTxt(base: string) {
  return ['User-agent: *', 'Allow: /', ...[...PRIVATE].map((p) => `Disallow: ${p}`), 'Disallow: /api/', '', `Sitemap: ${base}/sitemap.xml`, ''].join('\n');
}

export function sitemapXml(base: string, d: SeoDeps) {
  const urls: { loc: string; priority: string; lastmod?: string }[] = [];
  const add = (path: string, priority: string, lastmod?: string) => urls.push({ loc: base + path, priority, lastmod });
  add('/', '1.0');
  for (const p of Object.keys(STATIC)) if (p !== '/') add(p, p === '/learn.html' || p === '/courses.html' ? '0.9' : '0.4');
  for (const t of d.tutorials.trackIds()) add(`/learn.html?track=${encodeURIComponent(t)}`, '0.8');
  for (const x of d.tutorials.allTopics('en')) add(`/learn.html?track=${encodeURIComponent(x.track)}&topic=${encodeURIComponent(x.topic)}`, '0.7');
  for (const c of allCourses()) {
    add(`/course.html?id=${encodeURIComponent(c.id)}`, '0.7');
    for (const v of d.search.watchableVideos(c)) add(`/watch.html?course=${encodeURIComponent(c.id)}&v=${encodeURIComponent(v)}`, '0.5');
  }
  if (d.admin) for (const p of d.admin.publicPosts('en').posts) add(`/post.html?slug=${encodeURIComponent(p.slug)}`, '0.6', String(p.publishedAt ?? '').slice(0, 10) || undefined);
  const seen = new Set<string>();
  const body = urls.filter((u) => !seen.has(u.loc) && seen.add(u.loc)).map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

interface Meta { title: string; description: string; canonical: string; image: string; type: string; noindex: boolean; ld: object[] }

/** Title, description and structured data for one page request. */
export function pageMeta(pathname: string, query: URLSearchParams, base: string, d: SeoDeps): Meta {
  const path = pathname === '/index.html' ? '/' : pathname;
  const fixed = STATIC[path];
  const meta: Meta = {
    title: fixed?.title ?? SITE, description: fixed?.description ?? DEFAULT_DESC,
    canonical: base + path, image: `${base}/og.png`, type: 'website', noindex: PRIVATE.has(path), ld: [],
  };
  const org = { '@type': 'Organization', name: SITE, url: base, logo: `${base}/og.png`, sameAs: ['https://www.youtube.com/@loopNlogic'] };
  if (path === '/') meta.ld.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: `${base}/`, potentialAction: { '@type': 'SearchAction', target: `${base}/search.html?q={search_term_string}`, 'query-input': 'required name=search_term_string' } }, { '@context': 'https://schema.org', ...org });

  if (path === '/learn.html') {
    const track = query.get('track'), topic = query.get('topic');
    if (query.get('q')) meta.noindex = true;
    if (track) {
      const info = d.tutorials.pageInfo(track, topic, 'en');
      if (info) {
        meta.canonical = `${base}/learn.html?track=${encodeURIComponent(track)}${topic ? `&topic=${encodeURIComponent(topic)}` : ''}`;
        meta.title = topic ? `${info.topicTitle} · ${info.trackTitle} tutorial · ${SITE}` : `${info.trackTitle} tutorial: every topic with examples · ${SITE}`;
        meta.description = short(info.description || DEFAULT_DESC);
        meta.type = topic ? 'article' : 'website';
        if (topic) {
          meta.ld.push({ '@context': 'https://schema.org', '@type': 'LearningResource', name: info.topicTitle, description: meta.description, url: meta.canonical, inLanguage: ['en', 'bn'], learningResourceType: 'Tutorial', isAccessibleForFree: true, educationalLevel: 'University', keywords: info.keywords.join(', '), isPartOf: { '@type': 'Course', name: `${info.trackTitle} tutorial`, url: `${base}/learn.html?track=${encodeURIComponent(track)}` }, provider: org });
          meta.ld.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Tutorials', item: `${base}/learn.html` },
            { '@type': 'ListItem', position: 2, name: info.trackTitle, item: `${base}/learn.html?track=${encodeURIComponent(track)}` },
            { '@type': 'ListItem', position: 3, name: info.topicTitle, item: meta.canonical },
          ] });
        }
      } else meta.noindex = true;
    }
  } else if (path === '/course.html') {
    const c = getCourse(query.get('id') ?? '');
    if (c) {
      meta.canonical = `${base}/course.html?id=${encodeURIComponent(c.id)}`;
      meta.title = `${c.title.en} · ${c.access === 'paid' ? 'Course' : 'Free video course'} · ${SITE}`;
      meta.description = short(c.blurb.en);
      meta.ld.push({ '@context': 'https://schema.org', '@type': 'Course', name: c.title.en, description: meta.description, url: meta.canonical, provider: org, isAccessibleForFree: c.access !== 'paid', inLanguage: ['bn', 'en'] });
    } else meta.noindex = true;
  } else if (path === '/watch.html') {
    const c = getCourse(query.get('course') ?? '');
    const v = query.get('v') ?? '';
    const ok = c && v && d.search.watchableVideos(c).includes(v);
    const vid = ok ? getVideo(v) : undefined;
    if (c && vid) {
      meta.canonical = `${base}/watch.html?course=${encodeURIComponent(c.id)}&v=${encodeURIComponent(v)}`;
      meta.title = `${vid.title} · ${c.title.en} · ${SITE}`;
      meta.description = short(`${vid.title}. Part of the ${c.title.en} course on ${SITE}: watch the lesson, try the code and take the quiz.`);
      meta.image = `https://i.ytimg.com/vi/${encodeURIComponent(v)}/hqdefault.jpg`;
      meta.type = 'video.other';
      meta.ld.push({ '@context': 'https://schema.org', '@type': 'VideoObject', name: vid.title, description: meta.description, thumbnailUrl: meta.image, embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v)}`, url: meta.canonical, duration: `PT${Math.max(1, vid.seconds)}S` });
    } else if (c) {
      meta.canonical = `${base}/course.html?id=${encodeURIComponent(c.id)}`;
      meta.title = `${c.title.en} · ${SITE}`;
      meta.description = short(c.blurb.en);
      meta.noindex = c.access === 'paid';
    } else meta.noindex = true;
  } else if (path === '/post.html') {
    const slug = query.get('slug') ?? '';
    // From the post list, so serving the page does not count as a view.
    const p = d.admin?.publicPosts('en').posts.find((x) => x.slug === slug);
    if (p) {
      meta.canonical = `${base}/post.html?slug=${encodeURIComponent(slug)}`;
      meta.title = `${p.title} · ${SITE} blog`;
      meta.description = short(p.excerpt || DEFAULT_DESC);
      meta.type = 'article';
      meta.ld.push({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: meta.description, url: meta.canonical, datePublished: p.publishedAt, author: { '@type': 'Person', name: p.author || SITE }, publisher: org });
    } else meta.noindex = true;
  }
  return meta;
}

/** Puts the page's title and meta tags into an HTML file. */
export function injectHead(html: string, meta: Meta): string {
  const tags = [
    `<meta name="description" content="${esc(meta.description)}">`,
    meta.noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${esc(meta.canonical)}">`,
    '<meta name="theme-color" content="#0f3d34">',
    `<meta property="og:site_name" content="${esc(SITE)}">`,
    `<meta property="og:type" content="${meta.type}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(meta.canonical)}">`,
    `<meta property="og:image" content="${esc(meta.image)}">`,
    '<meta property="og:locale" content="en_US"><meta property="og:locale:alternate" content="bn_BD">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${esc(meta.image)}">`,
    '<link rel="icon" href="/favicon.png" type="image/png" sizes="64x64">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<meta name="theme-color" content="#0c1822">',
    ...meta.ld.map((o) => `<script type="application/ld+json">${ldJson(o)}</script>`),
  ].join('\n  ');
  let out = /<title>[\s\S]*?<\/title>/.test(html) ? html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`) : html.replace(/<head>/, `<head>\n  <title>${esc(meta.title)}</title>`);
  out = out.replace(/\s*<meta name="(description|robots)"[^>]*>/g, '');
  return out.replace(/<\/title>/, `</title>\n  ${tags}`);
}
