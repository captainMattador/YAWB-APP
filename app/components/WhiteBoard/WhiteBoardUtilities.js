import {clientPosition} from '../../utils/helpers';
import Stack from '../../datastructures/stack';
import Events from '../../utils/events-handler';

var self;

 /**
 * 
 *class sends UI interactions to server
 * 
 */ 
class WhiteBoardUtilities{
  
  constructor(canvas, controls, socket){
    
    self = this;
    
    // dom elements
    this.textForm;
    this.textInput;
    this.controls = controls;
    this.vidControl = controls.querySelector('.video-visual');
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
    this.prevBoard = controls.querySelector('.prevBoard');
    this.nextBoard = controls.querySelector('.nextBoard');
    this.snapshot = controls.querySelector('.snapshot');
    
    // sockets and storages
    this.socket = socket;
    this.events = new Events(); 
    this.keys = [];
    
    // canvas vars
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    
    this.mode;
    this.color;
    this.alpha;
    this.penSize;
    
    // drawing specific vars
    this.drawFlag = false;
    this.points = [];
    
    // text specific vars
    this.activeText = false;
    this.textFormInteracting = false;
    this.textPos = {};
    this.font = 'Roboto';
    this.textSize = 16;
    this.createTextForm();
    
    // set initial drawing tool values
    this.initVals();
    
    // initialize all the board events and socket events
    this.initEvents();
  }
  
  // public functions for handling board interactions
  destroy(){
    this.events.removeAllEvents();
  }
  
  initVals(){
    this.penSizeInput.value = 1;
    this.rChannel.value = 0;
    this.gChannel.value = 0;
    this.bChannel.value = 0;
    this.aChannel.value = 100;
    this.setMode('pen')
    this.changeColor();
    this.penSize = 1;
  }
  // private functions for handling board interactions
  initEvents(){    
    // dom events
    for(var i = 0; i < this.control.length; i++){
        this.events.addEvent(this.control[i], 'click', this.toggleControlPanel);
    }
    for(var i = 0; i < this.modeList.length; i++){
        this.events.addEvent(this.modeList[i], 'click', this.updateMode);
    }
    for(var i = 0; i < this.commandsList.length; i++){
        this.events.addEvent(this.commandsList[i], 'click', this.executeCommand);
    }
    this.events.addEvent(this.vidControl, 'click', this.toggleVideo.bind(this));
    this.events.addEvent(this.canvas, 'click', this.addText.bind(this));
    this.events.addEvent(this.canvas, 'mousedown', this.closeControlPanel.bind(this));
    this.events.addEvent(this.rChannel, 'input', this.changeColor.bind(this));
    this.events.addEvent(this.gChannel, 'input', this.changeColor.bind(this));
    this.events.addEvent(this.bChannel, 'input', this.changeColor.bind(this));
    this.events.addEvent(this.aChannel, 'input', this.changeColor.bind(this));
    this.events.addEvent(this.penSizeInput, 'input', this.changePenSize.bind(this));
    this.events.addEvent(document.body, 'keydown', this.keyPressHandler.bind(this));
    this.events.addEvent(document.body, 'keyup', this.keyReleasedHandler.bind(this));
    this.events.addEvent(this.canvas, 'mousedown', this.drawDown.bind(this));
    this.events.addEvent(this.canvas, 'mousemove', this.drawMove.bind(this));
    this.events.addEvent(document.body, 'mouseup', this.drawOff.bind(this));
    this.events.addEvent(this.prevBoard, 'click', this.prevCanvas.bind(this));
    this.events.addEvent(this.nextBoard, 'click', this.nextCanvas.bind(this));
 //   this.events.addEvent(this.snapshot, 'click', this.snapshot.bind(this));
  }
  
  
  toggleVideo(e){
    e.preventDefault();
    e.currentTarget.classList.toggle('videoActive');
    self.socket.emit('toggle-board');
  }
  
  prevCanvas (e){
    e.preventDefault();
  //  console.log("go to Previous Board");
    this.socket.emit('update-page', {
      direction: 'previous'
    });
  }
  
  nextCanvas (e){
    e.preventDefault();
  //  console.log("go to Next Board");
    this.socket.emit('update-page', {
      direction: 'next'
    });
  }  
  
  snapshot (e){
    e.preventDefault();
    console.log("go to snapshot");
  //  this.socket.emit('take-snapshot');
  }  
  
  keyPressHandler(e){
    this.keys[e.keyCode] = true;
    
    if(this.keys[91] && this.keys[90]){
      this.undoHistory();
    }
  }
  
  keyReleasedHandler(e){
    this.keys = [];
  }
  
  executeCommand(){
    var contorl = this.parentNode.parentNode.parentNode;
    switch(this.dataset.command){
      case 'clear':
        var clearConfirmed = confirm("Clear whiteboard?");
        if (clearConfirmed) {
          self.socket.emit('clear-board');
        }
        break;
      case 'undo':
        self.undoHistory();
        break;
    }
    contorl.classList.remove('active');
  }
  
  updateMode(e){
    e.preventDefault();
    var contorl, icon, title;
    
    // clear text box if visible
    if(self.mode === 'text'){
      self.activeText = false;
      self.textForm.classList.remove('active');
    }
    
    self.setMode(this.dataset.mode);
    contorl = this.parentNode.parentNode.parentNode;
    icon = contorl.querySelector('.fa');
    title = contorl.querySelector('h3');
    icon.className = this.dataset.icon;
    title.innerHTML = this.dataset.text;
    contorl.classList.remove('active');
  }
  
  setMode(mode){
    this.mode = mode;
    this.canvas.className = mode;
  }
  
  undoHistory(){
    self.socket.emit('undo-history');
  }
  
  addPoint(point){
    var rect = this.canvas.getBoundingClientRect(),
        pos = clientPosition(point);
    this.points.push({
      x: pos.x - rect.left,
      y: pos.y - rect.top
    });
  }
  
  /**
   * 
   * handle adding text to the board
   * 
   */
  
  // adding text form to the page and defining its handlers
  createTextForm(){
    this.textForm = document.createElement('form');
    this.textInput = document.createElement('input');
    this.textInput.setAttribute('placeHolder', 'Text here');
    this.textForm.className= 'text-mode-input';
    this.textForm.style.top = '0px';
    this.textForm.style.left = '0px';
    this.textForm.appendChild(this.textInput);
    document.body.appendChild(this.textForm);
    
    this.textFormEvents();
  }
  
  addText(point){
    if(this.mode !== 'text' || this.activeText) return;
    this.activeText = true;
    this.positionTextForm(clientPosition(point));
  }
  
  positionTextForm(point){
    this.textInput.value = '';
    this.textForm.classList.add('active');
    this.textForm.style.top = point.y - (this.textSize/2) + 'px';
    this.textForm.style.left = point.x + 'px';
    this.textFormSetWidth(point);
    this.textFormSetTextPosition(point);
    this.textInput.focus();
  }
  
  textFormEvents(){
    this.events.addEvent(this.textForm, 'submit', this.textFormSubmit);
  }

  textFormSubmit(e){
    e.preventDefault();
    
    self.textForm.classList.remove('active');
    self.activeText = false;
    self.socket.emit('adding-text', {
      color: self.color,
      alpha: self.alpha,
      font: self.textSize + 'px' + ' ' + self.font,
      pos: self.textPos,
      text: self.textInput.value
    });
  }
  
  textFormSetWidth(point){
    var rect = this.canvas.getBoundingClientRect();
    this.textForm.style.width = (this.canvasWidth -  point.x + rect.left) + 'px';
  }
  
  textFormSetTextPosition(point){
    var rect = this.canvas.getBoundingClientRect();
    this.textPos.x = point.x - rect.left;
    this.textPos.y = point.y - (this.textSize/2) - rect.top;
  }
  
  /**
   * 
   * pencil/highlighter/eraser drawing functions
   * 
   */
  drawDown(point){
    if(this.mode !== 'pen' && this.mode !== 'eraser') return;
    this.drawFlag = true;
    this.addPoint(point);
    this.addPoint(point);
    this.emitDrawingData();
  }
  
  drawMove(point){
    if(!this.drawFlag) return;
    this.addPoint(point);
    this.emitDrawingData();
  }
  
  drawOff(e){
    if(!this.drawFlag) return;
    this.drawFlag = false;
    this.points = [];
    this.socket.emit('finalize-board');
  }
  
  emitDrawingData(){
    this.socket.emit('drawing-points', {
        penSize: this.penSize,
        color: (this.mode !== 'eraser') ? this.color : 'rgb(255, 255, 255)',
        alpha: (this.mode !== 'eraser') ? this.alpha : 1,
        points: this.points
    });
  }
  
  
  /**
   * 
   * clear the board
   * 
   */
  clearBoard() {
      this.socket.emit('clear-board');
  }
  
  
  /**
   * 
   * function for changing values of tools
   * 
   */
  
  changeColor(e){
    let rVal = this.rChannel.value;
    let gVal = this.gChannel.value;
    let bVal = this.bChannel.value;
    this.color = 'rgb('+rVal+','+bVal+','+gVal+')';
    this.alpha = (this.aChannel.value / 100);
    this.colorVisual.style.backgroundColor = 'rgb('+rVal+','+bVal+','+gVal+')';
  }
  
  changePenSize(e){
    self.penSize = self.penSizeInput.value;
    self.penSizeVisual.style.height = self.penSize + 'px';
    self.penSizeVisual.style.width = self.penSize + 'px';
    self.penSizeVisual.style.marginLeft = -(self.penSize/2) + 'px';
    self.penSizeVisual.style.marginTop = -(self.penSize/2) + 'px';
  }
  
  closeControlPanel(e){
    e.preventDefault();
    var active = this.controls.querySelector('.active');
    if(active) active.classList.remove('active');
  }
  
  toggleControlPanel(e){
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
