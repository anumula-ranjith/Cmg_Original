import type { GraphQLSchema } from 'graphql';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '../../../../auth/useAuth';
import { fetchGraphqlData } from '../../../../client/graphql/client';
import type { BuildQueryOptions } from '../../../../client/graphql/instrospection/build';
import { useSchema } from '../../../../client/graphql/instrospection/useSchema';
import { parseGraphQlResponse } from '../../../../client/graphql/utils';
import { appSettings } from '../../../../config/appSettings';
import type { TableMetadata } from '../../../../excel/utils';
import CmgExcelUtils from '../../../../excel/utils';
import type { TableInfo } from '../../../hooks/useSelectedTable';
import { TableCell } from './../../../../excel/types';

const graphqlUrl = appSettings.graphqlUrl;

type Props = Readonly<{
  source: string;
  onCreated: (_tableInfo: TableInfo) => void;
}>;

const createExcelTable = async ({
  columns,
  source,
  apiKey,
  schema,
  onTableCreated,
  maxRows,
  filters,
}: {
  columns: string[];
  source: string;
  apiKey: string;
  schema: GraphQLSchema;
  onTableCreated?: (tableInfo: TableInfo) => void;
  maxRows: number;
  filters?: string | null;
}): Promise<void> => {
  const metadata: TableMetadata = { source, filters: '' };
  let allData: Record<string, TableCell>[] = [];
  let offset = 0;
  let limit = 100;
  
  while (offset < maxRows) {
    if ((maxRows-offset) < 100) {
      limit = maxRows-offset;
    }
    const currentQueryOptions = {
      query: { take: limit, skip: offset },
      build: { include: columns.map(item => `items.${item}`) },
    }
    const apiData = await fetchGraphqlData(schema, graphqlUrl, apiKey, source, currentQueryOptions, filters);
    if (apiData.totalCount !== undefined && apiData.totalCount <= 5000) {
      maxRows = apiData.totalCount;
    } else {
      maxRows = 5000;
    }
    console.log(apiData.totalCount, maxRows, offset)
    const excelData = parseGraphQlResponse(apiData.items, {}, columns);
    allData = allData.concat(excelData);
    offset += limit;
  }

const table = await CmgExcelUtils.Table.create(columns, allData, JSON.stringify(metadata));

onTableCreated?.({
  id: table.id,
  source,
  columns,
  rowCount: maxRows,
});
};

const useCreateTable = ({ source, onCreated }: Props) => {
  const { apiKey } = useAuth();
  const { schema } = useSchema();
  const [loading, setLoading] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);

  const createTable = useCallback(
    async (columns: string[], maxRows: number, filters?: string) => {
      if (schema && source && apiKey) {
        setLoading(true);
        try {
          await createExcelTable({
            source: source,
            columns,
            schema,
            apiKey,
            onTableCreated: _tableInfo => {onCreated(_tableInfo);},
            maxRows,
            filters,
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [schema, source, apiKey, onCreated]
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { loading, createTable};
};

export default useCreateTable;