import { expect } from 'expect';
import { describe, test } from 'mocha';
import { AuthenticationError, ValidationError } from '../errors.js';

describe('ValidationError', () => {
  test('Message', () => {
    const message = 'some message';
    const expectedMetadata = {
      pathScope: 'BODY',
      path: [],
    };

    const error = new ValidationError(message);

    expect(error.message).toEqual(message);
    expect(error.metadata).toEqual(expectedMetadata);
  });

  test('With metadata', () => {
    const message = 'some message';
    const metadata = { path: 'email.something' };
    const expectedMetadata = {
      pathScope: 'BODY',
      path: ['email', 'something'],
    };

    const error = new ValidationError(message, metadata);

    expect(error.message).toEqual(message);
    expect(error.metadata).toEqual(expectedMetadata);
  });
});

describe('AuthenticationError', () => {
  test('Default message', () => {
    const expectedMessage = 'Invalid credentials';

    const error = new AuthenticationError();

    expect(error.message).toEqual(expectedMessage);
  });
});
