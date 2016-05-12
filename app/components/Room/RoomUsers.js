import React from 'react';
import UserProfileImg from '../User/UserProfileImg';

class RoomUsers extends React.Component {

  constructor(){
    super();
    this.state = {
      Users: []
    };

    this.usersRef;
    this.updateUsersList = this.updateUsersList.bind(this);
  }

  componentDidMount(){
    this.usersRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child('Users');
    this.usersRef.on('value', this.updateUsersList);
  }

  componentWillUnmount(){
    this.usersRef.off('value', this.updateUsersList);
  }

  componentDidUpdate(){
    this.setWidth();
  }

  setWidth(){
    var list = this.refs.list,
        users = list.querySelectorAll('li'),
        userWidth = users[1].clientWidth;
    list.style.width = (users.length * userWidth) + 'px';
  }

  updateUsersList(snapshot){
    var users = this.flattenUsersList(snapshot.val());
    this.setState({
      Users : users
    });
  }

  flattenUsersList(obj){
    let arr = [];
    for(let prop in obj){
      let key = prop;
      arr.push(obj[prop]);
    }
    return arr;
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
      <section className="room-users">
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
