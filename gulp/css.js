var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  minify_css = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  config = require('./config');

/**
 * Gulp task css:*.
 * Autoprefixes CSS rules and concats files.
 * Outputs minified and un-minified CSS files to dist.
 */

gulp.task('css:foundation', ['scss:foundation'], function () {
  // minified CSS
  gulp.src([config.buildPath + '/' + config.name + '.css'])
  .pipe(autoprefixer({
    browsers: config.css.compatibility
  }))
  .pipe(minify_css())
  .pipe(concat('foundation.' + config.name + '.min.css'))
  .pipe(gulp.dest(config.destPath));

  // unminified CSS
  gulp.src([config.buildPath + '/' + config.name + '.css'])
  .pipe(autoprefixer({
    browsers: config.css.compatibility
  }))
  .pipe(rename('foundation.' + config.name + '.css'))
  .pipe(gulp.dest(config.destPath));
});

gulp.task('css:standalone', ['scss:standalone'], function () {
  // minified CSS
  gulp.src([config.buildPath + '/*.css', config.pluginPath + 'dist/css/contextMenu.css'])
  .pipe(autoprefixer({
    browsers: config.css.compatibility
  }))
  .pipe(minify_css())
  .pipe(concat('solo.' + config.name + '.min.css'))
  .pipe(gulp.dest(config.destPath));

  // unminified CSS
  gulp.src([config.buildPath + '/*.css', config.pluginPath + 'dist/css/contextMenu.css'])
  .pipe(concat('solo.' + config.name + '.css'))
  .pipe(autoprefixer({
    browsers: config.css.compatibility
  }))
  .pipe(gulp.dest(config.destPath));
});