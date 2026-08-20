'use client';

import { createStore, get, set, del, keys, values } from 'idb-keyval';

import { AUTH_TOKEN_KEY } from '../auth/constants';

const isBrowser = typeof window !== 'undefined';

let formsCacheStore = null;
let pendingStore = null;

if (isBrowser) {
  try {
    if (typeof indexedDB !== 'undefined' && indexedDB.deleteDatabase) {
      indexedDB.deleteDatabase('poll-offline');
    }
    formsCacheStore = createStore('poll-offline-forms', 'forms-cache');
    pendingStore = createStore('poll-offline-pending', 'pending-submissions');
  } catch (err) {
    console.warn('[offline] IndexedDB unavailable, using localStorage fallback:', err);
  }
}

const LS_PENDING_PREFIX = 'offline-pending:';
const LS_FORMS_PREFIX = 'offline-forms:';

/**
 * Cached responses are scoped to the account that fetched them. Without this
 * the next person on the device — including an anonymous visitor — would be
 * served the previous student's cached forms.
 */
function scopedKey(op) {
  const token = isBrowser ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  return token ? `${op}::${token}` : `${op}::anon`;
}

/** Drops every cached response belonging to the signed-in account. */
export async function clearCachedForms() {
  if (!isBrowser) return;
  if (formsCacheStore) {
    try {
      const allKeys = await keys(formsCacheStore);
      await Promise.all(allKeys.map((k) => del(k, formsCacheStore)));
    } catch (err) {
      console.warn('[offline] clearCachedForms IDB failed:', err);
    }
  }
  try {
    lsKeys(LS_FORMS_PREFIX).forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('[offline] clearCachedForms localStorage failed:', err);
  }
}

function lsKeys(prefix) {
  const out = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) out.push(k);
  }
  return out;
}

function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}

export async function cacheForms(op, data) {
  if (!isBrowser) return;
  const key = scopedKey(op);
  const payload = { data, cachedAt: Date.now() };
  if (formsCacheStore) {
    try {
      await set(key, payload, formsCacheStore);
      return;
    } catch (err) {
      console.warn('[offline] cacheForms IDB failed, using localStorage:', err);
    }
  }
  try {
    localStorage.setItem(LS_FORMS_PREFIX + key, JSON.stringify(payload));
  } catch (err) {
    console.warn('[offline] cacheForms localStorage failed:', err);
  }
}

export async function getCachedForms(op) {
  if (!isBrowser) return null;
  const key = scopedKey(op);
  if (formsCacheStore) {
    try {
      const entry = await get(key, formsCacheStore);
      if (entry?.data !== undefined) return entry.data;
    } catch (err) {
      console.warn('[offline] getCachedForms IDB failed:', err);
    }
  }
  try {
    const raw = localStorage.getItem(LS_FORMS_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw).data ?? null;
  } catch {
    return null;
  }
}

export async function addPending(item) {
  if (!isBrowser) throw new Error('not-in-browser');

  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const safeItem = toPlain(item);
  // Remember who wrote the draft. A draft saved while signed out has no owner
  // and may be sent by whoever signs in next; one saved by a signed-in student
  // must never be submitted under somebody else's account.
  const owner = localStorage.getItem(AUTH_TOKEN_KEY) || null;
  const record = { id, status: 'pending', createdAt: Date.now(), owner, ...safeItem };

  if (pendingStore) {
    try {
      await set(id, record, pendingStore);
      notifyPendingChange();
      return record;
    } catch (err) {
      console.warn('[offline] addPending IDB failed, using localStorage:', err);
    }
  }

  try {
    localStorage.setItem(LS_PENDING_PREFIX + id, JSON.stringify(record));
    notifyPendingChange();
    return record;
  } catch (err) {
    console.error('[offline] addPending localStorage failed:', err);
    throw err;
  }
}

export async function getPending() {
  if (!isBrowser) return [];

  let list = [];
  if (pendingStore) {
    try {
      list = await values(pendingStore);
    } catch (err) {
      console.warn('[offline] getPending IDB failed:', err);
    }
  }

  try {
    const lsList = lsKeys(LS_PENDING_PREFIX)
      .map((k) => {
        try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
      })
      .filter(Boolean);

    const seen = new Set(list.map((r) => r.id));
    for (const r of lsList) if (!seen.has(r.id)) list.push(r);
  } catch {}

  return list.filter(isOwnedByCurrentUser).sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * A draft belongs to the current session if it was saved signed-out (no owner,
 * so whoever signs in can send it) or by the account that is signed in now.
 */
export function isOwnedByCurrentUser(record) {
  if (!record?.owner) return true;
  return record.owner === localStorage.getItem(AUTH_TOKEN_KEY);
}

export async function getPendingCount() {
  if (!isBrowser) return 0;
  // Counts what the queue screen actually lists, so the nav badge can't
  // advertise drafts belonging to another account.
  const list = await getPending();
  return list.length;
}

export async function updatePending(id, patch) {
  if (!isBrowser) return;

  if (pendingStore) {
    try {
      const existing = await get(id, pendingStore);
      if (existing) {
        await set(id, { ...existing, ...patch }, pendingStore);
        notifyPendingChange();
        return;
      }
    } catch (err) {
      console.warn('[offline] updatePending IDB failed:', err);
    }
  }

  try {
    const raw = localStorage.getItem(LS_PENDING_PREFIX + id);
    if (!raw) return;
    const existing = JSON.parse(raw);
    localStorage.setItem(LS_PENDING_PREFIX + id, JSON.stringify({ ...existing, ...patch }));
    notifyPendingChange();
  } catch {}
}

export async function removePending(id) {
  if (!isBrowser) return;

  if (pendingStore) {
    try {
      await del(id, pendingStore);
    } catch (err) {
      console.warn('[offline] removePending IDB failed:', err);
    }
  }
  try {
    localStorage.removeItem(LS_PENDING_PREFIX + id);
  } catch {}
  notifyPendingChange();
}

const PENDING_EVENT = 'offline-pending-change';

/**
 * Signals that the visible queue changed. Also fired on sign-in/out, because
 * drafts are account-scoped and the badge has to be recounted.
 */
export function notifyPendingChange() {
  if (!isBrowser) return;
  window.dispatchEvent(new Event(PENDING_EVENT));
}

export function subscribePendingChange(callback) {
  if (!isBrowser) return () => {};
  window.addEventListener(PENDING_EVENT, callback);
  return () => window.removeEventListener(PENDING_EVENT, callback);
}
