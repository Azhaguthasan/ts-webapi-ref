"use strict";

var gulp = require("gulp");
var argv = require("yargs").argv;
var plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "mkdirp", "del", "wrench", "tsd"]
});

var options = {
    args: argv,
    src: "src",
    dist: "dist",
    tmp: ".tmp",
    errorHandler: function (title) {
        return function (err) {
            plugins.util.log(plugins.util.colors.red("[" + title + "]"), err.toString());
            plugins.util.beep();
            this.emit("end");
        };
    },
    tsdJson: "tsd.json",
};

plugins.wrench.readdirSyncRecursive("./gulp").filter(function (file) {
    return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
    require("./gulp/" + file)(gulp, plugins, options);
});

gulp.task("default", function () {
    gulp.start("build");
});
