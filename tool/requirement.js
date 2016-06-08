var through = require('through2');
var gutil = require('gulp-util');
var _ = require("lodash");

function requirement() {
    var obj = through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }
        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        var content = file.contents.toString();
        var requirePattern = /^.*require\((['"]).+\1\).*$/gm;
        var pathPattern = /.*require\((['"])(.+)\1\).*/;
        var match = content.match(requirePattern);
        obj._plugins.forEach(function(p) {
            var plugin = p.plugin;
            var opt = p.opt;
            match && match.forEach(function(line) {
                var path = line.match(pathPattern)[2];
                if (opt.test.test(path)) {
                    content = plugin(file, path, line, content);
                }
            })
        })
        file.contents = new Buffer(content);
        this.push(file);
        return cb();
    })
    obj.plugin = function(plugin) {
        obj._plugins = obj._plugins.concat(_.flatten([plugin]));
    }
    obj._plugins = [];
    return obj;
}

function ExcludePlugin(exclude) {
    var pattern = "^(" + exclude.join(")|(") + ")$";
    var test = new RegExp(pattern);
    this.plugin = function(file, path, line, content) {
        content = content.replace(line, "");
        return content;
    }
    this.opt = { test: test };
}

module.exports = { requirement: requirement, ExcludePlugin: ExcludePlugin };
