import React from 'react';
import CommentsComponent from '../Comments/CommentsComponent';
import TopBar from '../UiComponents/TopBar';
import RoomUsers from './RoomUsers';
import OwnerBoardView from '../WhiteBoard/OwnerBoardView';
import VisitorBoardView from '../WhiteBoard/VisitorBoardView';

class Room extends React.Component {

  constructor(){
    super();
    this.state = {
      boardView: <VisitorBoardView/>
    }
    
    this.setView = this.setView.bind(this);
  }

  componentWillMount(){
    this.ownerRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child('owner');
    this.ownerRef.once('value', this.setView);
  }
  
  setView(snapshot){
    if(YAWB.user.uid === snapshot.val()){
      YAWB.user.owner = true;
      this.setState({
        boardView: <OwnerBoardView/>
      });
    }else{
      YAWB.user.owner = false;
    }
  }

  render(){
 
    return (
      <div className="room">
        <TopBar></TopBar>
        <RoomUsers/>
        <section className="white-board">
          {this.state.boardView}
        </section>
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
