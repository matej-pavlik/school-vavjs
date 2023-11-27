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

describe('User: create ride', () => {
  test('Creates ride', async () => {
    const url = '/api/rides';
    const body = {
      date: '2023-11-27T04:29:51Z',
      type: 'ROUTE',
      value: 100,
    };
    const expected = {
      id: expect.any(String),
      date: '2023-11-27T04:29:51Z',
      type: 'ROUTE',
      value: 100,
      userId: expect.any(String),
      createdAt: expect.any(String),
    };

    const res = await request(app).post(url).set(headers).send(body);

    expect(res.body).toEqual(expected);
  });
});
