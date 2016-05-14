import React from 'react';
import {clientPosition, jsVendorPrefix} from '../../utils/helpers';
import {circle} from './shapes';
import Stack from '../../datastructures/stack';
import Events from '../../utils/events-handler';

class WhiteBoard extends React.Component {
  
  constructor(){
    super();
    
    // events manager
    this._events = new Events(); 
    
    // history
    this.history = new Stack({max: 20});
    
    // drawing vars
    this._mode = 'pen';
    this._drawFlag = false;
    this._points = [];   
    this._keys = []; 
    this._canvas;
    this._canvasWidth;
    this._canvasHeight;
    this._ctx;
    
    // binding this
    this.drawMove = this.drawMove.bind(this);
    this.drawDown = this.drawDown.bind(this);
    this.drawOff = this.drawOff.bind(this);
    this.keyPressHandler = this.keyPressHandler.bind(this);
    this.keyReleasedHandler = this.keyReleasedHandler.bind(this);
  }
  
  componentDidMount(){
    this.setBaseAttributes();
    
    this._events.addEvent(document.body, 'keydown', this.keyPressHandler);
    this._events.addEvent(document.body, 'keyup', this.keyReleasedHandler);
    this._events.addEvent(this._canvas, 'mousedown', this.drawDown);
    this._events.addEvent(this._canvas, 'mousemove', this.drawMove);
    this._events.addEvent(document.body, 'mouseup', this.drawOff);
  }
  
  setBaseAttributes(){
    this._canvas = this.refs.whiteBoard;
    this._ctx = this._canvas.getContext("2d");
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
    
    // blank image canvas into history, so after first draw you can revert 
    this.history.push(getCanvasData());
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
  
  getCanvasData(){
    return this._ctx.getImageData(0, 0, this._canvasWidth, this._canvasHeight);
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
    // adds two points at start to create a dot
    // if no movement occurs
    this.addPoint(point);
    this.drawRender();
  }
  
  drawMove(point){
    if(!this._drawFlag) return;
    this.addPoint(point);
    this.drawRender();
  }
  
  drawOff(e){
    this._drawFlag = false;
    this._points = [];
    this.history.push(getCanvasData());
  }
  
  drawRender() {
    var len = this._points.length;
    this._ctx.lineWidth = 5;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.strokeStyle = 'blue';
    
    if(len === 2){
      this._points[1].x += .5;
      this._points[1].y += .5;
    }
    
    this._ctx.beginPath();
    this._ctx.moveTo(this._points[0].x, this._points[0].y);
    
    for (var i = 1; i < len; i++) {
      this._ctx.lineTo(this._points[i].x, this._points[i].y);
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
      <section className="white-board">
        <canvas 
          ref="whiteBoard" 
          id="canvas"
          width="980"
          height="551"></canvas>
      </section>
    )
  }

}

export default WhiteBoard;
