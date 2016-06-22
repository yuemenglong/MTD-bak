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
var DebugPlugin = require("./tool/debug-plugin");
var ExcludePlugin = require("./tool/exclude-plugin");
var LessPlugin = require("./tool/less-plugin");
var JadePlugin = require("./tool/jade-plugin");

var exclude = ["react", "react-dom", "redux", "react-redux",
    "lodash", "bluebird", "moment",
    "isomorphic-fetch", "events",
];

var requireMap = {
    "react": "http://cdn.bootcss.com/react/0.14.7/react.js",
    "react-dom": "http://cdn.bootcss.com/react/0.14.7/react-dom.js",
    "redux": "http://cdn.bootcss.com/redux/3.5.2/redux.js",
    "react-redux": "http://cdn.bootcss.com/react-redux/4.4.5/react-redux.js",
    "lodash": "http://cdn.bootcss.com/lodash.js/4.12.0/lodash.min.js",
    "bluebird": "http://cdn.bootcss.com/bluebird/3.3.5/bluebird.min.js",
    "fetch": "http://cdn.bootcss.com/fetch/1.0.0/fetch.min.js",
    "moment": "http://cdn.bootcss.com/moment.js/2.13.0/moment.min.js",
    "events": "http://cdn.bootcss.com/EventEmitter/5.0.0/EventEmitter.min.js",
    "chosen": "http://cdn.bootcss.com/chosen/1.5.1/chosen.jquery.min.js",
    "redux-thunk": "",
    "react-addons-update": "",
}

var assets = [".*\\.less"];
var frontend = ["chosen"];

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
        .pipe(addsrc(["src/**/*.less"]))
        .pipe(gulp.dest("build"));
}

function dist() {
    var pre = prerequire();
    var ep = new ExcludePlugin(assets.concat(frontend));
    pre.plugin(ep);
    return gulp.src("build/**/*.js")
        .pipe(pre())
        .pipe(gulp.dest("dist"));
}

function dispatch() {
    var dispatchTasks = apps.map(function(name) {
        return gulp.src("build/bundle.js")
            .pipe(gulp.dest(`build/app/${name}`));
    })
    return merge(dispatchTasks);
}

function pack() {
    var lessTasks = [];
    var jadeTasks = [];
    var packTasks = apps.map(function(name) {
        var b = browserify(`build/app/${name}/bundle.js`);
        var pre = prerequire.transform(b);
        var jp = new JadePlugin(requireMap, name, `${name}.jade`);
        // var ep = new ExcludePlugin(exclude);
        var lp = new LessPlugin("bundle.css");
        pre.plugin(jp);
        // pre.plugin(ep);
        pre.plugin(lp);
        // var lessTask = lp.pipe(gulp.dest(`bundle/${name}`));
        var jadeTask = jp.pipe(gulp.dest("web/jade"));
        jadeTasks.push(jadeTask);
        // lessTasks.push(lessTask);
        return b.bundle()
            .pipe(source("bundle.js"))
            .pipe(buffer())
            .pipe(gulp.dest(`bundle/${name}`))
    })
    return merge(packTasks.concat(jadeTasks));
}

function clean() {
    return gulp.src("build").pipe(path(del));
}

var all = gulp.series(build, dist, dispatch, pack, clean);

gulp.task("build", build);
gulp.task("dist", dist);
gulp.task("dispatch", dispatch);
gulp.task("pack", pack);
gulp.task("clean", clean);
gulp.task("all", all);
gulp.task("default", all);


gulp.task("server-render", function() {
    return gulp.src("web/server-render.jsx")
        .pipe(jadeToJsx())
        .pipe(babel({ presets: ['react'] }))
        .pipe(rename({ extname: ".js" }))
        .pipe(gulp.dest("web/"));
})


gulp.task('watch', function() {
    var src = ["src/**/*.js", "src/**/*.jsx", "src/**/*.less"];
    gulp.watch(src, all);
});
