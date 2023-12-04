import sinon from 'sinon';
import db from '../src/db/index.js';
import { hashPassword } from '../src/utils/security.js';

export function createResponse() {
  const res = {
    json: sinon.spy(),
    status: sinon.spy(() => res),
  };

  return { res, jsonSpy: res.json, statusSpy: res.status };
}

export async function getCurrentUser() {
  const user = await db.user.findOneBy({ username: 'testusername' });
  delete user.password;
  return user;
}

export async function getOtherUser() {
  await db.user.save({
    email: 'another@example.com',
    username: 'another',
    password: await hashPassword('another'),
    age: 19,
  });

  const user = await db.user.findOneBy({ username: 'another' });
  delete user.password;
  return user;
}

export async function createRide(mergePayload = {}) {
  const { id } = await db.ride.save({
    date: '2023-11-27T04:29:51.000Z',
    type: 'ROUTE',
    value: 100,
    user: { id: (await getCurrentUser()).id },
    ...mergePayload,
  });
  return db.ride.findOneBy({ id });
}

export async function createRideType(mergePayload = {}) {
  const { id } = await db.rideType.save({
    name: 'Ride type name',
    description: 'Description',
    user: { id: (await getCurrentUser()).id },
    ...mergePayload,
  });
  return db.rideType.findOneBy({ id });
}
