function ExcludePlugin(exclude) {
    var pattern = "^(" + exclude.join(")|(") + ")$";
    var test = new RegExp(pattern);
    this.plugin = function(file, path, line, content) {
        content = content.replace(line, "");
        return content;
    }
    this.opt = { test: test };
}

module.exports = ExcludePlugin;
