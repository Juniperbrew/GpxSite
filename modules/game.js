module.exports = function(io) {

	var tools = require('./tools');

	var width = 1024;
	var height = 576;

	function Player(x, y) {
		this.x = x;
		this.y = y;
	}

	var players = Object.create(null);

	setInterval(function(){
  		io.of('/game').emit('sync', players);
	}, 100);      

	io.of('/game').on('connection', function(socket) {
		console.log('Connected for game: ' + socket.id);

		var x = tools.randomMinMax(0, width);
		var y = tools.randomMinMax(0, height);

		console.log('Spawning at (' + x + ',' + y + ')');

		socket.emit('success', {
			width: width,
			height: height,
			id: socket.id,
			x: x,
			y: y
		});

		players[socket.id] = new Player(x, y);

		socket.on('update', function(data) {
			players[socket.id].x = data.x;
			players[socket.id].y = data.y;
		})

		socket.on('disconnect', function(data) {
			console.log('Disconnected from game: ' + socket.id);
			delete players[socket.id];
		});

	});



}