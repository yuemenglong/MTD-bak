var _ = require("lodash");
var through = require('through2');
var gutil = require('gulp-util');
var stream = require("stream");

var requirePattern = /^.*require\((['"]).+\1\).*$/gm;
var pathPattern = /.*require\((['"])(.+)\1\).*/;

function transform(file, content, plugins) {
    var requirements = content.match(requirePattern) || [];
    content = content.replace(requirePattern, "");
    plugins.forEach(function(plugin) {
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
    return content;
}

function wrapPlugin(ret) {
    ret.plugin = function() {
        ret._plugins = _.concat(ret._plugins, arguments);
    }
    ret._plugins = [];
}

function wrapEvent(obj, ret) {
    obj.on("end", function() {
        ret._plugins.map(function(o) {
            if (o instanceof stream.Readable) {
                o.push(null);
            }
        })
    })
}

function prerequire() {
    var ret = function() {
        var obj = through.obj(function(file, enc, cb) {
            var filePath = _.nth(file.history, -1);
            var content = transform(filePath, file.contents.toString(), ret._plugins);
            file.contents = new Buffer(content);
            this.push(file);
            return cb();
        })
        wrapEvent(obj, ret);
        return obj;
    }
    wrapPlugin(ret);
    return ret;
}

prerequire.transform = function() {
    var ret = function(file, opt) {
        var buf = [];
        var obj = through(function(chunk, enc, cb) {
            buf.push(chunk);
            return cb();
        }, function(cb) {
            var content = Buffer.concat(buf).toString();
            content = transform(file, content, ret._plugins);
            this.push(new Buffer(content));
            return cb();
        })
        wrapEvent(obj, ret);
        return obj;
    }
    wrapPlugin(ret);
    return ret;
}

module.exports = prerequire;
