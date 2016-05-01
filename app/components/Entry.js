import React from 'react';

class Entry extends React.Component {

  getRef(ref){
    this.usernameRef = ref;
  }

  handleSubmit(e){
    e.preventDefault();
    var input = e.target.querySelector('input');
    console.log(input);
  }

  handleCreateRoom(e){
    e.preventDefault();
    this.props.history.pushState(null, '/user-profile/');
  }

  render(){
    return (
      <div className="entry">
        <div className="table">
          <div className="cell">
            <div className="content">
              <h2>Step 1: Start or join a room</h2>
              <button
                className="cta-btn secondary"
                onClick={(e) => this.handleCreateRoom(e)}>Start a new room</button>
              <p><em>-or-</em></p>
              <form onSubmit={(e) => this.handleSubmit(e)}>
                <input
                  type="text"
                  name="roomNum"
                  maxLength="6"
                  placeholder="Enter room number:"
                  ref={(ref) => this.getRef(ref)} />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Entry;
