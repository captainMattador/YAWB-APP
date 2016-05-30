import React from 'react';

 /**
 * 
 * HTML for controls
 * CSS stying in room.scss
 * 
 */ 
class WhiteBoardControls extends React.Component {
  
  render(){
    return (
      <div id="board-controls" className="board-controls">
          
        <div className="pen-size control">
          <div className="pen-size-visual control-icon">
            <div><span></span></div>
          </div>
          <h3>Pen Size</h3>
          <div className="control-panel slider">
              <label for="pen-size">size:</label>
              <input id="pen-size" type="range" min="1" max="40"/>
          </div>
        </div>
        
        <div className="color control">
          <div className="color-visual control-icon">
            <div><span ref="colorVisual"></span></div>
          </div>
          <h3>Color</h3>
          <div className="control-panel slider">
              <label for="r-channel">r channel:</label>
              <input id="r-channel" type="range" min="0" max="255"/>
              <label for="g-channel">b channel:</label>
              <input id="g-channel" type="range" min="0" max="255"/>
              <label for="b-channel">g channel:</label>
              <input id="b-channel" type="range" min="0" max="255"/>
              <label for="alpha-channel">opacity:</label>
              <input id="alpha-channel" type="range" min="0" max="100"/>
          </div>
        </div>
        
        <div className="mode control">
          <div className="mode-visual control-icon"><i className="fa fa-pencil" aria-hidden="true"></i></div>
          <h3>Pen</h3>
          <div className="control-panel">
              <ul id="mod-list">
                <li data-mode="pen" data-icon="fa fa-pencil" data-text="Pen">
                  pen: <i className="fa fa-pencil" aria-hidden="true" data-text=""></i>
                </li>
                <li data-mode="eraser" data-icon="fa fa-eraser" data-text="Eraser">
                  eraser: <i className="fa fa-eraser" aria-hidden="true"></i>
                </li>
                <li data-mode="text" data-icon="fa fa-font" data-text="Text">
                  text: <i className="fa fa-font" aria-hidden="true"></i>
                </li>
                <li data-mode="image" data-icon="fa fa-file-image-o" data-text="Image">
                  image: <i className="fa fa-file-image-o" aria-hidden="true"></i>
                </li>
              </ul>
          </div>
        </div>
        
        <div className="commands control">
          <div className="commands control-icon"><i className="fa fa-terminal" aria-hidden="true"></i></div>
          <h3>Commands</h3>
          <div className="control-panel">
              <ul id="mod-list">
                <li data-command="clear">
                  clear
                </li>
                <li data-command="undo">
                  undo
                </li>
                <li data-command="save">
                  save to file
                </li>
              </ul>
          </div>
        </div>
        {

        }
        <div className="previous control">  
          <h3>Previous</h3>     
          <div className="prevBoard control-icon"><i className="fa fa-chevron-left" aria-hidden="true"></i></div> 
        </div>
        
        <div className="next control">  
          <h3>Next</h3>     
          <div className="nextBoard control-icon"><i className="fa fa-chevron-right" aria-hidden="true"></i></div> 
        </div>
      </div>
    )
  }
}

export default WhiteBoardControls;