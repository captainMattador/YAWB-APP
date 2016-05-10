import React from 'react';

class CommentSubmit extends React.Component {

  constructor(){
    super();
    this.addComment = this.addComment.bind(this);
  }

  componentDidMount(){
    console.log(YAWB);
  }

  addComment(e){
    e.preventDefault();
    let val = this.refs.comment.value.trim();
    if(val.trim() === ''){
      return;
    }
    this.refs.comment.value = '';
    let commentsRef = YAWB.fbRef.child('Rooms').child(YAWB.user.activeRoom).child('PeerComments');
    commentsRef.push({
      postedBy: YAWB.user.fname + ' ' + YAWB.user.lname,
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
