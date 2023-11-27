import { expect } from 'expect';
import { describe, test } from 'mocha';
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
      createdAt: expect.any(String),
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });
});

describe('Guest: login', () => {
  test('Successful login: email', async () => {
    const url = '/login';
    const body = {
      login: 'test@example.com',
      password: 'testpassword',
    };
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'test@example.com',
      username: 'testusername',
      age: 40,
      createdAt: expect.any(String),
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });

  test('Successful login: username', async () => {
    const url = '/login';
    const body = {
      login: 'testusername',
      password: 'testpassword',
    };
    const expected = {
      id: expect.any(String),
      token: expect.any(String),
      email: 'test@example.com',
      username: 'testusername',
      age: 40,
      createdAt: expect.any(String),
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });

  test('Invalid credentials', async () => {
    const url = '/login';
    const body = {
      login: 'testusername',
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
