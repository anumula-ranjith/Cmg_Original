import * as IntrospectionModule from '@cmg/graphql-toolkit-introspection';
import type { GraphQLOutputType, GraphQLSchema } from 'graphql';

import * as StringUtilsModule from '../../../utilities/stringutils';
import type { BuildQueryOptions } from './build';
import { buildQuery } from './build';

jest.mock('@cmg/graphql-toolkit-introspection', () => ({
  findOperationRootTypeOrThrow: jest.fn(),
  buildOperationTree: jest.fn(),
}));
jest.mock('../../../utilities/stringutils', () => ({
  toCamelCase: jest.fn(),
}));

describe('buildQuery Function', () => {
  let findOperationRootTypeOrThrowSpy: jest.SpyInstance<
    ReturnType<typeof IntrospectionModule.findOperationRootTypeOrThrow>
  >;
  let toCamelCaseSpy: jest.SpyInstance<ReturnType<typeof StringUtilsModule.toCamelCase>>;
  let buildOperationTreeSpy: jest.SpyInstance<
    ReturnType<typeof IntrospectionModule.buildOperationTree>
  >;

  beforeEach(() => {
    findOperationRootTypeOrThrowSpy = jest.spyOn(
      IntrospectionModule,
      'findOperationRootTypeOrThrow'
    );
    toCamelCaseSpy = jest.spyOn(StringUtilsModule, 'toCamelCase');
    buildOperationTreeSpy = jest.spyOn(IntrospectionModule, 'buildOperationTree');
    toCamelCaseSpy.mockImplementation((str: string) => str);
    findOperationRootTypeOrThrowSpy.mockReturnValue({} as GraphQLOutputType);
    buildOperationTreeSpy.mockReturnValue('document');
  });

  it('should build the correct query without whereClause', () => {
    const schema = {} as GraphQLSchema;
    const source = 'source';
    const options: BuildQueryOptions = {
      query: { take: 10 },
      build: {},
    };
    const result = buildQuery(schema, source, options, null);
    expect(result).toBe('{source(take: 10,) document}');
  });

  it('should build the correct query with whereClause', () => {
    const schema = {} as GraphQLSchema;
    const source = 'source';
    const options: BuildQueryOptions = {
      query: { take: 10 },
      build: {},
    };
    const whereClause = 'id: 1';
    const result = buildQuery(schema, source, options, whereClause);
    expect(result).toBe('{source(take: 10,where: id: 1,) document}');
  });

  it('should call toCamelCase with the correct resourceType', () => {
    const schema = {} as GraphQLSchema;
    const source = 'sourceType';
    const options: BuildQueryOptions = {
      query: { take: 10 },
      build: {},
    };
    buildQuery(schema, source, options, null);
    expect(toCamelCaseSpy).toHaveBeenCalledWith(source);
  });

  it('should call findOperationRootTypeOrThrow with the correct parameters', () => {
    const schema = {} as GraphQLSchema;
    const source = 'sourceType';
    const options: BuildQueryOptions = {
      query: { take: 10 },
      build: {},
    };
    buildQuery(schema, source, options, null);
    expect(findOperationRootTypeOrThrowSpy).toHaveBeenCalledWith(schema, 'query', source);
  });

  it('should call buildOperationTree with the correct rootType', () => {
    const schema = {} as GraphQLSchema;
    const source = 'sourceType';
    const options: BuildQueryOptions = {
      query: { take: 10 },
      build: {
        exclude: ['test'],
      },
    };
    buildQuery(schema, source, options, null);
    expect(buildOperationTreeSpy).toHaveBeenCalledWith({}, options.build);
  });
});
