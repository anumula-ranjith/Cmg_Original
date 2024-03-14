import type { GraphQLInputType, GraphQLSchema } from 'graphql';

export type BuildArgumentNodeParams = {
  readonly schema: GraphQLSchema;
  readonly name: string;
  readonly value: unknown;
  readonly type: GraphQLInputType | string;
};

export type CoerceArgumentNodeByFieldParams = {
  readonly schema: GraphQLSchema;
  readonly typeName: string;
  readonly field: string;
  readonly args?: Record<string, unknown>;
};
