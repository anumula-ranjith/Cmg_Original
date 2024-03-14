import React, { createContext, useContext, useState } from 'react';

export type TableInfo = {
  id: string;
  source: string;
  columns: string[];
  rowCount: number;
};

export const SelectedTableContext = createContext<
  | {
      tableInfo: TableInfo | null;
      setTableInfo: React.Dispatch<React.SetStateAction<TableInfo | null>>;
    }
  | undefined
>(undefined);

/**
 * SelectedTableProvider provides a selected table's information or null if no table is selected.
 * It ensures that the event handler is registered only once and provides a shared state across the application.
 */
// TODO: Work on select table for Edit View
export const SelectedTableProvider = ({ children }) => {
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  // const debounceTimer = useRef<number | null>(null);
  // const isProcessing = useRef<boolean>(false);

  // const handleSourceLoad = useCallback(async (excelTableInfo: ExcelTableInfo) => {
  //   const source = await CmgExcelUtils.NameManager.load(
  //     CmgExcelUtils.Identifier.from(excelTableInfo.id)
  //   );
  //   const metadata: TableMetadata | null = source ? (JSON.parse(source) as TableMetadata) : null;
  //   if (metadata) {
  //     return { ...excelTableInfo, ...metadata };
  //   }
  //   return null;
  // }, []);

  // const processSelectionChanged = useCallback(async () => {
  //   const excelTableInfo = await CmgExcelUtils.Events.findSelectedTable();
  //   const newTable = excelTableInfo ? await handleSourceLoad(excelTableInfo) : null;
  //   setTableInfo(newTable);
  // }, [handleSourceLoad]);

  // useEffect(() => {
  //   const cellSelectionChangedEvent = () => {
  //     if (!isProcessing.current) {
  //       isProcessing.current = true;
  //       processSelectionChanged()
  //         .catch(error => {
  //           logger.error(`An error occurred at detecting table`, error);
  //           setTableInfo(null);
  //         })
  //         .finally(() => {
  //           isProcessing.current = false;
  //         });
  //     }
  //   };

  //   // The following contains debounce and avoid triggering if the user moves from cells fast
  //   const cellSelectedHandler = (): Promise<void> => {
  //     if (debounceTimer.current) {
  //       clearTimeout(debounceTimer.current);
  //     }
  //     debounceTimer.current = window.setTimeout(() => {
  //       if (isProcessing.current) return;
  //       cellSelectionChangedEvent();
  //     }, 100);
  //     return Promise.resolve();
  //   };

  //   CmgExcelUtils.Events.registerEvent('onSelectionChanged', cellSelectedHandler)
  //     .then(() => {
  //       cellSelectionChangedEvent();
  //       logger.log('Table events registered successfully');
  //     })
  //     .catch(err => logger.error('Failed to register table select events', err));

  //   return () => {
  //     if (debounceTimer.current) {
  //       clearTimeout(debounceTimer.current);
  //     }
  //     CmgExcelUtils.Events.removeEvents()
  //       .then(() => logger.log('Events removed successfully'))
  //       .catch(e => logger.error('Unable to remove table event', e));
  //   };
  // }, [processSelectionChanged]);

  return (
    <SelectedTableContext.Provider value={{ tableInfo, setTableInfo }}>
      {children}
    </SelectedTableContext.Provider>
  );
};

export const useSelectedTable = () => {
  const context = useContext(SelectedTableContext);
  if (!context) {
    throw new Error('useSelectedTable must be used within a SelectedTableProvider');
  }
  return context;
};
