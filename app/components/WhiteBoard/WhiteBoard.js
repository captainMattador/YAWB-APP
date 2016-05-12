import React from 'react';

class WhiteBoard extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <section className="white-board">
        <canvas id="canvas"></canvas>
      </section>
    )
  }

}

export default WhiteBoard;
