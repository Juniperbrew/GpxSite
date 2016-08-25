module.exports = function(io) {

	var chatClients = Object.create(null);

	var chat = io.of('/chat');

	chat.on('connection', function(socket) {

		console.log('Connected for chat: ' + socket.id);
		socket.emit('connected');

		var name = userNames.getGuestName();
		chatClients[socket.id] = name;
		console.log('Name: ' + name);
		socket.emit('send:name', name);
		socket.emit('send:userlist', userNames.get());

		chat.emit('event:join', name);

		socket.on('new:message', function(data) {
			console.log('Got message');
			console.dir(data);
			chat.emit('event:message', {
				name: chatClients[socket.id],
				message: data
			})
		});

		socket.on('request:name', function(data) {
			console.log('Got name request from ' + chatClients[socket.id]);
			if (userNames.claim(data)) {
				var oldName = chatClients[socket.id];
				userNames.free(oldName);
				chatClients[socket.id] = data;
				socket.emit('event:name-change', data);
				chat.emit('confirm:name', {
					old: oldName,
					new: data
				});
			}
		});

		socket.on('disconnect', function() {
			chat.emit('event:quit', chatClients[socket.id]);
			userNames.free(chatClients[socket.id]);
			delete chatClients[socket.id];
			console.log('Disconnected: ' + socket.id);
		});
	});

	var tracking = io.of('/tracking');
	tracking.on('connection', function(socket) {
		console.log('Connected for tracking: ' + socket.id);
	});

	io.sockets.on('connection', function(socket) {
		console.log('Connected for default namespace: ' + socket.id);
		socket.emit('success', "Connection successful.");

		socket.on('disconnect', function() {
			console.log('Disconnected: ' + socket.id);
		});
	});

	// Keep track of which names are used so that there are no duplicates
	var userNames = (function() {
		var names = Object.create(null);

		var claim = function(name) {
			if (!name || names[name]) {
				return false;
			} else {
				names[name] = true;
				return true;
			}
		};

		// find the lowest unused "guest" name and claim it
		var getGuestName = function() {
			var name,
				nextUserId = 1;

			do {
				name = 'Guest ' + nextUserId;
				nextUserId += 1;
			} while (!claim(name));

			return name;
		};

		// serialize claimed names as an array
		var get = function() {
			var res = [];
			for (user in names) {
				res.push(user);
			}

			return res;
		};

		var free = function(name) {
			if (names[name]) {
				delete names[name];
			}
		};

		return {
			claim: claim,
			free: free,
			get: get,
			getGuestName: getGuestName
		};
	}());

}