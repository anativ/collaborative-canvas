var io = require('socket.io').listen(8888);

io.sockets.on('connection', function (socket) {  
  socket.on('paint', function (data) { 
	socket.broadcast.emit('paint', data);
  });
});

// tell the client to change color
setInterval(function() {
	var myColor = "#" + Math.floor(Math.random()*16777215).toString(16);
	io.sockets.emit('change-bg',{"color":myColor});
},5000);
