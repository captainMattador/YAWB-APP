

/**
 * Top level of the entire app. Main will
 * load all the other views, and also keeps
 * state for the app.
 */

import React from 'react';
import Firebase from 'firebase';

import LoadingRoute from './LoadingRoute';
import LoginUserAccount from './LoginUserAccount';
import CreateUserAccount from './CreateUserAccount';
import UserHome from './User/UserHome';
import UserProfile from './User/UserProfile';
import Room from './Room/Room';
import Message from './GlobalMessanger/Message';

class Main extends React.Component {

  constructor(){
    super();

    this.firebaseBaseUrl = 'https://radiant-fire-5562.firebaseio.com/';
    this.state = {
      currentRoute: 0
    };

    this.routes = {
      LOADING_ROUTE : 0,
      LOGIN_USER_ACCOUNT_ROUTE : 1,
      CREATE_USER_ACCOUNT_ROUTE : 2,
      USER_HOME_ROUTE : 3,
      UPDATE_PROFILE_ROUTE : 4,
      ROOM_ROUTE : 5
    };

    this.getUser = this.getUser.bind(this);
    this.getUserError = this.getUserError.bind(this);
    this._updateTopLevelRoute = this._updateTopLevelRoute.bind(this);
    this.loadScreen = this.loadScreen.bind(this);
    this.updateRoute = this.updateRoute.bind(this);
  }

  /**
   * register the Auth with firebase. The call
   * back will be called when the authentication
   * of the user changes. Either by loggin out
   * or the auth token expires
   */
  componentDidMount(){
    // set the Fire Base base ref globally for
    // the rest of the app to use
    YAWB.fbRef = new Firebase(this.firebaseBaseUrl);
    YAWB.fbRef.onAuth(this.authDataCallback.bind(this));


    window.addEventListener('loading', this.loadScreen, false);
    window.addEventListener('loading-done', this.loadScreen, false);
    window.addEventListener('update-route', this.updateRoute, false);
  }

  componentWillUnmount(){
    // clean up listeners
    window.removeEventListener('loading', this.loadScreen, false);
    window.removeEventListener('loading-done', this.loadScreen, false);
    window.removeEventListener('update-route', this.updateRoute, false);
  }

  updateRoute(e){
    this._updateTopLevelRoute(this.routes[e.detail.route]);
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
    let userRef;
        // a user just logged in
    if (authData) {
      userRef = YAWB.fbRef.child('Users').child(authData.uid);
      userRef.once('value', this.getUser, this.getUserError);
    }

    // user is not logged in. Send them to the login screen
    else {
      this._updateTopLevelRoute(this.routes['LOGIN_USER_ACCOUNT_ROUTE']);
    }
  }

  getUser(snapshot){
    console.log(snapshot.val());
    
    if(snapshot.val() === null){
      this._updateTopLevelRoute(this.routes['LOGIN_USER_ACCOUNT_ROUTE']);
    }
    
    YAWB.user = snapshot.val();
    this._updateTopLevelRoute(this.routes['USER_HOME_ROUTE']);

    /***
     *
     *
     * remove once not needed,
     * goes straight to user profile
     *
     *
     */
    //this._updateTopLevelRoute(this.routes['UPDATE_PROFILE_ROUTE']);

    /***
     *
     *
     * remove once not needed,
     * sets room automoatically to the test room
     *
     *
     */
     //YAWB.room.id = 815340;
     //this._updateTopLevelRoute(this.routes['ROOM_ROUTE']);
  }

  /**
   * no yet implented
   */
  getUserError(error){
    console.log(error);
  }

  _updateTopLevelRoute(pageID){
    this.setState({
      currentRoute: pageID
    });
  }

  _renderRoute(){
    switch(this.state.currentRoute){
        case 0:
          return <LoadingRoute/>;
        case 1:
          return <LoginUserAccount/>;
        case 2:
          return <CreateUserAccount/>;
        case 3:
          return <UserHome/>;
        case 4:
          return <UserProfile/>;
        case 5:
          return <Room/>;
        default:
          return <LoginUserAccount/>;
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
