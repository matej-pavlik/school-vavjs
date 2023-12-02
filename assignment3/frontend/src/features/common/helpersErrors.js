export function parseResponseErrors({ errors }, pathIndex = 0) {
  if (!errors) {
    return null;
  }

  const result = {};

  errors.forEach((error) => {
    const {
      scope,
      metadata: { pathScope, path },
    } = error;

    if (scope === 'REQUEST' && pathScope === 'BODY' && path.length > pathIndex) {
      const field = path[pathIndex];

      result[field] = result[field] || {};

      if (path.length > pathIndex + 1) {
        result[field] = {
          ...result[field],
          ...(parseResponseErrors({ errors: [error] }, pathIndex + 1) || {}),
        };
        return;
      }

      result[field].errors = [...(result[field]?.errors || []), error];
    }
  });

  return result;
}
