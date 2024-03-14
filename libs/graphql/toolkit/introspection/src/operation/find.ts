import type { Maybe } from '@cmg/core-types';
import type {
  ASTKindToNode,
  GraphQLOutputType,
  GraphQLSchema,
  OperationDefinitionNode,
  OperationTypeNode,
  Visitor,
} from 'graphql';
import { TypeInfo, visit, visitWithTypeInfo } from 'graphql';

/**
 * Finds a Root Operation (from Query or Mutation) GraphQL Type.
 * @param schema The GraphQL Schema.
 * @param operationType The Operation Type.
 * @param field The field name.
 * @returns A GraphQL Type if the type found, undefined otherwise.
 */
export const findOperationRootType = (
  schema: GraphQLSchema,
  operationType: OperationTypeNode,
  field: string | OperationDefinitionNode
): Maybe<GraphQLOutputType> => {
  const typeInfo = new TypeInfo(schema);
  let outputType: Maybe<GraphQLOutputType> = undefined;
  const visitor: Visitor<ASTKindToNode> = {
    enter(node) {
      outputType = typeInfo.getType();
      typeInfo.enter(node);
    },
    leave(node) {
      typeInfo.leave(node);
    },
  };
  visit(
    typeof field === 'string'
      ? {
          kind: 'OperationDefinition',
          operation: operationType,
          selectionSet: {
            kind: 'SelectionSet',
            selections: [{ kind: 'Field', name: { kind: 'Name', value: field } }],
          },
        }
      : field,
    visitWithTypeInfo(typeInfo, visitor)
  );
  return outputType;
};

/**
 * Finds a Root Operation (from Query or Mutation) GraphQL Type. Throws if the type is not found.
 * @param schema The GraphQL Schema.
 * @param operationType The Operation Type.
 * @param field The field name.
 * @returns A GraphQL Type if the type found, throws otherwise.
 */
export const findOperationRootTypeOrThrow = (
  schema: GraphQLSchema,
  operationType: OperationTypeNode,
  field: string | OperationDefinitionNode
): GraphQLOutputType => {
  const type = findOperationRootType(schema, operationType, field);
  if (type == null) {
    throw new Error(
      `The operation type root ${
        typeof field === 'string' ? field : field.name?.value ?? '<unknown>'
      } was not found in the schema.`
    );
  }

  return type;
};
