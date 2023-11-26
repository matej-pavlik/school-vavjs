import { expect } from 'expect';
import jwt from 'jsonwebtoken';
import { describe, test } from 'mocha';
import { createJWT, hashPassword, verifyJWT } from '../security.js';

describe('hashPassword()', () => {
  test('Hashes password', async () => {
    const password = 'examplePassword123';
    const expected = expect.any(String);

    const actual = await hashPassword(password);

    expect(actual).toEqual(expected);
    expect(actual).not.toEqual(password);
  });
});

describe('createJWT()', () => {
  test('Generates JWT', async () => {
    const user = {
      id: '94953c8b-89fd-45b7-853c-438bc25ab7bf',
      email: 'example@exmaple.com',
      username: 'example000',
      password: 'hashed',
      age: 25,
    };
    const expected = expect.any(String);

    const actual = await createJWT(user);

    expect(actual).toEqual(expected);
  });

  test("Doesn't encode password", async () => {
    const user = {
      id: '94953c8b-89fd-45b7-853c-438bc25ab7bf',
      email: 'example@exmaple.com',
      username: 'example000',
      password: 'hashed',
      age: 25,
    };
    const expectedDecoded = {
      id: '94953c8b-89fd-45b7-853c-438bc25ab7bf',
      email: 'example@exmaple.com',
      username: 'example000',
      age: 25,
    };

    const actual = jwt.decode(await createJWT(user)).user;

    expect(actual).toEqual(expectedDecoded);
  });
});

describe('verifyJWT()', () => {
  test('Throws on invalid JWT', async () => {
    // prettier-ignore
    const invalidJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    await expect(() => verifyJWT(invalidJWT)).rejects.toThrow();
  });

  test('Decodes valid JWT', async () => {
    const user = {
      id: '94953c8b-89fd-45b7-853c-438bc25ab7bf',
      email: 'example@exmaple.com',
      username: 'example000',
      password: 'hashed',
      age: 25,
    };
    const token = await createJWT(user);
    const expected = {
      id: '94953c8b-89fd-45b7-853c-438bc25ab7bf',
      email: 'example@exmaple.com',
      username: 'example000',
      age: 25,
    };

    const actual = await verifyJWT(token);

    expect(actual).toEqual(expected);
  });
});
