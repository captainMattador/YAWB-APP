
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription;
window.URL = window.URL || window.webkitURL;
window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.webkitGetUserMedia;

var self;

class RoomRTC{
  
  constructor(socket, localVideo, remoteVideo){
    
    self = this;
    this.socket = socket;
    this.localStream;
    this.localVideo = localVideo;
    this.remoteVideo = remoteVideo;
    this.peerConnection;
    this.uuid;
    
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
    
    this.socket.on('message', function(signal) {
        
        if(!self.peerConnection) self.start(false);
        
        console.log('Client received message:', signal);
        
        // message is our own.
        //if(message.user.uid === YAWB.user.uid) return;
        
        if (signal.type === 'got user media') {
            console.log('message back from server got user media');
        } 
        
        else if(signal.sdp) {
            self.peerConnection
                .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                .then(function() {
                    // Only create answers in response to offers
                    if(signal.sdp.type == 'offer') {
                        self.peerConnection.createAnswer()
                            .then(self.createdDescription)
                            .catch(self.errorHandler);
                    }
            }).catch(self.errorHandler);
        }
        
        else if (signal.ice) {
            self.peerConnection
                .addIceCandidate(new RTCIceCandidate(signal.ice))
                .catch(self.errorHandler);
        } 
        
    });
    
    navigator.getUserMedia(self.constraints, self.getUserMediaSuccess, self.errorHandler);
    this.socket.emit('message', {'uid': YAWB.user.uid});
  }
  
  start(isCaller) {
    console.log('should be here', isCaller);
    self.peerConnection = new RTCPeerConnection(self.iceConfig);
    self.peerConnection.onicecandidate = self.gotIceCandidate;
    self.peerConnection.onaddstream = self.gotRemoteStream;
    self.peerConnection.addStream(self.localStream);
    
    console.log(self.peerConnection);

    if(isCaller) {
        self.peerConnection.createOffer().then(self.createdDescription).catch(self.errorHandler);
    }
  }
  
  gotIceCandidate(event) {
    if(event.candidate != null) {
        self.socket.emit('message', {'ice': event.candidate, 'uid': YAWB.user.uid});
    }
  }
  
  createdDescription(description) {
    console.log('got description');

    self.peerConnection.setLocalDescription(description).then(function() {
        self.socket.emit('message', {'sdp': self.peerConnection.localDescription, 'uid': YAWB.user.uid});
    }).catch(self.errorHandler);
  }
  
  gotRemoteStream(event) {
    console.log('got remote stream');
    self.remoteVideo.src = window.URL.createObjectURL(event.stream);
  }

  
  getUserMediaSuccess(stream) {
    self.localStream = stream;
    self.localVideo.src = window.URL.createObjectURL(stream);
  }
    
  // send message helper function
  sendMessage(message) {
    console.log('Client sending message: ', message);
    self.socket.emit('message', message);
  }
  
  errorHandler(error) {
    console.log(error);
  }

}

export default RoomRTC;
