export function parseFieldErrors(errors, pathIndex = 0) {
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
          ...parseFieldErrors([error], pathIndex + 1),
        };
        return;
      }

      result[field].errors = [...(result[field]?.errors || []), error];
    }
  });

  return result;
}
