import React from 'react';
import Input from './FormComponents/Input';
import {validateEmail} from '../utils/helpers';

class LoginUserAccount extends React.Component {

  constructor(){
    super();
    
    this.state = {
      formError: false,
      errorMessage: '',
      loading: ''
    };
    
    this.blur = this.blur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formVals = {};
  }

  loginHandler(){
    let self = this;
    this.refs.loader.classList.add('active');
    this.props.fireBase.authWithPassword({
      email: this.formVals.email,
      password : this.formVals.password
    }, function(){
      self.refs.loader.classList.remove('active');
      self._updateError(true, 'Error: Invalid username/password');
    });
  }
  
  handleSubmit(e){
    e.preventDefault();
    let valid = this.validateForm();
    let vals = {};
    
    if(valid){
      this._updateError(false, '');
      this.formVals = this.getSubmitVals();
      this.loginHandler();
    }else{
      this._updateError(true, 'Invalid form. Please fix errors.');
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
  
  updateTopLevelRoute(e){
    e.preventDefault();
    this.props.updateTopLevelRoute(this.props.mainRoutes['CREATE_USER_ACCOUNT_ROUTE']);
  }
  
  componentDidMount(){
    
    this._updateError(true, this.props.message);
  
  }
  
  render(){
    return (
      <div className="entry">
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Login or Create an Account</h2>
              <form ref="form" className="login-user-form clean" onSubmit={this.handleSubmit} noValidate>
                <Input name="email" type="email" placeholder="Email" blur={this.blur} required={true}/>
                <Input name="password" type="password" minLength={1} placeholder="Password" blur={this.blur} required={true}/>
                <input className="cta-btn" ref="submit" type="submit" value="Log in"/>
              </form>
              <p><em>-or-</em></p>
              <button
                className="cta-btn secondary"
                onClick={(e) => this.updateTopLevelRoute(e)}>Create an Account</button>
              {this._rendorError()}
            </div>
          </div>
        </div>
        <div ref="loader" className="loader"></div>
      </div>
    )
  }

}

export default LoginUserAccount;
