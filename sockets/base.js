module.exports = function (io) {
io.sockets.on('connection', function (socket) {
    console.log('New connection: '+socket.id);
      socket.emit('connected', "Connection successful.");
      
      socket.on('disconnect', function() {
        console.log('Disconnected: '+ socket.id);
     });
  });
}