// Top-bar links (pure, so it can be tested without a browser).
// Everyone sees Home, Tutorials, Courses, Premium and Blog; My learning (the dashboard)
// appears only for a signed-in student, and never when the site has no sign-in at all.
// Profile lives in the account menu.

const LINKS = [
  { id: 'home', href: '/', en: 'Home', bn: 'হোম' },
  { id: 'learn', href: '/learn.html', en: 'Tutorials', bn: 'টিউটোরিয়াল' },
  { id: 'courses', href: '/courses.html', en: 'Courses', bn: 'কোর্স' },
  { id: 'paid', href: '/paid-courses.html', en: 'Premium', bn: 'প্রিমিয়াম' },
  { id: 'blog', href: '/blog.html', en: 'Blog', bn: 'ব্লগ' },
  { id: 'dashboard', href: '/dashboard.html', en: 'My learning', bn: 'আমার শেখা', signedIn: true },
];

/**
 * @param {{ signedIn: boolean, authMode?: string, lang?: 'en' | 'bn' }} o
 * @returns {{ id: string, href: string, label: string }[]}
 */
export function navLinks({ signedIn, authMode, lang = 'en' }) {
  const canSignIn = authMode !== 'anonymous';
  return LINKS.filter((l) => !l.signedIn || (signedIn && canSignIn)).map((l) => ({ id: l.id, href: l.href, label: lang === 'bn' ? l.bn : l.en }));
}
