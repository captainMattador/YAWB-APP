import React from 'react';
import Input from './FormComponents/Input';
import {validateEmail} from '../utils/helpers';

class LoginUserAccount extends React.Component {

  constructor(){
    super();

    this.state = {
      formError: false,
      errorMessage: '',
      loading: '',
      testVal: ''
    };

    this.funcTest = this.funcTest.bind(this);

    this.blur = this.blur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formVals = {};

    // custom events
    this.loading = new CustomEvent('loading', {detail: {}, bubbles: true,
        cancelable: true});
    this.loadingDone = new CustomEvent('loading-done', {detail: {}, bubbles: true,
            cancelable: true});
  }

  errorMsg(title, msg, isError){
    return new CustomEvent('msg', {detail: {
        title: title,
        msg: msg,
        isError: isError
      },
        bubbles: true,
        cancelable: true
      });
  }

  loginHandler(){
    let self = this;
    window.dispatchEvent(this.loading);
    this.props.fireBase.authWithPassword({
      email: this.formVals.email,
      password : this.formVals.password
    }, this.authWithPasswordCallback.bind(this));
  }

  authWithPasswordCallback(error, data){
    window.dispatchEvent(this.loadingDone);
    if (error) {
      window.dispatchEvent(this.errorMsg('Error', 'Invalid username/password', true));
    } else {
      console.log("Authenticated successfully with payload:", data);
    }
  }

  handleSubmit(e){
    e.preventDefault();
    let valid = this.validateForm();
    let vals = {};

    if(valid){
      this.formVals = this.getSubmitVals();
      this.loginHandler();
    }else{
      window.dispatchEvent(this.errorMsg('Matt\'s comment', 'Sending a message to the window', false));
      //window.dispatchEvent(this.errorMsg('Error', 'Invalid form. Please fix errors.', true));
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
    this.props.updateTopLevelRoute(this.props.mainRoutes['CREATE_USER_ACCOUNT_ROUTE']);
  }

  componentDidMount(){
  }

  funcTest(event){
    event.preventDefault();
    this.setState({
      testVal: event.target.value
    });
  }

  blurTest(event){
    event.preventDefault();
    console.log('I left the input');
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

              <input
                value={this.state.testVal}
                onChange={this.funcTest}
                onBlur={this.blurTest.bind(this)}/>

              <h1>{this.state.testVal}</h1>
              <p><em>-or-</em></p>
              <button
                className="cta-btn secondary"
                onClick={(e) => this.updateTopLevelRoute(e)}>Create an Account</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default LoginUserAccount;
