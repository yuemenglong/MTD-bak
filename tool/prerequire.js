var _ = require("lodash");
var through = require('through2');
var gutil = require('gulp-util');
var stream = require("stream");

var path = require('vinyl-paths');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var vfs = require('vinyl-fs');
var File = require("vinyl");

function prerequire() {
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
            var plugin = p.plugin.bind(p);
            var opt = p.opt;
            match && match.forEach(function(line) {
                var path = line.match(pathPattern)[2];
                if (opt.test.test(path)) {
                    content = plugin(file, path, line, content);
                    if (content == undefined) {
                        throw new Error("Maybe Forget To Return Content");
                    }
                }
            })
        })
        file.contents = new Buffer(content);
        this.push(file);
        return cb();
    })
    obj.on("end", function() {
        obj._plugins.map(function(plugin) {
            if (!(plugin instanceof stream.Readable)) return;
            plugin.emit("end");
            if (!plugin.opt.chain) return;
            // plugin.opt.chain.reduce(function(acc, item) {
            //     debugger;
            //     return acc.pipe(item);
            // }, plugin).pipe(process.stdout);
        })
    })
    obj.plugin = function(plugin, opt) {
        plugin.opt = _.merge(opt, plugin.opt);
        obj._plugins = obj._plugins.concat(_.flatten([plugin]));
    }
    obj._plugins = [];
    return obj;
}

module.exports = prerequire;
