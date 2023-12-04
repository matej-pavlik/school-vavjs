import { expect } from 'expect';
import { describe, test } from 'mocha';
import sinon from 'sinon';
import {
  createResponse,
  createRideType as createTestRideType,
  getCurrentUser,
  getOtherUser,
} from '../../../test/utils.js';
import { ValidationError } from '../../utils/errors.js';
import { createRideType, deleteRideType, getUserRideTypes } from '../rideType.js';

describe('createRideType()', async () => {
  test('Creates ride type', async () => {
    const req = {
      user: await getCurrentUser(),
      body: {
        name: 'name',
        description: 'ride type description',
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {
      id: expect.any(String),
      name: 'name',
      description: 'ride type description',
      createdAt: expect.any(Date),
    };

    await createRideType(req, res);

    expect(jsonSpy.args).toEqual([[expected]]);
  });
});

describe('getUserRideTypes()', () => {
  test('Gets user ride types', async () => {
    const req = {
      user: await getCurrentUser(),
    };
    const { res, jsonSpy } = createResponse();
    // Ordered by createdAt
    const expected = [
      {
        id: expect.any(String),
        name: 'Some name',
        description: 'Description #2',
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: 'Hello',
        description: 'Description #1',
        createdAt: expect.any(Date),
      },
    ];

    await createTestRideType({ name: 'Hello', description: 'Description #1' });
    await createTestRideType({ name: 'Some name', description: 'Description #2' });
    await getUserRideTypes(req, res);

    expect(jsonSpy.args).toEqual([[expected]]);
  });
});

describe('deleteRideType()', () => {
  test('Deletes ride type', async () => {
    const rideType = await createTestRideType();
    const req = {
      user: await getCurrentUser(),
      params: {
        id: rideType.id,
      },
    };
    const { res, jsonSpy } = createResponse();
    const expected = {};

    await deleteRideType(req, res, () => {});

    expect(jsonSpy.args).toEqual([[expected]]);
  });

  test("Other user cannot delete someone else's ride type", async () => {
    const rideType = await createTestRideType();
    const req = {
      user: await getOtherUser(),
      params: {
        id: rideType.id,
      },
    };
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expectedError = expect.any(ValidationError);
    const expectedMsg = 'Invalid ride type id';
    const expectedMetadata = { pathScope: 'PARAMS', path: ['id'] };

    await deleteRideType(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expectedError]]);
    expect(nextSpy.args[0][0].message).toEqual(expectedMsg);
    expect(nextSpy.args[0][0].metadata).toEqual(expectedMetadata);
    expect(jsonSpy.notCalled).toEqual(true);
  });

  test('Passes ValidationError on invalid ride type id', async () => {
    const req = {
      user: await getCurrentUser(),
      params: {
        id: 'non-existent',
      },
    };
    const { res, jsonSpy } = createResponse();
    const nextSpy = sinon.spy();
    const expectedError = expect.any(ValidationError);
    const expectedMsg = 'Invalid ride type id';
    const expectedMetadata = { pathScope: 'PARAMS', path: ['id'] };

    await deleteRideType(req, res, nextSpy);

    expect(nextSpy.args).toEqual([[expectedError]]);
    expect(nextSpy.args[0][0].message).toEqual(expectedMsg);
    expect(nextSpy.args[0][0].metadata).toEqual(expectedMetadata);
    expect(jsonSpy.notCalled).toEqual(true);
  });
});
