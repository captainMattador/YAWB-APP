import React from 'react';
import logger from '../../utils/logger';

const COMPONENT = 'UserProfile';

// private variables
let inputArr = [];

class UserProfile extends React.Component {

  constructor(){
    super();
  }

  componentDidMount(){
  }

  inputRefs(ref){
    // inputArr.push({
    //   '' + ref.name + '' : ref
    // });
  }

  handleSubmit(e){
    e.preventDefault();
    //this.props.history.pushState(null, "/room/123456");
  }

  handleBack(e){
    e.preventDefault();
    //this.props.history.pushState(null, '/');
  }

  render(){
    return (
      <div className="user">
        <h1>This is where you can update your profile</h1>
      </div>
    )
  }

}

export default UserProfile;
