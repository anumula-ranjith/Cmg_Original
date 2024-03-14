import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  TextField,
  Button,
  Alert,
  Grid,
  Stack,
} from '@mui/material';
import { Formik, FormikProvider, useFormik, Form, Field } from 'formik';
import * as yup from 'yup';
import cmgIcon64 from '../../assets/cmg-icon-64x64.png';
import { useAuth } from '../../../auth/useAuth';
import { useSchema } from '../../../client/graphql/instrospection/useSchema';
import { SelectedTableProvider } from '../../hooks/useSelectedTable';
import { useHistory } from 'react-router-dom';

type Authenticate = {
  subdomain: string;
  authToken: string;
};

export const AuthenticateSchema = yup.object().shape({
  authToken: yup.string().required('Auth token is required'),
  subdomain: yup.string().required('Sub Domain is required'),
});

const AuthenticateScreen = () => {
  const history = useHistory();
  const { schema } = useSchema();
  const { saveApiKey, saveSubDomain } = useAuth();
  const { error, loading: instrospectionLoading } = useSchema();

  const formik = useFormik<Authenticate>({
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    validationSchema: AuthenticateSchema,
    initialValues: {
      subdomain: '',
      authToken: '',
    },
    onSubmit: values => {
      values.authToken && saveApiKey(values.authToken);
      values.subdomain && saveSubDomain(values.subdomain);

      if (schema) {
        history.push('/TableScreenGlobal');
      }
    },
  });

  const { submitForm } = formik;

  return (
    <SelectedTableProvider>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Grid container xs={10} sm={8}>
          <FormikProvider value={formik}>
            <Form>
              <Typography variant="h6" component="h1" gutterBottom>
                Enter your CMG API Key and Subdomain
              </Typography>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    required
                    name="subdomain"
                    render={({ field }) => (
                      <TextField {...field} label="Sub Domain" variant="outlined" fullWidth />
                    )}
                  />
                  {formik.touched.subdomain && formik.errors.subdomain && (
                    <Alert severity="error">{formik.errors.subdomain}</Alert>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Field
                    required
                    name="authToken"
                    render={({ field }) => (
                      <TextField {...field} label="API Key" variant="outlined" fullWidth />
                    )}
                  />
                  {formik.touched.authToken && formik.errors.authToken && (
                    <Alert severity="error">{formik.errors.authToken}</Alert>
                  )}
                  {/* Add other validation messages as needed */}
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={() => {void submitForm();}}>
                    Authenticate
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
          <Typography variant="body1" align="left" mt={2}>
            Have questions or need assistance? Contact{' '}
            <a href="mailto:support@cmgx.io">support@cmgx.io</a>
          </Typography>
        </Grid>
      </Box>
    </SelectedTableProvider>
  );
};
export default AuthenticateScreen;
