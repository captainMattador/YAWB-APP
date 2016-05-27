import React from 'react';
import {updateRoute, loading, msg} from '../../utils/CustomEvents';
import Input from '../FormComponents/Input';
import {validateEmail} from '../../utils/helpers';

var self;

class UserProfile extends React.Component {

  constructor(){
    super();
    this.state = {
      fname: YAWB.user.fname,
      lname: YAWB.user.lname,
      email: YAWB.user.email,
      profileImage: YAWB.user.profileImage
    };
    self = this;
    this.formVals = {};
    
    this.fileAdded = this.fileAdded.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.userInfoHandler = this.userInfoHandler.bind(this);
    this.updateEmailHandler = this.updateEmailHandler.bind(this);
    this.updatePasswordHandler = this.updatePasswordHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.blur = this.blur.bind(this);
  }

  componentDidMount(){
  }
  
  updateInfo(elem, val){
    if(val === ''){
      val = YAWB.user[elem.name];
    }
    this.setState({
      [elem.name] : val
    });
  }
  
  /**
   * 
   * Update email
   * 
   */
  
  updateEmailHandler(e){
    e.preventDefault();
    let form = this.refs.emailForm;
    let valid = this.validateForm(form);
    let vals = {}
    
    if(valid){
      loading(true);
      vals = this.getSubmitVals(form);
      YAWB.fbRef.changeEmail({
        oldEmail: YAWB.user.email,
        newEmail: vals.email,
        password: vals.currentPassword
      }, this.updateEmailCallback.bind(this, form, vals.newEmail));
     
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }
  
  updateEmailCallback(form, email, error){
    if(error){
      switch (error.code) {
        case "INVALID_PASSWORD":
          msg('Error', 'The specified user account password is incorrect.', true);
          break;
        case "INVALID_USER":
          msg('Error', 'The specified user account does not exist.', true);
          break;
        default:
          msg('Error', 'Error updating email.', true);
      }
    }else{
      let user = YAWB.fbRef.child('Users').child(YAWB.user.uid);
      user.update({ email: email });
      YAWB.user.email = email;
      this.clearForm(form);
      msg('Success', 'Email updated.', false);
    }
    loading(false);
  }
  
  /**
   * 
   * Update password
   * 
   */
  
  updatePasswordHandler(e){
    e.preventDefault();
    let form = this.refs.passwordForm;
    let valid = this.validateForm(form);
    let vals = {}
    
    if(valid){
      loading(true);
      vals = this.getSubmitVals(form);
      YAWB.fbRef.changePassword({
        email: YAWB.user.email,
        oldPassword: vals.currentPassword,
        newPassword: vals.newPassword
      }, this.updatePasswordCallback.bind(this, form));
     
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }
  
  updatePasswordCallback(form, error){
    if(error){
      switch (error.code) {
        case "INVALID_PASSWORD":
          msg('Error', 'The specified user account password is incorrect.', true);
          break;
        case "INVALID_USER":
          msg('Error', 'The specified user account does not exist.', true);
          break;
        default:
          msg('Error', 'Error changing password.', true);
      }
    }else{
      this.clearForm(form);
      msg('Success', 'Password updated.', false);
    }
    loading(false);
  }
  
  /**
   * 
   * deleteAccount
   * 
   */
  deleteAccount(e){
    e.preventDefault();
    let form = this.refs.deleteForm;
    let valid = this.validateForm(form);
    let vals = {}
    
    if(valid){
      vals = this.getSubmitVals(form);
      let deleteConfirmed = confirm('Do you really want to delete your account? This cannot be undone.');
      
      if (deleteConfirmed) {
        loading(true);
        YAWB.fbRef.removeUser({
          email: vals.deleteEmail,
          password: vals.deletePassword
        }, this.deleteCallback.bind(this));
      }else{
        this.clearForm(form);
      }
     
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }
  
  deleteCallback(error){
    if(error){
      switch (error.code) {
        case "INVALID_USER":
          msg('Error', 'The specified user account does not exist.', true);
          break;
        case "INVALID_PASSWORD":
          msg('Error', 'The specified user account password is incorrect.', true);
          break;
        default:
          msg('Error', 'Error removing user.', true);
      }
    }else{
        let userRef = YAWB.fbRef.child('Users').child(YAWB.user.uid);
        userRef.remove();
        YAWB.user = {};
        YAWB.room = {};
    }
    loading(false);
  }
  
  /**
   * 
   * user Info update
   * 
   */
  
  userInfoHandler(e){
    e.preventDefault();
    let form = this.refs.userInfoForm;
    let valid = this.validateForm(form);
    let vals = {};
    let size;
    
    if(valid){
      loading(true);
      vals = this.getSubmitVals(form);
      size = Object.keys(vals).length;
      if(size > 0){
        let userRef = YAWB.fbRef.child('Users').child(YAWB.user.uid);
        userRef.update(vals, this.userInfoCallBack.bind(this, form));
        this.updateLocalUserInfo(vals);
      }else{
        msg('Error', 'No values were entered.', true);
        loading(false);
      }
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }
  
  updateLocalUserInfo(vals){
    for(var prop in vals){
      YAWB.user[prop] = vals[prop];
    }
  }
  
  userInfoCallBack(form, error){
    if(error){
      msg('Error', 'Error updating user.', true);
    }else{
      this.clearForm(form);
      msg('Success', 'User updated.', false);
    }
    loading(false);
  }
  
  /**
   * 
   * global form helpers
   * 
   */
  
  clearForm(form){
    let inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    for(var i = 0; i < inputs.length; i++){
      inputs[i].value = '';
    }
  }
  
  getSubmitVals(form){
    var inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]'),
        vals = {};
    for(var i = 0; i < inputs.length; i++ ){
      let trimVal = inputs[i].value.trim();
      if(trimVal !== ''){
        vals[inputs[i].name] = trimVal;
      }
    }
    return vals;
  }
  
  validateForm(form){

    let inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    let inputLength = inputs.length;
    let validLength = 0;

    if(form.classList.contains('clean')){
      form.classList.add('dirty');
      form.classList.remove('clean');
    }

    for(var i = 0; i < inputLength; i++){
      let valid = this.validateInput(inputs[i]);
      if(valid) validLength++;
    }

    return (inputLength === validLength);
  }
  
  blur(e){
    this.validateInput(e.target);
  }
  
  validateInput(input){
    let valid = false;
    let val = input.value.trim();
    
    if(!input.required && val === ''){
      return true;
    }
    
    if(input.type === 'email' && !input.hasAttribute('data-match')){
      valid = validateEmail(input.value);
    }else if(input.hasAttribute('data-match')){
      let matchName = input.dataset.match;
      let matchElem = document.querySelector('input[name='+matchName+']');
      valid = (input.value === matchElem.value);
    }else{
      valid = (input.getAttribute('minlength') <= input.value.length);
    }
    (valid) ? input.classList.remove('invalid') : input.classList.add('invalid');
    return valid;
  }
  
  
  cancelHandler(e){
    e.preventDefault();
    updateRoute('USER_HOME_ROUTE');
  }
  
  /**
   * 
   * file upload code
   * 
   */
  
  fileAdded(e){
    var file = e.target.files[0];
    
    if(typeof file === 'undefined') return;
    
    // not an image
    if(!this.validExt(file.name)){
      msg('Error', 'In correct file format.', true);
      this.clearFile(e.target);
      return;
    }
    
    // file size is too large
    if(!this.validSize(file.size)){
      msg('Error', 'File size is too large.', true);
      this.clearFile(e.target);
      return;
    }
    
    this.saveImage(file);
    this.displayImage(file.path);    
  }
  
  clearFile(elem){
    elem.value = '';
    elem.files[0]= null;
  }
  
  validExt(filename){
    return /\.(jpe?g|png|gif|bmp)$/i.test(filename);
  }
  
  validSize(size){
    return size > 10000;
  }
  
  saveImage(file){
    var reader = new FileReader();
    reader.onload = function (e) {
        let data = this.result;
        let userRef = YAWB.fbRef.child('Users').child(YAWB.user.uid);
        userRef.update({
          profileImage: data
        });
        YAWB.user.profileImage = data;
    }
    reader.readAsDataURL( file );
  }
  
  displayImage(src){
    var img = new Image();
    img.onload = function(){
      self.setState({profileImage: this.src});
    }
    img.src = src;
  }

  render(){
    
    var imageView;
    if(typeof this.state.profileImage === 'undefined'){
      imageView = <span className="letter-icon">{this.state.fname.substring(0, 1)}</span>;
    }else{
      imageView = <span className="image-icon"><img src={this.state.profileImage} alt={this.state.fname}/></span>;
    }
    
    return (        
        <div className="user-profile">
          
           <div className="content">
                <div className="image-wrap">
                    <div className="image-info image">
                      <div>
                        <input name="fileUpload" type="file" onChange={this.fileAdded}/>
                        <span className="upload-icon"><i className="fa fa-file-image-o" aria-hidden="true"></i></span>
                        {imageView}
                      </div>
                      <p class="">Profile Image: 10mb max size</p>
                    </div>
                    <div className="image-info name">
                      <p>{this.state.fname} {this.state.lname}</p>
                    </div>
                    <div className="image-info email">
                      <p>{this.state.email}</p>
                    </div>
                    <div className="image-info cancel">
                      <button onClick={this.cancelHandler}>Back to home page</button>
                    </div>
                </div>
                
                <div className="info-wrap">
                    <div className="form-info user-info">
                      <h3>Update Name:</h3>
                      <form ref="userInfoForm" className="update-user-form clean" onSubmit={this.userInfoHandler} noValidate>
                          <Input name="fname" type="text" minLength={1} maxLength={20} placeholder="First Name" valueChange={this.updateInfo} blur={this.blur}/>
                          <Input name="lname" type="text" minLength={1} maxLength={20} placeholder="Last Name" valueChange={this.updateInfo} blur={this.blur}/>      
                          <div className="submit"><input className="cta-btn" ref="updateNameSubmit" type="submit" value="Update"/></div>
                      </form>
                    </div>
                    
                    <div className="form-info email">
                        <h3>Update Email:</h3>
                        <form ref="emailForm" className="update-user-email clean" onSubmit={this.updateEmailHandler} noValidate>
                          <Input name="email" type="email" placeholder="New Email" blur={this.blur} valueChange={this.updateInfo} required={true}/>
                          <Input name="currentPassword" type="password" minLength={1} placeholder="Current Password" blur={this.blur} required={true}/>
                          <div className="submit"><input className="cta-btn" ref="updateEmailSubmit" type="submit" value="Update"/></div>
                        </form>
                    </div>
                    
                    <div className="form-info password">
                        <h3>Update Password:</h3>
                        <form ref="passwordForm" className="update-user-password clean" onSubmit={this.updatePasswordHandler} noValidate>
                          <Input name="newPassword" type="password" minLength={1} placeholder="New Password" blur={this.blur} required={true}/>
                          <Input name="currentPassword" type="password" minLength={1} placeholder="Current Password" blur={this.blur} required={true}/>
                          <div className="submit"><input className="cta-btn" ref="updatePasswordSubmit" type="submit" value="Update"/></div>
                        </form>
                    </div>
                    
                    <div className="form-info delete">
                        <h3>Delete Account:</h3>
                        <form ref="deleteForm" className="delete-user clean" onSubmit={this.deleteAccount} noValidate>
                          <Input name="deleteEmail" type="email" placeholder="Current Email" blur={this.blur} required={true}/>
                          <Input name="deletePassword" type="password" minLength={1} placeholder="Current Password" blur={this.blur} required={true}/>
                          <div className="submit"><input className="cta-btn" ref="deleteSubmit" type="submit" value="Delete"/></div>
                        </form>
                    </div>
                 </div>
          </div>  
        </div>
    )
  }

}

export default UserProfile;
