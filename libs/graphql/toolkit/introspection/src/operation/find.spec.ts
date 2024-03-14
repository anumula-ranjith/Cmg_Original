import type { IntrospectionQuery } from 'graphql';
import { buildClientSchema } from 'graphql';

import introspectionJson from '../__mocks__/introspection.json';
import { findOperationRootType, findOperationRootTypeOrThrow } from './find';

const introspectSchema = introspectionJson.data as unknown as IntrospectionQuery;

describe('findOperationRootType', () => {
  it('finds the operation root type for a query', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = findOperationRootType(schema, 'query', 'offerings');

    expect(result?.toJSON()).toBe('OfferingCollectionSegment');
  });
});

describe('findOperationRootTypeOrThrow', () => {
  it('finds the operation root type for a query', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = findOperationRootTypeOrThrow(schema, 'query', 'offerings');

    expect(result.toJSON()).toBe('OfferingCollectionSegment');
  });

  it('throws when the operation root type for a query cannot be found', () => {
    const schema = buildClientSchema(introspectSchema);
    const resultFn = () => findOperationRootTypeOrThrow(schema, 'query', 'non_existent_field');

    expect(resultFn).toThrow(
      'The operation type root non_existent_field was not found in the schema.'
    );
  });
});
