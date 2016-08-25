'use strict';

var angular = require('angular');

var luegg = require('angularjs-scroll-glue');

var vars = {};

angular.module('chatApp', ['luegg.directives'])
	.factory('socket', require('../../providers/socket'))
	.value('vars', vars)
	.filter('formatMessage', require('../../filters/formatMessage'))
	.controller('ChatController', require('../../controllers/ChatController'));