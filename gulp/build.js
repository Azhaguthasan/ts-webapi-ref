"use strict";

module.exports = function (gulp, plugins, options) {
	gulp.task("build", ["compile"], function () {		
		return gulp
			.src(options.tmp + "/app/**/*.js")
			.pipe(plugins.uglify())
			.pipe(plugins.concat("index.js"))
			.pipe(gulp.dest("./"));
	});
}