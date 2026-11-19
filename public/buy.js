// Buy a paid course (/buy.html?course=…): price and coupon, then pay by bKash or
// Nagad with a reference code, then send the transaction ID. A person checks it.
import { api, getLang, applyI18n, mountNav, el, num, toast, currentUser, showSignIn, ago } from './common.js';

const T = {
  en: {
    tagline: 'Learn with purpose', title: (c) => `Buy “${c}”`, back: '← Back to the course',
    videos: (n, h) => `${n} videos · ${h} hours`, samples: (n) => `${n} free sample videos you can watch first`, access: (m) => (m ? `Access for ${m} months` : 'Access for ever'),
    price: 'Price', coupon: 'Coupon code', apply: 'Apply', discount: (c) => `Coupon ${c}`, total: 'To pay', remove: 'Remove',
    owned: 'You already have this course.', watch: 'Start watching',
    pay: 'How to pay', choose: 'Pay with', personal: 'Personal number: use Send Money', merchant: 'Merchant number: use Payment', agent: 'Agent number: use Cash In',
    step1: (m) => `Open your ${m} app.`, step2: (how) => how, step3: (n) => ['Send to ', el('strong', { class: 'big', text: n }), el('button', { type: 'button', class: 'chip small buy-copy', text: 'Copy', onclick: () => navigator.clipboard?.writeText(n).then(() => toast('Number copied.')) })],
    step4: (a) => ['Amount: ', el('strong', { class: 'big', text: `৳ ${a}` })], step5: (r) => ['In “Reference”, write ', el('strong', { class: 'big', text: r })],
    step6: 'You get a message with a transaction ID (TrxID). Enter it below.',
    trx: 'Transaction ID (TrxID)', last4: 'Last 4 digits of the number you paid from', send: 'I have paid · send for checking',
    sent: 'Thank you! We check payments by hand, usually within a day. The course opens as soon as it is approved.',
    noMethods: 'Payments are not open yet. Join the waitlist and we will tell you when they are.', waitlist: 'Join the waitlist',
    signIn: 'Sign in first, so the course is added to your account.', signInBtn: 'Sign in',
    orders: 'Your payments for this course', status: { pending: 'Being checked', approved: 'Approved', rejected: 'Not accepted', cancelled: 'Cancelled' }, cancel: 'Cancel',
    privacy: 'We only ask for the transaction ID and the last 4 digits of your number. Never share your PIN or OTP with anyone.',
    free: 'Unlock for free', freeNote: 'Your coupon covers the whole price.',
  },
  bn: {
    tagline: 'উদ্দেশ্য নিয়ে শেখা', title: (c) => `“${c}” কেনো`, back: '← কোর্সে ফিরে যাও',
    videos: (n, h) => `${n}টি ভিডিও · ${h} ঘণ্টা`, samples: (n) => `${n}টি ফ্রি নমুনা ভিডিও আগে দেখে নিতে পারো`, access: (m) => (m ? `${m} মাসের জন্য অ্যাক্সেস` : 'সারাজীবনের অ্যাক্সেস'),
    price: 'দাম', coupon: 'কুপন কোড', apply: 'লাগাও', discount: (c) => `কুপন ${c}`, total: 'দিতে হবে', remove: 'সরাও',
    owned: 'এই কোর্সটি তোমার কেনা আছে।', watch: 'দেখা শুরু করো',
    pay: 'কীভাবে টাকা পাঠাবে', choose: 'যেভাবে পাঠাবে', personal: 'পার্সোনাল নম্বর: Send Money ব্যবহার করো', merchant: 'মার্চেন্ট নম্বর: Payment ব্যবহার করো', agent: 'এজেন্ট নম্বর: Cash In ব্যবহার করো',
    step1: (m) => `তোমার ${m} অ্যাপ খোলো।`, step2: (how) => how, step3: (n) => ['এই নম্বরে পাঠাও ', el('strong', { class: 'big', text: n }), el('button', { type: 'button', class: 'chip small buy-copy', text: 'কপি', onclick: () => navigator.clipboard?.writeText(n).then(() => toast('নম্বর কপি হয়েছে।')) })],
    step4: (a) => ['পরিমাণ: ', el('strong', { class: 'big', text: `৳ ${a}` })], step5: (r) => ['“Reference”-এ লেখো ', el('strong', { class: 'big', text: r })],
    step6: 'একটি মেসেজে ট্রানজ্যাকশন আইডি (TrxID) পাবে। নিচে সেটা লেখো।',
    trx: 'ট্রানজ্যাকশন আইডি (TrxID)', last4: 'যে নম্বর থেকে পাঠিয়েছ তার শেষ ৪ সংখ্যা', send: 'টাকা পাঠিয়েছি · যাচাইয়ের জন্য পাঠাও',
    sent: 'ধন্যবাদ! আমরা নিজে হাতে পেমেন্ট দেখি, সাধারণত এক দিনের মধ্যে। অনুমোদন হলেই কোর্স খুলে যাবে।',
    noMethods: 'পেমেন্ট এখনো চালু হয়নি। ওয়েটলিস্টে যোগ দাও, চালু হলে জানাব।', waitlist: 'ওয়েটলিস্টে যোগ দাও',
    signIn: 'আগে সাইন ইন করো, যাতে কোর্সটি তোমার অ্যাকাউন্টে যোগ হয়।', signInBtn: 'সাইন ইন',
    orders: 'এই কোর্সের জন্য তোমার পেমেন্ট', status: { pending: 'যাচাই চলছে', approved: 'অনুমোদিত', rejected: 'গ্রহণ করা হয়নি', cancelled: 'বাতিল' }, cancel: 'বাতিল করো',
    privacy: 'আমরা শুধু ট্রানজ্যাকশন আইডি আর নম্বরের শেষ ৪ সংখ্যা চাই। পিন বা ওটিপি কখনো কাউকে দিও না।',
    free: 'ফ্রিতে খুলে নাও', freeNote: 'তোমার কুপনে পুরো দাম মাফ।',
  },
};
const t = () => T[getLang()];
const main = document.getElementById('main');
const courseId = new URLSearchParams(location.search).get('course') ?? '';
const NAMES = { bkash: 'bKash', nagad: 'Nagad' };
const COLORS = { bkash: '#e2136e', nagad: '#ec1c24' };
let d = null;
const state = { coupon: '', quote: null, method: null, trx: '', last4: '' };

const price = (L) => {
  const q = state.quote ?? { price: d.course.price, discount: 0, total: d.course.price, coupon: null };
  return el('div', { class: 'buy-price' },
    el('div', {}, el('span', { text: L.price }), el('span', { text: `৳ ${num(q.price)}` })),
    q.discount ? el('div', { class: 'off' }, el('span', { text: L.discount(q.coupon.code) }), el('span', { text: `− ৳ ${num(q.discount)}` })) : null,
    el('div', { class: 'total' }, el('span', { text: L.total }), el('span', { text: `৳ ${num(q.total)}` })));
};

function render() {
  const L = t();
  applyI18n({ tagline: L.tagline });
  const c = d.course;
  document.title = `${L.title(c.title)} · Loop & Logic`;
  const q = state.quote ?? { total: c.price };
  const head = [el('a', { href: `/watch.html?course=${encodeURIComponent(c.id)}`, text: L.back }), el('h1', { text: L.title(c.title) })];
  const summary = el('div', { class: 'buy-card' },
    el('div', { class: 'buy-tile', style: `background:${c.tint ?? '#e6efb5'}` }, el('span', { text: c.code ?? c.title.split(/\s+/).map((w) => w[0]).join('').slice(0, 3) })),
    el('h2', { text: c.title }), c.blurb ? el('p', { class: 'muted', style: 'margin:0', text: c.blurb }) : null,
    el('p', { class: 'muted small', style: 'margin:0', text: [L.videos(num(c.videos), num(c.hours)), L.access(c.accessMonths), c.samples ? L.samples(num(c.samples)) : null].filter(Boolean).join(' · ') }),
    price(L),
    c.couponsAllowed && !d.owned ? (() => {
      const inp = el('input', { type: 'text', id: 'cp', class: 'mono', value: state.coupon, autocomplete: 'off', oninput: (e) => { state.coupon = e.target.value; } });
      const apply = el('button', { type: 'button', class: 'btn secondary', text: state.quote?.coupon?.ok ? L.remove : L.apply, onclick: async () => {
        if (state.quote?.coupon?.ok) { state.coupon = ''; state.quote = null; return render(); }
        try { state.quote = await api('POST', `/api/buy/${encodeURIComponent(c.id)}/quote`, { coupon: state.coupon }); if (state.quote.coupon && !state.quote.coupon.ok) toast(state.quote.coupon.reason); render(); } catch (e) { toast(e.message); }
      } });
      return el('div', { class: 'buy-row' }, el('label', { class: 'buy-field', for: 'cp' }, L.coupon, inp), apply);
    })() : null);

  let right;
  if (d.owned) {
    right = el('div', { class: 'buy-card' }, el('div', { class: 'buy-ok', text: L.owned }), el('a', { class: 'btn primary', href: `/watch.html?course=${encodeURIComponent(c.id)}`, text: L.watch }));
  } else if (!d.signedIn) {
    right = el('div', { class: 'buy-card' }, el('p', { text: L.signIn }), el('button', { type: 'button', class: 'btn primary', text: L.signInBtn, onclick: () => showSignIn() }));
  } else if (q.total === 0 && state.quote?.coupon?.ok) {
    const go = el('button', { type: 'button', class: 'btn primary', text: L.free });
    go.onclick = async () => { go.disabled = true; try { await api('POST', `/api/buy/${encodeURIComponent(c.id)}`, { coupon: state.quote.coupon.code }); await load(); } catch (e) { toast(e.message); go.disabled = false; } };
    right = el('div', { class: 'buy-card' }, el('p', { class: 'buy-ok', text: L.freeNote }), go);
  } else if (!d.methods.length) {
    right = el('div', { class: 'buy-card' }, el('p', { class: 'buy-note', text: L.noMethods }), el('a', { class: 'btn primary', href: `/pricing.html#waitlist`, text: L.waitlist }));
  } else {
    state.method ??= d.methods[0].id;
    const m = d.methods.find((x) => x.id === state.method) ?? d.methods[0];
    const how = { personal: L.personal, merchant: L.merchant, agent: L.agent }[m.type];
    const trx = el('input', { type: 'text', id: 'trx', class: 'mono', value: state.trx, maxlength: '12', autocomplete: 'off', oninput: (e) => { state.trx = e.target.value; } });
    const last4 = el('input', { type: 'text', id: 'l4', inputmode: 'numeric', maxlength: '4', value: state.last4, autocomplete: 'off', oninput: (e) => { state.last4 = e.target.value.replace(/\D/g, ''); } });
    const send = el('button', { type: 'submit', class: 'btn primary', text: L.send });
    const form = el('form', { class: 'buy-card', 'aria-labelledby': 'pay-h' },
      el('h2', { id: 'pay-h', text: L.pay }),
      el('fieldset', { style: 'border:0;margin:0;padding:0' }, el('legend', { class: 'muted small', text: L.choose }),
        el('div', { class: 'buy-methods' }, ...d.methods.map((x) => el('label', { class: 'buy-method', 'data-on': String(x.id === m.id) },
          el('input', { type: 'radio', name: 'method', checked: x.id === m.id || null, onchange: () => { state.method = x.id; render(); } }), el('span', { class: 'dot', style: `background:${COLORS[x.id]}`, 'aria-hidden': 'true' }), NAMES[x.id])))),
      el('ol', { class: 'buy-steps' }, el('li', { text: L.step1(NAMES[m.id]) }), el('li', { text: L.step2(how) }), el('li', {}, ...L.step3(m.number)), el('li', {}, ...L.step4(num(q.total))), el('li', {}, ...L.step5(d.reference)), el('li', { text: L.step6 })),
      d.note ? el('p', { class: 'buy-note', text: d.note }) : null,
      el('div', { class: 'buy-row' }, el('label', { class: 'buy-field', for: 'trx' }, L.trx, trx), el('label', { class: 'buy-field', for: 'l4' }, L.last4, last4)),
      el('p', { class: 'muted small', style: 'margin:0', text: L.privacy }),
      send);
    form.onsubmit = async (e) => {
      e.preventDefault(); send.disabled = true;
      try {
        await api('POST', `/api/buy/${encodeURIComponent(c.id)}`, { method: m.id, trxId: state.trx, senderLast4: state.last4, coupon: state.quote?.coupon?.ok ? state.quote.coupon.code : '' });
        toast(L.sent); state.trx = ''; await load();
      } catch (err) { toast(err.message); send.disabled = false; }
    };
    right = form;
  }
  const orders = d.orders.length ? el('div', { class: 'buy-card' }, el('h2', { text: L.orders }), el('div', { class: 'buy-orders' }, ...d.orders.map((o) => el('div', { class: 'buy-order' },
    el('span', { class: `st ${o.status}`, text: L.status[o.status] ?? o.status }), el('span', { text: `৳ ${num(o.total)}${o.method !== 'free' ? ` · ${NAMES[o.method] ?? o.method} · ${o.trxId}` : ''}` }), el('span', { class: 'muted small', text: ago(o.createdAt) }),
    o.reason ? el('span', { class: 'muted small', style: 'flex-basis:100%', text: o.reason }) : null,
    o.status === 'pending' ? el('button', { type: 'button', class: 'linkish small', text: L.cancel, onclick: async () => { await api('POST', `/api/orders/${o.id}/cancel`); await load(); } }) : null)))) : null;
  const pending = d.orders.some((o) => o.status === 'pending');
  main.replaceChildren(...head, el('div', { class: 'buy-grid' }, el('div', { style: 'display:flex;flex-direction:column;gap:18px' }, summary, orders), pending && !d.owned ? el('div', { class: 'buy-card' }, el('p', { class: 'buy-ok', text: L.sent })) : right));
}

async function load() {
  try {
    d = await api('GET', `/api/buy/${encodeURIComponent(courseId)}?lang=${getLang()}`);
    render();
  } catch (e) {
    main.replaceChildren(el('div', { class: 'card empty' }, el('h2', { text: e.message }), el('a', { class: 'btn secondary', href: '/courses.html', text: 'Courses' })));
  }
}
mountNav('', load);
load();
