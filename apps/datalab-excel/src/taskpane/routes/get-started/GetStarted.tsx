import { useSchema } from '../../../client/graphql/instrospection/useSchema';
import { Button, Typography, Box, Grid } from '@mui/material';
import logo from '../../../assets/logo.png';
import { useHistory } from 'react-router-dom';

const GetStarted = () => {
  const { schema, loading } = useSchema();
  const history = useHistory();
  const handleGetStarted = () => {
    if (!schema) {
      history.push('/AuthenticateScreen');
    } else {
      history.push('/TableScreenGlobal');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Grid container justifyContent="center" xs={10} sm={8} rowSpacing={1}>
        <Grid item xs={12}>
          <Box
            sx={{ textAlign: 'center', backgroundColor: '#2b3e59', borderRadius: 2, padding: 1 }}
          >
            <img src={logo} alt="Logo" />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h6" component="h1">
              Elevate analytics and reports with CMG data
            </Typography>
            <Typography variant="body1">
              <ul>
                <li>Optimize financial model with the premier source of ECM data</li>
                <li>Efficiently design customized reports</li>
                <li>Easily query hundreds of offering-specific data fields</li>
              </ul>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleGetStarted}
            disabled={loading}
          >
            Get Started
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GetStarted;
