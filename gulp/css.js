var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  minify_css = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  config = require('./config');

/**
 * Gulp task css:foundation.
 * Concates the CSS dependencies for the Foundation based version. Applies Autoprefixer.
 * Outputs to buildPath.
 */
gulp.task('css:foundation', ['scss:foundation'], function () {
  return gulp.src([config.buildPath + config.name + '.css'])
    .pipe(autoprefixer({
      browsers: config.css.compatibility
    }))
    .pipe(rename('foundation.' + config.name + '.css'))
    .pipe(gulp.dest(config.buildPath + 'assets/'));
});

/**
 * Gulp task css:standalone.
 * Concates the CSS dependencies for the standalone version. Applies Autoprefixer.
 * Outputs to buildPath.
 */
gulp.task('css:standalone', ['scss:standalone', 'css:foundation'], function () {
  return gulp.src([config.buildPath + '/*.css'])
    .pipe(concat('solo.' + config.name + '.css'))
    .pipe(autoprefixer({
      browsers: config.css.compatibility
    }))
    .pipe(gulp.dest(config.buildPath + 'assets/'));
});


/**
 * Gulp task css:min.
 * Minifies the result of css:*.
 * Outputs to destPath.
 */
gulp.task('css:min', ['css:foundation', 'css:standalone'], function () {
    return gulp.src(config.buildPath + '/assets/*.css')
    .pipe(minify_css())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(config.destPath));
});
