var gulp = require('gulp'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  gulpUtil = require('gulp-util'),
  config = require('./config');

/**
 * Gulp task js:foundation.
 * Concates the JS dependencies for the Foundation based version. Applies Babel.
 * Outputs to buildPath.
 */
gulp.task('js:foundation', function () {
  return gulp.src(config.srcPath + 'js/' + config.name + '.js')
    .pipe(babel())
    .pipe(rename('foundation.' + config.name + '.js'))
    .pipe(gulp.dest(config.buildPath + 'assets/'));
});

/**
 * Gulp task js:standalone.
 * Concates the JS dependencies for the standalone version. Applies Babel.
 * Outputs to buildPath.
 */
gulp.task('js:standalone', ['js:foundation'], function () {
    return gulp.src(config.javascript.dependencies)
    .pipe(babel())
    .pipe(concat('solo.' + config.name + '.js'))
    .pipe(gulp.dest(config.buildPath + 'assets/'));
});

/**
 * Gulp task js:min.
 * Uglifies the result of js:*.
 * Outputs to destPath.
 */
gulp.task('js:min', ['js:foundation', 'js:standalone'], function () {
  return gulp.src(config.buildPath + 'assets/*.js')
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.destPath));
});
