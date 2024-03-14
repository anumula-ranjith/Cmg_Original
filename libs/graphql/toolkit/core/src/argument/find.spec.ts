/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { IntrospectionQuery } from 'graphql';
import { buildClientSchema } from 'graphql';

import introspectionJson from './__mocks__/introspection.json';
import { findArgumentsByField } from './find';

const introspectSchema = introspectionJson.data as unknown as IntrospectionQuery;

describe('findArgumentsByField', () => {
  it('find arguments for a Query type', () => {
    const schema = buildClientSchema(introspectSchema);
    const typeName = schema.getQueryType()?.name;
    expect(typeName).not.toBeFalsy();
    const result = findArgumentsByField(schema, typeName!, 'offerings');

    expect(result).toHaveLength(4);
    expect(result).toMatchSnapshot();
  });

  it('finds arguments for a Mutation type', () => {
    const schema = buildClientSchema(introspectSchema);
    const typeName = schema.getMutationType()?.name;
    expect(typeName).not.toBeFalsy();
    const result = findArgumentsByField(schema, typeName!, 'addCompany');

    expect(result).toMatchSnapshot();
  });
});
