'use client';

import useFormData from '../../lib/hooks/useFormData';

/**
 * The forms inside one category. `idg` comes from `m_group`; the endpoint
 * returns nothing without it, so the query stays disabled until we have one.
 */
export default function useGroupForms(idg, options = {}) {
  const query = useFormData('m_forms', {
    params: { idg },
    enabled: !!idg,
    ...options,
  });
  return { ...query, forms: query.data?.forms || [] };
}
