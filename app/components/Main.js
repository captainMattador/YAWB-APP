
import React from 'react';
import Firebase from 'firebase';

// main pages for routig.
// Main is top level UI component
// and it renders the next level page
// based on currentPage
import LoginUserAccount from './LoginUserAccount';
import CreateUserAccount from './CreateUserAccount';
import UserHome from './User/UserHome';
import UserProfile from './User/UserProfile';
import Room from './Room/Room';
import Error from './Error';
import Message from './UiComponents/Message';

class Main extends React.Component {

  constructor(){
    super();

    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.fbRef = new Firebase(this.firebaseBaseUrl);

    this.state = {
      displayMsg: true,
      user: null,
      roomNumber: null,
      currentRoute: 0
    };

    this.routes = {
      LOGIN_USER_ACCOUNT_ROUTE : 0,
      CREATE_USER_ACCOUNT_ROUTE : 1,
      USER_HOME_ROUTE : 2,
      UPDATE_PROFILE_ROUTE : 3,
      ROOM_ROUTE : 4,
    };

    this.authDataCallback = this.authDataCallback.bind(this);
    this.updateTopLevelRoute = this.updateTopLevelRoute.bind(this);
    this.loadScreen = this.loadScreen.bind(this);
  }

  /**
   * register the Auth with firebase. The call
   * back will be called when the authentication
   * of the user changes. Either by loggin out
   * or the auth token expires
   */
  componentDidMount(){

    // custom gloabl events. Any child
    // may call these to show the loading
    // screen
    window.addEventListener('loading', this.loadScreen, false);
    window.addEventListener('loading-done', this.loadScreen, false);

    this.fbRef.onAuth(this.authDataCallback.bind(this));

  }

  componentWillUnmount(){
    // clean up listeners
    window.removeEventListener('loading', this.loadScreen, false);
    window.removeEventListener('loading-done', this.loadScreen, false);
  }

  loadScreen(e){
    if(e.type === 'loading'){
      this.refs.loader.classList.add('active');
    }else{
      this.refs.loader.classList.remove('active');
    }
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
      /* successcully found a logged in user */
      this.setState({user: authData.uid});
      this.updateTopLevelRoute(this.routes['USER_HOME_ROUTE']);
    } else {
      /* no one is logged in */
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
          return <UserHome
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}
            roomNumber={this.state.roomNumber}
            user={this.state.user}
            fireBase={this.fbRef}/>;
        case 3:
          return <UserProfile
            updateTopLevelRoute={this.updateTopLevelRoute}
            mainRoutes={this.routes}
            currentRoute={this.state.currentRoute}
            fireBase={this.fbRef}/>;
        case 4:
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
        <div ref="loader" className="loader"></div>
        <Message />
      </div>
    )
  }
}

export default Main;
