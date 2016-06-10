var stream = require("stream");
var util = require("util");
var p = require("path");
var less = require("gulp-less");
var fs = require("fs");

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var vfs = require('vinyl-fs');
var File = require("vinyl");

function LessPlugin(opt) {
    var buf = [];
    this.test = /.+\.less/;
    this.transform = function(file, path, line, content) {
        var abs = p.resolve(p.dirname(file), path);
        var output = `@import '${abs.replace("\\", "\\\\")}';`;
        buf.push(output);
        content = content.replace(line, "");
        return content;
    }
    this.vfs = function() {
        return new File({ contents: new Buffer(buf.join("\n")) });
    }
}
util.inherits(LessPlugin, stream.PassThrough);

// fs.createReadStream("test.js").pipe(source()).pipe(process.stdout);

module.exports = LessPlugin;
