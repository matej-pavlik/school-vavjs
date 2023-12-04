import { expect } from 'expect';
import { describe, test } from 'mocha';
import sinon from 'sinon';
import {
  createResponse,
  createRide as createTestRide,
  createRideType as createTestRideType,
  getCurrentUser,
  getOtherUser,
} from '../../../test/utils.js';
import { ValidationError } from '../../utils/errors.js';
import { createRide, deleteRide, getUserRides } from '../ride.js';

describe('createRide()', async () => {
  test('Creates ride', async () => {
    const rideType = await createTestRideType();
    const req = {
      user: await getCurrentUser(),
      body: {
        date: '2023-11-27T04:29:51.000Z',
        type: 'ROUTE',
        value: 100,
        rideTypeId: rideType.id,
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {
      id: expect.any(String),
      date: expect.any(Date),
      type: 'ROUTE',
      value: 100,
      rideType,
      createdAt: expect.any(Date),
    };

    await createRide(req, res);

    expect(jsonSpy.args).toEqual([[expected]]);
  });
});

describe('getUserRides()', () => {
  test('Gets user rides', async () => {
    const rideType = await createTestRideType();
    const req = {
      user: await getCurrentUser(),
    };
    const { res, jsonSpy } = createResponse();
    // Ordered by createdAt
    const expected = [
      {
        id: expect.any(String),
        date: expect.any(Date),
        type: 'CONSUMPTION',
        value: 50,
        rideType: null,
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        date: expect.any(Date),
        type: 'ROUTE',
        value: 100,
        rideType,
        createdAt: expect.any(Date),
      },
    ];

    await createTestRide({ date: '2023-11-27T04:29:51.000Z', type: 'ROUTE', value: 100, rideType });
    await createTestRide({ date: '2023-11-27T04:29:51.000Z', type: 'CONSUMPTION', value: 50 });
    await getUserRides(req, res);

    expect(jsonSpy.args).toEqual([[expected]]);
  });
});

describe('deleteRide()', () => {
  test('Deletes ride', async () => {
    const ride = await createTestRide();
    const req = {
      user: await getCurrentUser(),
      params: {
        id: ride.id,
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {};

    await deleteRide(req, res, () => {});

    expect(jsonSpy.args).toEqual([[expected]]);
  });

  test("Other user cannot delete someone else's ride", async () => {
    const ride = await createTestRide();
    const req = {
      user: await getOtherUser(),
      params: {
        id: ride.id,
      },
    };
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expectedError = expect.any(ValidationError);
    const expectedMsg = 'Invalid ride id';
    const expectedMetadata = { pathScope: 'PARAMS', path: ['id'] };

    await deleteRide(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expectedError]]);
    expect(nextSpy.args[0][0].message).toEqual(expectedMsg);
    expect(nextSpy.args[0][0].metadata).toEqual(expectedMetadata);
    expect(jsonSpy.notCalled).toEqual(true);
  });

  test('Passes ValidationError on invalid ride id', async () => {
    const req = {
      user: await getCurrentUser(),
      params: {
        id: 'non-existent',
      },
    };
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expectedError = expect.any(ValidationError);
    const expectedMsg = 'Invalid ride id';
    const expectedMetadata = { pathScope: 'PARAMS', path: ['id'] };

    await deleteRide(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expectedError]]);
    expect(nextSpy.args[0][0].message).toEqual(expectedMsg);
    expect(nextSpy.args[0][0].metadata).toEqual(expectedMetadata);
    expect(jsonSpy.notCalled).toEqual(true);
  });
});
