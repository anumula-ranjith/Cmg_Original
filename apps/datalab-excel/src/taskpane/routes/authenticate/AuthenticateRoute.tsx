import React from 'react';
import { Route } from 'react-router-dom';
import AuthenticateScreen from './AuthenticateScreen';


export const AuthenticateScreenRoute = () => {
  return <Route path="/AuthenticateScreen" component={AuthenticateScreen} />;
};
