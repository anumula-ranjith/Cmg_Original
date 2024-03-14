import React, { useCallback, useState } from 'react';
import { type TableInfo, useSelectedTable } from '../../hooks/useSelectedTable';
import ToolBar from '../toolbar/Toolbar';
import * as yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import FilterForm from './components/FilterForm';
import ColumnForm from './components/ColumnForm';
import useCreateTable from '../../components/table/hooks/useCreateTable';
import { formWhereClause } from './components/CommonFilterOptions';
import { useSchema } from '../../../client/graphql/instrospection/useSchema';
import LoadingPopup from './components/LoadingPopup';
import { Box, Container, Stack } from '@mui/material';

const createReportSchema = yup.object().shape({
  startDate: yup.string().required('Start Date is required'),
  minGrossProceeds: yup.number().nullable().min(0, 'Minimum value should be 0 or greater'),
  maxGrossProceeds: yup.number().nullable().max(1e6, 'Maximum value should be 1 trillion or less'),
  minMarketCap: yup.number().nullable().min(0, 'Minimum value should be 0 or greater'),
  maxMarketCap: yup.number().nullable().max(1e6, 'Maximum value should be 1 trillion or less'),
});

const TableScreen = ({ onCreated }) => {
  const { loading, createTable } = useCreateTable({ source: 'offerings', onCreated });
  const [step, setStep] = useState(1);
  const { schema } = useSchema();

  const { setTableInfo } = useSelectedTable();
  const onTableCreated = useCallback(
    (tableInfo: TableInfo) => setTableInfo(tableInfo),
    [setTableInfo]
  );

  type CreateReport = {
    startDate: Date | null;
    endDate: Date | null;
    region: string[] | null;
    offeringType: string[] | null;
    sector: string[] | null;
    minGrossProceeds: number | null;
    maxGrossProceeds: number | null;
    minMarketCap: number | null;
    maxMarketCap: number | null;
    searchPattern: string;
    selectedColumns: string[];
  };

  const formik = useFormik<CreateReport>({
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    validationSchema: createReportSchema,
    initialValues: {
      startDate: null,
      endDate: null,
      region: [],
      offeringType: [],
      sector: [],
      minGrossProceeds: null,
      maxGrossProceeds: null,
      minMarketCap: null,
      maxMarketCap: null,
      searchPattern: '',
      selectedColumns: ['id', 'pricingDate'],
    },
    onSubmit: async values => {
      try {
        const filters = formWhereClause(values, schema);
        await createTable(values.selectedColumns, 5000, filters);
      } catch (error) {}
    },
  });

  const handleNext = async () => {
    try {
      const allTouched = Object.keys(formik.values).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});

      formik.setTouched(allTouched);

      formik.validateForm().then(errors => {
        if (Object.keys(errors).length === 0) {
          setStep(prevStep => prevStep + 1);
        } else {
          console.log('Validation failed. Please fix the errors.');
        }
      });
    } catch (error) {
      console.error('Error during validation:', error);
    }
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <ToolBar title="Create Report" />
      <Container>
        <FormikProvider value={formik}>
          <Form>
            {step === 1 ? (
              <FilterForm onCreated={onTableCreated} handleNext={handleNext} formik={formik} />
            ) : (
              <ColumnForm onCreated={onTableCreated} handleBack={handleBack} formik={formik} />
            )}
            <LoadingPopup open={loading} progress={100} />
          </Form>
        </FormikProvider>
      </Container>
    </Box>
  );
};

export default TableScreen;
