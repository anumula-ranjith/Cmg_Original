import { renderHook } from '@testing-library/react-hooks';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import * as UseSchemaModule from '../../client/graphql/instrospection/useSchema';
import * as GetSourceFieldsModule from '../../client/graphql/utils';
import useSourceColumns from './useSourceColumns';

jest.mock('../../client/graphql/instrospection/useSchema');
jest.mock('../../client/graphql/utils');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'MockObject',
    fields: {},
  }),
});

describe('useSourceColumns', () => {
  let useSchemaSpy: jest.SpyInstance<ReturnType<typeof UseSchemaModule.useSchema>>;
  let getSourceFieldsSpy: jest.SpyInstance<
    ReturnType<typeof GetSourceFieldsModule.getSourceFields>
  >;

  beforeEach(() => {
    useSchemaSpy = jest.spyOn(UseSchemaModule, 'useSchema');
    getSourceFieldsSpy = jest.spyOn(GetSourceFieldsModule, 'getSourceFields');

    useSchemaSpy.mockReturnValue({ schema, error: null, loading: false });
  });

  it('should return flattened source columns', () => {
    getSourceFieldsSpy.mockReturnValue({
      a: {
        b: null,
      },
    });
    const { result } = renderHook(() => useSourceColumns('testSource'));
    expect(result.current).toEqual(['a.b']);
  });

  it('should return an empty array if schema is not available', () => {
    getSourceFieldsSpy.mockReturnValue({});
    const { result } = renderHook(() => useSourceColumns('testSource'));
    expect(result.current).toEqual([]);
  });

  it('should handle different source input', () => {
    getSourceFieldsSpy.mockReturnValue({
      x: {
        y: null,
      },
    });
    const { result } = renderHook(() => useSourceColumns('anotherSource'));
    expect(result.current).toEqual(['x.y']);
  });

  it('should flatten deeply nested source columns', () => {
    getSourceFieldsSpy.mockReturnValue({
      a: {
        b: {
          c: {
            d: null,
          },
        },
      },
    });
    const { result } = renderHook(() => useSourceColumns('deepSource'));
    expect(result.current).toEqual(['a.b.c.d']);
  });
});
