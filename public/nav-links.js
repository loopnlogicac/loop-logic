// Top-bar links (pure, so it can be tested without a browser).
// Everyone sees Home, Courses, Paid courses and Blog; Dashboard and Profile only
// appear for a signed-in student, and never when the site has no sign-in at all.

const LINKS = [
  { id: 'home', href: '/', en: 'Home', bn: 'হোম' },
  { id: 'courses', href: '/courses.html', en: 'Courses', bn: 'কোর্স' },
  { id: 'paid', href: '/paid-courses.html', en: 'Paid courses', bn: 'পেইড কোর্স' },
  { id: 'blog', href: '/blog.html', en: 'Blog', bn: 'ব্লগ' },
  { id: 'dashboard', href: '/dashboard.html', en: 'Dashboard', bn: 'ড্যাশবোর্ড', signedIn: true },
  { id: 'profile', href: '/profile.html', en: 'Profile', bn: 'প্রোফাইল', signedIn: true },
];

/**
 * @param {{ signedIn: boolean, authMode?: string, lang?: 'en' | 'bn' }} o
 * @returns {{ id: string, href: string, label: string }[]}
 */
export function navLinks({ signedIn, authMode, lang = 'en' }) {
  const canSignIn = authMode !== 'anonymous';
  return LINKS.filter((l) => !l.signedIn || (signedIn && canSignIn)).map((l) => ({ id: l.id, href: l.href, label: lang === 'bn' ? l.bn : l.en }));
}
