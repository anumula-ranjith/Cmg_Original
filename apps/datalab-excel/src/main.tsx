import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

// TODO - add routes for /commands, /taskpane, /functions -- and remove html files

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
