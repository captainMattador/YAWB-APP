import React from 'react';
import {updateRoute, loading, msg} from '../../utils/CustomEvents';
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
  
  toggleChatBox(e){
    e.preventDefault();
    var chatBox = e.currentTarget.dataset.chatBox;
    var event = new CustomEvent('toggle-comments', {detail: {
      chatBox: chatBox
    }});
    window.dispatchEvent(event);
  }
  
  boardView(){
    if(this.state.userReturned){
      return (
        <WhiteBoardView/>
      );
    }
  }
  
  chatComponent(){
    if(this.state.userReturned && YAWB.user.owner){
      return (
        <CommentsComponent
          heading="Chat"
          commentsClass="peer-comments"
          dbList="PeerComments"/>
      );
    }
  }
  
  chatNav(){
    if(this.state.userReturned && YAWB.user.owner){
      return <li ref="chatIcon" data-chat-box="peer-comments" onClick={this.toggleChatBox}><i className="fa fa-comments" aria-hidden="true"></i></li>;
    }
  }
  
  leaveRoom(){
    YAWB.room = {};
    updateRoute('USER_HOME_ROUTE');
  }

  render(){

    var extendSettings = [
      {name: 'Leave Room', icon: 'fa-sign-out', callBack: this.leaveRoom}
    ];
    
    return (
      <div className={"room" + ((this.state.userReturned && YAWB.user.owner) ? " owner" : "")}>
        <TopBar extraSettings={extendSettings}>
          <ul className="chat-nav">
            {this.chatNav()}
            <li ref="questionIcon" data-chat-box="questions" onClick={this.toggleChatBox}><i className="fa fa-question-circle" aria-hidden="true"></i></li>
          </ul>
        </TopBar> 
        <RoomUsers/>
        {this.boardView()}
        {this.chatComponent()}
        <CommentsComponent
          heading="Ask a question"
          commentsClass="questions"
          dbList="Questions"/>
      </div>
    )
  }

}

export default Room;
