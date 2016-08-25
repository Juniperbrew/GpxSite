var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log("hit index");
	res.render('index', { title: 'Express' });
});

router.get('/activities', function(req, res, next) {
	res.render('activities', { title: 'Activities', id: 'activities' });
});

router.get('/upload', function(req, res, next) {
	res.render('upload', { title: 'Upload', id: 'upload'  });
});

router.get('/chat', function(req, res, next) {
	res.render('chat', { title: 'Chat', id: 'chat'  });
});

router.get('/websocket', function(req, res, next) {
	res.render('websocket', { title: 'Websocket', id: 'websocket'  });
});

router.get('/game', function(req, res, next) {
	res.render('game', { title: 'Game', id: 'game'  });
});

module.exports = router;
