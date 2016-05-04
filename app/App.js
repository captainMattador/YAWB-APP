import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import globals from './config/globals';
import routes from './config/routes';

/*
  two semi hackish ways around issues
  location has forces the app to the root

  and yawb sets a global object that can be
  used anywhere in the app
*/
location.hash = '';
window.yawb = globals;

ReactDOM.render(
  <Router>{routes}</Router>,
  document.getElementById('app')
)
