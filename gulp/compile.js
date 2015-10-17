"use strict";

module.exports = function (gulp, plugins, options) {
	gulp.task("compile", function () {
		plugins.mkdirp.sync(options.tmp);

		function noTypings(file) {
			return file.path.indexOf(".d.ts") === -1;
		}

		return gulp
			.src([options.src + "/app/**/*.ts", "typings/**/*.ts"])
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.if(noTypings, plugins.tslint()))
			.pipe(plugins.if(noTypings, plugins.tslint.report("verbose", { emitError: false })))
			.pipe(plugins.typescript({
				sortOutput: true,
				removeComments: false,
				noExternalResolve: false,
				noImplicitAny: true,
				target: "ES5"
			}))
			.on("error", options.errorHandler("Typescript"))
			.pipe(plugins.sourcemaps.write())
			.pipe(gulp.dest(options.tmp + "/app"))
			.pipe(plugins.size());
	})
}