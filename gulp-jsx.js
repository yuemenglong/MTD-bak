var gutil = require('gulp-util');
var through = require('through2');

var babel = require("babel-core");
var react = require("babel-plugin-transform-react-jsx");

function jsxToJs(src) {
    return babel.transform(src, {
        plugins: ["transform-react-jsx"]
    }).code;
}


module.exports = function(options) {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        var content = jsxToJs(file.contents.toString());
        file.contents = new Buffer(content);

        // var content = pp.preprocess(file.contents.toString(), options || {});
        // file.contents = new Buffer(content);

        this.push(file);

        cb();
    });
};
