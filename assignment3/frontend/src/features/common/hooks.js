import { useActionData } from 'react-router-dom';
import { parseResponseErrors } from './helpersErrors';

export function useActionErrors({ parsed = false } = {}) {
  const actionData = useActionData();
  return parsed ? parseResponseErrors(actionData || {}) : actionData?.errors || null;
}
