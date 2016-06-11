var p = require("path");

function DebugPlugin(exclude) {
    this.test = ".*";
    this.transform = function(file, paths, lines, content) {
        console.log("[DEBUG]: " + file);
        return content;
    }
}

module.exports = DebugPlugin;
