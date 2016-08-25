'use strict';

var angular = require('angular');

var vars = {};

angular.module('activitiesApp', [])
	.filter('parseActivity', require('../../filters/parseActivity'))
	.factory('api', require('../../providers/api'))
	.factory('format', require('../../providers/format'))
	.value('vars', vars)
	.controller('ActivitiesController', require('../../controllers/ActivitiesController'));


 (function() {

	google.charts.load('current', {
		packages: ['corechart']
	});

	console.log("Activities");

})();

window.initMap = function() {
	console.log('Initializing map');
	vars.map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 0,
			lng: 0
		},
		zoom: 1
	});

	google.maps.LatLng.prototype.kmTo = function(a) {
		var e = Math,
			ra = e.PI / 180;
		var b = this.lat() * ra,
			c = a.lat() * ra,
			d = b - c;
		var g = this.lng() * ra - a.lng() * ra;
		var f = 2 * e.asin(e.sqrt(e.pow(e.sin(d / 2), 2) + e.cos(b) * e.cos(c) * e.pow(e.sin(g / 2), 2)));
		return f * 6378.137;
	}

	google.maps.Polyline.prototype.inKm = function(n) {
		var a = this.getPath(n),
			len = a.getLength(),
			dist = 0;
		for (var i = 0; i < len - 1; i++) {
			dist += a.getAt(i).kmTo(a.getAt(i + 1));
		}
		return dist;
	}
}