import React from 'react';

class TopBar extends React.Component {

  constructor(){
    super();
    this.logOut = this.logOut.bind(this);
  }

  userProfileImage(){
      if(!YAWB.user.profileImage){
          return YAWB.user.fname.substring(0, 1);
      }

      // return profile image if there is one
      // not yet implemented
      return YAWB.user.fname.substring(0, 1);
  }

  logOut(){
      YAWB.fbRef.unauth();
  }

  render(){
    return (
      <section className="top-bar">
        <div className="user-info">
            <div className="user-profile-image">
                <span>{this.userProfileImage()}</span>
            </div>
            <div className="settings-pane">
                <ul>
                    <li onClick={this.logOut}><i className="fa fa-power-off" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Log Out</li>
                </ul>
            </div>
        </div>
      </section>
    )
  }
}

export default TopBar;
