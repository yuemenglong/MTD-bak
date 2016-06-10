var _ = require("lodash");
var through = require('through2');
var gutil = require('gulp-util');
var stream = require("stream");

function prerequire() {
    var ret = function(file, opt) {
        var buf = [];
        var obj = through(function(chunk, enc, cb) {
            buf.push(chunk);
            return cb();
        }, function(cb) {
            var content = Buffer.concat(buf).toString();
            var requirePattern = /^.*require\((['"]).+\1\).*$/gm;
            var pathPattern = /.*require\((['"])(.+)\1\).*/;
            ret._plugins.forEach(function(p) {
                var match = content.match(requirePattern);
                match && match.forEach(function(line) {
                    var path = line.match(pathPattern)[2];
                    if (p.test.test(path)) {
                        content = p.transform(file, path, line, content);
                        if (content == undefined) {
                            throw new Error("Maybe Forget To Return Content");
                        }
                    }
                })
            })
            this.push(new Buffer(content));
            return cb();
        })
        obj.on("end", function() {
            ret._plugins.map(function(o) {
                if (o instanceof stream.Readable) {
                    o.push(null);
                }
            })
        })
        return obj;
    }

    ret.plugin = function() {
        ret._plugins = _.concat(ret._plugins, arguments);
    }
    ret._plugins = [];
    return ret;
}

module.exports = prerequire;
