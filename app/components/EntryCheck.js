import React from 'react';
import globals from '../config/globals'

class EntryCheck extends React.Component {

  constructor(){
    super();
    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.fbRef = new Firebase(this.firebaseBaseUrl);
  }
  
  componentDidMount(){
    var authData = this.fbRef.getAuth();
    if (authData) {
      
      // user us still authenticated
      // assign their UID to the globals
      // and send them to their user home
      // page
      console.log(authData);
      window.yawb = globals;
      window.yawb.user = authData.uid;
      
      // go to user home
    } else {
      
      // no user logged in so go to the loggin page

    }
  }
  
  render(){
    return (
      <h1>Nothing to render. Will just do inital check to see if user is already logged in</h1>
    )
  }

}

export default EntryCheck;
