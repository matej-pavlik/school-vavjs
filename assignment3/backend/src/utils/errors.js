import { ErrorPathScope } from '../constants/errorFormat.js';

function createErrorMetadata({ pathScope, path } = {}) {
  return {
    pathScope: pathScope ?? ErrorPathScope.BODY,
    path: path == null ? [] : path.split('.'),
  };
}

export class ValidationError extends Error {
  constructor(message, metadata = {}) {
    super(message);
    this.metadata = createErrorMetadata(metadata);
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
  }
}
