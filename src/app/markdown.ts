// A small, safe Markdown subset for text written in the admin site (posts and
// admin-added tutorial topics). Everything is escaped first, so no HTML typed
// by a user ever reaches a page; only the tags below are produced.
//
// Blocks: ## / ### / #### headings, ``` fenced code ```, - or * lists,
// 1. numbered lists, > quotes, --- rules, blank-line paragraphs.
// Inline: `code`, **bold**, *italic*, [text](https://link).

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function slugify(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ঀ-৿]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'section';
}

function inline(text: string): string {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p) => {
    if (p.startsWith('`') && p.endsWith('`') && p.length > 2) return `<code>${esc(p.slice(1, -1))}</code>`;
    let h = esc(p);
    h = h.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, (_m, label: string, url: string) => `<a href="${url}">${label}</a>`);
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    return h;
  }).join('');
}

export function markdownToHtml(md: string): string {
  const lines = String(md ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out: string[] = [];
  const used = new Set<string>();
  let para: string[] = [];
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null;
  let quote: string[] = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; } };
  const flushQuote = () => { if (quote.length) { out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`); quote = []; } };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const fence = /^```\s*([a-z0-9+#-]*)\s*$/i.exec(line);
    if (fence) {
      flushAll();
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i]!)) code.push(lines[i++]!);
      out.push(`<pre><code${fence[1] ? ` class="language-${esc(fence[1].toLowerCase())}"` : ''}>${esc(code.join('\n'))}</code></pre>`);
      continue;
    }
    const h = /^(#{2,4})\s+(.+)$/.exec(line);
    if (h) {
      flushAll();
      const level = h[1]!.length;
      let id = slugify(h[2]!);
      while (used.has(id)) id += '-x';
      used.add(id);
      out.push(`<h${level} id="${id}">${inline(h[2]!.trim())}</h${level}>`);
      continue;
    }
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { flushAll(); out.push('<hr>'); continue; }
    const ul = /^\s*[-*]\s+(.+)$/.exec(line);
    const ol = /^\s*\d+[.)]\s+(.+)$/.exec(line);
    if (ul || ol) {
      flushPara(); flushQuote();
      const tag = ul ? 'ul' : 'ol';
      if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push((ul ?? ol)![1]!);
      continue;
    }
    const q = /^>\s?(.*)$/.exec(line);
    if (q) { flushPara(); flushList(); quote.push(q[1]!); continue; }
    if (!line.trim()) { flushAll(); continue; }
    flushList(); flushQuote();
    para.push(line.trim());
  }
  flushAll();
  return out.join('\n');
}

/** Plain text of Markdown, for search, excerpts and the AI's evidence. */
export function markdownText(md: string): string {
  return String(md ?? '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`_\[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();
}
