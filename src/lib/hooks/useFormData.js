import { useQuery } from '@tanstack/react-query';
import http from '../axios';
import { cacheForms, getCachedForms } from '../offline/idb';

/**
 * Fetches an Icms op and caches the response in IndexedDB, falling back to that
 * copy when the request fails or the device is offline.
 *
 * @param {string} op       Operation name (e.g. 'm_forms')
 * @param {object} options  React Query options, plus an optional `params`
 *                          object appended to the request. The cache key
 *                          includes those params, so per-group form lists do
 *                          not overwrite each other.
 */
export default function useFormData(op, options = {}) {
  const { params, ...queryOptions } = options;

  // Stable across renders for the same values, and readable in DevTools.
  const paramKey = params
    ? Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join('&')
    : '';
  const cacheKey = paramKey ? `${op}?${paramKey}` : op;

  return useQuery({
    queryKey: ['form-data', op, paramKey],
    queryFn: async ({ signal }) => {
      const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

      if (isOffline) {
        const cached = await getCachedForms(cacheKey);
        if (cached) return cached;
        throw new Error('offline-no-cache');
      }

      try {
        const data = await http.get('/', {
          params: { op, ...params },
          signal,
          _skipStatusCheck: op === 'm_version',
        });
        cacheForms(cacheKey, data);
        return data;
      } catch (err) {
        const cached = await getCachedForms(cacheKey);
        if (cached) return cached;
        throw err;
      }
    },
    enabled: !!op,
    ...queryOptions,
  });
}
