import React from 'react';
import Input from './FormComponents/Input';
import {updateRoute, loading, msg} from '../utils/CustomEvents';
import {validateEmail} from '../utils/helpers';

class LoginUserAccount extends React.Component {

  constructor(){
    super();

    this.formVals = {};
    this.blur = this.blur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateTopLevelRoute = this.updateTopLevelRoute.bind(this);
  }

  loginHandler(){
    let self = this;
    loading(true);
    YAWB.fbRef.authWithPassword({
      email: this.formVals.email,
      password : this.formVals.password
    }, this.authWithPasswordCallback.bind(this));
  }

  authWithPasswordCallback(error){
    if (error) {
      msg('Error', 'Invalid username/password', true);
    }
    loading(false);
  }

  handleSubmit(e){
    e.preventDefault();
    let valid = this.validateForm();
    let vals = {};

    if(valid){
      this.formVals = this.getSubmitVals();
      this.loginHandler();
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }

  getSubmitVals(){
    var inputs = this.refs.form.querySelectorAll('input[required]'),
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
    }else{
      valid = (input.getAttribute('minlength') < input.value.length);
    }
    (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
    return valid;
  }

  updateTopLevelRoute(e){
    e.preventDefault();
    updateRoute('CREATE_USER_ACCOUNT_ROUTE');
  }

  render(){
    return (
      <div className="entry">
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Login or create an account</h2>
              <form ref="form" className="login-user-form clean" onSubmit={this.handleSubmit} noValidate>
                <Input name="email" type="email" placeholder="Email" blur={this.blur} required={true}/>
                <Input name="password" type="password" minLength={1} placeholder="Password" blur={this.blur} required={true}/>
                <input className="cta-btn" ref="submit" type="submit" value="Log in"/>
              </form>
              <p><em>-or-</em></p>
              <button
                className="cta-btn secondary"
                onClick={this.updateTopLevelRoute}>Create an Account</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default LoginUserAccount;
