import React from 'react';

class UserProfileImg extends React.Component {

  constructor(){
    super();
  }

  userProfileImage(user){
      if(typeof user.profileImage !== 'undefined'){
          return <span><img src={user.profileImage} /></span>;
      }else{
          return <span className="letter">{user.fname.substring(0, 1)}</span>;
      }
  }

  render(){
    return (
      <div className="user-profile-image">
          {this.userProfileImage(this.props.user)}
      </div>
    )
  }

}

export default UserProfileImg;
