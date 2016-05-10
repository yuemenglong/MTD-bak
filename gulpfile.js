var gulp = require('gulp');
var jadeToJsx = require("gulp-jade-jsx");
//var jsxToJs = require("./gulp-jsx");
var rename = require("gulp-rename");

var del = require('del');
var path = require('vinyl-paths');
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babel = require('gulp-babel');

gulp.task('default', ["clean"]);

//trans jsx => js
gulp.task('build', function() {
    gulp.src("src/*.jsx")
        .pipe(jadeToJsx())
        // .pipe(jsxToJs())
        .pipe(babel({ presets: ['react'] }))
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest("src"));
});

//pack js
gulp.task('pack', ["build"], function() {
    return browserify('src/app.js', { bundleExternal: false })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('bundle'));
});

//del js which transformed from jsx
gulp.task('clean', ["pack"], function() {
    gulp.src("src/*.jsx")
        .pipe(rename({ extname: ".js" }))
        .pipe(path(del));
});
