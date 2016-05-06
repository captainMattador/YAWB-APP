
import React from 'react';
import Firebase from 'firebase';

// main pages for routig.
// Main is top level UI component
// and it renders the next level page
// based on currentPage
import EntryCheck from './EntryCheck';
import LoginUserAccount from './LoginUserAccount';
import CreateUserAccount from './CreateUserAccount';
import UserProfile from './User/UserProfile';
import Room from './Room/Room';
import Error from './Error';

class Main extends React.Component {
  
  constructor(){
    super();
    
    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.fbRef = new Firebase(this.firebaseBaseUrl);
    
    this.state = {
      user: null,
      roomNumber: null,
      currentRoute: 0
    };
    
    this.routes = {
      LOGIN_USER_ACCOUNT_ROUTE : 0,
      CREATE_USER_ACCOUNT_ROUTE : 1,
      UPDATE_PROFILE_ROUTE : 2,
      ROOM_ROUTE : 3,
    };
    
    this.authDataCallback = this.authDataCallback.bind(this);
    this.updateTopLevelRoute = this.updateTopLevelRoute.bind(this);
  }
  
  /**
   * register the Auth with firebase. The call 
   * back will be called when the authentication
   * of the user changes. Either by loggin out
   * or the auth token expires
   */
  componentDidMount(){
    
    this.fbRef.onAuth(this.authDataCallback.bind(this));
  
  }
  
  /**
   * Call back for authentication
   * when the state is logged out
   * the user is taken to the login screen.
   * In authentication the user is taken to
   * the room
   */
  authDataCallback(authData) {
    if (authData) {
      this.setState({user: authData.uid});
      this.updateTopLevelRoute(this.routes['ROOM_ROUTE']);
    } else {
      this.updateTopLevelRoute(this.routes['LOGIN_USER_ACCOUNT_ROUTE']);
    }
  }
  
  updateTopLevelRoute(pageID){
    this.setState({
      currentRoute: pageID
    });
  }
  
  _renderRoute(){
    switch(this.state.currentRoute){
        case 0:
          return <LoginUserAccount 
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}
            fireBase={this.fbRef}/>;
        case 1:
          return <CreateUserAccount 
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}
            fireBase={this.fbRef}/>;
        case 2:
          return <UserProfile 
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}
            fireBase={this.fbRef}/>;
        case 3:
          return <Room 
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}
            roomNumber={this.state.roomNumber}
            user={this.state.user}
            fireBase={this.fbRef}/>;
        default:
          return <Error
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}/>;
      }
  }
  
  /*
    returns the children routes to the UI.
    Main is top level route
  */
  render(){
    return (
      <div className="site-wrapper">
        {this._renderRoute()}
      </div>
    )
  }
}

export default Main;
