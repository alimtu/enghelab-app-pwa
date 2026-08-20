'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { AUTH_TOKEN_KEY } from './constants';
import { AUTH_EXPIRED_EVENT } from './events';
import { clearCachedForms, notifyPendingChange } from '../offline/idb';

const AuthContext = createContext(null);

/**
 * App-wide auth state. The app is browsable without an account — only the
 * sections that submit data require a signed-in student — so this provider
 * exposes the login sheet rather than redirecting to a login page.
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // `null` until the client has read localStorage, so nothing renders a
  // signed-out state during hydration and then flips.
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState(null);

  // Action to resume once the user finishes signing in.
  const pendingAction = useRef(null);

  useEffect(() => {
    setToken(localStorage.getItem(AUTH_TOKEN_KEY));
    setReady(true);
  }, []);

  // Keep tabs (and the logout helper) in sync.
  useEffect(() => {
    const sync = (e) => {
      if (e.key === AUTH_TOKEN_KEY) setToken(e.newValue);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // The axios interceptor cleared the stale token; reflect it and invite a
  // fresh sign-in without throwing the student out of the app.
  useEffect(() => {
    const onExpired = () => {
      setToken(null);
      setLoginReason('نشست شما به پایان رسیده است. دوباره وارد شوید.');
      setLoginOpen(true);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  // A queued action belongs to the screen that asked for it. If the student
  // navigates away before signing in, drop it rather than firing it later
  // against a page that no longer exists.
  useEffect(() => {
    pendingAction.current = null;
  }, [pathname]);

  const openLogin = useCallback((reason = null, onSuccess = null) => {
    setLoginReason(reason);
    pendingAction.current = onSuccess;
    setLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setLoginOpen(false);
    setLoginReason(null);
    pendingAction.current = null;
  }, []);

  const signIn = useCallback(
    (nextToken) => {
      // Cache keys embed the token, so entries from earlier sessions would
      // otherwise pile up on the device forever.
      clearCachedForms();

      localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
      setToken(nextToken);
      setLoginOpen(false);
      setLoginReason(null);

      // Gated queries failed while signed out; let them fetch again.
      queryClient.invalidateQueries();
      // Which drafts are visible depends on who is signed in.
      notifyPendingChange();

      const resume = pendingAction.current;
      pendingAction.current = null;
      if (resume) resume();
    },
    [queryClient],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    queryClient.clear();
    // Shared devices are the norm on campus — don't leave this student's
    // cached answers behind for the next person.
    clearCachedForms();
    notifyPendingChange();
  }, [queryClient]);

  /**
   * Run `action` if signed in, otherwise open the login sheet and run it once
   * the user succeeds. Use this for buttons that act (submit, save), and the
   * `<AuthGate>` component for whole sections that need an account to render.
   */
  const requireAuth = useCallback(
    (action, reason = null) => {
      if (token) {
        action?.();
        return true;
      }
      openLogin(reason, action);
      return false;
    },
    [token, openLogin],
  );

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      token,
      ready,
      loginOpen,
      loginReason,
      openLogin,
      closeLogin,
      signIn,
      signOut,
      requireAuth,
    }),
    [token, ready, loginOpen, loginReason, openLogin, closeLogin, signIn, signOut, requireAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
