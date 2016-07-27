module.exports = function(io) {
	var app = require('express');
	var express = require('express');
	var router = express.Router();

	var multer  = require('multer');

	var db = require('../libs/db.js');
	var app = require('../app');
	db.connect();

	debugger;

	var upload = multer();

	var connections = [];

	router.get('/stream', function(req, res) {
		res.sseSetup();
		res.sseSend("test");
		connections.push(res);
	})

	router.get("/activities", function(req,res) {
		var result = db.getAllActivities(function(result){
			res.json(result);
		});
	});

	router.get('/activity', function(req, res) {
		var id = req.query.id;
		var result = db.getActivity(id, function(result){
			res.json(result);
		});
	});

	router.post('/activity' , upload.array('gpx'), function (req, res) {
		res.send('POST activity received');
		var files = req.files;
		for(i = 0; i < files.length; i++) {
			console.log("Received: "+files[i].originalname);
			db.storeGpx(files[i].buffer.toString());
		}
	});

	router.post('/location', function(req, res) {

		console.log('got POST location');
		res.send('POST location received');
		var value = JSON.parse(req.get('location'));
	//db.storeLocation(value);

	//Send message to websockets
	io.emit('location', value);

	//Update open connections
	for(var i = 0; i < connections.length; i++){
		console.log("Sent location update to client: "+i);
		connections[i].sseSend(value);
	}
});

	return router;
}
