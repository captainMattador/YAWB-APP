import React from 'react';
import { hashHistory } from 'react-router';

class EntryCheck extends React.Component {

  // var authData = this.fbRef.getAuth();
  // if (authData) {
  //   console.log("User ", authData);
  // } else {
  //   console.log("User is logged out");
  // }

  constructor(){
    super();
    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.fbRef = new Firebase(this.firebaseBaseUrl);
  }
  render(){
    return (
      <h1>Nothing to render. Will just do inital check to see if user is already logged in</h1>
    )
  }

}

export default EntryCheck;
