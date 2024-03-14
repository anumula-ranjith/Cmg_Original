import React from 'react';
import { Route } from 'react-router-dom';
import Support from './Support';

export const SupportRoute = () => {
  return <Route exact path="/Support" component={Support} />;
};
