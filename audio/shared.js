var peerConnection = window.RTCPeerConnection ||
window.mozRTCPeerConnection ||
window.webkitRTCPeerConnection ||
window.msRTCPeerConnection;

var sessionDescription = window.RTCSessionDescription ||
window.mozRTCSessionDescription ||
window.webkitRTCSessionDescription ||
window.msRTCSessionDescription;

navigator.getUserMedia  = navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia;

var socket = io.connect('https://yawbapp.com/audio-stream');

var pc = new peerConnection({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] });
/*var pc = new peerConnection({ iceServers: [{ url: 'stun:stun.services.mozilla.com',
username: 'myuser',
credential: 'mycreds'
}]
});*/

function error (err) {
   console.warn(err);
}
