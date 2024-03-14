import React from 'react';

import type { TableInfo } from '../../../hooks/useSelectedTable';

type Props = Readonly<{
  table: TableInfo;
  items: string[];
  selectedItems: string[];
  loading: boolean;
  onUpdate: (columns: string[], rowCount: number) => void;
}>;

// This code will be implemented in future tickets, needs to do cleanup and use design system
const EditForm: React.FC<Props> = () => {
  return <div>Un-implemented</div>;
  // const [rowCount, setRowCount] = useState<number | null>(table.rowCount);
  // const [columns, setColumns] = useState<string[]>(selectedItems);

  // useEffect(() => {
  //   setRowCount(table.rowCount);
  //   setColumns(selectedItems);
  // }, [selectedItems, table]);

  // const onRowsChange = useCallback((value: string) => {
  //   value.length > 0 ? setRowCount(parseInt(value)) : setRowCount(null);
  // }, []);

  // const onSelectColumnsChange = useCallback((items: string[]) => setColumns(items), [setColumns]);

  // return (
  //   <div>
  //     <Typography variant="h5" sx={{ marginBottom: '15px' }}>
  //       Source: {table.source}
  //     </Typography>
  //     <TextField
  //       variant="outlined"
  //       label="Rows"
  //       type="number"
  //       value={rowCount}
  //       onChange={e => onRowsChange(e.target.value)}
  //       style={{ marginBottom: '16px', marginTop: '10px', width: '100%' }}
  //     />
  //     <SelectableList
  //       items={items}
  //       defaultItems={selectedItems}
  //       onChange={onSelectColumnsChange}
  //       filterText=""
  //       showOnlySelected={false}
  //     />
  //     <Box
  //       flex={1}
  //       display="flex"
  //       flexDirection="row"
  //       justifyContent="space-between"
  //       mt={2}
  //       gap={2}
  //     >
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         style={{
  //           marginTop: '20px',
  //           backgroundColor: '#1976D2',
  //           color: 'white',
  //           textTransform: 'none',
  //         }}
  //         onClick={() => rowCount && onUpdate(columns, rowCount)}
  //         disabled={!rowCount}
  //         endIcon={loading ? <CircularProgress size="20px" color="inherit" /> : null}
  //         fullWidth
  //       >
  //         Update Report
  //       </Button>
  //     </Box>
  //   </div>
  // );
};

export default EditForm;
