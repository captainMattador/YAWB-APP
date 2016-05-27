import React from 'react';

class Input extends React.Component {

  constructor(){
    super();
    this.state = {
      value: ''
    };
    this.event;
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  
  handleFocus(e){
    let elem = e.target;
    if(!this.refs.input.classList.contains('touched')){
      this.refs.input.classList.add('touched');
    }
  }
  
  handleBlur(e){
    let elem = e.target;
    if(this.refs.input.classList.contains('clean')){
      this.refs.input.classList.remove('clean');
      this.refs.input.classList.add('dirty');
    }
    this.props.blur(e);
  }
  
  handleChange(e){
    let targetVal = e.target.value;
    this.setState({
      value: targetVal
    });
    
    if(this.refs.input.classList.contains('clean')){
      this.refs.input.classList.remove('clean');
      this.refs.input.classList.add('dirty');
    }

    if(typeof this.props.valueChange === 'function'){
      this.props.valueChange(e.target, targetVal);
    }
  }

  render() {
    return (
      <div>
        <input
          ref="input"
          className="clean"
          value={this.state.value} 
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          {...this.props}/>
      </div>
    );
  }
}

Input.defaultProps = {
  required: false,
  minLength: 0,
  maxLength: 300,
  name: '',
  type: ''
};

Input.propTypes = { 
  name: React.PropTypes.string,
  type: React.PropTypes.string
};

export default Input;
