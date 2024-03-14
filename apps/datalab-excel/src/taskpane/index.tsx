import * as ReactDOM from 'react-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { ApiKeyProvider } from '../auth/useAuth';
import { IntrospectionProvider } from '../client/graphql/instrospection/useSchema';
import Taskpane from './components/Taskpane';
import { CssBaseline } from '@mui/material';

let isOfficeInitialized = false;

const render = () => {
  ReactDOM.render(
    <div>
      {isOfficeInitialized && (
        <ApiKeyProvider>
          <IntrospectionProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              <Taskpane />
            </LocalizationProvider>
          </IntrospectionProvider>
        </ApiKeyProvider>
      )}
    </div>,
    document.getElementById('container')
  );
};

/* Render application after Office initializes */
void Office.onReady(() => {
  isOfficeInitialized = true;
  try {
    render();
  } catch (err) {
    console.error(`error ocurred at rendering`);
  }
});
