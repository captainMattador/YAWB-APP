import React from 'react';

class CommentList extends React.Component {

  constructor(){
    super();
    this.state = {
      comments: []
    };
    this.commentsRef;
    this.commentsUpdated = this.commentsUpdated.bind(this);
  }

  componentDidMount(){
    this.commentsRef = YAWB.fbRef.child('Rooms').child(YAWB.user.activeRoom)
      .child('PeerComments');
    this.commentsRef.on('value', this.commentsUpdated);
  }

  componentWillUnmount(){
    this.commentsHandler.off('value', this.commentsUpdated);
  }

  componentDidUpdate(){
    this.refs.commentList.scrollTop = this.refs.commentList.clientHeight;
  }

  commentsUpdated(snapShot){
    let comments = this.flattenComments(snapShot.val());
    this.setState({
      comments: comments
    });
  }

  flattenComments(obj){
    let arr = [];
    for(let prop in obj){
      let key = prop;
      obj[prop]['key'] = prop;
      arr.push(obj[prop]);
    }
    return arr;
  }

  convertTimeStamp(timeStamp){
    var date = new Date(timeStamp);
    var options = {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return date.toLocaleTimeString("en-us", options);
  }

  render(){
    var comments = this.state.comments.map(comment =>{
      return (<li key={comment.key}>
                <div className="profile-img">
                  <span>{comment.postedBy.substring(0, 1)}</span>
                </div>
                <div className="comment">
                  <h2>{comment.postedBy} <span><em>{this.convertTimeStamp(comment.timeStamp)}</em></span></h2>
                  <p>{comment.comment}</p>
                </div>
              </li>);
    });
    return (
      <div ref="commentList" className="comments-wrap">
        <ul>
          {comments}
        </ul>
      </div>
    )
  }
}

export default CommentList;
