import React from 'react';
import {msg} from '../../utils/CustomEvents';

class CommentList extends React.Component {

  constructor(){
    super();
    this.state = {
      comments: [],
      pageLoaded: false
    };
    this.commentsRef;
    this.postedByRef;
    this.commentsUpdated = this.commentsUpdated.bind(this);
    this.alertPosted = this.alertPosted.bind(this);
  }

  componentDidMount(){
    this.commentsRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child(this.props.dbList);
    this.postedByRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id)
      .child("lastPostedCommentBy");
    this.commentsRef.on('value', this.commentsUpdated);
  }

  componentWillUnmount(){
    this.commentsRef.off('value', this.commentsUpdated);
  }

  componentDidUpdate(){
    this.refs[this.props.dbList].scrollTop = this.refs[this.props.dbList].clientHeight;
  }

  alertPosted(snapShot){
    if(snapShot.val().postedBy.uid !== YAWB.user.uid){
      var comment = (this.props.dbList === 'PeerComments') ? 'Posted in Chat' : 'Asked a question';
      msg(snapShot.val().postedBy.name, comment, false);
    }
  }

  commentsUpdated(snapShot){
    let comments = this.flattenComments(snapShot.val());

    // supress calling when the page loads
    if(this.state.pageLoaded){
      this.postedByRef.once('value', this.alertPosted);
    }

    this.setState({
      comments: comments,
      pageLoaded: true
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
      <div ref={this.props.dbList} className="comments-list">
        <ul>
          {comments}
        </ul>
      </div>
    )
  }
}

export default CommentList;
