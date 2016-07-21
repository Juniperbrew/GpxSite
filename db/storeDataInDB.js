var parser = require('xml2json');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var dataDir = __dirname + "/../data/";
var outputDir = __dirname + "/../data/json/"

var url = 'mongodb://localhost:27017/gpx';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");

  var openInserts = 0;
  var jsonArr = readGpx(dataDir,outputDir);
  console.log(jsonArr.length);
  jsonArr.forEach(function(document){
    openInserts++;
    db.collection('activities').insert(document, function(err, records) {
      if (err) console.log(err.message);
      openInserts--;
      //console.log("Record added as "+records[0]._id);
    });
});

  function checkOpenInserts(){
    console.log(openInserts);
    if(openInserts==0){
      db.close;
      console.log("DONE");
      process.exit();
    }else{
      setTimeout(checkOpenInserts , 100);
    }
  }
  checkOpenInserts();
});

//var schema = new mongoose.Schema({ name: 'string', size: 'string' });
/*var GpxModel= mongoose.model('Gpx', {
    text: {
        type: String,
        default: ''
    }
  });*/

//mongoose.connect('mongodb://localhost/gpx');

console.log("This file is " + __filename);
console.log("It's located in " + __dirname);



var insertDocument = function(document, db, callback) {
  db.collection('gpx').insertOne(document, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the gpx collection.");
    callback();
  });
};

function readGpx(dataDir, outputDir){
  var results = [];
  var filenames = fs.readdirSync(dataDir);
  filenames.forEach(function(filename) {
    if(!filename.endsWith('.gpx')){
      return;
    }
    var filepath = path.resolve(dataDir, filename);
    var fileStat = fs.statSync(filepath);
    if(fileStat.isDirectory()) {
      return;
    }
    var content = fs.readFileSync(dataDir + filename);
    var outputFile = filename.replace('.gpx','.json');
    var json = parser.toJson(content);
    results.push(JSON.parse(json));
    console.log(filename);
  });
  return results;
}