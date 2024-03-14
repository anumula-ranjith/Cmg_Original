import { HashRouter, Route, Switch } from 'react-router-dom';
import { AuthenticateScreenRoute } from '../routes/authenticate/AuthenticateRoute';
import { TableScreenGlobalRoute } from '../routes/table-builder/TableBuilderRoute';
import { SupportRoute } from '../routes/toolbar/ToolBarRoute';
import GetStarted from '../routes/get-started/GetStarted';
import { Box, Container } from '@mui/material';

const Taskpane = () => {
  return (
    <Container sx={{ height: '100vh', backgroundColor: '#fff' }} disableGutters>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={GetStarted} />
          {AuthenticateScreenRoute()}
          {TableScreenGlobalRoute()}
          {SupportRoute()}
        </Switch>
      </HashRouter>
    </Container>
  );
};

export default Taskpane;
