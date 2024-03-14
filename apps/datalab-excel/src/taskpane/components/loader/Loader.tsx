import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';

const pageLoaderStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  pointerEvents: 'all',
};

const PageLoader: React.FC = () => {
  return (
    <Box sx={pageLoaderStyle}>
      <CircularProgress />
      <Box pl={2}>Loading</Box>
    </Box>
  );
};

export const Loading: React.FC = () => {
  return <CircularProgress size={20} />;
};

export default PageLoader;
