import React from 'react';
import CommentsComponent from '../Comments/CommentsComponent';
import TopBar from '../UiComponents/TopBar';
import RoomUsers from './RoomUsers';
import WhiteBoardView from '../WhiteBoard/WhiteBoardView';

class Room extends React.Component {

  constructor(){
    super();
    this.state = {
      userReturned: false
    }
    
    this.returnedUser = this.returnedUser.bind(this);
  }

  componentWillMount(){
    this.ownerRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child('owner');
    this.ownerRef.once('value', this.returnedUser);
  }
  
  returnedUser(snapshot){
    YAWB.user.owner = (YAWB.user.uid === snapshot.val()) ? true : false;
    this.setState({
      userReturned: true
    });
  }
  
  boardView(){
    if(this.state.userReturned){
      return (
        <WhiteBoardView/>
      );
    }
  }
  
  chatComponent(){
    if(this.state.userReturned && !YAWB.user.owner){
      return (
        <CommentsComponent
          heading="Chat"
          icon="fa-comments"
          commentsClass="peer-comments"
          dbList="PeerComments"/>
      );
    }
  }

  render(){
    return (
      <div className={"room" + ((this.state.userReturned && YAWB.user.owner) ? " owner" : "")}>
        <TopBar/> 
        <RoomUsers/>
        {this.boardView()}
        {this.chatComponent()}
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
