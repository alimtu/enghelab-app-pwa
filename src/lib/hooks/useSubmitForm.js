import { useMutation } from '@tanstack/react-query';
import http from '../axios';
import buildSubmitParams from '../utils/buildSubmitParams';

export default function useSubmitForm() {
  return useMutation({
    mutationFn: ({ values, steps, formId }) => {
      const params = buildSubmitParams(values, steps, formId);

      return http.get('/', { params });
    },
  });
}
