var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf').sync,
  scss = require('./gulp/scss'),
  css = require('./gulp/css'),
  js = require('./gulp/javascript'),
  config = require('./gulp/config');


/**
 * Gulp task default.
 * Calls build:all.
 */
gulp.task('default', ['build:all']);

/**
 * Gulp task build:all.
 * Calls build:foundation and build:standalone.
 */
gulp.task('build:all', function() {
    runSequence('build:foundation', 'build:standalone');
});

/**
 * Gulp task build:foundation.
 * Calls js:foundation and css:foundation.
 */
gulp.task('build:foundation', ['js:foundation', 'css:foundation']);

/**
 * Gulp task build:standalone.
 * Calls js:standalone and css:standalone.
 */
gulp.task('build:standalone', ['js:standalone', 'css:standalone']);

/**
 * Gulp task clean.
 * Deletes the build and the dest folder.
 */
gulp.task('clean', function () {
  rimraf(config.buildPath);
  rimraf(config.destPath);
});