// One rule for "is this course paid, and what label does it get", shared by the
// home hub, the Courses page and the Paid courses page (pure, tested).

/**
 * @param {{ access?: string, price?: string | null } | null | undefined} c a course from /api/courses
 * @param {'en' | 'bn'} [lang]
 * @returns {{ paid: boolean, label: string, price: string | null }}
 *   label: "Free" for free courses, the price for paid ones, or "PRO" when a paid course has no price yet.
 */
export function courseAccess(c, lang = 'en') {
  const paid = c?.access === 'paid';
  const price = paid && typeof c?.price === 'string' && c.price.trim() ? c.price.trim() : null;
  return { paid, price, label: paid ? price ?? 'PRO' : lang === 'bn' ? 'ফ্রি' : 'Free' };
}

/** Only the paid courses, in the order given. */
export const paidCourses = (courses) => (courses ?? []).filter((c) => courseAccess(c).paid);
