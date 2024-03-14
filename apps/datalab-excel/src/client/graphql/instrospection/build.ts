import {
  buildOperationTree,
  findOperationRootTypeOrThrow,
} from '@cmg/graphql-toolkit-introspection';
import type { GraphQLSchema } from 'graphql';

import { toCamelCase } from '../../../utilities/stringutils';
import type { CoerceFieldsIntoOperationOptions } from './types';

export type Query = {
  take: number;
  skip: number;
};

export type BuildQueryOptions = {
  query: Query;
  build?: CoerceFieldsIntoOperationOptions;
};

const getQueryName = (resourceType: string) => toCamelCase(resourceType);

export const buildQuery = (
  schema: GraphQLSchema,
  source: string,
  options: BuildQueryOptions,
  whereClause: string | null | undefined
) => {
  const rootType = findOperationRootTypeOrThrow(schema, 'query', getQueryName(source));
  const document = buildOperationTree(rootType, options.build);
  const take = `take: ${options.query.take},`;
  const skip = `skip: ${options.query.skip},`;
  const where = whereClause ? `where: ${whereClause},` : '';
  const query = `{${source}(${take}${skip}${where}) ${document}}`;

  return query;
};
