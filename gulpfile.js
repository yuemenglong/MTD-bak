var gulp = require('gulp');
var jadeToJsx = require("./gulp-jade-jsx");
var jsxToJs = require("./gulp-jsx");
var rename = require("gulp-rename");

var del = require('del');
var vinylPaths = require('vinyl-paths');

gulp.task('default', function() {
    console.log("hello world");
});

gulp.task('jsx', function() {
    gulp.src("src/*.jsx")
        .pipe(jadeToJsx())
        .pipe(jsxToJs())
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest("src"));
});

gulp.task('clean', function() {
    gulp.src("src/*.jsx")
        .pipe(rename({ extname: ".js" }))
        .pipe(vinylPaths(del));
});
