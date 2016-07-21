var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

var multer  = require('multer');

var db = require('../libs/db.js');

/*var storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null,Date.now() + '-' + file.originalname)
  }
});

var upload = multer({ storage: storage });*/
var upload = multer();

router.get("/activities", function(req,res) {
	//console.dir(res);
	var MongoClient = req.MongoClient;
	var url = req.MongoUrl;
	MongoClient.connect(url, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('activities');

		//collection.find({ },{ "sort" : [['gpx.trk.time', -1]]}).find({ } , {"gpx.trk.name": 1}).toArray(function(err, result) {
		collection.find({ },{"gpx.trk.name": 1, "gpx.trk.time": 1}).sort({"gpx.trk.time": -1}).toArray(function(err, result) {
			res.json(result);
		});
	});
});

router.get('/activity', function(req, res) {

	var MongoClient = req.MongoClient;
	var url = req.MongoUrl;

	console.dir(req.query);
	var id = req.query.id;
	console.log(id);

	var o_id = new ObjectID(id);

	MongoClient.connect(url, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('activities');

		collection.find({ '_id': o_id }).toArray(function(err, result) {
			res.json(result);
		});
	});

});

router.post('/activity' , upload.array('gpx'), function (req, res) {
  //res.send('POST activity received');
  res.render('activities', { title: 'Activities' });
  //console.log(req.file.buffer.toString());
  var files = req.files;
  for(i = 0; i < files.length; i++) {
  	  console.log("Received: "+files[i].originalname);
  	  db.storeGpx(files[i].buffer.toString());
  }

  
  //console.log(req.files);
  //console.dir(req.file);
});

module.exports = router;
