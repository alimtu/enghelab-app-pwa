// Bridge between the axios interceptor (plain module) and the React auth
// context. The interceptor can't reach a hook, so an expired session is
// broadcast as a DOM event that AuthProvider listens for.
export const AUTH_EXPIRED_EVENT = 'auth:expired';

export function emitAuthExpired() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}
