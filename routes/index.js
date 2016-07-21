var express = require('express');
var router = express.Router();

/* GET home page. */
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

router.get('/db', function(req, res) {
	console.log("hit db");
	var MongoClient = req.MongoClient;
	var url = req.MongoUrl;
	MongoClient.connect(url, function(err, db) {
		if(err) { return console.dir(err); }

		var collection = db.collection('activities');

		collection.find({ },{ "gpx.trk.name": 1, "_id": 0}).toArray(function(err, result) {
			res.render('activities', { activities: result });
		});    
	});
	
});

var findActivities = function(db, callback) {
	var cursor = db.collection('activities').find({ },{ "gpx.trk.name": 1});
	var result = cursor.toArray();
	callback(result);
   /*cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
  });*/
};

module.exports = router;
