import type {
  GraphQLList,
  GraphQLNamedType,
  GraphQLNonNull,
  GraphQLType,
  GraphQLWrappingType,
} from 'graphql';
import { getNamedType, isWrappingType } from 'graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IteratedGraphQLNamedType = GraphQLList<any> | GraphQLNonNull<any> | GraphQLNamedType;

/**
 * Iterates through all the Wrapping GraphQL types.
 * @param type The type to unwrap.
 * @returns Returns an iterator of GraphQLType types in their unwrapped order.
 */
export function* iterateWrappedType(type: GraphQLType): Generator<IteratedGraphQLNamedType> {
  if (isWrappingType(type)) {
    yield type;
    yield* iterateWrappedType(type.ofType as GraphQLWrappingType);
  } else {
    yield getNamedType(type);
    return;
  }
}
