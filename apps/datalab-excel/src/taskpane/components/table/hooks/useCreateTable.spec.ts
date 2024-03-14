import { act, renderHook } from '@testing-library/react-hooks';
import type { GraphQLSchema } from 'graphql';

import * as authModule from '../../../../auth/useAuth';
import * as clientModule from '../../../../client/graphql/client';
import * as useSchemaModule from '../../../../client/graphql/instrospection/useSchema';
import CmgExcelUtils from '../../../../excel/utils';
import useCreateTable from './useCreateTable';

jest.mock('../../../../auth/useAuth');
jest.mock('../../../../client/graphql/instrospection/useSchema');
jest.mock('../../../../client/graphql/client');
jest.mock('../../../../excel/utils');

describe('useCreateTable hook', () => {
  const onCreatedMock = jest.fn();
  const mockApiKey = 'testApiKey';
  const mockSchema = {} as GraphQLSchema;
  const mockData = { items: [] };
  const mockExcelTable: Partial<Excel.Table> = {
    id: 'testTableId',
  };

  let useAuthSpy: jest.SpyInstance<ReturnType<typeof authModule.useAuth>>;
  let useSchemaSpy: jest.SpyInstance<ReturnType<typeof useSchemaModule.useSchema>>;
  let fetchGraphqlDataSpy: jest.SpyInstance<ReturnType<typeof clientModule.fetchGraphqlData>>;
  let createTableSpy: jest.SpyInstance<ReturnType<typeof CmgExcelUtils.Table.create>>;

  beforeEach(() => {
    useAuthSpy = jest.spyOn(authModule, 'useAuth');
    useSchemaSpy = jest.spyOn(useSchemaModule, 'useSchema');
    fetchGraphqlDataSpy = jest.spyOn(clientModule, 'fetchGraphqlData');
    createTableSpy = jest.spyOn(CmgExcelUtils.Table, 'create');
    useAuthSpy.mockReturnValue({
      apiKey: mockApiKey,
      saveApiKey: jest.fn(),
      resetAuth: jest.fn(),
    });
    useSchemaSpy.mockReturnValue({
      schema: mockSchema,
      error: null,
      loading: false,
    });
    fetchGraphqlDataSpy.mockResolvedValue(mockData);
    createTableSpy.mockImplementation(jest.fn().mockResolvedValue(mockExcelTable));
  });

  it('should call onCreated with table info after creating table', async () => {
    const source = 'testSource';
    const { result } = renderHook(() => useCreateTable({ source, onCreated: onCreatedMock }));
    await act(async () => {
      await result.current.createTable(['column1'], 10);
    });
    expect(onCreatedMock).toHaveBeenCalledWith({
      columns: ['column1'],
      id: 'testTableId',
      rowCount: 10,
      source: 'testSource',
    });
    expect(result.current.loading).toBe(false);
  });

  it('should not create table if schema, source, or apiKey is missing', async () => {
    useAuthSpy.mockReturnValue({
      apiKey: null,
      saveApiKey: jest.fn(),
      resetAuth: jest.fn(),
    });
    const source = 'testSource';
    const { result } = renderHook(() => useCreateTable({ source, onCreated: onCreatedMock }));
    await act(async () => {
      await result.current.createTable(['column1'], 10);
    });
    expect(onCreatedMock).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('should handle errors during table creation', async () => {
    fetchGraphqlDataSpy.mockRejectedValue(new Error('Test error'));

    const source = 'testSource';
    const { result } = renderHook(() => useCreateTable({ source, onCreated: onCreatedMock }));
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      await expect(result.current.createTable(['column1'], 10)).rejects.toThrow('Test error');
    });
    expect(onCreatedMock).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const source = 'testSource';
    const { unmount } = renderHook(() => useCreateTable({ source, onCreated: onCreatedMock }));
    expect(() => {
      act(() => {
        unmount();
      });
    }).not.toThrow();
  });
});
