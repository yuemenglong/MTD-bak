var stream = require("stream");
var util = require("util");
var p = require("path");
var less = require("gulp-less");
var fs = require("fs");

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var vfs = require('vinyl-fs');
var File = require("vinyl");
var stream = require("stream");

function LessPlugin(name) {
    stream.Readable.call(this);
    var that = this;
    this.test = /.+\.less/;
    this.transform = function(file, path, line, content) {
        var abs = p.resolve(p.dirname(file), path);
        var output = `@import '${abs.replace("\\", "\\\\")}';\n`;
        console.log(`push: ${output}`);
        this.push(output);
        content = content.replace(line, "");
        return content;
    }
    this._read = function() {}

    this.pipe = (function() {
        var ret = that.pipe(source(name))
            .pipe(buffer())
            .pipe(less());
        return ret.pipe.bind(ret);
        // return rs.pipe.bind(rs);
    })();
    // this.rs = rs;
}
util.inherits(LessPlugin, stream.Readable);

// fs.createReadStream("test.js").pipe(source()).pipe(process.stdout);

module.exports = LessPlugin;
