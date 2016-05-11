import React from 'react';
import {updateRoute, loading, msg} from '../utils/CustomEvents';
import Input from './FormComponents/Input';
import {validateEmail} from '../utils/helpers';

class CreateUserAccount extends React.Component {

  constructor(){
    super();
    this.formVals = {};

    this.handleSubmit = this.handleSubmit.bind(this);
    this.blur = this.blur.bind(this);
    this.createAccountHandler = this.createAccountHandler.bind(this);
    this.backHandler = this.backHandler.bind(this);
  }

  // account was valid
  createAccountHandler(){
    loading(true);
    YAWB.fbRef.createUser({
      email : this.formVals.email,
      password : this.formVals.password
    }, this.createAccountCallBack.bind(this));
  }

  createAccountCallBack(error, userData){
    if (error) {
      loading(false);
      msg('Error', 'This email address is already in use.', true);
      return;
    }

    let self = this;
    let postsUser = YAWB.fbRef.child("Users").child(userData.uid);
    postsUser.set({
      fname: this.formVals.fname,
      lname: this.formVals.lname,
      email: this.formVals.email,
      uid: userData.uid
    });
    YAWB.fbRef.authWithPassword({
      email: this.formVals.email,
      password : this.formVals.password
    }, this.authWithPasswordCallback.bind(this));
  }

  authWithPasswordCallback(error, data){
    loading(false);
  }

  handleSubmit(e){
    e.preventDefault();
    let valid = this.validateForm();
    let vals = {};

    if(valid){
      this.formVals = this.getSubmitVals();
      this.createAccountHandler();
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }

  getSubmitVals(){
    var inputs = this.refs.form.querySelectorAll('input'),
        vals = {};
    for(var i = 0; i < inputs.length; i++ ){
      vals[inputs[i].name] = inputs[i].value;
    }
    return vals;
  }

  validateForm(){

    let inputs = this.refs.form.querySelectorAll('input[required]');
    let inputLength = inputs.length;
    let validLength = 0;

    if(this.refs.form.classList.contains('clean')){
      this.refs.form.classList.add('dirty');
      this.refs.form.classList.remove('clean');
    }

    for(var i = 0; i < inputLength; i++){
      let valid = this.validateInput(inputs[i]);
      if(valid) validLength++;
    }

    return (inputLength === validLength);
  }

  blur(e){
    this.validateInput(e.target);
  }

  validateInput(input){
    let valid = false;

    if(input.type === 'email'){
      valid = validateEmail(input.value);
    }else if(input.hasAttribute('data-match')){
      let matchName = input.dataset.match;
      let matchElem = document.querySelector('input[name='+matchName+']');
      valid = (input.value === matchElem.value);
    }else{
      valid = (input.getAttribute('minlength') < input.value.length);
    }
    (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
    return valid;
  }

  backHandler(e){
    e.preventDefault();
    updateRoute('LOGIN_USER_ACCOUNT_ROUTE');
  }

  render(){
    return (
      <div className="ceate-account">
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Create an account</h2>
              <form ref="form" className="create-user-form clean" onSubmit={this.handleSubmit} noValidate>
                <Input name="fname" type="text" minLength={1} placeholder="First name" blur={this.blur} required={true}/>
                <Input name="lname" type="text" minLength={1} placeholder="Last name" blur={this.blur} required={true}/>
                <Input name="email" type="email" placeholder="Email" blur={this.blur} required={true}/>
                <Input name="password" type="password" minLength={1} placeholder="Password" blur={this.blur} required={true}/>
                <Input name="passwordmatch" type="password" data-match="password" placeholder="Confirm Password" blur={this.blur} required={true}/>
                <input className="cta-btn secondary" ref="submit" type="submit" value="Create Account"/>
              </form>
              <button
                className="cta-btn"
                onClick={this.backHandler}>Back</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CreateUserAccount;
