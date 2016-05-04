
import React from 'react';
import { hashHistory } from 'react-router'

class Main extends React.Component {
  /*
    returns the children routes to the UI.
    Main is top level route
  */
  render(){
    return (
      <div className="site-wrapper">
        {this.props.children}
      </div>
    )
  }
}

export default Main;
