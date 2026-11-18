// Deterministic display order for answer options, so the correct answer is
// not always in the same position. The same key always gives the same order,
// which keeps answers checkable without storing anything.

import { createRng, hashSeed } from './rng.ts';

/** order[i] = index (in the authored list) of the option shown at position i. */
export function optionOrder(key: string, count: number, keepLast = 0): number[] {
  const movable = Math.max(0, count - keepLast);
  const order = Array.from({ length: movable }, (_, i) => i);
  const rng = createRng(hashSeed(`options:${key}`));
  for (let i = movable - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  for (let i = movable; i < count; i++) order.push(i);
  return order;
}
