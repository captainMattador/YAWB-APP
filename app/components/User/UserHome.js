import React from 'react';
import {updateRoute, loading, msg} from '../../utils/CustomEvents';
import Input from '../FormComponents/Input';
import TopBar from '../UiComponents/TopBar';

const MIN_ROOM_NUM = 1;
const MAX_ROOM_NUM = 999999;
class UserHome extends React.Component {

  constructor(){
    super();
    this.roomRef;
    this.roomNumVal;

    this.createRoom = this.createRoom.bind(this);

    this.createNewRoom = this.createNewRoom.bind(this);
    this.createNewRoomError = this.createNewRoomError.bind(this);

    this.handleEnterRoomSubmit = this.handleEnterRoomSubmit.bind(this);

    this.enterRoom = this.enterRoom.bind(this);
    this.enterRoomError = this.enterRoomError.bind(this);

    this.blur = this.blur.bind(this);
  }

  /**
   * The dom is about to mount
   * so it's a good time to
   * reach out to the server
   * to get the data needed
   */
  componentWillMount(){
    this.roomRef = YAWB.fbRef.child("Rooms");
  }

  createRoom(e){
    e.preventDefault();
    loading(true);
    this.refs.createRoom.disabled = true;
    this.roomRef.once('value', this.createNewRoom, this.createNewRoomError);
  }

  createNewRoom(snapshot){
    let rooms = snapshot.val();
    let roomNum = this.generateRoomNum();
    let postsNewRoom = this.roomRef.child(roomNum);

    if(rooms){
      let ifRoomExists = this.checkIfRoomExists(rooms, roomNum);
      while(ifRoomExists){
        roomNum = this.generateRoomNum();
        ifRoomExists = this.checkIfRoomExists(rooms, roomNum);
      }
    }

    postsNewRoom.set({
      owner: YAWB.user.uid,
      roomId: roomNum
    });

    YAWB.room.id = roomNum;
    loading(false);
    updateRoute('ROOM_ROUTE');
  }

  createNewRoomError(error){
    console.log(error);
  }

  /**
  * handle entering a room by entering an existing room id
  */
  handleEnterRoomSubmit(e){
    e.preventDefault();
    let input = e.target.querySelector('input[name=roomNumber]');
    let valid = this.validateForm(input);

    if(valid){
      this.roomNumVal = input.value;
      loading(true);
      this.roomRef.once('value', this.enterRoom, this.enterRoomError);
    }else{
      msg('Error', 'You must enter a room number.', true);
    }
  }

  blur(e){
    this.validateInput(e.target);
  }

  validateForm(input){
    if(this.refs.form.classList.contains('clean')){
      this.refs.form.classList.add('dirty');
      this.refs.form.classList.remove('clean');
    }
    return this.validateInput(input);
  }

  validateInput(input){
    let valid = false;
    valid = (input.getAttribute('minlength') < input.value.length);
    (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
    return valid;
  }

  enterRoom(snapshot){
    let rooms = snapshot.val();
    let ifRoomExists = this.checkIfRoomExists(rooms, this.roomNumVal);

    if(!rooms || !ifRoomExists){
      msg('Error', 'No room currently matches that number.', true);
      loading(false);
      return;
    }

    YAWB.room.id = this.roomNumVal;
    loading(false);
    updateRoute('ROOM_ROUTE');
  }

  enterRoomError(){
    console.log('error entering the room');
  }

  checkIfRoomExists(obj, roomNum){
    for(var prop in obj){
      if(prop === roomNum)
        return true;
    }
    return false;
  }

  generateRoomNum(){
    return Math.floor((Math.random() * MAX_ROOM_NUM) + MIN_ROOM_NUM);
  }

  render(){
    return (
      <div className="user-home">
        <TopBar/>
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Start a new Room or Enter your Room number.</h2>
              <button
                ref="createRoom"
                className="cta-btn secondary"
                onClick={this.createRoom}>Start New Room</button>
              <p>-or-</p>
              <form ref="form" onSubmit={this.handleEnterRoomSubmit} className="create-room-form clean" noValidate>
                <Input ref="roomNumberInput" name="roomNumber" type="text" placeholder="Room number" blur={this.blur} minLength={1} maxLength={6} required={true}/>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default UserHome;
