var p = require("path");

function DebugPlugin(exclude) {
    this.test = /.*/;
    this.transform = function(file, path, line, content) {
        console.log(p.resolve(p.dirname(file), path));
        return content;
    }
}

module.exports = DebugPlugin;
