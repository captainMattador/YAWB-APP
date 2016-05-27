import React from 'react';

class SettingsPane extends React.Component {

  constructor(){
    super();
    this.logOut = this.logOut.bind(this);
  }

  logOut(){
      YAWB.user = {};
      YAWB.room = {};
      YAWB.fbRef.unauth();
  }
 
  render(){
    var key = 0;
    var extendedSetting = this.props.settigsExtended.map(setting =>{
      return (<li key={++key} onClick={setting.callBack}>
                <i className={"fa " + setting.icon} aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;{setting.name}
              </li>);
    });
    
    return (
        <div className="settings-pane">
            <ul>
                {extendedSetting}
                <li onClick={this.logOut}><i className="fa fa-power-off" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Log Out</li>
            </ul>
        </div>
    )
  }

}

export default SettingsPane;
