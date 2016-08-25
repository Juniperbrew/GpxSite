module.exports = function() {
	var module = {};

	var parser = require('xml2json');
	var MongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	var ObjectID = require('mongodb').ObjectID;

	var url = 'mongodb://localhost:27017/gpx';
	var db;

	MongoClient.connect(url, function(err, database) {
			if (err) {
				console.log("Database connection failed");
				console.log(err.message);
			} else  {
				console.log("Connected correctly to database.");
				db = database;
			}
	});

	module.storeDocument = function(collection, document) {
		db.collection(collection).insert(document, function(err, records) {
			if (err) {
				console.log(err.message);
			} else  {
				console.log("document added to collection: " + collection);
			}
		});
	};

	module.getActivity = function(id, callback) {
		var o_id = new ObjectID(id);
		db.collection('activities').find({
			'_id': o_id
		}).toArray(function(err, result) {
			return callback(result);
		});
	};
	module.getAllActivities = function(callback) {
		db.collection('activities').find({}, {
			"gpx.trk.name": 1,
			"gpx.trk.time": 1
		}).sort({
			"gpx.trk.time": -1
		}).toArray(function(err, result) {
			return callback(result);
		});
	};

	module.storeGpx = function(gpx) {
		var json = JSON.parse(parser.toJson(gpx));
		db.collection('activities').insert(json, function(err, records) {
			if (err) {
				console.log(err.message);
			} else  {
				console.log("gpx added to db");
			}
		});
	};

	module.storeLocation = function(location) {
		db.collection('locations').insert(location, function(err, records) {
			if (err) {
				console.log(err.message);
			} else  {
				console.log("location added to db");
			}
		});
	};

	return module;
}