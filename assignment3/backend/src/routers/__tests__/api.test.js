import { expect } from 'expect';
import { beforeEach, describe, test } from 'mocha';
import request from 'supertest';
import app from '../../app.js';

let headers;
beforeEach(async () => {
  const url = '/login';
  const body = {
    login: 'testusername',
    password: 'testpassword',
  };

  const res = await request(app).post(url).send(body);
  headers = { Authorization: `Bearer ${res.body.token}` };
});

describe('User: get me', () => {
  test('Returns current user', async () => {
    const url = '/api/users/me';
    const expected = {
      id: expect.any(String),
      email: 'test@example.com',
      username: 'testusername',
      age: 40,
      createdAt: expect.any(String),
    };

    const res = await request(app).get(url).set(headers).send();

    expect(res.body).toEqual(expected);
  });
});

describe('User: create ride', () => {
  test('Creates ride', async () => {
    const url = '/api/rides';
    const body = {
      date: '2023-11-27T04:29:51.000Z',
      type: 'ROUTE',
      value: 100,
    };
    const expected = {
      id: expect.any(String),
      date: '2023-11-27T04:29:51.000Z',
      type: 'ROUTE',
      value: 100,
      createdAt: expect.any(String),
    };

    const res = await request(app).post(url).set(headers).send(body);

    expect(res.body).toEqual(expected);
  });
});
