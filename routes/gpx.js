var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET users listing. */
router.get('*', function(req, res, next) {
	  res.render('map');
	//var content = fs.readFileSync()
  //res.send(req +' '+res+' '+next);
  //var path = path.join(__dirname, 'data'+req.url+'.gpx');
  //var file = fs.readFileSync(path);
  //res.send(path);

});

module.exports = router;
