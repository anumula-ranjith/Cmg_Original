import { CombinedError } from '@urql/core';

type GraphQLError = CombinedError['graphQLErrors'][0];

export const isGraphQLCombinedError = (error: unknown): error is CombinedError =>
  error != null && error instanceof CombinedError;

export const isGraphQLError = (error: unknown): error is GraphQLError =>
  error != null && typeof (error as GraphQLError).message !== 'undefined';
