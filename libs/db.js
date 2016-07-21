var parser = require('xml2json');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/gpx';

exports.storeGpx = function(gpx) {

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server.");

		var json = JSON.parse(parser.toJson(gpx));
		db.collection('activities').insert(json, function(err, records) {
			if (err){
				console.log(err.message);
			} else {
				console.log("gpx added to db");
			}
  		});
	});
};