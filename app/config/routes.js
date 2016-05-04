
// react specific imports
import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

// compontent specific routes
import Main from '../components/Main';
import EntryCheck from '../components/EntryCheck';
import LoginUserAccount from '../components/LoginUserAccount';
import CreateUserAccount from '../components/CreateUserAccount';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={Main}>
      <Route path="login-account" component={LoginUserAccount} />
      <Route path="create-account" component={CreateUserAccount} />
      <IndexRoute component={EntryCheck} />
    </Route>
  </Router>
);
