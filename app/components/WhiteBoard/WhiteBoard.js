import React from 'react';
import {clientPosition, jsVendorPrefix} from '../../utils/helpers';
import {circle} from './shapes';
import Events from '../../utils/events-handler';

var Point = function (x, y){
  this.x = x;
  this.y = y
}

class WhiteBoard extends React.Component {

  constructor(){
    super();
    
    // drawing vars
    this._drawFlag = false;
    this._points = [];
    this._events = new Events();    
    this._canvas;
    this._ctx;
    this._canvasWidth;
    this._canvasHeight;
    
    // binding this
    this.drawMove = this.drawMove.bind(this);
    this.drawDown = this.drawDown.bind(this);
    this.drawOff = this.drawOff.bind(this);
  }
  
  componentDidMount(){
    this.setBaseAttributes();
    this._events.addEvent(this._canvas, 'mousedown', this.drawDown);
    this._events.addEvent(this._canvas, 'mousemove', this.drawMove);
    this._events.addEvent(document.body, 'mouseup', this.drawOff);
  }
  
  setBaseAttributes(){
    this._canvas = this.refs.whiteBoard;
    this._ctx = this._canvas.getContext("2d");
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
  }
  
  mode(mode){
    switch(mode) {
      case 'pen':
        break;
			}
  }
  
  
  /**
   * pencil/highlighter/eraser drawing functions
   */
  drawDown(point){
    this._drawFlag = true;
    this._addPoint(point);
    this._render();
  }
  
  drawMove(point){
    if(!this._drawFlag) return;
    this._addPoint(point);
    this._render();
  }
  
  drawOff(e){
    this._drawFlag = false;
    this._points = [];
  }
  
  _addPoint(point){
    var rect = this._canvas.getBoundingClientRect(),
        p = new Point(point.clientX - rect.left, point.clientY - rect.top);
    this._points.push(p);
  }
  
  _render() {
    var p1, p2;    
    if(this._points.length === 1){
      p1 = this._points[0];
      p2 = {
        x: p1.x + .5,
        y: p1.y + .5
      };
    }else{
      p1 = this._points[0];
      p2 = this._points[1];
      this._points.splice(0, 1);
    }
    this._ctx.lineWidth = 10;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.strokeStyle = 'blue';
    
    this._ctx.beginPath();
    this._ctx.moveTo(p1.x, p1.y);
    //this._ctx.quadraticCurveTo(p2.x, p2.y, midPoint.x, midPoint.y);
    this._ctx.lineTo(p2.x, p2.y);
    this._ctx.stroke();
    this._ctx.closePath();
  }
  
  /**
   * conpletely clear the boards
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
