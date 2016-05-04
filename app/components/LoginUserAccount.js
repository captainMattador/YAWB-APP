import React from 'react';
import { hashHistory } from 'react-router';

class LoginUserAccount extends React.Component {

  constructor(){
    super();
    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.fbRef = new Firebase(this.firebaseBaseUrl);
  }

  loginHandler(){
  }

  componentDidMount(){

    // function authHandler(error, authData) {
    //   if (error) {
    //     console.log("Login Failed!", error);
    //   } else {
    //     console.log("Authenticated successfully with payload:", authData);
    //   }
    // }
    //
    // this.fbRef.authWithPassword({
    //   email    : 'mattbozelka.dev@gmail.com',
    //   password : '1234'
    // }, authHandler);
  }

  createAccountHandler(){
    hashHistory.push('create-account');
  }

  render(){
    return (
      <div className="entry">
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Login or Create an Account</h2>
              <form onSubmit={(e) => this.loginHandler(e)}>
                <input
                  type="email"
                  name="email"
                  placeholder="User Email"
                  ref="email" />
                  <br/><br/><br/>
                <input
                  type="password"
                  name="pw"
                  placeholder="User Password"
                  ref="pw" />
                  <br/><br/><br/>
                <input
                  type="submit"
                  name="formSubmit"
                  value="Log in"/>
              </form>
              <p><em>-or-</em></p>
              <button
                className="cta-btn secondary"
                onClick={(e) => this.createAccountHandler()}>Create an Account</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default LoginScreen;
