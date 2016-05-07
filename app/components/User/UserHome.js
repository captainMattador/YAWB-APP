import React from 'react';
import Input from '../FormComponents/Input';
import TopBar from '../UiComponents/TopBar';

const MIN_ROOM_NUM = 1;
const MAX_ROOM_NUM = 999999;
class UserHome extends React.Component {

  constructor(){
    super();
    this.userRef;
    this.roomRef;

    this.state = {
      user: {
        fname: '',
        lname: '',
        email: '',
        uid: ''
      }
    }

    this.formVals = {};

    this.createRoom = this.createRoom.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUserError = this.getUserError.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.getRoomsError = this.getRoomsError.bind(this);
    this.handleEnterRoomSubmit = this.handleEnterRoomSubmit.bind(this);
    this.blur = this.blur.bind(this);
    this.msg = this.msg.bind(this);

    // custom events
    this.loading = new CustomEvent('loading', {detail: {}, bubbles: true,
        cancelable: true});
    this.loadingDone = new CustomEvent('loading-done', {detail: {}, bubbles: true,
            cancelable: true});
  }

  msg(title, msg, isError){
    return new CustomEvent('msg', {detail: {
        title: title,
        msg: msg,
        isError: isError
      },
        bubbles: true,
        cancelable: true
      });
  }

  /**
   * The dom is about to mount
   * so it's a good time to
   * reach out to the server
   * to get the data needed
   */
  componentWillMount(){
    this.userRef = this.props.fireBase.child("Users").child(this.props.user);
    this.userRef.once('value', this.getUser, this.getUserError);
    this.roomRef = this.props.fireBase.child("Rooms");
  }

  getUser(snapshot){
    this.setState({
      user: snapshot.val()
    });
  }

  getUserError(error){
    console.log(error);
  }

  createRoom(e){
    e.preventDefault();
    window.dispatchEvent(this.loading);
    this.refs.createRoom.disabled = true;
    this.roomRef.once('value', this.getRooms, this.getRoomsError);
  }

  getRooms(snapshot){
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
      owner: this.state.user.uid,
      roomId: roomNum
    });

    this.setState({
      roomNumber: roomNum
    });
    window.dispatchEvent(this.loadingDone);
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

  /*
    handle errors when trying to get the rooms list
  */
  getRoomsError(error){
    console.log(error);
  }

  componentDidMount(){
  }

  /*
    handling of the enter room form
  */

  handleEnterRoomSubmit(e){
    e.preventDefault();
    let valid = this.validateForm();

    if(valid){
      this.formVals = this.getSubmitVals();
    }else{
      window.dispatchEvent(this.msg('Error', 'You must enter a room number.', true));
    }
  }

  getSubmitVals(){
    var inputs = this.refs.form.querySelectorAll('input'),
        vals = {};
    for(var i = 0; i < inputs.length; i++ ){
      vals[inputs[i].name] = inputs[i].value;
    }
    return vals;
  }

  validateForm(){

    let inputs = this.refs.form.querySelectorAll('input[required]');
    let inputLength = inputs.length;
    let validLength = 0;

    if(this.refs.form.classList.contains('clean')){
      this.refs.form.classList.add('dirty');
      this.refs.form.classList.remove('clean');
    }

    for(var i = 0; i < inputLength; i++){
      let valid = this.validateInput(inputs[i]);
      if(valid) validLength++;
    }

    return (inputLength === validLength);
  }

  blur(e){
    this.validateInput(e.target);
  }

  validateInput(input){
    let valid = false;
    valid = (input.getAttribute('minlength') < input.value.length);
    (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
    return valid;
  }

  render(){
    return (
      <div className="user-home">
        <TopBar user={this.state.user} fireBase={this.props.fireBase}/>
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
                <Input name="roomNumber" type="text" placeholder="Room number" blur={this.blur} maxLength={1} maxLength={6} required={true}/>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default UserHome;
