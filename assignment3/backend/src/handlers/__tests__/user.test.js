import { expect } from 'expect';
import { beforeEach, describe, test } from 'mocha';
import sinon from 'sinon';
import { createResponse } from '../../../test/utils.js';
import { AuthenticationError, ValidationError } from '../../utils/errors.js';
import { createUser, loginUser } from '../user.js';

function createUserRequest(mergeData = {}) {
  return {
    body: {
      email: 'example@example.com',
      username: 'example000',
      password: 'example_password',
      age: 24,
      ...mergeData,
    },
  };
}

describe('createUser()', () => {
  test('Creates user', async () => {
    const req = {
      body: {
        email: 'example@example.com',
        username: 'example000',
        password: 'example_password',
        age: 24,
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'example000',
      age: 24,
    };

    await createUser(req, res, () => {});

    expect(jsonSpy.args).toEqual([[expected]]);
  });

  test('Passes ValidationError if email already exists', async () => {
    const initialReq = createUserRequest({ email: 'example@example.com', username: 'example000' });
    const req = createUserRequest({ email: 'example@example.com', username: 'different' });
    const { res: initialRes } = createResponse();
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expectedError = expect.any(ValidationError);
    const expectedMsg = 'Email already exists';

    await createUser(initialReq, initialRes, () => {});
    await createUser(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expectedError]]);
    expect(nextSpy.args[0][0].message).toEqual(expectedMsg);
    expect(jsonSpy.notCalled).toEqual(true);
  });

  test('Passes ValidationError if username already exists', async () => {
    const initialReq = createUserRequest({ email: 'example@example.com', username: 'example000' });
    const req = createUserRequest({ email: 'different@gmail.com', username: 'example000' });
    const { res: initialRes } = createResponse();
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expectedError = expect.any(ValidationError);
    const expectedMsg = 'Username already exists';

    await createUser(initialReq, initialRes, () => {});
    await createUser(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expectedError]]);
    expect(nextSpy.args[0][0].message).toEqual(expectedMsg);
    expect(jsonSpy.notCalled).toEqual(true);
  });
});

describe('loginUser()', () => {
  beforeEach(async () => {
    const req = {
      body: {
        email: 'example@example.com',
        username: 'example000',
        password: 'example_password',
        age: 24,
      },
    };
    const { res } = createResponse();

    await createUser(req, res, () => {});
  });

  test('Successful login: email', async () => {
    const req = {
      body: {
        login: 'example@example.com',
        password: 'example_password',
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'example000',
      age: 24,
    };

    await loginUser(req, res, () => {});

    expect(jsonSpy.args).toEqual([[expected]]);
  });

  test('Successful login: username', async () => {
    const req = {
      body: {
        login: 'example000',
        password: 'example_password',
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'example000',
      age: 24,
    };

    await loginUser(req, res, () => {});

    expect(jsonSpy.args).toEqual([[expected]]);
  });

  test('Passes AuthenticationError on invalid login', async () => {
    const req = {
      body: {
        login: 'example@example.com',
        password: 'invalid password',
      },
    };
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expected = expect.any(AuthenticationError);

    await loginUser(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expected]]);
    expect(jsonSpy.notCalled).toEqual(true);
  });
});
