var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 80;

app.use('/assets', express.static(__dirname + '/assets'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/', express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('ID: ' + UserID + ' connected.');
});

http.listen(port, function() {
    console.log('listening on *:' + (port).toString());
});