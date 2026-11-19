/** RFC 4180 rows; neutralize spreadsheet formulas in untrusted text cells. */
export function csv(rows: unknown[][]): string {
  return '\uFEFF' + rows.map((row) => row.map((value) => {
    let text = value == null ? '' : String(value);
    if (/^[\s]*[=+\-@]|^[\t\r\n]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }).join(',')).join('\r\n') + '\r\n';
}
