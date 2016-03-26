var gulp = require('gulp'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  gulpUtil = require('gulp-util'),
  config = require('./config');

/**
 * Gulp task js:*.
 * Concates the JS dependencies.
 * Outputs uglified and un-uglified JS files to dist.
 */

gulp.task('js:foundation', function () {
  // minified JS
  gulp.src([config.srcPath + 'js/' + config.name + '.js'])
    .pipe(babel())
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(rename('foundation.' + config.name + '.min.js'))
    .pipe(gulp.dest(config.destPath));

  // unminified JS
  gulp.src([config.srcPath + 'js/' + config.name + '.js'])
    .pipe(babel())
    .pipe(rename('foundation.' + config.name + '.js'))
    .pipe(gulp.dest(config.destPath));
});

gulp.task('js:standalone', function () {
  // minified JS
  gulp.src(config.javascript.dependencies)
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat('solo.' + config.name + '.min.js'))
  .pipe(gulp.dest(config.destPath));

  // unminified JS
  gulp.src(config.javascript.dependencies)
  .pipe(babel())
  .pipe(concat('solo.' + config.name + '.js'))
  .pipe(gulp.dest(config.destPath));

});