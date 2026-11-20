import { el, api, getLang, currentUser, showSignIn } from './common.js';

// Spread into each host page's T so its visible strings share the page language.
export const savedStrings = {
  en: { savedHeading: 'Saved', bookmarkTab: 'Bookmarks', revisitTab: 'Revisit', notesTab: 'Notes', bookmark: '★ Bookmark', revisit: 'Revisit later', privateNote: 'Private note (up to 2,000 characters)', saveNote: 'Save', deleteNote: 'Remove saved item', signSave: 'Sign in to save', noteSaved: 'Saved', savedEmpty: 'Nothing saved here yet.', savedError: 'Could not load saved items. Try again.', noteError: 'Could not save. Try again.' },
  bn: { savedHeading: 'সেভ করা', bookmarkTab: 'বুকমার্ক', revisitTab: 'আবার দেখব', notesTab: 'নোট', bookmark: '★ বুকমার্ক', revisit: 'পরে আবার দেখব', privateNote: 'নিজের নোট (সর্বোচ্চ ২,০০০ অক্ষর)', saveNote: 'সেভ করো', deleteNote: 'সেভ করা আইটেম সরাও', signSave: 'সেভ করতে সাইন ইন করো', noteSaved: 'সেভ হয়েছে', savedEmpty: 'এখানে এখনো কিছু সেভ করোনি।', savedError: 'সেভ করা আইটেম আসেনি। আবার চেষ্টা করো।', noteError: 'সেভ হয়নি। আবার চেষ্টা করো।' },
};

export function savedEditor(key, L) {
  const box = el('section', { class: 'card saved-editor' });
  if (!currentUser()) return el('section', { class: 'card' }, el('button', { type: 'button', class: 'btn secondary', text: L.signSave, onclick: () => showSignIn() }));
  const url = `/api/my-notes/${encodeURIComponent(key)}?lang=${getLang()}`;
  const status = el('p', { role: 'status', class: 'small' });
  api('GET', url).then((note) => {
    const bookmark = el('input', { type: 'checkbox' }); bookmark.checked = note.bookmark;
    const revisit = el('input', { type: 'checkbox' }); revisit.checked = note.revisit;
    const text = el('textarea', { maxlength: '2000', rows: '4', style: 'width:100%' }); text.value = note.text;
    const save = el('button', { class: 'btn secondary', type: 'submit', text: L.saveNote });
    const remove = el('button', { class: 'btn ghost', type: 'button', text: L.deleteNote });
    const form = el('form', {}, el('div', { class: 'row' }, el('label', {}, bookmark, L.bookmark), el('label', {}, revisit, L.revisit)), el('label', {}, L.privateNote, text), el('div', { class: 'row' }, save, remove), status);
    const write = async (deleting) => {
      save.disabled = remove.disabled = true;
      try {
        await api(deleting ? 'DELETE' : 'PUT', url, deleting ? undefined : { bookmark: bookmark.checked, revisit: revisit.checked, text: text.value });
        if (deleting) { bookmark.checked = revisit.checked = false; text.value = ''; }
        status.textContent = L.noteSaved;
      } catch { status.textContent = L.noteError; }
      finally { save.disabled = remove.disabled = false; }
    };
    form.onsubmit = (e) => { e.preventDefault(); write(false); };
    remove.onclick = () => write(true);
    box.replaceChildren(form);
  }).catch(() => box.replaceChildren(el('p', { role: 'status', text: L.savedError })));
  return box;
}

export function savedList(L) {
  const box = el('section', { class: 'card' }, el('h2', { text: L.savedHeading }));
  if (!currentUser()) { box.append(el('button', { type: 'button', class: 'btn secondary', text: L.signSave, onclick: () => showSignIn() })); return box; }
  api('GET', `/api/my-notes?lang=${getLang()}`).then(({ notes }) => {
    const items = el('div');
    const tabs = el('div', { role: 'tablist', class: 'row', 'aria-label': L.savedHeading });
    for (const [i, label] of [L.bookmarkTab, L.revisitTab, L.notesTab].entries()) {
      const btn = el('button', { type: 'button', role: 'tab', class: 'btn ghost small', text: label, 'aria-selected': String(i === 0) });
      const show = () => {
        for (const tab of tabs.children) tab.setAttribute('aria-selected', String(tab === btn));
        const rows = notes.filter((n) => i === 0 ? n.bookmark : i === 1 ? n.revisit : n.text.trim());
        items.replaceChildren(...(rows.length ? rows.map((n) => el('div', { class: 'lesson-row' }, el('div', {}, el('a', { href: n.href, text: n.title }), i === 2 ? el('p', { style: 'white-space:pre-wrap', text: n.text }) : null))) : [el('p', { class: 'muted', text: L.savedEmpty })]));
      };
      btn.onclick = show; tabs.append(btn); if (i === 0) show();
    }
    box.append(tabs, items);
  }).catch(() => box.append(el('p', { text: L.savedError })));
  return box;
}
