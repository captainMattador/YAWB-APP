import React from 'react';

class Room extends React.Component {

  tempBak(e){
    e.preventDefault();
    this.props.history.pushState(null, '/user-profile/');
  }

  render(){
    return (
      <div className="room">
        <section className="top-bar"></section>
        <section className="canvas">
            <canvas id="canvas"></canvas>
        </section>
        <button
          className="temp"
          onClick={(e) => this.tempBak(e)}>Temp back button</button>
      </div>
    )
  }

}

export default Room;
