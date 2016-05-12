import React from 'react';

class UserProfileImg extends React.Component {

  constructor(){
    super();
  }

  userProfileImage(user){
      if(!user.profileImage){
          return user.fname.substring(0, 1);
      }

      // return profile image if there is one
      // not yet implemented
      return user.fname.substring(0, 1);
  }

  componentDidMount(){
  }
  render(){
    return (
      <div className="user-profile-image">
          <span>{this.userProfileImage(this.props.user)}</span>
      </div>
    )
  }

}

export default UserProfileImg;
