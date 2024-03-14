import type { GraphQLSchema } from 'graphql';

import type { BuildQueryOptions } from './instrospection/build';
import { buildQuery } from './instrospection/build';
import type { GQLError, GQLQueryType, GQLResponse } from './types';

export async function fetchInstrospection(
  graphQlUrl: string,
  apiKey: string | null,
  query: string,
  variables: Record<string, string> | null = null
): Promise<GQLResponse> {
  if (!apiKey) {
    throw new Error('No API Key set');
  }
  const response = await fetch(graphQlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });
  if (response.status !== 200) {
    throw new Error(`Server responded with ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/graphql-response+json')) {
    throw new Error(
      `Expected JSON response but received ${contentType ? contentType : 'no content type'}`
    );
  }
  const result = (await response.json()) as GQLResponse;
  if (result.errors) {
    const messages = result.errors.map((error: GQLError) => error.message).join('\n');
    throw new Error(`Errors: ${messages}`);
  }
  return result;
}

export async function fetchGraphqlData(
  schema: GraphQLSchema,
  graphQlUrl: string,
  apiKey: string | null,
  source: string,
  queryOptions: BuildQueryOptions,
  whereClause: string | null | undefined,
): Promise<GQLQueryType> {
  if (!apiKey) {
    throw new Error('No API key found');
  }
  const query = buildQuery(schema, source, queryOptions, whereClause);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
    }),
  };
  const response = await fetch(graphQlUrl, options);

  if (response.status !== 200) {
    throw new Error(`Server responded with ${response.status} ${response.statusText}`);
  }
  const result = (await response.json()) as GQLResponse;
  if (result.errors) {
    const messages = result.errors.map(error => error.message).join('<br />');
    throw new Error(`GraphQL: ${messages}`);
  }
  const typeData = (result.data ? result.data[source] : { items: [] }) as GQLQueryType;
  return typeData;
}
