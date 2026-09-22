'use client';

import useFormData from '../../lib/hooks/useFormData';

/**
 * The form categories (پژوهش، آموزش، …) shown on the forms hub.
 * `m_group` requires a signed-in session.
 */
export default function useFormGroups(options = {}) {
  const query = useFormData('m_group', options);
  return { ...query, groups: query.data?.group || [] };
}
