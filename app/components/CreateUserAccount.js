import React from 'react';
import {updateRoute, loading, msg} from '../utils/CustomEvents';
import Input from './FormComponents/Input';
import formHelper from '../utils/form-helpers';

class CreateUserAccount extends React.Component {

  constructor(){
    super();
    this.state = {
      imageUrl : null
    };
    
    this.fileAdded = this.fileAdded.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createAccountHandler = this.createAccountHandler.bind(this);
    this.backHandler = this.backHandler.bind(this);
  }

  // account was valid
  createAccountHandler(vals){
    loading(true);
    YAWB.fbRef.createUser({
      email : vals.email,
      password : vals.password
    }, this.createAccountCallBack.bind(this, vals));
  }

  createAccountCallBack(vals, error, userData){
    if (error) {
      loading(false);
      msg('Error', 'This email address is already in use.', true);
      return;
    }
    
    let postsUser = YAWB.fbRef.child('Users').child(userData.uid);
    postsUser.set({
      fname: vals.fname,
      lname: vals.lname,
      email: vals.email,
      profileImage: this.state.imageUrl,
      uid: userData.uid
    });
    YAWB.fbRef.authWithPassword({
      email: vals.email,
      password : vals.password
    }, this.authWithPasswordCallback.bind(this));
  }

  authWithPasswordCallback(error){
    loading(false);
  }

  handleSubmit(e){
    e.preventDefault();
    let form = this.refs.form;
    let valid = formHelper.validateForm(form);
    let vals = {};

    if(valid){
      vals = formHelper.getSubmitVals(form);
      this.createAccountHandler(vals);
    }else{
      msg('Error', 'Invalid form. Please fix errors.', true);
    }
  }
  
  backHandler(e){
    e.preventDefault();
    updateRoute('LOGIN_USER_ACCOUNT_ROUTE');
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
    if(!formHelper.validImageExt(file.name)){
      msg('Error', 'In correct file format.', true);
      formHelper.clearFile(e.target);
      return;
    }
    
    // file size is too large
    if(!formHelper.validSize(file.size, 10000)){
      msg('Error', 'File size is too large.', true);
      formHelper.clearFile(e.target);
      return;
    }
    
    this.saveImage(file);  
  }
  
  saveImage(file){
    var reader = new FileReader();
    var self = this;
    reader.onload = function (e) {
      self.setState({
        imageUrl: this.result
      });
    }
    reader.readAsDataURL( file );
  }

  render(){
    
    var imageView;
    if(this.state.imageUrl !== null){
      imageView = (<div>
        <input name="fileUpload" type="file" onChange={this.fileAdded}/>
        <span className="image-icon"><img src={this.state.imageUrl}/></span>
        <span className="upload-icon"><i className="fa fa-file-image-o" aria-hidden="true"></i></span>
      </div>)
    }else{
      imageView = (<div>
        <input name="fileUpload" type="file" onChange={this.fileAdded}/>
        <span className="upload-icon no-image"><i className="fa fa-file-image-o" aria-hidden="true"></i></span>
      </div>)
    }
    
    return (
      <div className="ceate-account-overflow">
        <div className="ceate-account">
            <div className="content">
              <div className="image-wrap">
                  <div className="image-info image">
                    {imageView}
                    <p class="">Profile Image: Optional/10mb max size</p>
                  </div>
              </div>
              <form ref="form" className="create-user-form clean" onSubmit={this.handleSubmit} noValidate>
                <Input name="fname" type="text" minLength={1} placeholder="First name" blur={formHelper.blur} required={true}/>
                <Input name="lname" type="text" minLength={1} placeholder="Last name" blur={formHelper.blur} required={true}/>
                <Input name="email" type="email" placeholder="Email" blur={formHelper.blur} required={true}/>
                <Input name="emailmatch" type="email" data-match="email" placeholder="Confirm Email" blur={formHelper.blur} required={true}/>
                <Input name="password" type="password" minLength={1} placeholder="Password" blur={formHelper.blur} required={true}/>
                <Input name="passwordmatch" type="password" data-match="password" placeholder="Confirm Password" blur={formHelper.blur} required={true}/>
                
                <div>
                  <input className="cta-btn secondary" ref="submit" type="submit" value="Create Account"/>
                </div>
                <div>
                  <button
                  className="cta-btn"
                  onClick={this.backHandler}>Back</button>
                </div>
              </form>
            </div>
        </div>
      </div>
    )
  }
}

export default CreateUserAccount;
