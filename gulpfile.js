// jQuery Joyride - created with Gulp Fiction
var gulp = require("gulp");
var livereload = require("gulp-livereload"),
	watch = require("gulp-watch"),
	prefix = require("gulp-autoprefixer");
	sass = require("gulp-sass");
var concat = require("gulp-concat");

gulp.task("js", function () {
	gulp.src([{"path":"./src/scripts/*.js"}])
		.pipe(concat("jquery-joyride.min.js"))
		.pipe(gulp.dest("./dist/"));
});

// TODO: Fix autoprefixer settings not working
gulp.task("sass", function() {
	gulp.src("./src/sass/*.scss")
		.pipe(sass())
		.pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(gulp.dest("./dist/css"))
});

gulp.task("watch", function () {
	var server = livereload();
	gulp.watch("./dist/**").on("change", function(file) {
		server.changed(file.path);
	});
});

gulp.task("server", function(next) {
	var connect = require("connect"),
		server = connect();
	server.use(connect.static(dest)).listen(process.env.PORT || 80, next);
});