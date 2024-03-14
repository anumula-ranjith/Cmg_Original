import { useMemo } from 'react';

import { useSchema } from '../../client/graphql/instrospection/useSchema';
import type { SourceField } from '../../client/graphql/utils';
import { getSourceFields } from '../../client/graphql/utils';
import { GraphQLEnumType, GraphQLInputObjectType } from 'graphql';

const flattenNestedObject = (obj: SourceField, prefix = ''): string[] => {
  let result: string[] = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    const item = obj[key];
    if (item && typeof item === 'object') {
      result = result.concat(flattenNestedObject(item, newPrefix));
    } else {
      result.push(newPrefix);
    }
  }
  return result;
};

const useSourceColumns = (source: string): string[] => {
  const { schema } = useSchema();

  return useMemo(() => {
    const fields = schema ? getSourceFields(schema, source) : {};
    return flattenNestedObject(fields);
  }, [schema, source]);
};



export default useSourceColumns;
