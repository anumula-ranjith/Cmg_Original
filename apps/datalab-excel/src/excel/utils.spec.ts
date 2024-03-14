import { OfficeMockObject } from 'office-addin-mock';

import CmgExcelUtils from './utils';

const mockExcel = {
  context: {
    sync: jest.fn(),
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  run: async function (callback: Function) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await callback(this.context);
  },
};

describe('Identifier', () => {
  it('should correctly format a GUID into an identifier', () => {
    const guid = '12345678-1234-1234-1234-123456789012';
    const identifier = CmgExcelUtils.Identifier.from(guid);
    expect(identifier).toBe('CMG_12345678123412341234123456789012');
  });
  it('should handle GUIDs with uppercase characters', () => {
    const guid = 'ABCD5678-ABCD-ABCD-ABCD-ABCD56789012';
    const identifier = CmgExcelUtils.Identifier.from(guid);
    expect(identifier).toBe('CMG_ABCD5678ABCDABCDABCDABCD56789012');
  });
  it('should handle GUIDs with curly braces', () => {
    const guid = '{12345678-1234-1234-1234-123456789012}';
    const identifier = CmgExcelUtils.Identifier.from(guid);
    expect(identifier).toBe('CMG_12345678123412341234123456789012');
  });
  it('should return a prefixed string even if input is not a valid GUID format', () => {
    const notAGuid = 'not-a-guid';
    const identifier = CmgExcelUtils.Identifier.from(notAGuid);
    expect(identifier).toBe('CMG_NOTAGUID');
  });
});

describe('Table', () => {
  let excelMock: OfficeMockObject;
  const mockHeaderRowRange = {
    values: [[]],
  };

  it('should create a table in Excel', async () => {
    const mockTable = {
      getHeaderRowRange: () => mockHeaderRowRange,
      load: jest.fn(),
      id: 'tableId',
      rows: {
        add: jest.fn(),
      },
    };
    const mockExcelCell = {
      load: jest.fn(),
      address: 'A1',
      worksheet: {
        tables: {
          add: jest.fn(() => mockTable),
        },
      },
    };
    const mockGetActiveWorksheet = {
      getCell: jest.fn(() => mockExcelCell),
    };

    excelMock = new OfficeMockObject({
      ...mockExcel,
      context: {
        ...mockExcel.context,
        workbook: {
          worksheets: {
            getActiveWorksheet: () => mockGetActiveWorksheet,
          },
        },
      },
    });
    global.Excel = excelMock as never;

    const columns = ['Column1', 'Column2'];
    const data = [{ Column1: 'Data1', Column2: 'Data2' }];
    const table = await CmgExcelUtils.Table.create(columns, data);
    expect(mockExcelCell.worksheet.tables.add).toHaveBeenCalledWith('A1:A1', true);
    expect(table.id).toBe('tableId');
  });

  it('should create a table with metadata in Excel', async () => {
    const mockTable = {
      getHeaderRowRange: jest.fn(() => mockHeaderRowRange),
      load: jest.fn(),
      id: 'tableId',
      rows: {
        add: jest.fn(),
      },
    };
    const mockExcelCell = {
      load: jest.fn(),
      address: 'A1',
      worksheet: {
        tables: {
          add: jest.fn(() => mockTable),
        },
      },
    };
    const mockGetActiveWorksheet = {
      getCell: jest.fn(() => mockExcelCell),
    };
    const mockGetItemOrNullObject = {
      load: jest.fn(),
      name: undefined,
    };
    const mockContext = {
      ...mockExcel.context,
      workbook: {
        names: {
          getItemOrNullObject: jest.fn(() => mockGetItemOrNullObject),
          add: jest.fn(),
        },
        worksheets: {
          getActiveWorksheet: jest.fn(() => mockGetActiveWorksheet),
        },
      },
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: mockContext,
    });
    global.Excel = excelMock as never;
    const metadata = 'SomeMetadata';
    await CmgExcelUtils.Table.create(['Column1', 'Column2'], [], metadata);
    expect(mockContext.workbook.names.add).toHaveBeenCalledWith('CMG_TABLEID', 'SomeMetadata');
  });

  it('should throw an error when excels throw and error', async () => {
    const mockExcelCell = {
      load: jest.fn(),
      address: 'A1',
      worksheet: {
        tables: {
          add: jest.fn(() => {
            throw new Error('Table overlaps with another table.');
          }),
        },
      },
    };
    const mockGetActiveWorksheet = {
      getCell: () => mockExcelCell,
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: {
        ...mockExcel.context,
        workbook: {
          worksheets: {
            getActiveWorksheet: () => mockGetActiveWorksheet,
          },
        },
      },
    });
    global.Excel = excelMock as never;
    await expect(CmgExcelUtils.Table.create(['Column1'], [])).rejects.toThrow(
      'Table overlaps with another table.'
    );
  });
});

describe('NameManager', () => {
  it('should save data to Excel name manager', async () => {
    const mockName = {
      load: jest.fn(),
      name: undefined,
      delete: jest.fn(),
    };
    const contextMock = {
      ...mockExcel.context,
      workbook: {
        names: {
          getItemOrNullObject: () => mockName,
          add: jest.fn(),
        },
      },
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: contextMock,
    });
    global.Excel = excelMock as never;
    await CmgExcelUtils.NameManager.save('testKey', 'testValue');
    expect(contextMock.workbook.names.add).toHaveBeenCalledWith('testKey', 'testValue');
  });

  it('should throw an error when excels throw and error at saving name', async () => {
    const mockName = {
      load: jest.fn(),
      name: undefined,
      delete: jest.fn(),
    };
    const contextMock = {
      ...mockExcel.context,
      workbook: {
        names: {
          getItemOrNullObject: () => mockName,
          add: jest.fn(() => {
            throw new Error('Cannot save name.');
          }),
        },
      },
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: contextMock,
    });
    global.Excel = excelMock as never;
    await expect(CmgExcelUtils.NameManager.save('testKey', 'testValue')).rejects.toThrow(
      'Cannot save name.'
    );
  });

  it('should delete data from Excel name manager', async () => {
    const mockName = {
      load: jest.fn(),
      name: 'testKey',
      delete: jest.fn(),
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: {
        ...mockExcel.context,
        workbook: {
          names: {
            getItemOrNullObject: () => mockName,
            add: jest.fn(),
          },
        },
      },
    });
    global.Excel = excelMock as never;
    await CmgExcelUtils.NameManager.delete('testKey');
    expect(mockName.delete).toHaveBeenCalled();
  });

  it('should not delete if name does not exist in Excel name manager', async () => {
    const mockName = {
      load: jest.fn(),
      name: undefined,
      delete: jest.fn(),
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: {
        ...mockExcel.context,
        workbook: {
          names: {
            getItemOrNullObject: () => mockName,
          },
        },
      },
    });
    global.Excel = excelMock as never;
    await CmgExcelUtils.NameManager.delete('nonExistentKey');
    expect(mockName.delete).not.toHaveBeenCalled();
  });

  it('should throw an error when excels throw and error at deleting name', async () => {
    const mockName = {
      load: jest.fn(),
      name: 'nameMock',
      delete: jest.fn(() => {
        throw new Error('Cannot delete name.');
      }),
    };
    const excelMock = new OfficeMockObject({
      ...mockExcel,
      context: {
        ...mockExcel.context,
        workbook: {
          names: {
            getItemOrNullObject: () => mockName,
          },
        },
      },
    });
    global.Excel = excelMock as never;
    await expect(CmgExcelUtils.NameManager.delete('nonExistentKey')).rejects.toThrow(
      'Cannot delete name.'
    );
  });
});
