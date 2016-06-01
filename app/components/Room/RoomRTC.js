

import adapter from 'webrtc-adapter';

var self;

class RoomRTC{
  
  constructor(socket, localVideo){
    self = this;
    this.socket = socket;
    this.localVideo = localVideo;
    this.stream;
    this.peersConnections = {};
    
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
            'OfferToReceiveAudio': this.constraints.audio,
            'OfferToReceiveVideo': this.constraints.video
        }
    };
    
    this.initalizeConnection();
  }
  
  initalizeConnection(){
    // initiate the signal handlers
    // to the server
    this.signalHandlers();

    // if owner set up local media
    // to be shared with the rest
    if(YAWB.user.owner){
        this.setupLocalMedia();
    }

    // not the owner so announce
    // that you are ready to connect
    else{
        self.sendMessage({
            type: "callee_arrived",
            from: YAWB.user.uid,
        });
    }
  }
  
  /**
   * called to create the appropriate connection
   * to another peer
   */
  getPeerConnection(connectionWith){
    
    if (typeof self.peersConnections[connectionWith] !== 'undefined') {
        return self.peersConnections[connectionWith];
    }
    
    var peerConnection = new RTCPeerConnection(self.iceConfig);
    self.peersConnections[connectionWith] = peerConnection;
    peerConnection.onicecandidate = function(ice_event){
        if (ice_event.candidate) {
            var message = {
                type: 'new_ice_candidate',
                from: YAWB.user.uid,
                to: connectionWith,
                candidate: ice_event.candidate
            }
            self.sendMessage(message);
        }
    };
    
    if(!YAWB.user.owner){
        peerConnection.onaddstream = function(event){
            console.log('adding remote stream of the owner');
            self.localVideo.src = window.URL.createObjectURL(event.stream); 
        };
    }else{
        peerConnection.addStream(self.stream);
    }
    
    return peerConnection;    
  }
  
  makeOffer(offerTo){
      var pc = self.getPeerConnection(offerTo);
      pc.createOffer(function(sdp){
          pc.setLocalDescription(sdp);
          self.sendMessage({
            type: 'sdp_offer',
            from: YAWB.user.uid,
            to: offerTo,
            sdp: sdp
          });
      }, self.errorHandler);
  }
 
  // setup caller handlers
  signalHandlers(){
      this.socket.on('message', function(msg) {
        
        // return if the message happens to be
        // from our selves
        if(msg.from === YAWB.user.uid) return;
        
        // either create the needed connection or
        // return the existing one.
        var pc = self.getPeerConnection(msg.from);
        
        if (msg.type === 'callee_arrived') {
            console.log('callee_arrived', msg);
            var intervalID = window.setInterval(function(){
                if(self.stream){
                    console.log('stream is ready');
                    clearInterval(intervalID);
                    self.makeOffer(msg.from);
                }
            }, 250);
        }

        else if (msg.type === 'new_ice_candidate') {
            console.log('new_ice_candidate', msg);
            
            pc.addIceCandidate(
                new RTCIceCandidate(msg.candidate)
            );
        }
        
        else if (msg.type === 'sdp_offer') {
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), function () {
                console.log('Setting remote description by offer');
                pc.createAnswer(function(sdp){
                    pc.setLocalDescription(sdp);
                    self.sendMessage({
                        type: 'sdp_answer',
                        from: YAWB.user.uid,
                        to: msg.from,
                        sdp: sdp
                    });
                }, self.errorHandler);
            });
        }
        
        else if (msg.type === 'sdp_answer') {
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), function () {
                console.log('We got an answer');
            });
        }
      });
  }
 
 /**
  * get the local user media sream.
  * can be video or audo. 
  */
  setupLocalMedia(){
    navigator.mediaDevices.getUserMedia(self.constraints)
    .then(self.getUserMediaSuccess)
    .catch(self.errorHandler);
  }
  
  getUserMediaSuccess(stream){
      self.localVideo.src = window.URL.createObjectURL(stream);
      self.stream = stream;
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
    
    // close out each peer connection
    // befor we leave
    for(prop in self.peersConnections){
        self.peersConnections[prop].close();
        self.peersConnections[prop] = null;
    }
  }

}

export default RoomRTC;
