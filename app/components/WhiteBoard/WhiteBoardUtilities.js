import io from 'socket.io-client';
import {clientPosition} from '../../utils/helpers';
import Stack from '../../datastructures/stack';
import Events from '../../utils/events-handler';

var self;

class WhiteBoardUtilities{
  
  constructor(canvas, controls, socket){
    
    self = this;
    
    // dom elements
    this.controls = controls;
    this.control = controls.querySelectorAll('.control-icon');
    this.penSizeVisual = controls.querySelector('.pen-size-visual span');
    this.penSizeInput = controls.querySelector('#pen-size');
    this.rChannel = controls.querySelector('#r-channel');
    this.gChannel = controls.querySelector('#g-channel');
    this.bChannel = controls.querySelector('#b-channel');
    this.aChannel = controls.querySelector('#alpha-channel');
    this.colorVisual = controls.querySelector('.color-visual span');
    this.modList = controls.querySelector('#mod-list');
    this.modeList = controls.querySelectorAll('.mode.control li');
    this.commandsList = controls.querySelectorAll('.commands.control li');
    
    // sockets and storages
    this.socket = socket;
    this._events = new Events(); 
    this._history = new Stack({max: 20});
    this._keys = [];
    
    // canvas vars
    this._canvas = canvas;
    this._ctx = this._canvas.getContext("2d");
    this._canvasWidth = this._canvas.width;
    this._canvasHeight = this._canvas.height;
    
    this._mode;
    this._color;
    this._alpha;
    this._penSize;
    
    // drawing specific vars
    this._drawFlag = false;
    this._points = [];
    
    // set initail drawing tool values
    this._initVals();
    
    // initialize all the board events and socket events
    this._initEvents();
  }
  
  // public functions for handling board interactions
  destroy(){
    this._events.removeAllEvents();
  }
  
  _initVals(){
    this.penSizeInput.value = 1;
    this.rChannel.value = 0;
    this.gChannel.value = 0;
    this.bChannel.value = 0;
    this.aChannel.value = 100;
    this._mode = 'pen';
    this._changeColor();
    this._penSize = 1;
  }
  // private functions for handling board interactions
  _initEvents(){    
    // dom events
    for(var i = 0; i < this.control.length; i++){
        this._events.addEvent(this.control[i], 'click', this._toggleControlPanel);
    }
    for(var i = 0; i < this.modeList.length; i++){
        this._events.addEvent(this.modeList[i], 'click', this._updateMode);
    }
    for(var i = 0; i < this.commandsList.length; i++){
        this._events.addEvent(this.commandsList[i], 'click', this._executeCommand);
    }
    this._events.addEvent(this._canvas, 'mousedown', this._closeControlPanel.bind(this));
    this._events.addEvent(this.rChannel, 'input', this._changeColor.bind(this));
    this._events.addEvent(this.gChannel, 'input', this._changeColor.bind(this));
    this._events.addEvent(this.bChannel, 'input', this._changeColor.bind(this));
    this._events.addEvent(this.aChannel, 'input', this._changeColor.bind(this));
    this._events.addEvent(this.penSizeInput, 'input', this._changePenSize.bind(this));
    this._events.addEvent(document.body, 'keydown', this._keyPressHandler.bind(this));
    this._events.addEvent(document.body, 'keyup', this._keyReleasedHandler.bind(this));
    this._events.addEvent(this._canvas, 'mousedown', this._drawDown.bind(this));
    this._events.addEvent(this._canvas, 'mousemove', this._drawMove.bind(this));
    this._events.addEvent(document.body, 'mouseup', this._drawOff.bind(this));
  }
  
  _keyPressHandler(e){
    this._keys[e.keyCode] = true;
    
    if(this._keys[91] && this._keys[90]){
      this._undoHistory();
    }
  }
  
  _keyReleasedHandler(e){
    this._keys = [];
  }
  
  _executeCommand(){
    var contorl = this.parentNode.parentNode.parentNode;
    console.log(this.dataset);
    switch(this.dataset.command){
      case 'clear':
        var clearConfirmed = confirm("Clear whiteboard?");
        if (clearConfirmed) {
          self.socket.emit('clear-board');
        }
        break;
      case 'undo':
        self._undoHistory();
        break;
    }
    contorl.classList.remove('active');
  }
  
  _updateMode(e){
    e.preventDefault();
    var contorl, icon, title;
    self._mode = this.dataset.mode;
    contorl = this.parentNode.parentNode.parentNode;
    icon = contorl.querySelector('.fa');
    title = contorl.querySelector('h3');
    icon.className = this.dataset.icon;
    title.innerHTML = this.dataset.text;
    contorl.classList.remove('active');
  }
  
  _undoHistory(){
    self.socket.emit('undo-history');
  }
  
  _addPoint(point){
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
  _drawDown(point){
    if(this._mode !== 'pen' && this._mode !== 'eraser') return;
    this._drawFlag = true;
    this._addPoint(point);
    this._addPoint(point);
    this.socket.emit('drawing-points', {
        penSize: this._penSize,
        color: (this._mode !== 'eraser') ? this._color : 'rgb(255, 255, 255)',
        alpha: (this._mode !== 'eraser') ? this._alpha : 1,
        points: this._points
    });
  }
  
  _drawMove(point){
    if(!this._drawFlag) return;
    this._addPoint(point);
    this.socket.emit('drawing-points', {
        penSize: this._penSize,
        color: (this._mode !== 'eraser') ? this._color : 'rgb(255, 255, 255)',
        alpha: (this._mode !== 'eraser') ? this._alpha : 1,
        points: this._points
    });
  }
  
  _drawOff(e){
    if(!this._drawFlag) return;
    this._drawFlag = false;
    this._points = [];
    this.socket.emit('finalize-board');
  }
  
  _clearBoard() {
      this.socket.emit('clear-board');
  }
  
  _changeColor(e){
    let rVal = this.rChannel.value;
    let gVal = this.gChannel.value;
    let bVal = this.bChannel.value;
    this._color = 'rgb('+rVal+','+bVal+','+gVal+')';
    this._alpha = (this.aChannel.value / 100);
    this.colorVisual.style.backgroundColor = 'rgb('+rVal+','+bVal+','+gVal+')';
  }
  
  _changePenSize(e){
    self._penSize = self.penSizeInput.value;
    self.penSizeVisual.style.height = self._penSize + 'px';
    self.penSizeVisual.style.width = self._penSize + 'px';
    self.penSizeVisual.style.marginLeft = -(self._penSize/2) + 'px';
    self.penSizeVisual.style.marginTop = -(self._penSize/2) + 'px';
  }
  
  _closeControlPanel(e){
    e.preventDefault();
    var active = this.controls.querySelector('.active');
    if(active) active.classList.remove('active');
  }
  
  _toggleControlPanel(e){
    e.preventDefault();
    var currActive = self.controls.querySelector('.active'),
        parent = this.parentNode;
    if(parent.classList.contains('active')){
        currActive.classList.remove('active');
        return;
    }
    else if(currActive) currActive.classList.remove('active');
    parent.classList.add('active'); 
  }
  
}

export default WhiteBoardUtilities;
