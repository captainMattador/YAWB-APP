import React from 'react';
import Input from './FormComponents/Input';
import {validateEmail} from '../utils/helpers';

class CreateUserAccount extends React.Component {

  constructor(){
    super();
    this.state = {
      message: '',
      formError: false,
      errorMessage: '',
      loading: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.blur = this.blur.bind(this);
    this.createAccountHandler = this.createAccountHandler.bind(this);
    this.formVals = {};
  }

  // account was valid
  createAccountHandler(){
    this.refs.loader.classList.add('active');
    this.props.fireBase.createUser({
      email : this.formVals.email,
      password : this.formVals.password
    }, this.createAccountCallBack.bind(this));
  }

  createAccountCallBack(error, userData){
    if (error) {
      this.refs.loader.classList.remove('active');
      this._updateError(true, 'This email address is already in use.');
      return;
    }
    
    let self = this;
    let postsUser = this.props.fireBase.child("Users").child(userData.uid);
    postsUser.set({
      fname: this.formVals.fname,
      lname: this.formVals.lname,
      email: this.formVals.email,
      uid: userData.uid
    });
    this.props.fireBase.authWithPassword({
      email: this.formVals.email,
      password : this.formVals.password
    });
  }
  
  handleSubmit(e){
    e.preventDefault();
    let valid = this.validateForm();
    let vals = {};
    
    if(valid){
      this._updateError(false, '');
      this.formVals = this.getSubmitVals();
      this.createAccountHandler();
    }else{
      this._updateError(true, 'Invalid form. Please fix errors.');
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
      let macthName = input.dataset.match;
      let matchElem = document.querySelector('input[name='+macthName+']');
      valid = (input.value === matchElem.value);
    }else{
      valid = (input.getAttribute('minlength') < input.value.length);
    }
    (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
    return valid;
  }
  
  _updateError(error, msg){
    this.setState({
      formError: error,
      errorMessage: msg
    });
  }
  
  _rendorError(){
    if(this.state.formError)
      return <p className="error">{this.state.errorMessage}</p>;
  }
  
  backHandler(e){
    e.preventDefault();
    this.props.updateTopLevelRoute(this.props.mainRoutes['LOGIN_USER_ACCOUNT_ROUTE']);
  }
    
  render(){
    return (
      <div className="ceate-account">
        <h1>Create an account</h1>
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
          onClick={(e) => this.backHandler(e)}>Back</button>
        {this._rendorError()}
        <div ref="loader" className="loader"></div>
      </div>
    )
  }
}

export default CreateUserAccount;
