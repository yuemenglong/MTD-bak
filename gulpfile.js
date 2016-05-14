var gulp = require('gulp');
var jadeToJsx = require("gulp-jade-jsx");

var del = require('del');
var browserify = require("browserify");
var path = require('vinyl-paths');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var babel = require('gulp-babel');
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var addsrc = require('gulp-add-src');
var less = require("gulp-less");
var concatCss = require("gulp-concat-css");

gulp.task('default', ["build", "pack", "clean", "less"]);

gulp.task("src", ["build", "pack", "clean"]);

//trans jsx => js
gulp.task('build', function() {
    return gulp.src("src/**/*.jsx")
        .pipe(jadeToJsx())
        .pipe(babel({ presets: ['react'] }))
        .pipe(rename({ extname: ".js" }))
        .pipe(addsrc(["src/**/*.js", "src/**/*.json"]))
        .pipe(replace(/^.*require\((["'`])[^.].*\1\).*$/gm, "")) //ignore external
        .pipe(gulp.dest("build"));
});

//pack js
gulp.task('pack', ["build"], function() {
    return browserify('build/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('bundle'));
});

gulp.task("less", function() {
    return gulp.src("src/**/*.less")
        .pipe(less())
        .pipe(concatCss("app.css"))
        .pipe(gulp.dest("bundle"));
})

//del js which transformed from jsx
gulp.task('clean', ["build", "pack"], function() {
    return gulp.src("build").pipe(path(del));
});


gulp.task('watch', function() {
    gulp.watch("src/**/*.js", ["src"]);
    gulp.watch("src/**/*.jsx", ["src"]);
    gulp.watch("src/**/*.json", ["src"]);
    gulp.watch("src/**/*.less", ["less"]);
});
