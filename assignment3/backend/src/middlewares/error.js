import { ZodError } from 'zod';
import { ErrorPathScope, ErrorScope } from '../constants/errorFormat.js';
import { AuthenticationError, ValidationError } from '../utils/errors.js';

function getPathScope(path) {
  if (path[0] === 'body') {
    return ErrorPathScope.BODY;
  }
  if (path[0] === 'params') {
    return ErrorPathScope.PARAMS;
  }

  throw new Error('Invalid path scope');
}

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
  try {
    if (err instanceof ZodError) {
      res.status(400).json({
        errors: err.errors.map(({ path, message }) => ({
          scope: ErrorScope.REQUEST,
          message,
          metadata: {
            pathScope: getPathScope(path),
            path: path.slice(1),
          },
        })),
      });
    } else if (err instanceof ValidationError) {
      res.status(400).json({
        errors: [
          {
            scope: ErrorScope.REQUEST,
            message: err.message,
            metadata: err.metadata,
          },
        ],
      });
    } else if (err instanceof AuthenticationError) {
      res.status(401).json({
        errors: [
          {
            scope: ErrorScope.GENERIC,
            message: err.message,
            metadata: {},
          },
        ],
      });
    } else {
      throw err;
    }
  } catch (error) {
    res.status(500).json({
      errors: [
        {
          scope: ErrorScope.GENERIC,
          message: 'Internal Server Error',
          metadata: {},
        },
      ],
    });
  }
}
