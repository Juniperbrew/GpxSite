 
$(function() {

	var socket = io.connect('/game');

	var radius = 10;
	var x = 0;
	var y = 0;
	var id;
	var ctx;

	var speed = 200;

	var serverState = Object.create(null);
	var localState = Object.create(null);

	var canvas = document.createElement('canvas');
	ctx = canvas.getContext("2d");

	var logging = false;

	document.getElementById("game").appendChild(canvas);

	var button = document.createElement('input');
	button.type = 'button';
	button.value = 'Enable logging';
	button.onclick = function() {
		logging = !logging;
		if (logging) {
			button.value = 'Disable logging';
		} else {
			button.value = 'Enable logging';
		}

	};
	document.getElementById("game").appendChild(button);

	// Handle keyboard controls

	var keysDown = {};

	window.addEventListener("keydown", function(e) {
		keysDown[e.keyCode] = true;

		if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}

	}, false);

	window.addEventListener("keyup", function(e) {
		delete keysDown[e.keyCode];
	}, false);

	var fps = 0;
	var fpsCounter = 0;
	var then = Date.now();
	var fpsPolled = Date.now();

	var serverUpdateDelay = 0.1;
	var serverUpdateDelayLeft = serverUpdateDelay;

	// The main game loop
	var main = function() {
		var now = Date.now();
		var delta = now - then;
		fpsCounter++;
		if (fpsCounter >= 60) {
			fps = Math.round(fpsCounter / ((Date.now() - fpsPolled) / 1000));
			//log('fps: ' + fps);
			fpsPolled = Date.now();
			fpsCounter = 0;
		}

		update(delta / 1000);
		render();

		then = now;

		requestAnimationFrame(main);
	};

	function update(delta) {
		serverUpdateDelayLeft -= delta;
		if (serverUpdateDelayLeft < 0) {
			log('sending server update');
			socket.emit('update', {
				x: x,
				y: y
			});
			serverUpdateDelayLeft = serverUpdateDelay;
		}
		var newLocalState = Object.create(null);
		for (var eID in serverState) {
			if (id != eID) {
				if (eID in localState) {
					newLocalState[eID] = localState[eID];
					var xDiff = serverState[eID].x - localState[eID].x;
					var yDiff = serverState[eID].y - localState[eID].y;
					newLocalState[eID].x += xDiff * delta * 10;
					newLocalState[eID].y += yDiff * delta * 10;
				} else {
					newLocalState[eID] = serverState[eID];
				}
			}
		}
		localState = newLocalState;

		var dx = 0;
		var dy = 0;
		if (38 in keysDown) { // Up
			dy = -speed * delta;
		}
		if (40 in keysDown) { // Down
			dy = speed * delta;
		}
		if (37 in keysDown) { // Left
			dx = -speed * delta;
		}
		if (39 in keysDown) { // Right
			dx = speed * delta;
		}

		if (!outOfBounds(x + dx, y, radius)) {
			x += dx;
		}
		if (!outOfBounds(x, y + dy, radius)) {
			y += dy;
		}
	};

	function render() {
		ctx.fillStyle = "blue";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(x, y, 10, 0, 2 * Math.PI);
		ctx.fill();

		for (var eID in localState) {
			if (id != eID) {
				var enemy = localState[eID];
				ctx.fillStyle = "yellow";
				ctx.beginPath();
				ctx.arc(enemy.x, enemy.y, radius, 0, 2 * Math.PI);
				ctx.fill();
			}

		}

		ctx.fillStyle = "white";
		ctx.font = "30px Arial";
		ctx.fillText("Fps: " + fps, 10, 35);
	};

	socket.on('success', function(data) {
		log('Connected successfully to server');
		logDir(data);

		canvas.width = data.width;
		canvas.height = data.height;
		x = data.x;
		y = data.y;
		id = data.id;
		main();

	});

	socket.on('sync', function(data) {
		log('Got sync');
		serverState = data;
	});

	function log(message) {
		if (logging) {
			console.log(message);
		}
	};

	function logDir(object) {
		if (logging) {
			console.dir(object);
			button.value = 'Enable logging';
			con
		}
	};

	function outOfBounds(x, y, radius) {
		if (x - radius < 0 || y - radius < 0 || x + radius > canvas.width || y + radius > canvas.height) {
			return true;
		} else {
			return false;
		}
	}


})