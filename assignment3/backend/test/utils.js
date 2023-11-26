import sinon from 'sinon';

export function createResponse() {
  const res = {
    json: sinon.spy(),
    status: sinon.spy(() => res),
  };

  return { res, jsonSpy: res.json, statusSpy: res.status };
}
