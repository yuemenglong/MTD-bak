var gulp = require('gulp');
var jadeToJsx = require("./gulp-jade-jsx");

gulp.task('default', function() {
    console.log("hello world");
});

gulp.task('jsx', function() {
    gulp.src("src/*.jsx")
        .pipe(jadeToJsx())
        .pipe(gulp.dest("jsx"));
});
