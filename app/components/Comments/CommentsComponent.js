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
  }

  componentDidMount(){
    this.updateListHeight()
    this.win.addEventListener('resize', this.updateListHeight);
  }

  componentWillUnmount(){
    this.win.removeEventListener('resize', this.updateListHeight);
  }

  updateListHeight(){
    var commentHeader, commentList, commentSubmit;
    commentHeader = this.refs.commentHeader;
    commentSubmit = ReactDOM.findDOMNode(this.refs.commentSubmit);
    commentList = ReactDOM.findDOMNode(this.refs.commentList);
    commentList.style.height =
        (this.win.innerHeight - commentSubmit.clientHeight - commentHeader.clientHeight) + 'px';
  }

  toggleComments(){
    var toggleBtn = document.querySelectorAll('.toggle-comments');
    // hack to hide all the toggle buttons
    for(var i = 0; i < toggleBtn.length; i++){
      toggleBtn[i].classList.toggle('active');
    }
    this.refs.comments.classList.toggle('active');
  }

  render(){
    return (
      <section ref="comments" className={"comments " + this.props.commentsClass}>
        <div className="toggle-comments">
          <i className={"fa " + this.props.icon} aria-hidden="true" onClick={this.toggleComments}></i>
        </div>
        <div className="comments-wrapper">
          <div ref="commentHeader" className="header">
            <h2>{this.props.heading}</h2>
            <i className="fa fa-times-circle" aria-hidden="true" onClick={this.toggleComments}></i>
          </div>
          <CommentList ref="commentList" dbList={this.props.dbList}/>
          <CommentSubmit ref="commentSubmit" dbList={this.props.dbList}/>
        </div>
      </section>
    )
  }
}

export default CommentsComponent;
