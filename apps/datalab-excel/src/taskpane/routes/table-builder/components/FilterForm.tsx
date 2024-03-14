import { Button, Grid, Typography, TextField, Autocomplete, Alert, Checkbox } from '@mui/material';
import { Box } from '@mui/material';
import { FormikProvider } from 'formik';
import React, { useEffect, useState } from 'react';
import type { TableInfo } from '../../../hooks/useSelectedTable';
import { FormikDatePickerField } from '../../../components/formik/formik-date-picker-field/FormikDatePickerField';
import { GetOfferingTypeColumns, GetRegionColumns, GetSectorColumns } from './CommonFilterOptions';

const source = 'offerings';
type Props = Readonly<{
  onCreated: (tableInfo: TableInfo) => void;
  formik: any;
  handleNext: any;
}>;

const FilterForm: React.FC<Props> = ({ onCreated, formik, handleNext }) => {
  const sectorsColumns: string[] = GetSectorColumns();
  const regionColumns: string[] = GetRegionColumns();
  const offeringTypeColumns: string[] = GetOfferingTypeColumns();

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const defaultStartDate = `${currentYear}-01-01`;
    if (!formik.values.startDate) {
      formik.setFieldValue('startDate', defaultStartDate);
    }
  }, [formik.values.endDate]);

  return (
    <>
      <Box>
        <FormikProvider value={formik}>
          <Typography variant="h5" gutterBottom mt={1}>
            Select Filters
          </Typography>
          <Typography variant="body2" gutterBottom>
            Pricing Date Range
          </Typography>
          <Box display="flex" marginBottom="20px">
            <Grid container mt={2} columnSpacing={1}>
              <Grid item xs={6}>
                <FormikDatePickerField name="startDate" label="Start Date" required />
              </Grid>
              <Grid item xs={6}>
                <FormikDatePickerField name="endDate" label="End Date" required />
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="start" mt={2}></Box>
          <Box marginBottom="20px">
            <Autocomplete
              options={regionColumns}
              onChange={(event, value) => formik.setFieldValue('region', value)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Region"
                  sx={{ width: '300px', marginBottom: '10px' }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              multiple
            />
            <Autocomplete
              options={offeringTypeColumns}
              onChange={(event, value) => formik.setFieldValue('offeringType', value)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Offering Type"
                  sx={{ width: '300px', marginBottom: '10px' }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              multiple
            />
            <Autocomplete
              options={sectorsColumns}
              onChange={(event, value) => formik.setFieldValue('sector', value)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Sector"
                  sx={{ width: '300px', marginBottom: '20px' }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              multiple
            />
          </Box>

          <Typography variant="body2" gutterBottom>
            Gross Proceeds Total ($M)
          </Typography>
          <Box display="flex" marginBottom="20px">
            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Min Gross Proceeds"
                  variant="outlined"
                  value={formik.values.minGrossProceeds}
                  onChange={formik.handleChange}
                  name="minGrossProceeds"
                />
                {formik.touched.minGrossProceeds && formik.errors.minGrossProceeds && (
                  <Alert severity="error">{formik.errors.minGrossProceeds}</Alert>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Max Gross Proceeds"
                  variant="outlined"
                  value={formik.values.maxGrossProceeds}
                  onChange={formik.handleChange}
                  name="maxGrossProceeds"
                />
                {formik.touched.maxGrossProceeds && formik.errors.maxGrossProceeds && (
                  <Alert severity="error">{formik.errors.maxGrossProceeds}</Alert>
                )}
              </Grid>
            </Grid>
          </Box>
          <Typography variant="body2" gutterBottom>
            Market Cap ($M)
          </Typography>
          <Box display="flex" marginBottom="20px">
            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Min Market Cap"
                  variant="outlined"
                  value={formik.values.minMarketCap}
                  onChange={formik.handleChange}
                  name="minMarketCap"
                />
                {formik.touched.minMarketCap && formik.errors.minMarketCap && (
                  <Alert severity="error">{formik.errors.minMarketCap}</Alert>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="Max Market Cap"
                  variant="outlined"
                  value={formik.values.maxMarketCap}
                  onChange={formik.handleChange}
                  name="maxMarketCap"
                />
                {formik.touched.maxMarketCap && formik.errors.maxMarketCap && (
                  <Alert severity="error">{formik.errors.maxMarketCap}</Alert>
                )}
              </Grid>
            </Grid>
          </Box>
          <Box textAlign="right">
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </FormikProvider>
      </Box>
    </>
  );
};

export default FilterForm;
