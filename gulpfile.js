var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf').sync,
  requireDir = require('require-dir'),
  browser = require('browser-sync'),
  config = require('./gulp/config'),
  port = process.env.SERVER_PORT || 3000;

requireDir('./gulp');



/**
 * Gulp task default.
 * Calls build:all.
 */
gulp.task('default', ['serve', 'watch']);

/**
 * Gulp task build:all.
 * Calls build:foundation and build:standalone.
 */
gulp.task('build:all', function(cb) {
    runSequence('build:foundation', 'build:standalone', cb);
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
 * Gulp task watch.
 * Watch files for changes and reloads the browser.
 */
gulp.task('watch', function() {
  gulp.watch('js/**/*', [[['js:foundation'], 'js:standalone'], browser.reload]);
  gulp.watch('scss/**/*', [[['css:foundation'], 'css:standalone'], browser.reload]);
  gulp.watch('test/visual/*.html', [browser.reload]);
});


/**
 * Gulp task serve.
 * Starts a BrowerSync instance.
 */
gulp.task('serve', ['build:all'], function(){
  browser.init({server: './test/visual', port: port});
});


/**
 * Gulp task clean.
 * Deletes the build and the dest folder.
 */
gulp.task('clean', function () {
  rimraf(config.buildPath);
  rimraf(config.destPath);
});