import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';

// store global info of the
// logged in user and room
// used to help keep state and
// cut down on server calls
window.YAWB = {
  user:{},
  room:{},
  fbRef:null
};

ReactDOM.render(
  <Main/>,
  document.getElementById('app')
)
