export function createValidation(schema) {
  return async (req, res, next) => {
    const { body, params, query } = req;
    return schema
      .parseAsync({ body, params, query })
      .then(() => next())
      .catch((error) => next(error));
  };
}
