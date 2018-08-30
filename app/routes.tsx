import * as React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import NetworkPage from './containers/NetworkPage'

export default () => (
  <App>
    <Switch>
      <Route path="/network" component={NetworkPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
