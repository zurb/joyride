var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  prompt = require('gulp-prompt').prompt,
  replace = require('gulp-replace'),
  sequence = require('run-sequence'),
  inquirer = require('inquirer'),
  config = require('./config');

var VERSIONED_FILES = [
  config.srcPath + 'js/' + config.name + '.js',
  'package.json',
  'bower.json'
];
var CURRENT_VERSION = require('../package.json').version;
var NEXT_VERSION;


gulp.task('dist', function(cb) {
  sequence('dist:prompt', 'dist:version', 'dist:min', cb);
});

/**
 * Gulp task dist:min.
 * Copies the built files into the dist folder, calls js:min and css:min.
 */
gulp.task('dist:min', ['js:min', 'css:min'], function() {
  // uninified files
  gulp.src([config.buildPath + 'assets/*'])
    .pipe(gulp.dest(config.destPath));
});


gulp.task('dist:prompt', function(cb) {
  inquirer.prompt([{
    type: 'input',
    name: 'version',
    message: 'What version are we moving to? (Current version is ' + CURRENT_VERSION + ')'
  }], function(res) {
    NEXT_VERSION = res.version;
    cb();
  });
});

// Bumps the version number in any file that has one
gulp.task('dist:version', function() {
  return gulp.src(VERSIONED_FILES, { base: process.cwd() })
    .pipe(replace(CURRENT_VERSION, NEXT_VERSION))
    .pipe(gulp.dest('.'));
});