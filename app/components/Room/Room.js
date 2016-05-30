import React from 'react';
import io from 'socket.io-client';
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
    
    // connect to the server
    //this.socketHost = 'http://localhost:8080/room-users';
    this.socketHost = 'http://159.203.245.200:8080/room-users';
    this.socket = io.connect(this.socketHost);
    
    // window.navigator.getUserMedia = navigator.webkitGetUserMedia;
    
    // if(navigator.getUserMedia){
    //   console.log('good news you have it!');
    // }else{
    //   console.log('uh oh');
    // }
    
    this.returnedUser = this.returnedUser.bind(this);
  }

  componentWillMount(){
    this.ownerRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child('owner');
    this.ownerRef.once('value', this.returnedUser);
  }
  
  componentDidMount(){
      // var errorCallback = function(e) {
      //   console.log('Reeeejected!', e);
      // };

      // navigator.getUserMedia({video: false, audio: true}, 
      // function(localMediaStream) {
      //   console.log(localMediaStream);
      // }, errorCallback);
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
        <WhiteBoardView socket={this.socket}/>
      );
    }
  }
  
  chatComponent(){
    if(this.state.userReturned && !YAWB.user.owner){
      return (
        <CommentsComponent
          heading="Chat"
          commentsClass="peer-comments"
          dbList="PeerComments"/>
      );
    }
  }
  
  chatNav(){
    if(this.state.userReturned && !YAWB.user.owner){
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
        <RoomUsers socket={this.socket}/>
        {this.boardView()}
        {this.chatComponent()}
        <CommentsComponent
          heading="Ask a question"
          commentsClass="questions"
          dbList="Questions"/>
          
          <video id="camera" autoplay></video>
      </div>
    )
  }

}

export default Room;
