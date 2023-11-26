import { expect } from 'expect';
import { describe, test } from 'mocha';
import z from 'zod';
import { createResponse } from '../../../test/utils.js';
import { AuthenticationError, ValidationError } from '../../utils/errors.js';
import { errorMiddleware } from '../error.js';

describe('errorMiddleware()', () => {
  test('Request scope: ZodError', async () => {
    const { res, statusSpy, jsonSpy } = createResponse();
    const zodSchema = z.object({
      body: z
        .object({
          nested: z.object({ property: z.string() }).strict(),
          secondNested: z.object({ secondProperty: z.string() }).strict(),
          shallow: z.string(),
        })
        .strict(),
      params: z
        .object({
          id: z.string(),
        })
        .strict(),
    });
    const malformedReq = {
      body: {
        nested: {},
        somethingElse: true,
      },
    };
    // Log error.errors to see zod errors message format
    const error = await zodSchema.parseAsync(malformedReq).catch((err) => err);
    const expectedStatus = 400;
    const expectedResponse = {
      errors: [
        {
          scope: 'REQUEST',
          message: 'Required',
          metadata: {
            pathScope: 'BODY',
            path: ['nested', 'property'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'Required',
          metadata: {
            pathScope: 'BODY',
            path: ['secondNested'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'Required',
          metadata: {
            pathScope: 'BODY',
            path: ['shallow'],
          },
        },
        {
          scope: 'REQUEST',
          message: "Unrecognized key(s) in object: 'somethingElse'",
          metadata: {
            pathScope: 'BODY',
            path: [],
          },
        },
        {
          scope: 'REQUEST',
          message: 'Required',
          metadata: {
            pathScope: 'PARAMS',
            path: [],
          },
        },
      ],
    };

    errorMiddleware(error, {}, res, () => {});

    expect(statusSpy.args).toEqual([[expectedStatus]]);
    expect(jsonSpy.args).toEqual([[expectedResponse]]);
  });

  test('Request scope: ValidationError', () => {
    const { res, statusSpy, jsonSpy } = createResponse();
    const error = new ValidationError('some message');
    const expectedStatus = 400;
    const expectedResponse = {
      errors: [
        {
          scope: 'REQUEST',
          message: 'some message',
          metadata: {
            pathScope: 'BODY',
            path: [],
          },
        },
      ],
    };

    errorMiddleware(error, {}, res, () => {});

    expect(statusSpy.args).toEqual([[expectedStatus]]);
    expect(jsonSpy.args).toEqual([[expectedResponse]]);
  });

  test('Generic scope: AuthenticationError', () => {
    const { res, statusSpy, jsonSpy } = createResponse();
    const error = new AuthenticationError();
    const expectedStatus = 401;
    const expectedResponse = {
      errors: [
        {
          scope: 'GENERIC',
          message: 'Invalid credentials',
          metadata: {},
        },
      ],
    };

    errorMiddleware(error, {}, res, () => {});

    expect(statusSpy.args).toEqual([[expectedStatus]]);
    expect(jsonSpy.args).toEqual([[expectedResponse]]);
  });

  test('Generic scope: any other error', () => {
    const { res, statusSpy, jsonSpy } = createResponse();
    const error = new Error();
    const expectedStatus = 500;
    const expectedResponse = {
      errors: [
        {
          scope: 'GENERIC',
          message: 'Internal Server Error',
          metadata: {},
        },
      ],
    };

    errorMiddleware(error, {}, res, () => {});

    expect(statusSpy.args).toEqual([[expectedStatus]]);
    expect(jsonSpy.args).toEqual([[expectedResponse]]);
  });
});
