'use strict';

window.initMap = function() {
	var map = new google.maps.Map(document.getElementById('map'), {
		center: new google.maps.LatLng(0, 0),
		zoom: 1
	});

	var marker = new google.maps.Marker({
		map: map
	});
	var path = [];
	var polyLine;

	var socket = io.connect('/tracking');
	socket.on('location', function(location) {
		console.dir(location);
		var lat = parseFloat(location.lat);
		var lon = parseFloat(location.lon);
		console.log(lat + "," + lon);
		if (!isNaN(lat) && !isNaN(lon)) {
			var pos = new google.maps.LatLng(lat, lon);
			path.push(pos);

			marker.setPosition(pos);
			if (polyLine != null) {
				polyLine.setMap(null);
			}
			polyLine = new google.maps.Polyline({
				path: path,
				geodesic: true,
				strokeColor: '#FF0000',
			});
			polyLine.setMap(map);

			map.setZoom(17);
			map.panTo(pos);
		}
	});
	socket.on('connected', function(data) {
		socket.emit('websocket');
		console.log(data);
	});
}