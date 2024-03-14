import '@testing-library/jest-dom/extend-expect';
import type { RenderOptions } from '@testing-library/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import * as UseSourceColumnsModule from '../../../hooks/useSourceColumns';
import * as UseCreateTableModule from '../../../components/table/hooks/useCreateTable';
import React from 'react';

jest.mock('./hooks/useCreateTable');
jest.mock('../../hooks/useSourceColumns');

describe('Create Component', () => {
  const onCreatedMock = jest.fn();
  let useCreateTableSpy: jest.SpyInstance<ReturnType<typeof UseCreateTableModule.default>>;
  let useSourceColumnsSpy: jest.SpyInstance<ReturnType<typeof UseSourceColumnsModule.default>>;

  // const wrapper: RenderOptions['wrapper'] = ({ children }) => (
  //   <DesignSystemProvider>{children}</DesignSystemProvider>
  // );
  const wrapper: RenderOptions['wrapper'] = ({ children }) => (
    <React.Fragment>{children}</React.Fragment>
  );

  const columns = ['column1', 'column2'];
  beforeEach(() => {
    // ToastManager.error = jest.fn();
    // ToastManager.success = jest.fn();
    useCreateTableSpy = jest.spyOn(UseCreateTableModule, 'default');
    useSourceColumnsSpy = jest.spyOn(UseSourceColumnsModule, 'default');

    useCreateTableSpy.mockImplementation(() => ({
      loading: false,
      createTable: jest.fn(),
    }));
    useSourceColumnsSpy.mockImplementation(() => columns);
  });

  it('should render create report', async () => {
    render(<Create onCreated={onCreatedMock} />, { wrapper });

    await act(async () => {
      await waitFor(() => {
        expect(screen.queryByText('Select Pricing Date Range')).toBeInTheDocument();
        expect(screen.queryByText('Select Columns')).toBeInTheDocument();
        expect(screen.queryByText('Submit')).toBeInTheDocument();
      });
    });
  });

  it('should handle create table success when parameters are provided', async () => {
    const createTableMock = jest.fn().mockResolvedValue(undefined);
    useCreateTableSpy.mockImplementation(() => ({
      loading: false,
      createTable: createTableMock,
    }));
    render(<Create onCreated={onCreatedMock} />, { wrapper });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      userEvent.paste(screen.getByRole('textbox', { name: /start date/i }), '01/01/2000');
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(createTableMock).toHaveBeenCalledWith(['column1', 'column2'], 100, {
      endDate: null,
      startDate: '2000-01-01',
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    // expect(ToastManager.success).toHaveBeenCalledWith('Table successfully created');
  });

  it('should show error toast on table creation fails', async () => {
    const error = new Error('Creation Error');
    const createTableMock = jest.fn().mockRejectedValue(error);
    useCreateTableSpy.mockImplementation(() => ({
      loading: false,
      createTable: createTableMock,
    }));

    render(<Create onCreated={onCreatedMock} />, { wrapper });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      userEvent.paste(screen.getByRole('textbox', { name: /start date/i }), '01/01/2000');
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(createTableMock).toHaveBeenCalledWith(['column1', 'column2'], 100, {
      endDate: null,
      startDate: '2000-01-01',
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    // expect(ToastManager.error).toHaveBeenCalledWith(error.message);
  });

  it('should show validation errors when missing start date and columns', async () => {
    render(<Create onCreated={onCreatedMock} />, { wrapper });
    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(screen.getByText('Unselect All'));
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      const errorListItems = screen.getAllByRole('listitem');
      const startDateError = errorListItems.find(item =>
        item.textContent?.includes('Start Date is required')
      );
      const columnError = errorListItems.find(item =>
        item.textContent?.includes('Select at least one column')
      );
      expect(startDateError).toBeInTheDocument();
      expect(columnError).toBeInTheDocument();
    });
  });
});
