import { describe, expect, test } from 'vitest';
import { parseFieldErrors } from '../helperErrors';

describe('parseFieldErrors()', () => {
  test('Parses errors', () => {
    const errors = [
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
          path: ['nested'],
        },
      },
      {
        scope: 'REQUEST',
        message: 'Some message',
        metadata: {
          pathScope: 'BODY',
          path: ['otherNested', 'otherProperty'],
        },
      },
      {
        scope: 'REQUEST',
        message: 'Required',
        metadata: {
          pathScope: 'BODY',
          path: ['email'],
        },
      },
      {
        scope: 'REQUEST',
        message: 'Another message',
        metadata: {
          pathScope: 'BODY',
          path: ['email'],
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
    ];
    const expected = {
      nested: {
        property: {
          errors: [
            {
              scope: 'REQUEST',
              message: 'Required',
              metadata: {
                pathScope: 'BODY',
                path: ['nested', 'property'],
              },
            },
          ],
        },
        errors: [
          {
            scope: 'REQUEST',
            message: 'Required',
            metadata: {
              pathScope: 'BODY',
              path: ['nested'],
            },
          },
        ],
      },
      otherNested: {
        otherProperty: {
          errors: [
            {
              scope: 'REQUEST',
              message: 'Some message',
              metadata: {
                pathScope: 'BODY',
                path: ['otherNested', 'otherProperty'],
              },
            },
          ],
        },
      },
      email: {
        errors: [
          {
            scope: 'REQUEST',
            message: 'Required',
            metadata: {
              pathScope: 'BODY',
              path: ['email'],
            },
          },
          {
            scope: 'REQUEST',
            message: 'Another message',
            metadata: {
              pathScope: 'BODY',
              path: ['email'],
            },
          },
        ],
      },
    };

    const actual = parseFieldErrors(errors);

    expect(actual).toEqual(expected);
  });
});
