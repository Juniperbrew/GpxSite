'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');


var files = [
	{
		src: './client/apps/activities/main.js',
		dest: './public/js/activities/bundle.js'
	},
	{
		src: './client/apps/upload/main.js',
		dest: './public/js/upload/bundle.js'
	},
	{
		src: './client/apps/websocket/main.js',
		dest: './public/js/websocket/bundle.js'
	},
	{
		src: './client/apps/chat/main.js',
		dest: './public/js/chat/bundle.js'
	}
];

gulp.task('watch', bundleAll);

function bundleAll() {
	files.forEach(function(file) {
		var customOpts = {
			entries: [file.src],
			debug: true
		};
		var opts = assign({}, watchify.args, customOpts);
		var b = watchify(browserify(opts));

		bundle(b, file.dest);
	})
};

function bundle(b, dest) {
	b.on('update', bundleAll);
	b.on('log', gutil.log);
	return b.bundle()
		// log errors if they happen
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source(dest))
		// optional, remove if you don't need to buffer file contents
		.pipe(buffer())
		// optional, remove if you dont want sourcemaps
		.pipe(sourcemaps.init({
			loadMaps: true
		})) // loads map from browserify file
		// Add transformation tasks to the pipeline here.
		.pipe(sourcemaps.write('./')) // writes .map file
		.pipe(gulp.dest('./'));
};