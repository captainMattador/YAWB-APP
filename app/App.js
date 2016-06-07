
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';

/**
 * YAWB is a global object that holds important
 * values for the logged in user and the room the
 * user is using. Object can be accessed anywhere 
 * in the app.
 */

window.YAWB = {
  user:{},
  room:{},
  fbRef:null
};

ReactDOM.render(
  <Main/>,
  document.getElementById('app')
)
