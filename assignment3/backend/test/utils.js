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

export async function createRide() {
  return db.ride.save({
    date: '2023-11-27T04:29:51.000Z',
    type: 'ROUTE',
    value: 100,
    user: { id: (await getCurrentUser()).id },
    rideType: null,
  });
}
