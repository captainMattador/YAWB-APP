import React from 'react';
import ReactDOM from 'react-dom';
import CommentSubmit from './CommentSubmit';
import CommentList from './CommentList';

class CommentsComponent extends React.Component {

  constructor(){
    super();
    this.win = window;
    this.updateListHeight = this.updateListHeight.bind(this);
    this.toggleComments = this.toggleComments.bind(this);
    this.cancelComments = this.cancelComments.bind(this);
  }

  componentDidMount(){
    this.updateListHeight()
    this.win.addEventListener('resize', this.updateListHeight);
    this.win.addEventListener('toggle-comments', this.toggleComments, false);
  }

  componentWillUnmount(){
    this.win.removeEventListener('resize', this.updateListHeight);
    this.win.removeEventListener('toggle-comments', this.toggleComments, false);
  }

  updateListHeight(){
    var commentHeader, commentList, commentSubmit;
    commentHeader = this.refs.commentHeader;
    commentSubmit = ReactDOM.findDOMNode(this.refs.commentSubmit);
    commentList = ReactDOM.findDOMNode(this.refs.commentList);
    commentList.style.height =
        (this.win.innerHeight - commentSubmit.clientHeight - commentHeader.clientHeight) + 'px';
  }

  toggleComments(e){ 
    e.preventDefault();
    if(this.refs.comments.classList.contains(e.detail.chatBox)){
      this.refs.comments.classList.toggle('active');
    }
  }
  
  cancelComments(e){ 
    e.preventDefault();
    this.refs.comments.classList.remove('active');
  }

  render(){
    return (
      <section ref="comments" className={"comments " + this.props.commentsClass}>
        <div className="comments-wrapper">
          <div ref="commentHeader" className="header">
            <h2>{this.props.heading}</h2>
            <i className="fa fa-times-circle" aria-hidden="true" onClick={this.cancelComments}></i>
          </div>
          <CommentList ref="commentList" dbList={this.props.dbList}/>
          <CommentSubmit ref="commentSubmit" dbList={this.props.dbList}/>
        </div>
      </section>
    )
  }
}

export default CommentsComponent;
