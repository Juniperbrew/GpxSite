var map;

(function() {
	var app = angular.module('app', []);

	app.controller('Controller', function($http, $scope){

		init();

		$scope.log = function(text){
			console.log(text);
		}
		console.log(window.location.hostname);
		$http.get('http://localhost:3000/api/activities')
		.then(function(result) {
			console.dir(result);
			$scope.activities = result.data;
		});

		$scope.selected = function(id){
			getActivity(id);
  			window.scrollTo(0,0); //scroll to top
  		};

  		function getActivity(id){
  			$http.get('http://localhost:3000/api/activity/',{ params: { id: id }})
  			.then(function(result) {
  				$scope.selectedActivity = result.data;
  				loadActivity(result.data);
  			})
  		}

  		var checkpointsForPace = 10;
  		var routePath;

  		function loadActivity(gpx){
  			var route = gpx[0].gpx.trk.trkseg.trkpt;
  			var path = [];
  			var bounds = new google.maps.LatLngBounds();

  			var startPoint = route[0];
  			var start = new google.maps.LatLng(startPoint.lat, startPoint.lon);
  			var startTime = new Date(startPoint.time);
  			$scope.date = startTime;

  			var endPoint = route[route.length-1];
  			var endTime = new Date(endPoint.time);

  			var durationMilli = endTime - startTime;
  			$scope.duration = getTimeStamp(durationMilli);

  			var elevationDataArray = [];
  			elevationDataArray.push(["Time", "Elevation"]);

  			var paceDataArray = [];
  			paceDataArray.push(["Time", "Pace"]);
  			var paceCounter = checkpointsForPace;
  			var paceMeasurement = 0;

  			var lastPoint = start;
  			for(i = 0; i< route.length; i++){
  				var p = route[i];
  				var lat = parseFloat(p.lat);
  				var lon = parseFloat(p.lon);
  				var elevation = parseFloat(p.ele);
  				var time = new Date(p.time);
  				var point = new google.maps.LatLng(lat, lon);
  				path.push(point);
  				bounds.extend(point);

  				elevationDataArray.push([time,elevation]);

  				paceMeasurement += lastPoint.kmTo(point);
  				paceCounter--;
  				if(paceCounter==0){
  					var duration = (time - startTime)/(1000*60);
  					paceDataArray.push([time, duration/paceMeasurement]);
  					paceMeasurement = 0;
  					startTime = time;
  					paceCounter = checkpointsForPace;
  				}
  				lastPoint = point;
  			}

  			if(routePath !== undefined){
  				routePath.setMap(null);
  			}
  			routePath = new google.maps.Polyline({
  				path: path,
  				strokeColor: '#FF0000',
  				strokeOpacity: 1.0,
  				strokeWeight: 2
  			});
  			$scope.length = routePath.inKm().toFixed(2);
  			var paceMin = (durationMilli/(1000*60)) / $scope.length;
  			$scope.averagePace = formatPace((durationMilli/(1000)) / $scope.length);
  			map.fitBounds(bounds);
  			routePath.setMap(map);

  			var elevationData = google.visualization.arrayToDataTable(elevationDataArray);
  			var elevationChart = new google.visualization.LineChart(document.getElementById('elevationChart'));
  			elevationChart.draw(elevationData, null);

  			var paceData = google.visualization.arrayToDataTable(paceDataArray);
  			var paceChart = new google.visualization.LineChart(document.getElementById('paceChart'));
  			var options = {
  				title: 'Pace',
  				legend: 'none',
  				vAxis: { viewWindow: {max: paceMin+3,
  					min: paceMin-3}}
  				};

  				paceChart.draw(paceData, options);
  			$scope.hide = false;
  		}

		function getTimeStamp(ms){
			var sec = Math.floor((ms/1000) % 60);
			var min = Math.floor((ms/(1000*60)) % 60);
			var hour = Math.floor((ms/(1000*60*60)));
			return ("0"+hour).slice(-2) + ":"+ ("0"+min).slice(-2) + ":" + ("0"+sec).slice(-2);
		}

		function formatPace(secPerKm){
			var min = Math.floor(secPerKm/60);
			var sec = Math.floor(secPerKm%60);
			return min +":"+("0"+sec).slice(-2);
		}

	});

	app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

	app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);

	app.controller('UploadController', ['$scope', 'fileUpload', function($scope, fileUpload){

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/api/activity";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
	}]);

  app.filter('parseActivity', function() {
  return function(input) {
    return input.split(" ")[0];
  };
  });

})();

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });

	google.maps.LatLng.prototype.kmTo = function(a){ 
		var e = Math, ra = e.PI/180; 
		var b = this.lat() * ra, c = a.lat() * ra, d = b - c; 
		var g = this.lng() * ra - a.lng() * ra; 
		var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d/2), 2) + e.cos(b) * e.cos 
			(c) * e.pow(e.sin(g/2), 2))); 
		return f * 6378.137; 
	}

	google.maps.Polyline.prototype.inKm = function(n){ 
		var a = this.getPath(n), len = a.getLength(), dist = 0; 
		for (var i=0; i < len-1; i++) { 
			dist += a.getAt(i).kmTo(a.getAt(i+1)); 
		}
		return dist; 
	}
}

function init() {

	google.charts.load('current', {packages: ['corechart']});


}

