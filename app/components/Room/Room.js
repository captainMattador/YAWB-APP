import React from 'react';
import TopBar from '../UiComponents/TopBar';

class Room extends React.Component {

  constructor(){
    super();
    this.userRef;

    this.state = {
      user: {
        fname: '',
        lname: '',
        email: ''
      }
    }
    this.getUser = this.getUser.bind(this);
    this.getUserError = this.getUserError.bind(this);
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
  }

  getUser(snapshot){
    this.setState({
      user: snapshot.val()
    });
  }

  getUserError(error){
    console.log(error);
  }

  strSubset(str, start, end){
    return str.substring(start, end);
  }

  componentDidMount(){
  }

  render(){
    return (
      <div className="room">
        <TopBar user={this.state.user} fireBase={this.props.fireBase}/>
        <section className="canvas">
            <canvas id="canvas"></canvas>
        </section>
      </div>
    )
  }

}

export default Room;
