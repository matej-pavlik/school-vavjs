import { expect } from 'expect';
import { beforeEach, describe, test } from 'mocha';
import request from 'supertest';
import app from '../../app.js';

describe('Guest: registration', () => {
  test('Successful registration', async () => {
    const url = '/register';
    const body = {
      email: 'example@example.com',
      username: 'username',
      password: 'somePassword123',
      age: 24,
    };
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'username',
      age: 24,
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });
});

describe('Guest: login', () => {
  beforeEach(async () => {
    const url = '/register';
    const body = {
      email: 'example@example.com',
      username: 'username',
      password: 'somePassword123',
      age: 24,
    };

    await request(app).post(url).send(body);
  });

  test('Successful login: email', async () => {
    const url = '/login';
    const body = {
      login: 'example@example.com',
      password: 'somePassword123',
    };
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'username',
      age: 24,
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });

  test('Successful login: username', async () => {
    const url = '/login';
    const body = {
      login: 'username',
      password: 'somePassword123',
    };
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'username',
      age: 24,
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });

  test('Invalid credentials', async () => {
    const url = '/login';
    const body = {
      login: 'username',
      password: 'wrongPassword',
    };
    const expectedStatusCode = 401;
    const expected = {
      errors: [
        {
          scope: 'GENERIC',
          message: 'Invalid credentials',
          metadata: {},
        },
      ],
    };

    const res = await request(app).post(url).send(body);

    expect(res.statusCode).toEqual(expectedStatusCode);
    expect(res.body).toEqual(expected);
  });
});
