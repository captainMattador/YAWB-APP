import React from 'react';
import CommentsComponent from '../Comments/CommentsComponent';
import TopBar from '../UiComponents/TopBar';
import RoomUsers from './RoomUsers';
import WhiteBoard from '../WhiteBoard/WhiteBoard';

class Room extends React.Component {

  constructor(){
    super();

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
    this.roomRef = YAWB.fbRef.child("Rooms").child(YAWB.room.id);
    this.roomRef.once('value', this.addUser, this.addUserError);
  }

  addUser(snapshot){
    let val = snapshot.val();
    let roomUsersRef;
    YAWB.room.isOwner = (val.owner === YAWB.user.uid)? true : false;
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
        <TopBar></TopBar>
        <RoomUsers/>
        <WhiteBoard/>
        <CommentsComponent
          heading="Chat"
          icon="fa-comments"
          commentsClass="peer-comments"
          dbList="PeerComments"/>
        <CommentsComponent
          heading="Ask a question"
          icon="fa-question-circle"
          commentsClass="questions"
          dbList="Questions"/>
      </div>
    )
  }

}

export default Room;
