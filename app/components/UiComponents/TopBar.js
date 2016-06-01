import React from 'react';
import UserProfileImg from './UserProfileImg';
import SettingsPane from './SettingsPane';

class TopBar extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <section className="top-bar">
        <div className="user-info">
            <UserProfileImg user={YAWB.user}/>
            <SettingsPane settigsExtended={this.props.extraSettings}/>
        </div>
        {this.props.children}
      </section>
    )
  }
}

export default TopBar;
