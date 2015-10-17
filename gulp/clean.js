"use strict";

module.exports = function (gulp, plugins, options) {
	gulp.task("clean", function (done) {
        var envPath = "";
        
        plugins.del([options.dist + "/" + envPath, options.tmp + "/", "index.js"], done);
    });
}