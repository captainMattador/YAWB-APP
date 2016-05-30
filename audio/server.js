var express = require('express'),
app = express(),
http = require('http'),
socketIO = require('socket.io'),
server, io;

app.use(express.static(__dirname));

server = http.Server(app);
server.listen(3000);

console.log('Listening on port 3000');

io = socketIO(server);
var audioStream = io.of('/audio-stream');

audioStream.on('connection', function (socket) {

socket.on('make-offer', function (data) {
socket.broadcast.emit('offer-made', {
offer: data.offer,
socket: socket.id
        });
    });

socket.on('make-answer', function (data) {
socket.to(data.to).emit('answer-made', {
socket: socket.id,
answer: data.answer
        });
    });

});
