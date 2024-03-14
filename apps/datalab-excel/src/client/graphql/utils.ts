import { findOperationRootTypeOrThrow } from '@cmg/graphql-toolkit-introspection';
import type { GraphQLOutputType, GraphQLSchema } from 'graphql';
import { GraphQLEnumType, getNamedType, isObjectType, isScalarType } from 'graphql';

import type { TableCell } from '../../excel/types';
import type { CoerceFieldsIntoOperationOptions } from './instrospection/types';
import type { GQLNode } from './types';

export const DEFAULT_MAX_NESTED_COERCION = 2;

export function escapeIfNeeded(s: string | object): string {
  let str: string;
  if (typeof s === 'object') {
    str = JSON.stringify(s).replace(/[{}"]/g, m => {
      switch (m) {
        case '{':
          return '\\{';
        case '}':
          return '\\}';
        case '"':
          return '\\"';
        default:
          return m;
      }
    });
  } else {
    str = s.toString();
  }
  return `"${str}"`;
}

export function stringifyResponse(response: unknown): TableCell {
  if (response === null || response === undefined) {
    return '';
  }
  if (typeof response === 'boolean') {
    return response ? 'TRUE' : 'FALSE';
  }
  if (typeof response === 'number') {
    return response;
  }
  if (typeof response === 'string') {
    return response.length < 1 ? '' : response;
  }
  if (typeof response === 'object') {
    if (Array.isArray(response)) {
      if (response.length === 0) {
        return '';
      }
    } else {
      return escapeIfNeeded(JSON.stringify(response));
    }
    return JSON.stringify(response);
  }
  return response as string;
}

export function parseGraphQlResponse(
  response: GQLNode[],
  userColumns: Record<string, string>,
  headers: string[]
): Record<string, TableCell>[] {
  const userColumnsKeys = Object.keys(userColumns);
  const result = response.map((item: GQLNode) => {
    const rows: Record<string, TableCell> = {};
    headers.forEach((header: string) => {
      if (userColumnsKeys.includes(header)) {
        rows[header] = userColumns[header];
      } else {
        let value: unknown = item;
        const headerParts = header.split('.');
        for (const key of headerParts) {
          if (Array.isArray(value)) {
            value = JSON.stringify(
              value.map(item => {
                const v = item as Record<string, unknown>;
                return `${(v[key] ? v[key] : '') as string}`;
              })
            );
          } else if (value !== null && typeof value === 'object') {
            value = value[key as keyof typeof value];
          }
        }
        const answer = stringifyResponse(value);
        rows[header] = answer;
      }
    });
    return rows;
  });
  return result;
}

const MAX_DEPTH = 3;

export type SourceField = {
  [key: string]: SourceField | null;
};

const retrieveSourceFieldsFromSchema = (
  type: GraphQLOutputType,
  options?: CoerceFieldsIntoOperationOptions,
  path = '',
  depth = 0
): SourceField => {
  if (depth >= (options?.maxNested ?? MAX_DEPTH)) {
    return {};
  }
  const result: SourceField = {};
  const namedType = getNamedType(type);

  if (isObjectType(namedType)) {
    const fields = namedType.getFields();
    for (const fieldName in fields) {
      const field = fields[fieldName];
      const currPath = path ? `${path}.${fieldName}` : fieldName;
      const fieldNamedType = getNamedType(field.type);
      const isLeaf = isScalarType(fieldNamedType);
      const isObject = isObjectType(fieldNamedType);

      const isIncluded =
        options?.include == null ||
        options.include.some(includePath =>
          isLeaf
            ? currPath.startsWith(`${includePath}.`) || currPath === includePath
            : includePath.startsWith(currPath)
        );

      const isExcluded = options?.exclude ? options.exclude.includes(currPath) : false;
      if (isIncluded && !isExcluded) {
        if (isObject) {
          const nestedObject = retrieveSourceFieldsFromSchema(
            field.type,
            options,
            currPath,
            depth + 1
          );
          if (Object.keys(nestedObject).length > 0) {
            result[fieldName] = nestedObject;
          }
        } else {
          result[fieldName] = null;
        }
      }
    }
  }

  return result;
};

export const getSourceFields = (
  schema: GraphQLSchema,
  source: string,
  options?: CoerceFieldsIntoOperationOptions
): SourceField => {
  const rootType = findOperationRootTypeOrThrow(schema, 'query', source);
  const namedType = getNamedType(rootType);
  const fields = isObjectType(namedType) ? Object.entries(namedType.getFields()) : [];
  const items = fields.filter(([fieldName]) => {
    return fieldName === 'items';
  });
  if (items.length > 0) {
    const itemsType = items[0][1].type;
    return retrieveSourceFieldsFromSchema(itemsType, options);
  }
  return {};
};