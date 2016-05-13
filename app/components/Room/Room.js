import React from 'react';
import CommentsComponent from '../Comments/CommentsComponent';
import TopBar from '../UiComponents/TopBar';
import RoomUsers from './RoomUsers';
import WhiteBoard from '../WhiteBoard/WhiteBoard';

class Room extends React.Component {

  constructor(){
    super();
  }

  componentWillMount(){
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
