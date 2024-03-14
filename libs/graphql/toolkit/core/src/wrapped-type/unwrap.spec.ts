import { GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';

import { iterateWrappedType } from './unwrap';

describe('iterateWrappedType', () => {
  it('iterates a wrapped list', () => {
    const wrappedType = GraphQLList(GraphQLBoolean);
    const result = [...iterateWrappedType(wrappedType)];
    expect(result).toMatchInlineSnapshot(`
      Array [
        "[Boolean]",
        "Boolean",
      ]
    `);
  });

  it('iterates a wrapped non-nullable', () => {
    const wrappedType = GraphQLNonNull(GraphQLBoolean);
    const result = [...iterateWrappedType(wrappedType)];
    expect(result).toMatchInlineSnapshot(`
      Array [
        "Boolean!",
        "Boolean",
      ]
    `);
  });

  it('iterates a nested type', () => {
    const wrappedType = GraphQLNonNull(GraphQLList(GraphQLBoolean));
    const result = [...iterateWrappedType(wrappedType)];
    expect(result).toMatchInlineSnapshot(`
      Array [
        "[Boolean]!",
        "[Boolean]",
        "Boolean",
      ]
    `);
  });
});
