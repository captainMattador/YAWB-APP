import React from 'react';
import io from 'socket.io-client';

class VisitorBoardView extends React.Component {
  
  constructor(){
    super();
    
    //sockets
    this.socket;
    this.socketHost = 'http://159.203.245.200:8080/board-data';
    
    // canvas vars
    this._canvas;
    this._canvasWidth;
    this._canvasHeight;
    this._ctx;
    
    // socket functions
    this.drawRender = this.drawRender.bind(this);
  }
  
  componentDidMount(){ 
    this.setBaseAttributes();
    
    // socket events 
    this.socket = io.connect(this.socketHost);
    this.socket.on('emited-drawing-points', this.drawRender);
  }
  
  setBaseAttributes(){
    this._canvas = this.refs.whiteBoard;
    this._ctx = this._canvas.getContext("2d");
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
  }
  
  drawRender(points) {
    var len = points.length;
    this._ctx.lineWidth = 5;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.strokeStyle = 'blue';
    
    if(len === 2){
      points[1].x += .5;
      points[1].y += .5;
    }
    
    this._ctx.beginPath();
    this._ctx.moveTo(points[0].x, points[0].y);
    
    for (var i = 1; i < len; i++) {
      this._ctx.lineTo(points[i].x, points[i].y);
    }
    
    this._ctx.stroke();
    this._ctx.closePath();
  }
  
  /**
   * 
   * React JS render board to the dom
   * 
   */
  render(){
   return (
      <canvas 
            ref="whiteBoard" 
            id="canvas"
            width="980"
            height="551"></canvas>
    )
  }

}

export default VisitorBoardView;