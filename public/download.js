import { api, el } from './common.js';

/** Keep the normal token refresh and error handling for authenticated downloads. */
export async function downloadFile(path, filename, type = 'text/csv') {
  const data = await api('GET', path, undefined, {}, type === 'text/csv' ? 'text' : 'json');
  const url = URL.createObjectURL(new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type }));
  const link = el('a', { href: url, download: filename });
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
