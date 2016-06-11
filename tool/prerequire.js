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
            var requirements = content.match(requirePattern) || [];
            content = content.replace(requirePattern, "");
            ret._plugins.forEach(function(plugin) {
                var paths = [];
                var lines = [];
                var length = requirements.length;
                var i = 0;
                while (i++ < length) {
                    var line = requirements.shift();
                    var path = line.match(pathPattern)[2];
                    if (RegExp(plugin.test).test(path)) {
                        paths.push(path);
                        lines.push(line);
                    } else {
                        requirements.push(line);
                    }
                }
                content = plugin.transform(file, paths, lines, content);
                requirements = requirements.concat(lines);
                if (content == undefined) {
                    throw new Error("Maybe Forget To Return Content");
                }
            })
            content = requirements.concat([content]).join("\n");
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
