var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf').sync,
  babel = require('gulp-babel'),
  exec = require('child_process').exec,
  config = require('./config'),
  tmpFolder = './_publish/';

/**
 * Gulp task publish.
 * Publishes latest version to gh-pages.
 */
gulp.task('publish', function (cb) {
  runSequence('publish:prepare', 'publish:push', 'publish:clean', cb);
});

/**
 * Gulp task publish:prepare.
 * Creates temporary folder to publish by copying all relevant assets.
 */
gulp.task('publish:prepare', function (cb) {
  // Copy HTML files
  gulp.src(['./test/visual/*'])
    .pipe(gulp.dest(tmpFolder))
    .on('end', function() {
      // Copy component files
      gulp.src([config.buildPath + '/assets/*'])
        .pipe(gulp.dest(tmpFolder + 'assets/'))
        .on('end', function() {
          // Copy dependencies
          gulp.src(['./node_modules/{foundation-sites,what-input,jquery}/**/*'])
            .pipe(gulp.dest(tmpFolder + '/'))
            .on('end', cb);
        });
    });
});

/**
 * Gulp task publish:clean.
 * Cleans up temporary folder for publish.
 */
gulp.task('publish:clean', function (cb) {
  rimraf(tmpFolder);
});

/**
 * Gulp task publish:push.
 * Publishes the visual tests to gh-pages.
 */
gulp.task('publish:push', function(cb) {
  exec('git subtree push --prefix ' + tmpFolder + ' origin gh-pages', function(error, stdout, stderr) {
    console.log(stdout);
    cb();
  });
});