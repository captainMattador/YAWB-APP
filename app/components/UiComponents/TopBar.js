import React from 'react';
import UserProfileImg from '../User/UserProfileImg';

class TopBar extends React.Component {

  constructor(){
    super();
    this.logOut = this.logOut.bind(this);
  }

  logOut(){
      YAWB.fbRef.unauth();
  }

  render(){
    return (
      <section className="top-bar">
        <div className="user-info">
            <UserProfileImg user={YAWB.user}/>
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
