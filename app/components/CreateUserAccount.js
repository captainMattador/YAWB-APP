import React from 'react';
import { hashHistory } from 'react-router';
import Firebase from 'firebase';
import Form from './FormComponents/Form';
import Input from './FormComponents/Input';

class CreateUserAccount extends React.Component {

  constructor(){
    super();
    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.fbRef = new Firebase(this.firebaseBaseUrl);
    this.state = {
      message: '',
    };
    this.createAccountHandler = this.createAccountHandler.bind(this);
    this.formVals = {};
  }

  componentDidMount(){
  }

  // account was valid
  createAccountHandler(vals){
    this.formVals = vals;
    this.fbRef.createUser({
      email : this.formVals.email,
      password : this.formVals.password
    }, this.createAccountCallBack.bind(this));
  }

  createAccountCallBack(error, userData){
    if (error) {
      this.setErrorMsg('This email address is already in use.');
      return;
    }

    var self = this,
        postsUser = this.fbRef.child("Users").child(userData.uid);
    postsUser.set({
      fname: this.formVals.fname,
      lname: this.formVals.lname,
      email: this.formVals.email,
      uid: userData.uid
    });
  }

  setErrorMsg(msg){
    this.setState({message: msg});
  }

  backHandler(e){
    e.preventDefault();
    hashHistory.push('/');
  }

  render(){
    var formElems = [
      <Input key="fname" name="fname" type="text" placeholder="First name" required={true}/>,
      <Input key="lname" name="lname" type="text" placeholder="Last name" required={true}/>,
      <Input key="email" name="email" type="email" placeholder="Email" validType="email" required={true}/>,
      <Input key="password" name="password" type="password" placeholder="Password" required={true}/>,
      <Input key="passwordmatch" name="passwordmatch" type="password" placeholder="Confirm Password" validType="match" mustMatch="password" required={true}/>];
    return (
      <div className="ceate-account">
        <h1>Create an account</h1>
        <Form
          className="form"
          submitVal="Create Account"
          formElems={formElems}
          onSubmit={this.createAccountHandler}/>
        <button
          className="cta-btn"
          onClick={(e) => this.backHandler(e)}>Back</button>
        <p className="error">{this.state.message}</p>
      </div>
    )
  }
}

export default CreateUserAccount;
