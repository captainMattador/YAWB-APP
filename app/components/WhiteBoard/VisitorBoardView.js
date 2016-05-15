import React from 'react';

class VisitorBoardView extends React.Component {
  
  constructor(){
    super();
    this.boardDataRef;
    this.setBoardData=this.setBoardData.bind(this);
    this.setBoardDataError=this.setBoardDataError.bind(this);
    
  }
  
  componentDidMount(){ 
    this.boardDataRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child('BoardData');
    this.boardDataRef.on("value", this.setBoardData, this.setBoardDataError);
  }
  
  setBoardData(snapshot){
    var data=snapshot.val();
    console.log(data);
    var img=new Image();
    var self=this;
    img.onload=function(){
      self.refs.boardPic.src=this.src;
    };
    img.src=data;    
  }
  
  setBoardDataError(){
    
  }
  
  /**
   * 
   * React JS render board to the dom
   * 
   */
  render(){
    return (
      <div ref="canvasPic" className="canvas-pic"><img src="" ref="boardPic" /></div>
      
    )
  }

}

export default VisitorBoardView;