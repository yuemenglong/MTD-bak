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

var exclude = ["react", "react-dom", "lodash", "bluebird",
    "isomorphic-fetch", "moment", "redux", "react-redux", "events",
];
// var exclude = ["React", "ReactDOM", "Redux", "ReactRedux",
//     "_", "Promise", "fetch", "moment", "EventEmitter"
// ];

gulp.task('src', ["pre-clean", "server", "build", "pack", "post-clean"]);
gulp.task('default', ["src", "less"]);

gulp.task('pre-clean', function() {
    return gulp.src("server").pipe(path(del));
});

gulp.task("server", ["pre-clean"], function() {
    return gulp.src("src/**/*.jsx")
        .pipe(jadeToJsx())
        .pipe(addsrc(["src/**/*.js"]))
        .pipe(babel({ presets: ['react', 'es2015'] }))
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest("server"));
})

//trans jsx => js
gulp.task('build', ["server"], function() {
    var excludePattern = "(" + exclude.join(")|(") + ")";
    var pattern = `^.*require\\((["'])(${excludePattern})\\1\\).*$`;
    return gulp.src("server/**/*.js")
        // .pipe(replace(/^.*require\((["'`])[^.].*\1\).*$/gm, "")) //ignore external
        .pipe(replace(new RegExp(pattern, "gm"), ""))
        .pipe(gulp.dest("build"));
});

//pack js
gulp.task('pack', ["build"], function() {
    // var b = browserify("build/bundle.js");
    // exclude.map(o => b.external(o));
    // return b.bundle()
    return browserify('build/container/Window/bundle.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest('bundle'));
});

gulp.task("less", function() {
    return gulp.src("src/**/*.less")
        .pipe(less())
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest("bundle"));
})

//del js which transformed from jsx
gulp.task('post-clean', ["build", "pack"], function() {
    return gulp.src("build").pipe(path(del));
});


gulp.task('watch', ["default"], function() {
    gulp.watch("src/**/*.js", ["src"]);
    gulp.watch("src/**/*.jsx", ["src"]);
    gulp.watch("src/**/*.less", ["less"]);
});
