// Identity.
// - anonymous (default): a random learner id in an HttpOnly cookie. For demos.
// - hybrid: anonymous by default; a learner who signs in with Supabase Auth sends
//   an access token and is identified by their user id. Anything they did before
//   signing in can be claimed into the account (POST /api/auth/claim).
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
  /** hybrid mode: the anonymous learner id from the cookie, when a signed-in request still carries it */
  anonId?: string;
  /** hybrid mode: true when the request is signed in */
  signedIn?: boolean;
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
  mode: 'anonymous' | 'supabase' | 'hybrid';
  identify(req: IncomingMessage): Promise<Identity>;
}

function anonymousIdentity(req: IncomingMessage): Identity {
  const existing = readCookie(req, LEARNER_COOKIE);
  if (existing && UUID.test(existing)) return { learnerId: existing, email: null };
  const learnerId = randomUUID();
  // Behind an HTTPS host (Render and similar) the proxy sets x-forwarded-proto.
  const secure = req.headers['x-forwarded-proto'] === 'https';
  return { learnerId, email: null, setCookie: `${LEARNER_COOKIE}=${learnerId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure ? '; Secure' : ''}` };
}

/** Header that removes the anonymous cookie (after its data was claimed). */
export function clearAnonCookie(req: IncomingMessage): string {
  const secure = req.headers['x-forwarded-proto'] === 'https';
  return `${LEARNER_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`;
}

export function anonymousAuth(): Authenticator {
  return { mode: 'anonymous', async identify(req) { return anonymousIdentity(req); } };
}

/** Optional sign-in: anonymous unless the request carries a valid Supabase access token. */
export function hybridAuth(url: string, anonKey: string, fetchImpl: AuthFetch = globalThis.fetch as unknown as AuthFetch, ttlMs = 60_000): Authenticator {
  const signedIn = supabaseAuth(url, anonKey, fetchImpl, ttlMs);
  return {
    mode: 'hybrid',
    async identify(req) {
      const header = req.headers.authorization ?? '';
      if (!header.startsWith('Bearer ')) return anonymousIdentity(req);
      const id = await signedIn.identify(req); // throws AuthError when the token is bad or expired
      const anon = readCookie(req, LEARNER_COOKIE);
      return { ...id, signedIn: true, anonId: anon && UUID.test(anon) ? anon : undefined };
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
