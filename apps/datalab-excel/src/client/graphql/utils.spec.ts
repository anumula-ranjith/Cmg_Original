import * as FindOperationRootTypeOrThrowModule from '@cmg/graphql-toolkit-introspection';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import type { CoerceFieldsIntoOperationOptions } from './instrospection/types';
import type { GQLNode } from './types';
import type { SourceField } from './utils';
import { escapeIfNeeded, getSourceFields, parseGraphQlResponse, stringifyResponse } from './utils';

jest.mock('@cmg/graphql-toolkit-introspection');

describe('getSourceFields', () => {
  const mockSchemaObject = new GraphQLObjectType({
    name: 'MockType',
    fields: {
      items: {
        type: new GraphQLObjectType({
          name: 'Items',
          fields: {
            a: {
              type: new GraphQLObjectType({
                name: 'A',
                fields: {
                  b: {
                    type: new GraphQLObjectType({
                      name: 'B',
                      fields: {
                        c: {
                          type: GraphQLString,
                        },
                      },
                    }),
                  },
                  d: {
                    type: GraphQLString,
                  },
                },
              }),
            },
            e: {
              type: GraphQLString,
            },
          },
        }),
      },
    },
  });

  const schema = new GraphQLSchema({
    query: mockSchemaObject,
  });

  let findOperationRootTypeOrThrowSpy: jest.SpyInstance<
    ReturnType<typeof FindOperationRootTypeOrThrowModule.findOperationRootTypeOrThrow>
  >;
  beforeEach(() => {
    findOperationRootTypeOrThrowSpy = jest.spyOn(
      FindOperationRootTypeOrThrowModule,
      'findOperationRootTypeOrThrow'
    );
    findOperationRootTypeOrThrowSpy.mockReturnValue(mockSchemaObject);
  });

  it('should return source fields for default options', () => {
    const result: SourceField = getSourceFields(schema, 'testSource');
    expect(result).toEqual({
      a: {
        d: null,
      },
      e: null,
    });
  });

  it('should return source fields from the entire schema', () => {
    const options: CoerceFieldsIntoOperationOptions = {
      maxNested: 100,
    };

    const result: SourceField = getSourceFields(schema, 'testSource', options);
    expect(result).toEqual({
      a: {
        b: {
          c: null,
        },
        d: null,
      },
      e: null,
    });
  });

  it('should include specified subproperties in the include option', () => {
    const options: CoerceFieldsIntoOperationOptions = {
      include: ['a.b'],
      maxNested: 3,
    };

    const result: SourceField = getSourceFields(schema, 'testSource', options);
    expect(result).toEqual({
      a: {
        b: {
          c: null,
        },
      },
    });
  });

  it('should exclude specified subproperties in the exclude option', () => {
    const options = {
      exclude: ['a.d'],
      maxNested: 3,
    };
    const result: SourceField = getSourceFields(schema, 'testSource', options);
    expect(result).toEqual({
      a: {
        b: {
          c: null,
        },
      },
      e: null,
    });
  });

  it('should handle both include and exclude options', () => {
    const options = {
      include: ['a.d', 'e'],
      exclude: ['a.b'],
      maxNested: 3,
    };
    const result: SourceField = getSourceFields(schema, 'testSource', options);
    expect(result).toEqual({
      a: {
        d: null,
      },
      e: null,
    });
  });

  it('should not add properties that do not have children for default options', () => {
    const result: SourceField = getSourceFields(schema, 'testSource');
    expect(result).not.toHaveProperty('a.b');
  });
});

describe('escapeIfNeeded', () => {
  it('should escape curly braces in objects', () => {
    const input = { a: 1, b: 2 };
    const result = escapeIfNeeded(input);
    expect(result).toBe('"\\{\\"a\\":1,\\"b\\":2\\}"');
  });

  it('should escape double quotes in objects', () => {
    const input = { a: 'test' };
    const result = escapeIfNeeded(input);
    expect(result).toBe('"\\{\\"a\\":\\"test\\"\\}"');
  });

  it('should return string as is when not an object', () => {
    const input = 'test';
    const result = escapeIfNeeded(input);
    expect(result).toBe('"test"');
  });

  it('should handle empty objects', () => {
    const input = {};
    const result = escapeIfNeeded(input);
    expect(result).toBe('"\\{\\}"');
  });

  it('should handle nested objects', () => {
    const input = { a: { b: 'test' } };
    const result = escapeIfNeeded(input);
    expect(result).toBe('"\\{\\"a\\":\\{\\"b\\":\\"test\\"\\}\\}"');
  });

  it('should handle numbers', () => {
    const input = '123';
    const result = escapeIfNeeded(input);
    expect(result).toBe('"123"');
  });

  it('should handle booleans', () => {
    const input = 'true';
    const result = escapeIfNeeded(input);
    expect(result).toBe('"true"');
  });
});

describe('stringifyResponse', () => {
  it('should handle null and undefined', () => {
    expect(stringifyResponse(null)).toBe('');
    expect(stringifyResponse(undefined)).toBe('');
  });
  it('should handle booleans', () => {
    expect(stringifyResponse(true)).toBe('TRUE');
    expect(stringifyResponse(false)).toBe('FALSE');
  });
  it('should handle numbers', () => {
    expect(stringifyResponse(123)).toBe(123);
  });
  it('should handle strings', () => {
    expect(stringifyResponse('test')).toBe('test');
    expect(stringifyResponse('')).toBe('');
  });
  it('should handle objects', () => {
    const obj = { a: 1, b: 'test' };
    expect(stringifyResponse(obj)).toBe('"{"a":1,"b":"test"}"');
  });
  it('should handle arrays', () => {
    const arr = [1, 2, 3];
    expect(stringifyResponse(arr)).toBe('[1,2,3]');
  });
});

describe('parseGraphQlResponse', () => {
  const mockResponse: GQLNode[] = [
    {
      id: '1',
      name: 'name-1',
      details: {
        age: 25,
        address: {
          city: 'city-a',
          zip: '12345',
        },
      },
    },
    {
      id: '2',
      name: 'name-2',
      details: {
        age: 30,
        address: {
          city: 'city-b',
          zip: '67890',
        },
      },
    },
  ];
  const mockColumns = {
    id: 'ID',
    name: 'Name',
  };
  const mockHeaders = ['id', 'name', 'details.age', 'details.address.city'];

  it('should parse a GraphQL response', () => {
    const result = parseGraphQlResponse(mockResponse, mockColumns, mockHeaders);
    expect(result).toStrictEqual([
      {
        id: 'ID',
        name: 'Name',
        'details.age': 25,
        'details.address.city': 'city-a',
      },
      {
        id: 'ID',
        name: 'Name',
        'details.age': 30,
        'details.address.city': 'city-b',
      },
    ]);
  });

  it('should handle missing keys in the response', () => {
    const result = parseGraphQlResponse(mockResponse, mockColumns, ['missing.key']);
    expect(result).toStrictEqual([
      {
        'missing.key': '',
      },
      {
        'missing.key': '',
      },
    ]);
  });

  it('should handle array values in the response', () => {
    const responseWithArray: GQLNode[] = [
      {
        id: '1',
        names: ['name-1', 'name-2'],
      },
    ];
    const result = parseGraphQlResponse(responseWithArray, {}, ['names']);
    expect(result).toStrictEqual([
      {
        names: '["name-1","name-2"]',
      },
    ]);
  });

  it('should handle nested array values in the response', () => {
    const responseWithNestedArray: GQLNode[] = [
      {
        id: '1',
        users: [
          { name: 'name-1', id: 'name-id-1' },
          { name: 'name-2', id: 'name-id-2' },
          { name: 'name-3', id: 'name-id-3' },
        ],
      },
    ];
    const result = parseGraphQlResponse(responseWithNestedArray, {}, ['users.name', 'users.id']);
    expect(result).toStrictEqual([
      {
        'users.id': '["name-id-1","name-id-2","name-id-3"]',
        'users.name': '["name-1","name-2","name-3"]',
      },
    ]);
  });

  it('should handle empty array values in the response', () => {
    const responseWithEmptyArray: GQLNode[] = [
      {
        id: '1',
        names: [],
      },
    ];
    const result = parseGraphQlResponse(responseWithEmptyArray, {}, ['names']);
    expect(result).toStrictEqual([
      {
        names: '',
      },
    ]);
  });

  it('should handle user columns that are not in the headers', () => {
    const result = parseGraphQlResponse(mockResponse, { 'not.in.headers': 'Value' }, mockHeaders);
    expect(result[0]).not.toHaveProperty('not.in.headers');
    expect(result).toStrictEqual([
      { 'details.address.city': 'city-a', 'details.age': 25, id: '1', name: 'name-1' },
      { 'details.address.city': 'city-b', 'details.age': 30, id: '2', name: 'name-2' },
    ]);
  });

  it('should handle headers that are not in the user columns or response', () => {
    const result = parseGraphQlResponse(mockResponse, mockColumns, [
      ...mockHeaders,
      'not.in.response',
    ]);
    expect(result[0]).toStrictEqual({
      'details.address.city': 'city-a',
      'details.age': 25,
      id: 'ID',
      name: 'Name',
      'not.in.response': '',
    });
  });
});
