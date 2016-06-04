import React from 'react';
import io from 'socket.io-client';
import {msg} from '../../utils/CustomEvents';
import UserProfileImg from '../UiComponents/UserProfileImg';

class RoomUsers extends React.Component {

  constructor(socket){
    super();
    this.state = {
      Users: []
    };
    this.usersList = [];
    this.socket;
    this.userJoined = this.userJoined.bind(this);
    this.userLeft = this.userLeft.bind(this);
    this.toggleUsers = this.toggleUsers.bind(this);
  }

  componentDidMount(){
    this.socket = this.props.socket;
    
    this.socket.emit('joining-room', {
      user: YAWB.user,
      room: YAWB.room.id
    });
    
    this.socket.on('user-joining', this.userJoined);
    this.socket.on('user-leaving', this.userLeft);
    this.socket.on('announce-user', this.announceUser);
    this.socket.on('announce-leaving', this.announceUserLeft);
  }

  componentWillUnmount(){
    this.socket.removeListener('user-joining', this.userJoined);
    this.socket.removeListener('announce-user', this.announceUser);
    this.socket.removeListener('user-leaving', this.userLeft);
    this.socket.removeListener('announce-leaving', this.announceUserLeft);
    this.socket.disconnect();
  }

  componentDidUpdate(){
    this.setWidth();
  }

  setWidth(){
    var list = this.refs.list,
        users = list.querySelectorAll('li'),
        userWidth;

    if(users.length > 0){
      var users = list.querySelectorAll('li'),
          userWidth = users[0].clientWidth;
      list.style.width = (users.length * userWidth) + 'px';
    }
  }
  
  announceUser(userName){
    msg(userName, 'Joined the room', false);
  }
  
  announceUserLeft(userName){
    msg(userName, 'Left the room', false);
  }

  userJoined(users){
    this.usersList = users;
    this.setState({
      Users : this.usersList
    });
  }
  
  userLeft(user){
    var index = this.usersList.indexOf(user);
    if(index > -1){
      this.usersList.splice(index, 1);
      this.setState({
        Users : this.usersList
      });
    }
  }
  
  toggleUsers(){
    this.refs.userList.classList.toggle('active');
  }

  render(){
    var users = this.state.Users.map(user =>{
      return (<li key={user.uid}>
                <div className="user">
                    <UserProfileImg user={user}/>
                    <div className="info">{user.fname + ' ' + user.lname}</div>
                </div>
              </li>);
    });
    
    return (
      <section ref="userList" className="room-users">
        <span ref="toggle" className="toggleUsers" onClick={this.toggleUsers}><i className="fa fa-chevron-up" aria-hidden="true"></i></span>
        <div className="scroll-wrap">
          <ul ref="list" className="room-users-list">
            {users}
          </ul>
        </div>
      </section>
    )
  }

}

export default RoomUsers;
