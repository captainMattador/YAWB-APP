

import adapter from 'webrtc-adapter';

var self;

class RoomRTC{
  
  constructor(socket, videoPlayer){
    self = this;
    this.socket = socket;
    this.videoPlayer = videoPlayer;
    this.stream;
    this.peerConnections = {};
    
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

    // grab the local media
    this.setupLocalMedia();
  }
  
  /**
   * called to create the appropriate connection
   * to another peer
   */
  getPeerConnection(connectionWith){
    
    if (typeof self.peerConnections[connectionWith] !== 'undefined') {
        return self.peerConnections[connectionWith];
    }
    
    var peerConnection = new RTCPeerConnection(self.iceConfig);
    self.peerConnections[connectionWith] = peerConnection;
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
            self.videoPlayer.src = window.URL.createObjectURL(event.stream);
            self.videoPlayer.play();
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
      }, self.errorHandler, self.sdpConstraints);
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
            self.makeOffer(msg.from);
        }
        
        /**
         * handle when an ice candidate
         * comes in
         */
        else if (msg.type === 'new_ice_candidate') {
            console.log('new_ice_candidate', msg);
            
            pc.addIceCandidate(
                new RTCIceCandidate(msg.candidate)
            );
        }
        
        /**
         * offer recieved. add it to local description
         */
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
        
        /**
         * answer recieved. add it to local description
         */
        else if (msg.type === 'sdp_answer') {
            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp), function () {
                console.log('We got an answer');
            });
        }
        
        /**
         * user left the room, so remove them from
         * the peer list
         */
        else if (msg.type ==='leaving_room'){
            console.log('someone is leaving the room');
            self.removeConnection(msg.from);
        }
        
      });
  }
 
 /**
  * get the local user media sream.
  * can be video or audo. 
  */
  setupLocalMedia(){
    navigator.mediaDevices.getUserMedia(self.constraints)
    .then(function(stream){
        
        if(!YAWB.user.owner){
            self.sendMessage({
                type: "callee_arrived",
                from: YAWB.user.uid,
            });
        }else{
            self.videoPlayer.src = window.URL.createObjectURL(stream);
            self.videoPlayer.muted = 'muted';
            self.stream = stream;
        }
        
    })
    .catch(self.errorHandler);
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
   * generic helper function for 
   * closing down a connection.
   */
  removeConnection(connection){
      self.peerConnections[connection].close();
      delete self.peerConnections[connection];
  }
  
  /**
   * when a user leaves the room or disconnects
   * Kill the auido/video stream and end the 
   * peer connection
  */
  destroy() {
    
    if(self.stream){
        var tracks = self.stream.getTracks();
        tracks.map(track => {
            track.stop();
        });
    }

    // close out each peer connection
    // befor we leave
    for(var connection in self.peerConnections){
        self.sendMessage({
            type: 'leaving_room',
            from: YAWB.user.uid,
            to: connection
        });
        self.removeConnection(connection);
    }
  }

}

export default RoomRTC;
