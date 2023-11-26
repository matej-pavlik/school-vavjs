import { expect } from 'expect';
import { describe, test } from 'mocha';
import sinon from 'sinon';
import z, { ZodError } from 'zod';
import { createValidation } from '../validation.js';

describe('createValidation()', () => {
  test('Returns a middleware function', () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
      }),
    });
    const expected = expect.any(Function);

    const actual = createValidation(schema);

    expect(actual).toEqual(expected);
  });

  test('Middleware calls next(ZodError) on invalid input', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
      }),
    });
    const req = {
      body: {
        name: 10000,
      },
    };
    const nextSpy = sinon.spy();
    const expectedNextArg = expect.any(ZodError);

    const fn = createValidation(schema);
    await fn(req, {}, nextSpy);

    expect(nextSpy.args).toEqual([[expectedNextArg]]);
  });

  test('Middleware calls next() on valid input', async () => {
    const schema = z.object({
      body: z.object({
        name: z.string(),
      }),
    });
    const req = {
      body: {
        name: 'John',
      },
    };
    const nextSpy = sinon.spy();

    const fn = createValidation(schema);
    await fn(req, {}, nextSpy);

    expect(nextSpy.calledOnce).toBe(true);
    expect(nextSpy.args).toEqual([[]]);
  });
});
