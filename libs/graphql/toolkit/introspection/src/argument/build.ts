import { filterNotNull } from '@cmg/core-array';
import { findArgumentsByField } from '@cmg/graphql-toolkit-core';
import type { ArgumentNode } from 'graphql';
import { astFromValue, isInputType } from 'graphql';

import type { BuildArgumentNodeParams, CoerceArgumentNodeByFieldParams } from './types';

/**
 * Builds an GraphQL AST Argument Node from a GraphQL Type.
 * @param params Build Parameters.
 * @returns GraphQL AST Argument Node
 */
export const buildArgumentNode = (params: BuildArgumentNodeParams): ArgumentNode | undefined => {
  const { schema, name, value, type } = params;
  if (value === undefined) {
    return undefined;
  }

  const inputType = typeof type === 'string' ? schema.getType(type) : type;
  if (!isInputType(inputType)) {
    return undefined;
  }

  const astValue = astFromValue(value, inputType);
  if (astValue == null) {
    return undefined;
  }

  return {
    kind: 'Argument',
    name: { kind: 'Name', value: name },
    value: astValue,
  };
};

/**
 * Builds a collection of GraphQL AST Argument Node from a GraphQL Type's field.
 * @param params Build Parameters.
 * @returns A collection of GraphQL AST Argument Node.
 */
export const buildArgumentNodesByField = (
  params: CoerceArgumentNodeByFieldParams
): readonly ArgumentNode[] => {
  const { schema, field, typeName, args } = params;
  return findArgumentsByField(schema, typeName, field)
    .filter(arg => args?.[arg.name] != null)
    .map(arg =>
      buildArgumentNode({
        schema,
        name: arg.name,
        type: arg.type,
        value: args?.[arg.name],
      })
    )
    .filter(filterNotNull);
};
