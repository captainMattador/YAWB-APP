import React from 'react';

class Input extends React.Component {

  constructor(){
    super();
    this.state = {
      value: '',
      className: 'clean invalid'
    };
    this.validTypeEnum = [
      'email',
      'match',
      'custome'
    ];
    this.event;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e){
    let targetVal = e.target.value;
    // update input values state
    this.setState({
      value: targetVal
    });

    if(this.props.required) this.validate(e.target);
  }

  validate(elem){

    let val = elem.value;
    let index = this.validTypeEnum.indexOf(this.props.validType);
    let valid = false;
    elem.classList.remove('clean');
    elem.classList.add('dirty');

    switch(index){
      // email validation
      case 0:
        valid = this.validateEmail(val);
        break;
      // matchvalidation
      case 1:
        valid = this.matchVal(elem, val)
        break;
      // custome
      case 2:
        // future addition. Add regex validation
        break;
      default:
        valid = this.validateRange(val);
    }

    (valid) ? elem.classList.remove('invalid') : elem.classList.add('invalid');
    window.dispatchEvent(this.event);
  }

  matchVal(elem, value) {
    if(typeof this.props.mustMatch === 'undefined') return;
    var matchElem = elem.parentNode.parentNode.querySelector('input[name='+this.props.mustMatch+']');
    return (matchElem.value === elem.value);
  }

  validateEmail(value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  }

  validateRange(val) {
    return (val.length > this.props.minLength);
  }

  updateClassName(name){
    this.setState({
      className: name
    });
  }

  componentDidMount(){
    this.event = new CustomEvent('input-valid', {'detail': this.refs.input});
  }

  render() {
    return (
      <div>
        <input
          ref="input"
          className={this.state.className}
          name={this.props.name}
          type={this.props.type}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onBlur={this.handleChange}
          value={this.state.value}
          required={this.props.required}
          maxLength={this.props.maxLength}
          minLength={this.props.minLength} />
      </div>
    );
  }
}

Input.defaultProps = {
  required : false,
  minLength: 0,
  maxLength: 300
};

export default Input;
