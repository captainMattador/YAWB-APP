import React from 'react';

class Message extends React.Component {

  constructor(){
    super();
    this.state = {
      msg: '',
      title: ''
    }
    this.active = false;
    this.timeout;
    this.handleMsg = this.handleMsg.bind(this);
    this.cancelCurrMsg = this.cancelCurrMsg.bind(this);
  }

  componentDidMount(){
    window.addEventListener('msg', this.handleMsg , false);
  }

  componentWillUnmount(){
    window.removeEventListener('msg', this.handleMsg , false);
  }

  handleMsg(e){
    (e.detail.isError) ? this.refs.msg.classList.add('error') : this.refs.msg.classList.remove('error');
    this.setState({
      msg: e.detail.msg,
      title: e.detail.title
    });
    this.displayMsg();
  }

  displayMsg(){
    if(this.active){
      this.cancelCurrMsg();
    }

    this.refs.msg.classList.add('active');
    this.timeout = setTimeout(this.cancelCurrMsg, 1500);
  }

  cancelCurrMsg(){
    clearTimeout(this.timeout);
    this.refs.msg.classList.remove('active');
  }

  render(){
    return (
      <div ref="msg" className="message">
        <h2>{this.state.title}</h2>
        <p>{this.state.msg}</p>
      </div>
    )
  }
}

Message.defaultProps = {
  status: 'ok'
};

export default Message;
