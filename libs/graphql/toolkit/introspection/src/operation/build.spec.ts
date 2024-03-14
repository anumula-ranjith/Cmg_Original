import type { IntrospectionQuery } from 'graphql';
import { buildClientSchema, print } from 'graphql';

import introspectionJson from '../__mocks__/introspection.json';
import { buildOperation, buildOperationSelectionNode, buildOperationTree } from './build';
import { findOperationRootTypeOrThrow } from './find';

const introspectSchema = introspectionJson.data as unknown as IntrospectionQuery;

describe('buildOperationTree', () => {
  it('builds the operation tree', () => {
    const schema = buildClientSchema(introspectSchema);
    const rootType = findOperationRootTypeOrThrow(schema, 'query', 'offerings');
    const result = buildOperationTree(rootType);

    expect(result).toMatchSnapshot();
  });

  it('builds operation tree excluding some paths', () => {
    const schema = buildClientSchema(introspectSchema);
    const rootType = findOperationRootTypeOrThrow(schema, 'query', 'offerings');
    const result = buildOperationTree(rootType, {
      exclude: [
        'pageInfo.startCursor',
        'items.offeringAdvisers',
        'items.offeringManagers',
        'items.calculatedOffering',
        'items.secFilings',
        'items.offeringSponsors',
        'items.calculatedOfferingAdvisers',
        'items.calculatedOfferingManagers',
        'items.calculatedOfferingSponsors',
        'items.dataQualityFailures',
        'items.filingDetails',
        'items.company',
        'items.firmCalculation',
        'items.news',
      ],
    });

    expect(result).toMatchSnapshot();
  });

  it('builds operation tree including some paths', () => {
    const schema = buildClientSchema(introspectSchema);
    const rootType = findOperationRootTypeOrThrow(schema, 'query', 'offerings');
    const result = buildOperationTree(rootType, {
      include: ['pageInfo', 'items.company.hasSplits'],
    });

    expect(result).toMatchSnapshot();
  });

  it('builds operation tree with limited depth', () => {
    const schema = buildClientSchema(introspectSchema);
    const rootType = findOperationRootTypeOrThrow(schema, 'query', 'offerings');
    const result = buildOperationTree(rootType, {
      include: ['items.company'],
    });

    expect(result).toMatchSnapshot();
  });
});

describe('buildOperationSelectionNode', () => {
  it('builds a query operation', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperationSelectionNode(schema, 'query', 'offerings');

    expect(print(result)).toMatchSnapshot();
  });

  it('builds a mutation operation', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperationSelectionNode(schema, 'mutation', 'addOffering');

    expect(print(result)).toMatchSnapshot();
  });
});

describe('buildOperation', () => {
  it('builds an operation', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperation(schema, 'query', 'offerings');
    expect(print(result)).toMatchSnapshot();
  });

  it('builds an operation with multiple selections', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperation(schema, 'query', 'offerings', 'companies');
    expect(print(result)).toMatchSnapshot();
  });

  it('builds an operation with multiple alias selections', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperation(schema, 'query', 'offerings', {
      field: 'offerings',
      alias: 'myOfferings',
    });
    expect(print(result)).toMatchSnapshot();
  });

  it('builds an operation with multiple selections with inclusive fields', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperation(schema, 'mutation', {
      field: 'deleteDataQualityFailure',
      options: {
        include: ['deleteDataQualityFailure.deletedDataQualityFailure.id'],
      },
    });
    expect(print(result)).toMatchSnapshot();
  });

  it('builds an operation with arguments', () => {
    const schema = buildClientSchema(introspectSchema);
    const result = buildOperation(schema, 'query', {
      field: 'offerings',
      options: {
        maxNested: 5,
        args: { where: { accelerated: { eq: true } }, order: [{ company: { issuer: 'ASC' } }] },
        exclude: [
          'offerings.items.calculatedOffering',
          'offerings.items.offeringSponsors',
          'offerings.items.company.hasSplits',
        ],
      },
    });
    expect(print(result)).toMatchSnapshot();
  });
});
