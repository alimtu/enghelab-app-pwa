import queryClient from './queryClient';
import { AUTH_TOKEN_KEY } from './auth/constants';

let isLoggingOut = false;

/**
 * Full sign-out: drops the session and every cached artifact of it, then
 * returns to the home page. The app stays usable signed-out, so this no longer
 * redirects to a login page — prefer `useAuth().signOut()` inside components.
 */
export default function logout({ hard = false } = {}) {
  if (typeof window === 'undefined' || isLoggingOut) return;
  isLoggingOut = true;

  queryClient.cancelQueries();
  queryClient.clear();

  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.clear();

  // Only a hard reset clears offline caches and the service worker; a routine
  // sign-out must not throw away queued offline submissions.
  if (hard) {
    // Display preferences are accessibility settings, not session state — a
    // student who needs 120% text should not have to set it again after a
    // reset. Preserved across the clear.
    const preserved = ['enghelab-app-display', 'enghelab-app-theme'].map(
      (k) => [k, localStorage.getItem(k)]
    );
    localStorage.clear();
    preserved.forEach(([k, v]) => {
      if (v !== null) localStorage.setItem(k, v);
    });

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }

    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
      });
    }
  }

  window.location.href = '/';
}
