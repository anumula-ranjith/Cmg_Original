import { Box, Checkbox, Link, List, ListItem, ListItemText } from '@mui/material';
import type { MouseEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Props = Readonly<{
  items: string[];
  filterText: string;
  showOnlySelected: boolean;
  onChange: (items: string[]) => void;
}>;

type SelectableItemProps = {
  item: string;
  isSelected: boolean;
  onToggle: (item: string) => void;
};

export const formatItemName = (itemName: string): string => {
  const segments = itemName.split('.');
  const formattedSegments = segments.map(segment => {
    const formattedSegment = segment.replace(/([a-z])([A-Z])/g, '$1 $2');
    return formattedSegment.charAt(0).toUpperCase() + formattedSegment.slice(1);
  });
  return formattedSegments.join(' - ');
};

const SelectableItem: React.FC<SelectableItemProps> = ({ item, isSelected, onToggle }) => {
  const formattedName = useMemo(() => formatItemName(item), [item]);

  const handleClickList = useCallback(() => {
    onToggle(item);
  }, [item, onToggle]);

  return (
    <ListItem button onClick={handleClickList}>
      <Checkbox edge="start" checked={isSelected} />
      <ListItemText primary={formattedName} />
    </ListItem>
  );
};

const MemoizedSelectableItem = React.memo(SelectableItem);
const listStyle = {
  width: '100%',
  maxHeight: '500px',
  overflow: 'auto',
};
const SelectableList: React.FC<Props> = ({ items, filterText, showOnlySelected, onChange }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    () => new Set(['id', 'pricingDate'])
  );

  useEffect(() => {
    setSelectedItems(prevSelected => new Set(prevSelected).add('id').add('pricingDate'));
  }, [items]);

  const handleToggle = useCallback(
    (value: string) => {
      setSelectedItems(prevSelected => {
        const newSelected = new Set(prevSelected);
        if (value === 'pricingDate' || value === 'id') {
          if (!newSelected.has(value)) {
            newSelected.add(value);
          }
        } else {
          if (newSelected.has(value)) {
            newSelected.delete(value);
          } else {
            newSelected.add(value);
          }
        }
        onChange(Array.from(newSelected));
        return newSelected;
      });
    },
    [onChange]
  );

  const filteredItems = useMemo(() => {
    let filtered = items;
    const defaultColumns = ['id', 'pricingDate'];
    const defaultColumnsSet = new Set(defaultColumns);
    filtered.sort((a, b) => {
      const aIsDefault = defaultColumnsSet.has(a);
      const bIsDefault = defaultColumnsSet.has(b);
      if (a === 'id') return -1;
      if (b === 'id') return 1;
      if (aIsDefault && !bIsDefault) return -1;
      if (!aIsDefault && bIsDefault) return 1;
      return 0;
    });
    if (filterText.trim() !== '') {
      filtered = filtered.filter(item => item.toLowerCase().includes(filterText.toLowerCase()));
    }
    if (showOnlySelected) {
      filtered = filtered.filter(item => selectedItems.has(item));
    }
    return filtered;
  }, [filterText, items, showOnlySelected, selectedItems]);
  const handleUnselectAll = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setSelectedItems(new Set());
      onChange([]);
    },
    [onChange]
  );

  const handleSelectAll = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setSelectedItems(new Set(items));
      onChange(items);
    },
    [items, onChange]
  );
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href="#" onClick={handleUnselectAll}>
          Unselect All
        </Link>
        {!showOnlySelected && (
          <Link href="#" onClick={handleSelectAll}>
            Select All
          </Link>
        )}
      </Box>
      <List sx={listStyle}>
        {filteredItems.map(item => (
          <MemoizedSelectableItem
            key={`select_${item}`}
            item={item}
            isSelected={selectedItems.has(item)}
            onToggle={() => handleToggle(item)}
          />
        ))}
      </List>
    </React.Fragment>
  );
};
export default SelectableList;
