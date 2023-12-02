import { expect } from 'expect';
import { describe, test } from 'mocha';
import sinon from 'sinon';
import { AuthenticationError } from '../../utils/errors.js';
import { createJWT } from '../../utils/security.js';
import { protectMiddleware } from '../protect.js';

describe('protectMiddleware()', () => {
  test('Passes AuthenticationError on invalid authorization header', async () => {
    const req = {
      headers: {
        authorization: 'corrupted',
      },
    };
    const nextSpy = sinon.spy();
    const expectedNextArg = expect.any(AuthenticationError);

    await protectMiddleware(req, {}, nextSpy);

    expect(nextSpy.args).toEqual([[expectedNextArg]]);
  });

  test('Passes AuthenticationError on invalid token', async () => {
    const req = {
      headers: {
        // prettier-ignore
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSIsImlhdCI6MTUxNjIzOTAyMn0.r4iPVvmS0SHbEb9wE1GqXIZCkBzaXjMveD7OQT_FH54',
      },
    };
    const nextSpy = sinon.spy();
    const expectedNextArg = expect.any(AuthenticationError);

    await protectMiddleware(req, {}, nextSpy);

    expect(nextSpy.args).toEqual([[expectedNextArg]]);
  });

  test('Injects user into req on valid token and calls next', async () => {
    const user = {
      email: 'example@example.com',
      username: 'example000',
      password: 'hashed',
      age: 24,
      createdAt: '2023-12-01T15:45:13.318Z',
    };
    const req = {
      headers: {
        authorization: `Bearer ${await createJWT(user)}`,
      },
      get user() {
        return this.property;
      },
      set user(value) {
        this.property = value;
      },
    };
    const reqUserSpy = sinon.spy(req, 'user', ['set']);
    const nextSpy = sinon.spy();
    const expectedReqUser = {
      email: 'example@example.com',
      username: 'example000',
      age: 24,
      createdAt: '2023-12-01T15:45:13.318Z',
    };

    await protectMiddleware(req, {}, nextSpy);

    expect(reqUserSpy.set.args).toEqual([[expectedReqUser]]);
    expect(nextSpy.args).toEqual([[]]);
  });
});
