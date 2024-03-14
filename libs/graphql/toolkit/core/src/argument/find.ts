import type { GraphQLArgument, GraphQLSchema } from 'graphql';
import { isObjectType } from 'graphql';

/**
 * Finds the GraphQL arguments from an ObjectType's field.
 * @param schema The schema to explore.
 * @param typeName The GraphQL Type name name.
 * @param field The field name of the GraphQL Typ.
 * @returns An array of GraphQL Arguments.
 */
export const findArgumentsByField = (
  schema: GraphQLSchema,
  typeName: string,
  field: string
): readonly GraphQLArgument[] => {
  const type = schema.getType(typeName);
  if (!isObjectType(type)) {
    return [];
  }

  const fields = type.getFields();
  const args = Object.values(fields).find(fieldType => fieldType.name === field)?.args;
  return args ?? [];
};
