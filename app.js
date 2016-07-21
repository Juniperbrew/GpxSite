var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveIndex = require('serve-index')

var routes = require('./routes/index');
var users = require('./routes/users');
var gpx = require('./routes/gpx');
var map = require('./routes/map');
var api = require('./routes/api');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/gpx';

//Test DB
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    if(path.endsWith('.gpx') || path.endsWith('.csv')) res.set('Content-Type', 'text/plain');
  }
}


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public') , options));
app.use('/gpx', express.static(path.join(__dirname, 'data') , options));
app.use('/gpx', serveIndex('data', {'icons': true}))

// Make our db accessible to our router
app.use(function(req,res,next){
    req.MongoClient = MongoClient;
    req.MongoUrl = url;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/map', map);
app.use('/api',api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err.stack);
    //res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
