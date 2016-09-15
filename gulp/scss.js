var gulp = require('gulp'),
  rename = require('gulp-rename'),
  sass = require('gulp-ruby-sass')
  mustache = require('gulp-mustache'),
  config = require('./config');
  
/**
 * Gulp task scss:*.
 * Converts SASS to CSS into the build folder.
 */

gulp.task('scss:foundation', function () {
  return sass(config.srcPath + 'scss/' + config.name + '.scss', {sourcemap: false})
    .pipe(rename(config.name + '.css'))
    .pipe(gulp.dest(config.buildPath));
});

gulp.task('scss:standalone', ['writeScss:foundation', 'scss:foundation'], function () {
  return sass(config.buildPath + 'foundation.scss', {sourcemap: false, defaultEncoding: 'UTF-8'})
    .pipe(gulp.dest(config.buildPath));
});


// prepare imports for SASS dynamically based on config
gulp.task('writeScss:foundation', function () {
  return gulp.src(config.srcPath + 'scss/foundation_dependencies.scss')
    .pipe(mustache(config.css)) 
    .pipe(rename('foundation.scss'))
    .pipe(gulp.dest(config.buildPath));
});