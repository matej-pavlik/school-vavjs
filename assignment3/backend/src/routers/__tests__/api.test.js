import { expect } from 'expect';
import { beforeEach, describe, test } from 'mocha';
import request from 'supertest';
import { createRide, createRideType } from '../../../test/utils.js';
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

describe('User: get rides', () => {
  test('Gets rides', async () => {
    const url = '/api/rides';
    // Ordered by createdAt
    const expected = [
      {
        id: expect.any(String),
        date: expect.any(String),
        type: 'CONSUMPTION',
        value: 50,
        createdAt: expect.any(String),
      },
      {
        id: expect.any(String),
        date: expect.any(String),
        type: 'ROUTE',
        value: 100,
        createdAt: expect.any(String),
      },
    ];

    await createRide({ date: '2023-11-27T04:29:51.000Z', type: 'ROUTE', value: 100 });
    await createRide({ date: '2023-11-27T04:29:51.000Z', type: 'CONSUMPTION', value: 50 });
    const res = await request(app).get(url).set(headers).send();

    expect(res.body).toEqual(expected);
  });
});

describe('User: delete ride', () => {
  test('Deletes ride', async () => {
    const ride = await createRide();
    const url = `/api/rides/${ride.id}`;
    const expected = {};

    const res = await request(app).delete(url).set(headers).send();

    expect(res.body).toEqual(expected);
  });
});

describe('User: create ride type', () => {
  test('Creates ride type', async () => {
    const url = '/api/ride-types';
    const body = {
      name: 'name',
      description: 'ride type description',
    };
    const expected = {
      id: expect.any(String),
      name: 'name',
      description: 'ride type description',
      createdAt: expect.any(String),
    };

    const res = await request(app).post(url).set(headers).send(body);

    expect(res.body).toEqual(expected);
  });
});

describe('User: get ride types', () => {
  test('Gets ride types', async () => {
    const url = '/api/ride-types';
    // Ordered by createdAt
    const expected = [
      {
        id: expect.any(String),
        name: 'ride name 2',
        description: 'ride type description 2',
        createdAt: expect.any(String),
      },
      {
        id: expect.any(String),
        name: 'ride name',
        description: 'ride type description',
        createdAt: expect.any(String),
      },
    ];

    await createRideType({ name: 'ride name', description: 'ride type description' });
    await createRideType({ name: 'ride name 2', description: 'ride type description 2' });
    const res = await request(app).get(url).set(headers).send();

    expect(res.body).toEqual(expected);
  });
});

describe('User: delete ride type', () => {
  test('Deletes ride type', async () => {
    const rideType = await createRideType();
    const url = `/api/ride-types/${rideType.id}`;
    const expected = {};

    const res = await request(app).delete(url).set(headers).send();

    expect(res.body).toEqual(expected);
  });
});
