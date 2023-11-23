import { expect } from 'expect';
import { describe, test } from 'mocha';
import request from 'supertest';
import app from '../../app.js';

// TODO login
describe('Register', () => {
  test('Successful registration', async () => {
    const url = '/register';
    const body = {
      email: 'example@example.com',
      username: 'username',
      password: 'somePassword123',
      age: 24,
    };
    const expected = {
      id: expect.any(Number),
      token: expect.any(String),
      email: 'example@example.com',
      username: 'username',
      age: 24,
    };

    const res = await request(app).post(url).send(body);

    expect(res.body).toEqual(expected);
  });
});
