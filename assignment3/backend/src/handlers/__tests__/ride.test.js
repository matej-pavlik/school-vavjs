import { expect } from 'expect';
import { describe, test } from 'mocha';
import { createResponse, getCurrentUser } from '../../../test/utils.js';
import { createRide } from '../ride.js';

describe('createRide()', async () => {
  test('Creates ride', async () => {
    const req = {
      user: await getCurrentUser(),
      body: {
        date: '2023-11-27T04:29:51.000Z',
        type: 'ROUTE',
        value: 100,
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {
      id: expect.any(String),
      date: expect.any(Date),
      type: 'ROUTE',
      value: 100,
      createdAt: expect.any(Date),
    };

    await createRide(req, res);

    expect(jsonSpy.args).toEqual([[expected]]);
  });
});
