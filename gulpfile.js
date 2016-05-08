var gulp = require('gulp');
var jadeToJsx = require("./gulp-jade-jsx");
var jsxToJs = require("./gulp-jsx");
var rename = require("gulp-rename");

var del = require('del');
var path = require('vinyl-paths');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('default', ["clean"]);

gulp.task('build', function() {
    gulp.src("src/*.jsx")
        .pipe(jadeToJsx())
        .pipe(jsxToJs())
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest("src"));
});

gulp.task('pack', ["build"], function() {
    return browserify('src/app.js', { bundleExternal: false })
        .bundle()
        .pipe(source('bundle.js')) // gives streaming vinyl file object
        .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
        .pipe(gulp.dest('bundle'));
});

gulp.task('clean', ["pack"], function() {
    gulp.src("src/*.jsx")
        .pipe(rename({ extname: ".js" }))
        .pipe(path(del));
});
