import React from 'react';
import OwnerView from './OwnerView'
import VisitorView from './VisitorView'

class WhiteBoard extends React.Component {
  
  constructor(){
    super();
    console.log(YAWB.user.owner);
  }
  
  componentDidMount(){

  }
  
  renderBoardArea(){
    if(YAWB.user.owner){
      return <OwnerView/>;
    }else{
      <VisitorView/>;
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
        {this.renderBoardArea()}
      </section>
    )
  }

}

export default WhiteBoard;
