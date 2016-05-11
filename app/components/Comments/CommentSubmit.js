import React from 'react';

class CommentSubmit extends React.Component {

  constructor(){
    super();
    this.addComment = this.addComment.bind(this);
  }

  addComment(e){
    e.preventDefault();
    let val = this.refs.comment.value.trim();
    if(val.trim() === ''){
      return;
    }
    this.refs.comment.value = '';
    let commentsRef = YAWB.fbRef.child('Rooms').child(YAWB.room.id).child(this.props.dbList);
    let lastPosted = YAWB.fbRef.child('Rooms').child(YAWB.room.id).child("lastPostedCommentBy");
    let userName = YAWB.user.fname + ' ' + YAWB.user.lname;
    lastPosted.set({
      postedBy: {
          uid: YAWB.user.uid,
          name: userName
      }
    });
    commentsRef.push({
      postedBy: userName,
      comment: val,
      timeStamp: Firebase.ServerValue.TIMESTAMP
    });
  }

  render(){
    return (
      <div className="comments-submit">
        <form ref="form" className="comment-form" onSubmit={this.addComment} noValidate>
          <input ref="comment" name="comment-text" placeholder="Comment" maxLength={300} />
        </form>
      </div>
    )
  }
}

export default CommentSubmit;
