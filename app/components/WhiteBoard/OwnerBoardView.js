import React from 'react';
import io from 'socket.io-client';
import {clientPosition, jsVendorPrefix} from '../../utils/helpers';
import {circle} from './shapes';
import Stack from '../../datastructures/stack';
import Events from '../../utils/events-handler';

class OwnerBoardView extends React.Component {
  
  constructor(){
    super();
    
    console.log('should get called');
    
    //sockets
    this.socket;
    this.socketHost = 'http://159.203.245.200:8080/board-data';
    
    // events manager
    this._events = new Events(); 
    
    // history
    this.history = new Stack({max: 20});
    this._keys = [];
    
    // canvas vars
    this._canvas;
    this._canvasWidth;
    this._canvasHeight;
    this._ctx;
    
    // drawing vars
    this._mode = 'pen';
    this._drawFlag = false;
    this._points = [];   
    
    // binding this
    this.drawMove = this.drawMove.bind(this);
    this.drawDown = this.drawDown.bind(this);
    this.drawOff = this.drawOff.bind(this);
    this.keyPressHandler = this.keyPressHandler.bind(this);
    this.keyReleasedHandler = this.keyReleasedHandler.bind(this);
    
    // socket functions
    this.drawRender = this.drawRender.bind(this);
  }
  
  componentDidMount(){
    this.setBaseAttributes();
    
    // socket events 
    this.socket = io.connect(this.socketHost);
    this.socket.on('emited-drawing-points', this.drawRender);
    
    // dom events
    this._events.addEvent(document.body, 'keydown', this.keyPressHandler);
    this._events.addEvent(document.body, 'keyup', this.keyReleasedHandler);
    this._events.addEvent(this._canvas, 'mousedown', this.drawDown);
    this._events.addEvent(this._canvas, 'mousemove', this.drawMove);
    this._events.addEvent(document.body, 'mouseup', this.drawOff);
  }
  
  componentWillUnmount(){
    this._events.removeAllEvents();
    this.socket.removeListener('emited-drawing-points', this.drawRender);
    this.socket.disconnect();
  }
  
  setBaseAttributes(){
    this._canvas = this.refs.whiteBoard;
    this._ctx = this._canvas.getContext("2d");
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
  }
  
  keyPressHandler(e){
    this._keys[e.keyCode] = true;
    
    if(this._keys[91] && this._keys[90]){
      this.undoHistory();
    }
  }
  
  keyReleasedHandler(e){
    this._keys = [];
  }
  
  mode(mode){
    switch(mode) {
      case 'pen':
        break;
			}
  }
  
  undoHistory(){
    if(this.history.size() > 1){
      this.history.pop();
      this._ctx.putImageData(this.history.peek(), 0, 0);
    }
  }
  
  addPoint(point){
    var rect = this._canvas.getBoundingClientRect(),
        pos = clientPosition(point);
    this._points.push({
      x: pos.x - rect.left,
      y: pos.y - rect.top
    });
  }
  
  /**
   * 
   * pencil/highlighter/eraser drawing functions
   * 
   */
  drawDown(point){
    this._drawFlag = true;
    this.addPoint(point);
    this.addPoint(point);
    this.socket.emit('drawing-points', this._points);
  }
  
  drawMove(point){
    if(!this._drawFlag) return;
    this.addPoint(point);
    this.socket.emit('drawing-points', this._points);
  }
  
  drawOff(e){
    this._drawFlag = false;
    this._points = [];
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
   * Set ctx context for the different types of modes
   * 
  */
  
  /**
   * 
   * conpletely clear the boards
   * 
   */
  clearBoard() {
    var clearConfirmed = confirm("Clear whiteboard?");
    if (clearConfirmed) {
      this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
    }
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

export default OwnerBoardView;
