import { api, el, getLang } from './common.js';
const T = {
  en: { notifications: 'Notifications', unread: (n) => `Notifications: ${n} unread`, readAll: 'Mark all read', empty: 'No notifications yet.', error: 'Could not load notifications. Try again.' },
  bn: { notifications: 'নোটিফিকেশন', unread: (n) => `নোটিফিকেশন: ${n}টি পড়া হয়নি`, readAll: 'সব পড়া হয়েছে', empty: 'এখনো কোনো নোটিফিকেশন নেই।', error: 'নোটিফিকেশন আসেনি। আবার চেষ্টা করো।' },
};
let cleanup = () => {};
export function mountNotices(actions) {
  cleanup(); actions.querySelector('.notice-menu')?.remove();
  const L = T[getLang()];
  const count = el('span', { 'aria-hidden': 'true' });
  const bell = el('button', { type: 'button', class: 'btn ghost small', 'aria-label': L.notifications, 'aria-expanded': 'false' }, '🔔 ', count);
  const panel = el('div', { class: 'acct-menu', style: 'max-height:70vh;overflow:auto', hidden: true });
  const wrapper = el('div', { class: 'notice-menu', style: 'position:relative' }, bell, panel);
  const refresh = async () => {
    try {
      const d = await api('GET', `/api/my-notices?lang=${getLang()}`); count.textContent = d.unread ? String(d.unread) : ''; bell.setAttribute('aria-label', L.unread(d.unread));
      const mark = el('button', { type: 'button', text: L.readAll, disabled: !d.unread, onclick: async () => { mark.disabled = true; try { await api('POST', '/api/my-notices/read-all'); await refresh(); } catch { mark.disabled = false; } } });
      panel.replaceChildren(el('strong', { text: L.notifications }), mark, ...(d.notices.length ? d.notices.map((n) => el('a', { href: n.href }, n.read ? '' : '● ', el('span', { text: n.text }))) : [el('p', { text: L.empty })]));
    } catch { panel.replaceChildren(el('p', { role: 'status', text: L.error })); }
  };
  bell.onclick = (e) => { e.stopPropagation(); panel.hidden = !panel.hidden; bell.setAttribute('aria-expanded', String(!panel.hidden)); if (!panel.hidden) refresh(); };
  wrapper.onclick = (e) => e.stopPropagation();
  const close = () => { panel.hidden = true; bell.setAttribute('aria-expanded', 'false'); };
  const visible = () => { if (!document.hidden) refresh(); };
  document.addEventListener('click', close); document.addEventListener('visibilitychange', visible);
  const timer = setInterval(visible, 60000);
  cleanup = () => { clearInterval(timer); document.removeEventListener('click', close); document.removeEventListener('visibilitychange', visible); };
  actions.append(wrapper); refresh();
}
