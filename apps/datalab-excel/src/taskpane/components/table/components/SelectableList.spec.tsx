// import { DesignSystemProvider } from '@cmg/design-system';
import type { RenderOptions } from '@testing-library/react';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import SelectableList from './SelectableList';

describe('SelectableList', () => {
  const mockOnChange = jest.fn();
  // const wrapper: RenderOptions['wrapper'] = ({ children }) => (
  //   <DesignSystemProvider>{children}</DesignSystemProvider>
  // );
  const wrapper: RenderOptions['wrapper'] = ({ children }) => (
    <React.Fragment>{children}</React.Fragment>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default items', () => {
    const items = ['item1', 'item2', 'item3'];
    const defaultItems = ['item1', 'item2'];
    render(
      <SelectableList
        items={items}
        defaultItems={defaultItems}
        filterText=""
        showOnlySelected={false}
        onChange={mockOnChange}
      />,
      { wrapper }
    );
    expect(mockOnChange).toHaveBeenCalledWith(defaultItems);
  });

  it('should handle unselect all', () => {
    const items = ['item1', 'item2', 'item3'];
    const { getByText } = render(
      <SelectableList
        items={items}
        filterText=""
        showOnlySelected={false}
        onChange={mockOnChange}
      />,
      { wrapper }
    );
    fireEvent.click(getByText('Unselect All'));
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it('should filter items based on filterText', () => {
    const items = ['apple', 'banana', 'cherry'];
    const filterText = 'app';
    const { queryByText } = render(
      <SelectableList
        items={items}
        filterText={filterText}
        showOnlySelected={false}
        onChange={mockOnChange}
      />,
      { wrapper }
    );
    expect(queryByText('apple')).not.toBeNull();
    expect(queryByText('banana')).toBeNull();
    expect(queryByText('cherry')).toBeNull();
  });

  it('should shows only selected items when showOnlySelected is true', () => {
    const items = ['apple', 'banana', 'cherry'];
    const defaultItems = ['apple', 'banana'];
    const { queryByText } = render(
      <SelectableList
        items={items}
        defaultItems={defaultItems}
        filterText=""
        showOnlySelected={true}
        onChange={mockOnChange}
      />,
      { wrapper }
    );
    expect(queryByText('apple')).not.toBeNull();
    expect(queryByText('banana')).not.toBeNull();
    expect(queryByText('cherry')).toBeNull();
  });
});
