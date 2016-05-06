import React from 'react';

class Error extends React.Component {

  constructor(){
    super();
  }
  
  updateTopLevelRoute(e){
    e.preventDefault();
    this.props.updateTopLevelRoute(this.props.mainRoutes['LOGIN_USER_ACCOUNT_ROUTE']);
  }
  
  render(){
    return (
      <div className="error-page">
        <h1>Opps looks like there was an error!</h1>
        <button
            className="cta-btn secondary"
            onClick={(e) => this.updateTopLevelRoute(e)}>Create an Account</button>
      </div>
    )
  }
}

export default Error;
