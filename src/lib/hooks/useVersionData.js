import { useQuery } from '@tanstack/react-query';
import http from '../axios';

/**
 * App chrome data: version, logo, name and gallery images.
 *
 * The backend returns `images` as an index-keyed object ({"0": url, "1": url}),
 * not an array, so it is normalised here — consumers iterate it as a list.
 */
export default function useVersionData(options = {}) {
  return useQuery({
    queryKey: ['version-data', 'm_version'],
    queryFn: async ({ signal }) => {
      const data = await http.get('/', {
        params: { op: 'm_version' },
        signal,
        _skipStatusCheck: true, // m_version returns raw { version, logo, name, images }
      });

      const { images } = data || {};
      return {
        ...data,
        images: Array.isArray(images) ? images : Object.values(images || {}),
      };
    },
    ...options,
  });
}
