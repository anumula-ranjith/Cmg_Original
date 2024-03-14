import type {
  DocumentNode,
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLSchema,
  OperationDefinitionNode,
  OperationTypeNode,
  SelectionNode,
  SelectionSetNode,
} from 'graphql';
import { getNamedType, isObjectType, isScalarType, parse } from 'graphql';

import { buildArgumentNodesByField } from '../argument';
import { DEFAULT_MAX_NESTED_COERCION } from './const';
import { findOperationRootTypeOrThrow } from './find';
import type { BuildOperation, CoerceFieldsIntoOperationOptions } from './types';

/**
 * Builds a GraphQL Operation Structured AST Selection Tree.
 * @param type The GraphQL Type.
 * @param options Options.
 * @returns Returns a Structured AST Selection Tree Definition as a string.
 */
export const buildOperationTree = (
  type: GraphQLOutputType,
  options?: CoerceFieldsIntoOperationOptions,
  path?: string,
  depth = 0,
  _cache?: Map<GraphQLNamedType, number>
): string => {
  const map = _cache ?? new Map<GraphQLNamedType, number>();
  const namedType = getNamedType(type);
  const maxNested = options?.maxNested ?? DEFAULT_MAX_NESTED_COERCION;
  const nestedCount = map.get(namedType) ?? 0;

  if (options?.maxCyclicNested && depth > options.maxCyclicNested) {
    return '';
  }

  if (isObjectType(namedType)) {
    map.set(namedType, nestedCount + 1);
    const fieldEntries = Object.entries(namedType.getFields());
    const fields = fieldEntries
      .filter(([, fieldType]) => {
        const fieldNamedType = getNamedType(fieldType.type);
        const fieldNestedCount = map.get(fieldNamedType) ?? 0;
        return fieldNestedCount < maxNested;
      })
      .map(([, fieldType]) => {
        const fieldName = fieldType.name;
        const fieldEntries = Object.entries(namedType.getFields());
        const isObject = isObjectType(getNamedType(fieldType.type));
        const currPath = path == null ? fieldName : `${path}.${fieldName}`;
        const descendants = buildOperationTree(fieldType.type, options, currPath, depth + 1, map);
        if (isObject && descendants === '' && fieldEntries.length > 0) {
          return { coerced: null, currPath, fieldType };
        }
        return { coerced: `${fieldName}${descendants}`, currPath, fieldType };
      })
      .filter(({ coerced, currPath, fieldType }) => {
        const isLeafType = isScalarType(getNamedType(fieldType.type));
        const isIncluded =
          options?.include == null ||
          options.include.some(includePath =>
            isLeafType
              ? currPath.startsWith(`${includePath}.`) || currPath === includePath
              : includePath.startsWith(currPath)
          );
        const isExcluded = options?.exclude?.includes(currPath);
        return coerced !== null && isIncluded && !isExcluded;
      })
      .map(({ coerced }) => coerced);

    if (depth === 0) {
      fields.push('totalCount');
    }
    if (fields.length === 0) {
      return '';
    }

    return `{\n\t${fields.join(',\n\t')}\t\n}`;
  }

  return '';
};

/**
 * Builds a GraphQL Operation Selection Node from a GraphQL Type.
 * @param schema The GraphQL Schema.
 * @param operationType The Operation Type.
 * @param operation The Operation to build.
 * @returns An AST Selection Node.
 */
export const buildOperationSelectionNode = (
  schema: GraphQLSchema,
  operationType: OperationTypeNode,
  operation: BuildOperation
): SelectionNode => {
  const field = typeof operation === 'object' ? operation.field : operation;
  const options = typeof operation === 'object' ? operation.options : undefined;
  const alias = typeof operation === 'object' ? operation.alias : undefined;
  const operationTypeName =
    (operationType === 'query' ? schema.getQueryType()?.name : schema.getMutationType()?.name) ??
    'Query';

  const operationArgs = buildArgumentNodesByField({
    schema,
    typeName: operationTypeName,
    field,
    args: options?.args,
  });

  const rootType = findOperationRootTypeOrThrow(schema, operationType, field);
  const result = buildOperationTree(rootType, options, field);
  const selectionSet = parse(result, { noLocation: true }).definitions.map(definition => {
    if (definition.kind === 'OperationDefinition') {
      return definition.selectionSet;
    }

    return undefined;
  })[0];

  return {
    kind: 'Field',
    name: { kind: 'Name', value: field },
    alias: alias != null ? { kind: 'Name', value: alias } : undefined,
    arguments: operationArgs,
    selectionSet,
  };
};

/**
 * Builds a GraphQL Operation from a GraphQL Type.
 * @param schema The GraphQL Schema.
 * @param operationType The Operation Type.
 * @param operations The Operation(s) to build.
 * @returns An AST Document Node.
 */
export const buildOperation = (
  schema: GraphQLSchema,
  operationType: OperationTypeNode,
  ...operations: readonly BuildOperation[]
): DocumentNode => {
  const selections = operations.map(operation =>
    buildOperationSelectionNode(schema, operationType, operation)
  );

  const operationSelectionSet: SelectionSetNode = {
    kind: 'SelectionSet',
    selections,
  };
  const operationDefinition: OperationDefinitionNode = {
    kind: 'OperationDefinition',
    operation: operationType,
    selectionSet: operationSelectionSet,
  };

  return {
    kind: 'Document',
    definitions: [operationDefinition],
  };
};
