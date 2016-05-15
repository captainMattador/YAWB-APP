import React from 'react';

class VisitorBoardView extends React.Component {
  
  constructor(){
    super();
  }
  
  componentDidMount(){

  }
  
  /**
   * 
   * React JS render board to the dom
   * 
   */
  render(){
    return (
      <div ref="canvasPic" className="canvas-pic">Test of drawing board</div>
    )
  }

}

export default VisitorBoardView;