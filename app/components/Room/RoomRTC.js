

import adapter from 'webrtc-adapter';

var self;

class RoomRTC{
  
  constructor(socket, localVideo, remoteVideo){
    self = this;
    this.socket = socket;
    this.localVideo = localVideo;
    this.remoteVideo = remoteVideo;
    this.peerConnection;
    this.stream;
    this.peersList = [];
    
    this.constraints = {
        video: true,
        audio: true,
    };
    
    this.iceConfig = {
        'iceServers': [{
            'url': 'stun:stun.l.google.com:19302'
        }]
    };
    
    this.sdpConstraints = {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    };
   
    this.initConnection();
  }
  
  
  // initialize the connection
  initConnection(){
     
    /**
     * start the local connection process
     * to begin speaking with a peer.
     * This is the same for caller and callee
     */
    // this.peerConnection = new RTCPeerConnection(this.iceConfig);
    // this.peerConnection.onicecandidate = this.onicecandidate.bind(YAWB.user);
    // this.peerConnection.onaddstream = this.onaddstream;
    // this.setupLocalMedia();
    
    /**
     * begin differentiating between
     * caller and callee. In our instance
     * the owner of the room should be 
     * the callee
     */
    this.setupLocalMedia();
    // caller
    // if(YAWB.user.owner){
    //     this.callerHandlers();
    //     this.sendMessage({
    //         type: "joining",
    //         from: YAWB.user.uid,
    //     });
    // }
    // // callee
    // else{
    //     this.calleeHandlers();
    //     this.sendMessage({
    //         type: "joining",
    //         from: YAWB.user.uid,
    //     });
    //     this.sendMessage({
    //         type: "callee_arrived",
    //         from: YAWB.user.uid,
    //     });
    // }

  }
  
  newDescriptionCreated(description) {
    console.log(description);
    self.peerConnection
        .setLocalDescription(description)
        .then(function() {
            self.sendMessage({
                type:"new_description",
                from: YAWB.user.uid,
                sdp:description 
            });
        }).catch(self.errorHandler);
  }
  
//   onicecandidate(ice_event){
//     console.log(ice_event);
//     if (ice_event.candidate) {
//         var message = {
//             type: "new_ice_candidate",
//             from: YAWB.user.uid,
//             candidate: ice_event.candidate
//         }
//         self.sendMessage(message);
//     }
//   }
  
  onaddstream(event){
    console.log(event);
    self.remoteVideo.src = window.URL.createObjectURL(event.stream);
  }
  
  // setup caller handlers
  callerHandlers(){
      this.socket.on('message', function(msg) {
          
        if(msg.from === YAWB.user.uid) return;
        
        if (msg.type === 'callee_arrived') {
            console.log('callee_arrived', msg);
            self.startPeerConnection(true, msg);
        }

        else if (msg.type === 'new_ice_candidate') {
            console.log('new_ice_candidate', msg);
            
            self.peerConnection.addIceCandidate(
                new RTCIceCandidate(msg.candidate)
            );
        }
        
        else if (msg.type === 'new_description') {
            console.log('new_description', msg);
            if(!YAWB.user.owner){
                self.startPeerConnection(false, msg);
            }
            self.peerConnection
                .setRemoteDescription(new RTCSessionDescription(msg.sdp))
                .then(function() {
                    if (self.peerConnection.remoteDescription.type === 'answer') {
                        console.log('doing some custom answer work');
                    }else if (self.peerConnection.remoteDescription.type === 'offer') {
                        self.peerConnection.createAnswer(self.newDescriptionCreated.bind(msg), self.errorHandler);
                    }
                }).catch(self.errorHandler);
        }else{
            console.log(msg);
        }
        
      });
  }
  
//    calleeHandlers(){
       
//       this.socket.on('message', function(msg) {
          
//         if(msg.from === YAWB.user.uid) return;
        
//         if (msg.type === 'new_ice_candidate') {
//             console.log('new_ice_candidate', msg);
//             self.peerConnection.addIceCandidate(
//                 new RTCIceCandidate(msg.candidate)
//             );
//         }
        
//         else if (msg.type === 'new_description') {
//             console.log('new_description', msg);
//             self.startPeerConnection(false, msg)
//             self.peerConnection
//                 .setRemoteDescription(new RTCSessionDescription(msg.sdp))
//                 .then(function() {
//                     if (self.peerConnection.remoteDescription.type === 'offer') {
//                         self.peerConnection.createAnswer(self.newDescriptionCreated, self.errorHandler);
//                     }
//                 }).catch(self.errorHandler);
//         } else{
//             console.log(msg);
//         }
//       });
//   }
  
  startPeerConnection(isOwner, msg){
    
    console.log('starting', msg);
    self.peerConnection = new RTCPeerConnection(self.iceConfig);
    self.peerConnection.onicecandidate = function(ice_event){
        if (ice_event.candidate) {
            var message = {
                type: "new_ice_candidate",
                from: YAWB.user.uid,
                to: msg.from,
                candidate: ice_event.candidate
            }
            self.sendMessage(message);
        }
    };
    self.peerConnection.onaddstream = self.onaddstream;
    self.peerConnection.addStream(self.stream);
    
    // create the offer
    if(isOwner){
        self.peerConnection.createOffer(self.newDescriptionCreated, self.errorHandler);   
    }
    
  }
  
  
 /**
  * get the local user media sream.
  * can be video or audo. 
  */
  setupLocalMedia(){
    navigator.mediaDevices.getUserMedia(self.constraints)
    .then( self.getUserMediaSuccess)
    .catch(self.errorHandler);
  }
  
  getUserMediaSuccess(stream){
      self.localVideo.src = window.URL.createObjectURL(stream);
      self.stream = stream;
      
      self.callerHandlers();
       
      if(!YAWB.user.owner){
          self.sendMessage({
                type: "callee_arrived",
                from: YAWB.user.uid,
            });
            // //self.callerHandlers();
            // self.sendMessage({
            //     type: "joining",
            //     from: YAWB.user.uid,
            // });
        }
        // callee
        // else{
        //     //self.calleeHandlers();
        //     self.sendMessage({
        //         type: "joining",
        //         from: YAWB.user.uid,
        //     });
        //     self.sendMessage({
        //         type: "callee_arrived",
        //         from: YAWB.user.uid,
        //     });
        // }
      //self.peerConnection.addStream(stream);
  }
  
  /**
   * generic sender function
   * handles the signiling to 
   * the server
   */
  sendMessage(message) {
    self.socket.emit('message', message);
  }
  
  /**
   * generic error handler
   * for each of the WebRTC calls
   */
  errorHandler(error) {
    console.log(error);
  }
  
  /**
   * when a user leaves the room or disconnects
   * Kill the auido/video stream and end the 
   * peer connection
  */
  destroy() {
    var tracks = self.stream.getTracks();
    
    // sendMessage({
    //     'leaving-room',
    // });
    tracks.map(track => {
        track.stop();
    });
    self.peerConnection.close();
    self.peerConnection = null;
  }

}

export default RoomRTC;
