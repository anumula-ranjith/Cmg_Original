import { formatItemName } from '../taskpane/components/table/components/SelectableList';
import type { TableCell } from './types';

const nameManagerCache: Record<string, string> = {};
// const registeredEvents: Handler[] = [];

// type EventType = 'onSelectionChanged' | 'onActivated';
// type Handler = {
//   handler: () => Promise<unknown>;
//   eventType: EventType;
// };

export type ExcelTableInfo = {
  id: string;
  columns: string[];
  range: Excel.Range;
  name: string;
  rowCount: number;
};

const loadFromExcelContext = async (
  context: Excel.RequestContext,
  key: string
): Promise<string | null> => {
  const names = context.workbook.names;
  const existingName = names.getItemOrNullObject(key);
  existingName.load(['name', 'value']);
  await context.sync();
  if (existingName.name) {
    return existingName.value as string;
  }
  return null;
};

const storeInExcelContext = async (
  context: Excel.RequestContext,
  key: string,
  value: string
): Promise<void> => {
  const names = context.workbook.names;
  const existingName = names.getItemOrNullObject(key);
  existingName.load('name');
  await context.sync();
  if (existingName.name) {
    existingName.formula = value;
  } else {
    names.add(key, value);
  }
  nameManagerCache[key] = value;
  await context.sync();
};

const deleteFromExcelContext = async (
  context: Excel.RequestContext,
  key: string
): Promise<void> => {
  const names = context.workbook.names;
  const existingName = names.getItemOrNullObject(key);
  existingName.load('name');
  await context.sync();
  if (existingName.name) {
    existingName.delete();
  }
  await context.sync();
};

export type TableMetadata = {
  source: string;
  filters: string | null;
};

// const addColumns = async (context: Excel.RequestContext, table: Excel.Table, columns: string[]) => {
//   table.rows.load('count');
//   for (let i = 0; i < columns.length; i++) {
//     const columnName = columns[i];
//     const existingColumn = table.columns.items.find(col => col.name === columnName);
//     if (!existingColumn) {
//       logger.log(`Adding column '${columnName}' at ${i}`);
//       table.columns.add(undefined, [[columnName], ['']]);
//     }
//   }

//   await context.sync();
// };

// const deleteUnexistingColumns = async (
//   context: Excel.RequestContext,
//   table: Excel.Table,
//   sourceColumns: string[]
// ) => {
//   table.columns.load(['count', 'name']);
//   for (const column of table.columns.items) {
//     column.load(['name']);
//     await context.sync();
//     if (!sourceColumns.includes(column.name)) {
//       logger.log(`Deleting column ${column.name}`);
//       column.delete();
//     }
//   }
//   await context.sync();
// };

// const cleanTable = async (context: Excel.RequestContext, table: Excel.Table) => {
//   try {
//     const dataRange = table.getDataBodyRange();
//     dataRange.load('address');
//     await context.sync();
//     dataRange.delete(Excel.DeleteShiftDirection.up);
//     await context.sync();
//   } catch (error) {
//     console.error(error);
//   }
// };

// const convertToExcelDateTime = (isoDateTime: string | undefined): number => {
//   if (!isoDateTime) return 0;
//   const dateTimeParts = isoDateTime.split('T');
//   const datePart = dateTimeParts[0];
//   const timePart = dateTimeParts[1];

//   const date = new Date(datePart);
//   const time = timePart ? new Date(`1970-01-01T${timePart}`) : new Date(0); // Use a default date for time-only values

//   const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel epoch starts on December 30, 1899

//   const millisecondsPerDay = 24 * 60 * 60 * 1000;
//   const daysSinceEpoch = Math.floor((date.getTime() - excelEpoch.getTime()) / millisecondsPerDay);

//   const timeInSeconds =
//     time.getUTCHours() * 3600 + time.getUTCMinutes() * 60 + time.getUTCSeconds();
//   const excelTimeValue = timeInSeconds / (24 * 60 * 60); // Convert time to fraction of a day

//   return daysSinceEpoch + excelTimeValue + 1; // Add time value and 1 to match Excel's date/time numbering
// };

/*
  Gets the table range for a table, we need to provide excel from what range to what range
  the table occupies the space
*/
const getTableRange = async (context: Excel.RequestContext, columns: string[], cellRowPoint: number, cellColumnPoint: number) => {
  const sheet = context.workbook.worksheets.getActiveWorksheet();
  const currentCell = sheet.getCell(cellRowPoint, cellColumnPoint);
  currentCell.load(['address', 'columnIndex', 'rowIndex']);
  await context.sync();
  const newRange = sheet.getCell(
    currentCell.rowIndex,
    currentCell.columnIndex + columns.length - 1
  );
  newRange.load('address');
  await context.sync();
  return `${currentCell.address}:${newRange.address}`;
};

// const getUserColumns = async (
//   context: Excel.RequestContext,
//   table: Excel.Table,
//   apiColumns: string[]
// ): Promise<Record<string, string>> => {
//   const headerRowRange = table.getHeaderRowRange();
//   headerRowRange.load('values');
//   await context.sync();
//   const headers = headerRowRange.values[0] as string[];
//   const firstRowRange = headerRowRange.getOffsetRange(1, 0);
//   firstRowRange.load(['formulas', 'values']);
//   await context.sync();
//   const result: Record<string, string> = {};
//   headers.forEach((header, index) => {
//     if (!apiColumns.includes(header)) {
//       const cellValue = firstRowRange.formulas[0][index] as string | undefined | null;
//       result[header] = cellValue ?? '';
//     }
//   });
//   return result;
// };

// const getCurrentFilters = async (
//   context: Excel.RequestContext,
//   table: Excel.Table
// ): Promise<Record<string, Excel.FilterCriteria>> => {
//   table.columns.load('items/filter');
//   const filters: Record<string, Excel.FilterCriteria> = {};
//   await context.sync();
//   for (const column of table.columns.items) {
//     column.load(['name', 'criteria']);
//     await context.sync();
//     // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//     if (column.filter.criteria) {
//       filters[column.name] = column.filter.criteria;
//     }
//   }
//   return filters;
// };

// const deleteTableFilters = async (
//   context: Excel.RequestContext,
//   table: Excel.Table
// ): Promise<void> => {
//   table.columns.load(['name', 'items/filter']);
//   await context.sync();
//   for (const column of table.columns.items) {
//     column.filter.clear();
//   }
//   await context.sync();
// };

// const reApplyTableFilters = async (
//   context: Excel.RequestContext,
//   table: Excel.Table,
//   filters: Record<string, Excel.FilterCriteria>
// ): Promise<void> => {
//   table.columns.load(['name', 'items/filter']);
//   await context.sync();
//   const filtersKeys = Object.keys(filters);
//   for (const column of table.columns.items) {
//     if (filtersKeys.includes(column.name)) {
//       column.filter.apply(filters[column.name]);
//     }
//   }
//   await context.sync();
// };

function charToNumber(char: string): number {
  if (char.length !== 1 && char.length !== 2 || !char.match(/[A-Z]/i)) {
    throw new Error(`Invalid input: "${char}". Only single uppercase letters or pairs are allowed.`);
  }

  if (char.length === 1) {
    return char.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  } else {
    const firstCharValue = char.charAt(0).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    const secondCharValue = char.charAt(1).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    return firstCharValue * 26 + secondCharValue - 1;
  }
}

function splitCharAndNumber(value: string): [string, number] {
  const match = value.match(/(\D+)(\d+)/);

  if (!match) {
    throw new Error("User not Selected any Cell.");
  }

  const [chars, nums] = match.slice(1);

  return [chars, Number(nums)-1];
}

const CmgExcelUtils = {
  Identifier: {
    from: (guid: string) => {
      const compactGuid = guid.replace(/[-{}]/g, '').toUpperCase();
      return `CMG_${compactGuid}`;
    },
  },
  Table: {
    create: async (columns: string[], data: Record<string, TableCell>[], metadata?: string) => {
      return Excel.run(async context => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        const selectedRange = context.workbook.getSelectedRange();
        selectedRange.load('address');
        await context.sync();

        const userSelectedCell = splitCharAndNumber(selectedRange.address.split("!")[1])
        const cellRowPoint = userSelectedCell[1]
        console.log(userSelectedCell)
        const cellColumnPoint = charToNumber(userSelectedCell[0])
        const currentCell = sheet.getCell(cellRowPoint, cellColumnPoint);
        console.log(cellRowPoint, cellColumnPoint)
        // Always create the table at the first cell A1
        // const currentCell = sheet.getCell(11, 3);
        
        // const tableRange = await getTableRange(context, columns);
        const tableRange = await getTableRange(context, columns, cellRowPoint, cellColumnPoint);
        const table: Excel.Table = currentCell.worksheet.tables.add(tableRange, true);
        const formattedColumns = columns.map(column => formatItemName(column));
        table.getHeaderRowRange().values = [formattedColumns];
        table.load('id');
        const rows = data.map(item => columns.map(key => item[key]));
        rows.length > 0 && table.rows.add(0, rows);
        await context.sync();
        if (metadata) {
          const key = `${CmgExcelUtils.Identifier.from(table.id)}`;
          await storeInExcelContext(context, key, metadata);
        }
        return table;
      });
    },
    // updateTable: async (
    //   columns: string[],
    //   apiColumns: string[],
    //   apiData: GQLNode[],
    //   tableId: string,
    //   metadata?: string
    // ) => {
    //   return Excel.run(async context => {
    //     const sheet = context.workbook.worksheets.getActiveWorksheet();
    //     const table = sheet.tables.getItem(tableId);
    //     const range = table.getDataBodyRange();
    //     range.load('values');
    //     await context.sync();
    //     table.load('name');
    //     await context.sync();
    //     const tableFilters = await getCurrentFilters(context, table);
    //     const userColumns = await getUserColumns(context, table, apiColumns);
    //     const data = parseGraphQlResponse(apiData, userColumns, columns);
    //     const rows = data.map(item => columns.map(key => item[key]));
    //     table.load('name');
    //     table.columns.load(['count', 'items', 'name']);
    //     await deleteTableFilters(context, table);
    //     await deleteUnexistingColumns(context, table, columns);
    //     await cleanTable(context, table);
    //     await addColumns(context, table, columns);
    //     await cleanTable(context, table);
    //     rows.length > 0 && table.rows.add(0, rows);
    //     await reApplyTableFilters(context, table, tableFilters);
    //     await context.sync();
    //   });
    // },
    // geTableFilterCriterias: async (tableId: string, souceColumns: string[]) => {
    //   return Excel.run(async context => {
    //     const sheet = context.workbook.worksheets.getActiveWorksheet();
    //     const table = sheet.tables.getItem(tableId);
    //     table.load('name');
    //     await context.sync();

    //     table.columns.load(['name', 'filter/criteria']);
    //     await context.sync();
    //     const obj: Record<string, Excel.FilterCriteria> = {};
    //     table.columns.items.forEach(column => {
    //       const headerName = column.name;
    //       // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //       if (column.filter.criteria && souceColumns.includes(headerName)) {
    //         obj[headerName] = column.filter.criteria;
    //       }
    //     });
    //     return obj;
    //   });
    // },
  },
  Cell: {
    // toXYCoordinate(cell: string): [number, number] {
    //   const cellAddress = cell.split('!').pop() ?? cell;
    //   const colMatch = cellAddress.match(/[A-Z]+/);
    //   const rowMatch = cellAddress.match(/\d+/);
    //   if (!colMatch || !rowMatch) {
    //     throw new Error(`Invalid cell address: ${cell}`);
    //   }
    //   const colStr = colMatch[0];
    //   let col = 0;
    //   for (let i = 0; i < colStr.length; i++) {
    //     col = col * 26 + (colStr.charCodeAt(i) - 64);
    //   }
    //   return [parseInt(rowMatch[0], 10), col];
    // },
    // async isCurrentCellInTable(
    //   tableRange: Excel.Range,
    //   context: Excel.RequestContext
    // ): Promise<boolean> {
    //   tableRange.load(['rowCount', 'columnCount']);
    //   const selectedRange = context.workbook.getSelectedRange();
    //   selectedRange.load(['addressLocal', 'rowCount', 'columnCount']);
    //   const selectedCell = selectedRange.getCell(0, 0);
    //   selectedCell.load(['addressLocal']);
    //   await context.sync();
    //   const tableStartCell = tableRange.getCell(0, 0);
    //   const tableEndCell = tableRange.getCell(tableRange.rowCount - 1, tableRange.columnCount - 1);
    //   tableStartCell.load(['addressLocal']);
    //   tableEndCell.load(['addressLocal']);
    //   await context.sync();
    //   const [selectedRow, selectedCol] = CmgExcelUtils.Cell.toXYCoordinate(
    //     selectedCell.addressLocal
    //   );
    //   const [start2Row, start2Col] = CmgExcelUtils.Cell.toXYCoordinate(tableStartCell.addressLocal);
    //   const [end2Row, end2Col] = CmgExcelUtils.Cell.toXYCoordinate(tableEndCell.addressLocal);
    //   return (
    //     selectedRow >= start2Row &&
    //     selectedRow <= end2Row &&
    //     selectedCol >= start2Col &&
    //     selectedCol <= end2Col
    //   );
    // },
  },
  NameManager: {
    async load(key: string): Promise<string | null> {
      if (nameManagerCache[key]) {
        return Promise.resolve(nameManagerCache[key]);
      }
      return Excel.run(async context => {
        const result = await loadFromExcelContext(context, key);
        if (result) {
          nameManagerCache[key] = result;
        }
        return result;
      });
    },
    save(key: string, value: string) {
      return Excel.run(async context => {
        await storeInExcelContext(context, key, value);
      });
    },
    delete(key: string) {
      return Excel.run(async context => await deleteFromExcelContext(context, key));
    },
  },
  Events: {
    // async findSelectedTable() {
    //   return Excel.run(async context => {
    //     const currentWorksheet = context.workbook.worksheets.getActiveWorksheet();
    //     const currentTables = currentWorksheet.tables;
    //     currentTables.load(['name', 'columns', 'rows']);
    //     await context.sync();
    //     const tables: ExcelTableInfo[] = currentTables.items.map(table => ({
    //       id: table.id,
    //       name: table.name,
    //       range: table.getRange(),
    //       columns: table.columns.items.map(c => c.name),
    //       rowCount: table.rows.count,
    //     }));
    //     for (const table of tables) {
    //       if (await CmgExcelUtils.Cell.isCurrentCellInTable(table.range, context)) {
    //         return table;
    //       }
    //     }
    //     return null;
    //   });
    // },
    // registerEvent(eventType: EventType, handler: () => Promise<unknown>): Promise<unknown> {
    //   return Excel.run(async context => {
    //     const workbook = context.workbook;
    //     switch (eventType) {
    //       case 'onSelectionChanged':
    //         workbook.onSelectionChanged.add(handler);
    //         break;
    //       case 'onActivated':
    //         workbook.onActivated.add(handler);
    //         break;
    //       default:
    //         throw new Error('Event not registered');
    //     }
    //     workbook.onSelectionChanged.add(handler);
    //     registeredEvents.push({ eventType, handler });
    //     await context.sync();
    //   });
    // },
    // removeEvents() {
    //   return Excel.run(function (context) {
    //     const workbook = context.workbook;
    //     while (registeredEvents.length > 0) {
    //       const event = registeredEvents.pop();
    //       if (event) {
    //         const { eventType, handler } = event;
    //         switch (eventType) {
    //           case 'onSelectionChanged':
    //             workbook.onSelectionChanged.remove(handler);
    //             break;
    //           case 'onActivated':
    //             workbook.onActivated.remove(handler);
    //             break;
    //           default:
    //             throw new Error('Event not registered');
    //         }
    //       }
    //     }
    //     return context.sync();
    //   });
    // },
  },
};

export default CmgExcelUtils;
