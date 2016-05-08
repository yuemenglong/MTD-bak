var gulp = require('gulp');
var jadeToJsx = require("./gulp-jade-jsx");
var jsxToJs = require("./gulp-jsx");

gulp.task('default', function() {
    console.log("hello world");
});

gulp.task('jsx', function() {
    gulp.src("src/*.js")
        .pipe(jadeToJsx())
        .pipe(jsxToJs())
        .pipe(gulp.dest("build"));
});

gulp.task('build', function() {

});
