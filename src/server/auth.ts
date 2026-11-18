// Identity.
// - anonymous (default): a random learner id in an HttpOnly cookie. For demos.
// - supabase: the browser signs in with Supabase Auth (Google or email link)
//   and sends its access token; the server verifies it with Supabase on each
//   request (cached briefly) and uses the user id as the learner id.

import type { IncomingMessage } from 'node:http';
import { randomUUID } from 'node:crypto';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LEARNER_COOKIE = 'll_learner';

export interface Identity {
  learnerId: string;
  email: string | null;
  setCookie?: string;
}

export class AuthError extends Error {
  readonly code = 'unauthenticated';
  readonly status = 401;
}

export type AuthFetch = (url: string, init: { method: string; headers: Record<string, string> }) => Promise<{ ok: boolean; status: number; json(): Promise<any> }>;

function readCookie(req: IncomingMessage, name: string): string | undefined {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

export interface Authenticator {
  mode: 'anonymous' | 'supabase';
  identify(req: IncomingMessage): Promise<Identity>;
}

export function anonymousAuth(): Authenticator {
  return {
    mode: 'anonymous',
    async identify(req) {
      const existing = readCookie(req, LEARNER_COOKIE);
      if (existing && UUID.test(existing)) return { learnerId: existing, email: null };
      const learnerId = randomUUID();
      // Behind an HTTPS host (Render and similar) the proxy sets x-forwarded-proto.
      const secure = req.headers['x-forwarded-proto'] === 'https';
      return { learnerId, email: null, setCookie: `${LEARNER_COOKIE}=${learnerId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure ? '; Secure' : ''}` };
    },
  };
}

export function supabaseAuth(url: string, anonKey: string, fetchImpl: AuthFetch = globalThis.fetch as unknown as AuthFetch, ttlMs = 60_000): Authenticator {
  const cache = new Map<string, { identity: Identity; until: number }>();
  const base = url.replace(/\/$/, '');
  return {
    mode: 'supabase',
    async identify(req) {
      const header = req.headers.authorization ?? '';
      const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
      if (!token) throw new AuthError('Sign in to continue.');
      const hit = cache.get(token);
      if (hit && hit.until > Date.now()) return hit.identity;
      const res = await fetchImpl(`${base}/auth/v1/user`, { method: 'GET', headers: { apikey: anonKey, authorization: `Bearer ${token}` } });
      if (!res.ok) throw new AuthError('Your sign-in has expired. Please sign in again.');
      const user = await res.json();
      if (!user?.id) throw new AuthError('Sign in to continue.');
      const identity: Identity = { learnerId: String(user.id), email: user.email ?? null };
      cache.set(token, { identity, until: Date.now() + ttlMs });
      if (cache.size > 5000) cache.clear();
      return identity;
    },
  };
}
