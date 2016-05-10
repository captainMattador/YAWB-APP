import React from 'react';
import ReactDOM from 'react-dom';
import CommentSubmit from './CommentSubmit';
import CommentList from './CommentList';
import {msg} from '../../utils/CustomEvents';

class CommentsComponent extends React.Component {

  constructor(){
    super();
    this.win = window;
    this.updateListHeight = this.updateListHeight.bind(this);
  }

  componentDidMount(){
    this.updateListHeight()
    this.win.addEventListener('resize', this.updateListHeight);
  }

  componentWillUnmount(){
    this.win.removeEventListener('resize', this.updateListHeight);
  }

  updateListHeight(){
    var commentList, commentSubmit;
    commentSubmit = ReactDOM.findDOMNode(this.refs.commentSubmit);
    commentList = ReactDOM.findDOMNode(this.refs.commentList);
    commentList.style.height =
        (this.win.innerHeight - commentSubmit.clientHeight) + 'px';
  }

  render(){
    return (
      <section className="comments">
        <CommentList ref="commentList"/>
        <CommentSubmit ref="commentSubmit" list="PeerComments"/>
      </section>
    )
  }
}

export default CommentsComponent;
