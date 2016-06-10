var stream = require("stream");
var util = require("util");
var p = require("path");
var less = require("gulp-less");
var fs = require("fs");

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var vfs = require('vinyl-fs');

function LessPlugin(opt) {
    var that = this;
    stream.PassThrough.call(this);
    this.opt = { test: /.+\.less/, chain: [source("test.css")] };
    this.plugin = function(file, path, line, content) {
        var abs = p.resolve(p.dirname(file), path);
        var output = `@import '${abs.replace("\\", "\\\\")}';`;
        this.push(output);
        content = content.replace(line, "");
        return content;
    }
    this.on("end", function() {
        that.push(null);
        // that.pipe(less()).pipe(fs.createWriteStream(opt.dest));
        // that.pipe(source("test.less")).pipe(buffer()).pipe(less);
        // that.pipe(source("test.css")).pipe(process.stdout);
        that.pipe(process.stdout);
    })
}
util.inherits(LessPlugin, stream.PassThrough);

// fs.createReadStream("test.js").pipe(source()).pipe(process.stdout);

module.exports = LessPlugin;
