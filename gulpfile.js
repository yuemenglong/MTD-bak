var fs = require("fs");
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
var merge = require('merge-stream');

var through = require('through2');

var prerequire = require("./tool/prerequire");
var ExcludePlugin = require("./tool/exclude-plugin");
var LessPlugin = require("./tool/less-plugin");

var exclude = ["react", "react-dom", "redux", "react-redux",
    "lodash", "bluebird", "moment",
    "isomorphic-fetch", "events",
];

var assets = [".*\\.less"];

var apps = fs.readdirSync("src/app").filter(function(name) {
    var stats = fs.statSync(`src/app/${name}`)
    return stats.isDirectory();
});

function build() {
    return gulp.src("src/**/*.jsx")
        .pipe(jadeToJsx())
        .pipe(addsrc(["src/**/*.js"]))
        .pipe(babel({ presets: ['react'] }))
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest("build"));
}

function dispatch() {
    var dispatchTasks = apps.map(function(name) {
        var path = `build/app/${name}`;
        return gulp.src("build/bundle.js")
            .pipe(gulp.dest(`build/${name}`));
    })
    return merge(dispatchTasks);
}


gulp.task("pack", gulp.series(build, dispatch));
// gulp.task("pack2", gulp.series(build));

// // gulp.task('src', ["pre-clean", "build", "pack", "post-clean"]);
// // gulp.task('default', ["src", "less"]);

// gulp.task("test", function() {
//     var r = prerequire();
//     r.plugin(new ExcludePlugin(exclude));
//     r.plugin(new LessPlugin());
//     // gulp.src("test.js").pipe(r).pipe(gulp.dest("bundle"));
//     var t = through(function(chunk, enc, cb) {
//         return cb();
//     }, function(cb) {
//         return cb();
//     })
//     gulp.src("./none.js").pipe(t).pipe(gulp.dest("bundle"));
// })

// gulp.task('pre-clean', function() {
//     return gulp.src(["temp", "build"])
//         .pipe(path(del));
// });

// gulp.task("build", ["pre-clean"], function() {
//     function wait() {
//         var obj = through.obj(function(file, enc, cb) {
//             console.log(file);
//             obj.on("end", function() {
//                 console.log(file);
//                 cb();
//             })
//         })
//         return obj;
//     }
//     var buildTask = gulp.src("src/**/*.jsx")
//         .pipe(jadeToJsx())
//         .pipe(addsrc(["src/**/*.js"]))
//         // .pipe(babel({ presets: ['react', 'es2015'] }))
//         .pipe(babel({ presets: ['react'] }))
//         .pipe(rename({ extname: ".js" }))
//         .pipe(gulp.dest("build"));
//     var dispatchTasks = apps.map(function(name) {
//         var path = `src/app/${name}`;
//         return gulp.src("src/bundle.js")
//             .pipe(gulp.dest(`build/app/${name}`));
//     })
//     return buildTask.pipe(wait()).pipe(merge(dispatchTasks));
// })

// gulp.task("dist", ["build"], function() {
//     var pre = prerequire();
//     pre.plugin(new ExcludePlugin(assets));
//     return gulp.src("build/**/*.js")
//         .pipe(pre())
//         .pipe(gulp.dest("dist"));
// });

// gulp.task('pack-exclude', ["build"], function() {
//     var excludePattern = "(" + exclude.join(")|(") + ")";
//     var pattern = `^.*require\\((["'])(${excludePattern})\\1\\).*$`;
//     return gulp.src("build/**/*.js")
//         // .pipe(replace(/^.*require\((["'`])[^.].*\1\).*$/gm, "")) //ignore external
//         .pipe(replace(new RegExp(pattern, "gm"), ""))
//         .pipe(gulp.dest("temp"))
// })

// gulp.task('pack-dispatch', ["pack-exclude"], function() {
//     var names = fs.readdirSync("temp/app").filter(function(name) {
//         var stats = fs.statSync(`temp/app/${name}`)
//         return stats.isDirectory();
//     });
//     var dispatchTasks = names.map(function(name) {
//         var path = `temp/app/${name}`;
//         return gulp.src("temp/bundle.js")
//             .pipe(gulp.dest(`temp/app/${name}`));
//     })
//     return merge(dispatchTasks);
// })

// gulp.task('pack', ["pack-dispatch"], function() {
//     var names = fs.readdirSync("temp/app").filter(function(name) {
//         var stats = fs.statSync(`temp/app/${name}`)
//         return stats.isDirectory();
//     });
//     var packTasks = names.map(function(name) {
//         var path = `temp/app/${name}/bundle.js`;
//         var dest = `bundle/${name}`;
//         var b = browserify(path);
//         // b.pipeline.get('deps').push(require('through2').obj(
//         //     function(row, enc, next) {
//         //         console.log(row.file || row.id);
//         //         next();
//         //     }
//         // ));
//         return b.bundle()
//             .pipe(source('bundle.js'))
//             .pipe(buffer())
//             .pipe(gulp.dest(dest));
//     })
//     return merge(packTasks);
// });

// gulp.task('post-clean', ["pack"], function() {
//     return gulp.src("temp").pipe(path(del));
// });

// gulp.task("less", function() {
//     return gulp.src("src/**/*.less")
//         .pipe(less())
//         .pipe(concatCss("bundle.css"))
//         .pipe(gulp.dest("bundle"));
// })

// gulp.task("server-render", function() {
//     return gulp.src("web/server-render.jsx")
//         .pipe(jadeToJsx())
//         .pipe(babel({ presets: ['react'] }))
//         .pipe(rename({ extname: ".js" }))
//         .pipe(gulp.dest("web/"));
// })

// gulp.task('watch', ["default"], function() {
//     gulp.watch("src/**/*.js", ["src"]);
//     gulp.watch("src/**/*.jsx", ["src"]);
//     gulp.watch("src/**/*.less", ["less"]);
// });
