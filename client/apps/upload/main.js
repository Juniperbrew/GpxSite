'use strict';

var angular = require('angular');

var vars = {};

angular.module('activitiesApp', [])
	.directive('fileModel', require('../../directives/fileModel'))
	.service('fileUpload', require('../../providers/fileUpload'))
	.value('vars', vars)
	.controller('UploadController', require('../../controllers/UploadController'));


console.log("Upload");