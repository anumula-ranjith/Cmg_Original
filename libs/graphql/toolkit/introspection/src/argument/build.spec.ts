import { assertIsNonNullable } from '@cmg/core-assert';
import type { ASTNode, IntrospectionQuery } from 'graphql';
import { assertInputType, buildClientSchema, GraphQLList, GraphQLNonNull, print } from 'graphql';

import introspectionJson from '../__mocks__/introspection.json';
import { buildArgumentNode, buildArgumentNodesByField } from './build';

const introspectSchema = introspectionJson.data as unknown as IntrospectionQuery;

describe('buildArgumentNodesByField', () => {
  it('builds a Query type argument nodes from a field', () => {
    const schema = buildClientSchema(introspectSchema);
    const typeName = assertIsNonNullable(schema.getQueryType()?.name);
    expect(typeName).not.toBeFalsy();
    const result = buildArgumentNodesByField({
      schema,
      typeName,
      field: 'offerings',
      args: {
        where: { accelerated: { eq: true } },
        order: { accelerated: 'ASC', company: { issuer: 'ASC' } },
      },
    });

    expect(print(result as unknown as ASTNode)).toMatchSnapshot();
  });
});

describe('buildArgumentNode', () => {
  it('builds an argument', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = assertIsNonNullable(
      buildArgumentNode({
        schema,
        name: 'where',
        type: 'OfferingFilterInput',
        value: { accelerated: { eq: true } },
      })
    );

    expect(result).not.toBeUndefined();
    expect(print(result)).toMatchSnapshot();
  });

  it('builds an wrapped argument', () => {
    const schema = buildClientSchema(introspectSchema);
    const typeName = 'OfferingSortInput';
    const baseType = schema.getType(typeName);
    const scalarType = assertInputType(baseType);
    const type = GraphQLList(GraphQLNonNull(scalarType));
    const result = assertIsNonNullable(
      buildArgumentNode({
        schema,
        name: 'order',
        type,
        value: [{ accelerated: 'ASC' }, { company: { issuer: 'ASC' } }],
      })
    );

    expect(result).not.toBeUndefined();
    expect(print(result)).toMatchSnapshot();
  });
});
