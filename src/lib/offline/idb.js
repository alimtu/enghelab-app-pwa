'use client';

import { createStore, get, set, del, keys } from 'idb-keyval';

import { AUTH_TOKEN_KEY } from '../auth/constants';

const isBrowser = typeof window !== 'undefined';

let formsCacheStore = null;

if (isBrowser) {
  try {
    if (typeof indexedDB !== 'undefined' && indexedDB.deleteDatabase) {
      indexedDB.deleteDatabase('poll-offline');
      // The submit-later queue was removed; drop any drafts left on the device.
      indexedDB.deleteDatabase('poll-offline-pending');
    }
    formsCacheStore = createStore('poll-offline-forms', 'forms-cache');
  } catch (err) {
    console.warn('[offline] IndexedDB unavailable, using localStorage fallback:', err);
  }
}

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
