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
    this.props.history.pushState(null, "/room/123456");
  }

  handleBack(e){
    e.preventDefault();
    this.props.history.pushState(null, '/');
  }

  render(){
    return (
      <div className="entry">
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Step 2: Enter your information</h2>
              <form onSubmit={(e) => this.handleSubmit(e)}>
                <input
                  type="text"
                  name="fname"
                  maxLength="20"
                  placeholder="First name:"
                  ref={(ref) => this.inputRefs(ref)} />
                  <br/><br/><br/>
                <input
                  type="text"
                  name="lname"
                  maxLength="20"
                  placeholder="Last name:"
                  ref={(ref) => this.inputRefs(ref)}/>
                  <br/><br/><br/>
                <input
                  type="email"
                  name="email"
                  maxLength="20"
                  placeholder="Email:"
                  ref={(ref) => this.inputRefs(ref)}/>
                  <br/><br/><br/>
                <button
                  className="cta-btn"
                  onClick={(e) => this.handleBack(e)}>Go back</button>
                  <br/><br/><br/>
                <input className="secondary" type="submit" value="Create room"/>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default UserProfile;
