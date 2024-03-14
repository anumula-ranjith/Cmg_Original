import React from 'react';

import type { TableInfo } from '../../hooks/useSelectedTable';

type Props = Readonly<{
  table: TableInfo;
}>;

// TODO: This component should be implemented in next tickets
const Edit: React.FC<Props> = () => {
  // const { loading, updateTable } = useUpdateTable({ table });
  // const sourceColumns: string[] = useSourceColumns(table.source);

  // const onUpdate = useCallback(
  //   (columns: string[], rowCount: number) => {
  //     updateTable(columns, rowCount)
  //       .then(() => MessageService.showSuccess('Table successfully updated'))
  //       .catch((error?: { message?: string }) =>
  //         MessageService.showMessage(error?.message ?? 'An error has ocurred', 'error')
  //       );
  //   },
  //   [updateTable]
  // );

  // if (sourceColumns.length === 0 || table.columns.length === 0) {
  //   return <Loading />;
  // }

  // return (
  //   <EditForm
  //     table={table}
  //     items={sourceColumns}
  //     selectedItems={table.columns}
  //     loading={loading}
  //     onUpdate={onUpdate}
  //   />
  // );

  return <div>Un-implemented</div>;
};

export default Edit;
