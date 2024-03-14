import React, { useCallback, useState } from 'react';
import {
  Button,
  Divider,
  Stack,
  Typography,
  TextField,
  Box,
  Container,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import { FormikProvider } from 'formik';
import LoadingPopup from './LoadingPopup';
import useCreateTable from '../../../components/table/hooks/useCreateTable';
import useSourceColumns from '../../../hooks/useSourceColumns';
import SelectableList from '../../../components/table/components/SelectableList';
import FormikErrors from '../../../components/formik/FormikErrors';
import type { TableInfo } from '../../../hooks/useSelectedTable';

type Props = Readonly<{
  onCreated: (tableInfo: TableInfo) => void;
  handleBack : any;
  formik: any;
}>;

const source = 'offerings';

const fullWidth = { width: '100%' };

const ColumnForm: React.FC<Props> = ({ onCreated,handleBack,formik }) => {
  const { submitForm, setFieldValue } = formik;
  const { loading } = useCreateTable({ source: 'offerings', onCreated });
  const onSelectColumnsChange = useCallback(
    (items: string[]) => void setFieldValue('selectedColumns', items),
    [setFieldValue]
  );
  const sourceColumns: string[] = useSourceColumns(source);
  const [selectedItems, setSelectedItems] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue) => {
    setSelectedTab(newValue);
    setSelectedItems(newValue === 1);
  };

  return (
    <FormikProvider value={formik}>
      <Box>
        <FormikErrors />
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary">
          <Tab label="All" onClick={() => setSelectedItems(false)} />
          <Tab label="Selected" onClick={() => setSelectedItems(true)} />
        </Tabs>
        <Box sx={fullWidth} mt={2}>
          <TextField
            name="searchPattern"
            label="Search"
            fullWidth
            value={formik.values.searchPattern}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Box>
      </Box>
      <Box>
        <SelectableList
          items={sourceColumns}
          onChange={onSelectColumnsChange}
          filterText={formik.values.searchPattern}
          showOnlySelected={selectedItems}
        />
      </Box>
      <Box>
        <Divider />
        <Stack spacing={2} direction="row" mt={2} justifyContent="space-between">
        <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              void submitForm();
            }}
            disabled={loading}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </FormikProvider>
  );
};

export default ColumnForm;
