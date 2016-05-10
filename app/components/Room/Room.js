import React from 'react';
import CommentsComponent from '../Comments/CommentsComponent';
import TopBar from '../UiComponents/TopBar';

class Room extends React.Component {

  constructor(){
    super();
    this.state = {
      isOwner: false
    };
    // firebase refs
    this.roomRef;

    this.addUser = this.addUser.bind(this);
    this.addUserError = this.addUserError.bind(this);
  }

  /**
   * The dom is about to mount
   * so it's a good time to
   * reach out to the server
   * to get the data needed
   */
  componentWillMount(){
    this.roomRef = YAWB.fbRef.child("Rooms").child(YAWB.user.activeRoom);
    this.roomRef.once('value', this.addUser, this.addUserError);
  }

  addUser(snapshot){
    let val = snapshot.val();
    let roomUsersRef;
    if(val.owner === YAWB.user.uid){
      this.setState({
        isOwner: true
      });
    }
    roomUsersRef = this.roomRef.child('Users').child(YAWB.user.uid);
    roomUsersRef.update(YAWB.user);
  }

  addUserError(error){
    console.log(error);
  }

  componentDidMount(){
  }

  render(){
    return (
      <div className="room">
        <TopBar/>
        <CommentsComponent isOwner={this.state.isOwner}/>
      </div>
    )
  }

}

export default Room;
