import type { TableInfo } from '../../../hooks/useSelectedTable';

// const graphqlUrl = appSettings.graphqlUrl;

type Props = Readonly<{
  table: TableInfo;
}>;

// const updateExcelTable = async ({
//   columns,
//   sourceColumns,
//   apiKey,
//   schema,
//   tableInfo,
//   queryOptions,
// }: {
//   columns: string[];
//   sourceColumns: string[];
//   apiKey: string;
//   schema: GraphQLSchema;
//   tableInfo: TableInfo;
//   queryOptions: BuildQueryOptions;
// }): Promise<void> => {
//   const criterias = await CmgExcelUtils.Table.geTableFilterCriterias(tableInfo.id, sourceColumns);
//   const whereClauses = buildWhereClause(tableInfo, schema, criterias);
//   const data = await fetchGraphqlData(
//     schema,
//     graphqlUrl,
//     apiKey,
//     tableInfo.source,
//     queryOptions,
//     whereClauses
//   );
//   await CmgExcelUtils.Table.updateTable(columns, sourceColumns, data.items, tableInfo.id);
// };

const useUpdateTable = ({ table }: Props) => {
  // const { apiKey } = useAuth();
  // const { schema } = useSchema();
  // const sourceColumns = useSourceColumns(table.source);
  // const [loading, setLoading] = useState<boolean>(false);
  // const isMounted = useRef(true);

  // const updateTable = useCallback(
  //   async (columns: string[], maxRows: number) => {
  //     if (schema && apiKey) {
  //       setLoading(true);
  //       try {
  //         await updateExcelTable({
  //           columns,
  //           apiKey,
  //           sourceColumns,
  //           schema,
  //           tableInfo: table,
  //           queryOptions: {
  //             query: { take: maxRows },
  //             build: { include: columns.map(item => `items.${item}`) },
  //           },
  //         });
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   },
  //   [schema, apiKey, sourceColumns, table]
  // );

  // useEffect(() => {
  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, []);

  // TODO: This hook should be implemented in next tickets
  return {
    loading: false,
    updateTable: () => {
      throw Error('Update Table not implemented yet');
    },
  };
};

export default useUpdateTable;
