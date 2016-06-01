import React from 'react';

class Modal extends React.Component {

  constructor(){
    super();
  }

  render(){
    return (
      <div className={"modal-wrap " + this.props.modalActive}>
          <div className="modal">
            
            <div className="table">
                <div className="cell">
                    {this.props.children}
                </div>
            </div>
        
          </div>
      </div>
    )
  }

}

export default Modal;