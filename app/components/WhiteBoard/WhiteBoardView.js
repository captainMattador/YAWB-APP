import React from 'react';
import io from 'socket.io-client';
import WhiteBoardControls from './WhiteBoardControls';
import WhiteBoardUtilities from './WhiteBoardUtilities';
import Stack from '../../datastructures/stack';
import {updateRoute, loading, msg} from '../../utils/CustomEvents';

class WhiteBoardView extends React.Component {
  
  constructor(){
    super();
    
    this.wbUtils;
    this.socket;
    this._history = new Stack({max: 20});
    
    if(navigator.getUserMedia){
      console.log('good news you have getUserMedia!');
    }
    
    // dom canvas
    this._canvas;
    this._ctx;
    this._canvasWidth;
    this._canvasHeight;
    
    // in memory canvas
    this._memCanvas;
    this._memCtx;
    this._memCanvasWidth;
    this._memCanvasHeight;
    
    // socket functions
    this.drawRender = this.drawRender.bind(this);
    this.snapshotBoard = this.snapshotBoard.bind(this);
    this.textRender = this.textRender.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.undoHistory = this.undoHistory.bind(this);
    this.updatePage = this.updatePage.bind(this);
    
    //page manager
    this.pages = [];   //creates method in WhiteboardView, everything Whiteboard view has access
    this.maxBoards = 10;
    this.pageIndex = 0;
  }
  
  componentDidMount(){
    //canvas in DOM
    this._canvas = this.refs.whiteBoard;
    this._ctx = this._canvas.getContext("2d");
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
    //canvas in memory
    this._memCanvas = document.createElement('canvas');
    this._memCtx = this._memCanvas.getContext("2d");
    this._memCanvas.width = this._canvasWidth;
    this._memCanvas.height = this._canvasHeight;
    this.snapshotBoard(); // capture the blank state for history purposes
    
    // connect grab the socket connect from the Room view.
    this.socket = this.props.socket;
    
    if(YAWB.user.owner){
      this.wbUtils = new WhiteBoardUtilities(
        this._canvas,
        document.getElementById('board-controls'), 
        this.socket);
    }
    
    // add events
    this.socket.on('emited-drawing-points', this.drawRender);
    this.socket.on('emited-finalize-board', this.snapshotBoard);
    this.socket.on('emited-text-added', this.textRender);
    this.socket.on('emited-clear-board', this.clearBoard);
    this.socket.on('emited-undo-history', this.undoHistory);
    this.socket.on('emited-update-page', this.updatePage);
  }
  
  componentWillUnmount(){
    if(YAWB.user.owner){
      this.wbUtils.destroy();
    }
    this.socket.removeListener('emited-drawing-points', this.drawRender);
    this.socket.removeListener('emited-finalize-board', this.snapshotBoard);
    this.socket.removeListener('emited-text-added', this.textRender);
    this.socket.removeListener('emited-clear-board', this.clearBoard);
    this.socket.removeListener('emited-undo-history', this.undoHistory);
    this.socket.removeListener('emited-update-page', this.updatePage);
    this.socket.disconnect();
  }
  
  drawRender(data) {
    var len = data.points.length;
    this._ctx.clearRect(0, 0, this._canvasWidth, this._canvas.height);
    this._ctx.drawImage(this._memCanvas, 0, 0);
    
    this._ctx.save();
    this._ctx.lineWidth = data.penSize;
    this._ctx.lineJoin = 'round';
    this._ctx.lineCap = 'round';
    this._ctx.shadowBlur = data.penSize * .1;
    this._ctx.shadowColor = data.color;
    this._ctx.strokeStyle = data.color;
    this._ctx.globalAlpha = data.alpha;
        
    if(len === 2){
      data.points[1].x += .5;
      data.points[1].y += .5;
    }
    
    this._ctx.beginPath();
    this._ctx.moveTo(data.points[0].x, data.points[0].y);
    
    for (var i = 1; i < len; i++) {
      this._ctx.lineTo(data.points[i].x, data.points[i].y);
    }
    
    this._ctx.stroke();
    this._ctx.restore();
  }
  
  /**
   * capture steps of the boad
   * as well as put into the history stack
   * (call after any big update to the board)
   */
  snapshotBoard(){
    var data = this._ctx.getImageData(0, 0, this._canvasWidth, this._canvas.height);
    this._memCtx.clearRect(0, 0, this._canvasWidth, this._canvas.height);
    this._memCtx.putImageData(data, 0, 0);
    this.addToHistory();
    return (data);
  }
 
  
  textRender(data){
    this._ctx.save();
    
    this._ctx.font = data.font;
    this._ctx.fillStyle = data.color;
    this._ctx.globalAlpha = data.alpha;
    this._ctx.textBaseline = 'top'; 
    this._ctx.fillText(data.text, data.pos.x, data.pos.y);
    
    this._ctx.restore();
    this.snapshotBoard();
  }
  
  clearBoard(){
    this._memCtx.clearRect(0, 0, this._canvasWidth, this._canvas.height);
    this._ctx.clearRect(0, 0, this._canvasWidth, this._canvas.height);
    this.snapshotBoard();
  }
  
  undoHistory(){
    if(this._history.size() > 1){
      this._history.pop();
      this._ctx.putImageData(this._history.peek(), 0, 0);
      this._memCtx.putImageData(this._history.peek(), 0, 0);
    }
  }

  /**
 * 
 *portion to handle pagination
 * 
 */
  announcePageError(message){
    msg('Error', message, true);
  }  
  
  updatePage(data){
    
    var direction = data.direction;
    if (this.pageIndex === 0 && direction === "previous"){
      this.announcePageError("No previous page");
      return;
    }
    else if (this.pageIndex === this.maxBoards-1 && direction ==="next"){
      this.announcePageError("Maximum pages is reached");
      return;
    }
    this.pageIndex++;
    console.log(data);
  }
  
  // save current Page (points, ctx, ) to pages, decrement pageIndex, display  
  // previousPage(pageIndex){
  //   var imgData;
  //   if (pageIndex===0){
  //     announcePageError('No previous page');
  //     return; 
  //   }
  //   imgData = this._ctx.getImageData(0, 0, this._canvasWidth, this._canvasHeight);
  //   pages[pageIndex]=imgData;
  //   pageIndex--;
  //   this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
  //   this._ctx.putImageData(0,0,pages[this.pageIndex]);
  //   //display new pageIndex?
  // } 
  
  // save current Page (points, ctx, ) to pages, increment pageIndex, restore context and draw board
  // nextPage(pageIndex){
  //   var imgData;
  //   imgData = this._ctx.getImageData(0, 0, this._canvasWidth, this._canvasHeight);
  //   pages[pageIndex]=imgData;
  //   this.pageIndex++;
  //   this._ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
  //   //display new Page Index?
    
  // }*/
  
  addToHistory(){
    this._history.push(this._memCtx.getImageData(0, 0, this._canvasWidth, this._canvas.height));
  }

  render(){
    
    var boardControls;
    if(YAWB.user.owner){
      boardControls = <WhiteBoardControls/>
    }
    
    return (
      <section className="white-board">
        {boardControls}
        <canvas 
              ref="whiteBoard" 
              id="canvas"
              width="980"
              height="551"></canvas>
      </section>
    )
  }

}

export default WhiteBoardView;
