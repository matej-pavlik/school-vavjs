import sinon from 'sinon';
import db from '../src/db/index.js';

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
