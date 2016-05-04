
import React from 'react';

class Form extends React.Component {

  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkForm = this.checkForm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.refs.submit.disabled = true;
    this.props.onSubmit(this.getSubmitVals(), (success) =>
      this.formSubmitCallBack(success));
  }

  formSubmitCallBack(success){
    // if not a succes let them
    // fill out the form again
    if(!success){
      this.refs.submit.disabled = false;
    }
  }

  checkForm(e){
    var inputs = this.refs.form.querySelectorAll('input'),
        validate = this.inputsValidate();
    (validate) ? this.refs.submit.disabled = false : this.refs.submit.disabled = true;
  }

  getSubmitVals(){
    var inputs = this.refs.form.querySelectorAll('input'),
        vals = {};
    for(var i = 0; i < inputs.length; i++ ){
      vals[inputs[i].name] = inputs[i].value;
    }
    return vals;
  }

  inputsValidate(){
    var inputs = this.refs.form.querySelectorAll('input'),
        valid = true;

    for(var i = 0; i < inputs.length; i++ ){
      if(inputs[i].classList.contains('invalid') && inputs[i].required){
        valid = false;
        break;
      }
    }

    return valid;
  }

  // attacth to for event
  componentDidMount(){
    window.addEventListener('input-valid', this.checkForm, false);
    var form = this.refs.form;
    var validate = this.inputsValidate();
    if(validate) this.refs.submit.disabled = false;
  }

  // detach from event
  componentWillUnmount(){
    window.removeEventListener('input-valid', this.checkForm, false);
  }

  render(){
    return (
      <form ref="form" className={this.props.className} onSubmit={this.handleSubmit} noValidate>
        {this.props.formElems}
        <input ref="submit" type="submit" value={this.props.submitVal} disabled={true}/>
      </form>
    )
  }
}

Form.defaultProps = {
  className : 'form',
  submitVal : 'Submit'
};

export default Form;
