function ExcludePlugin(exclude) {
    var pattern = "^(" + exclude.join(")|(") + ")$";
    this.test = new RegExp(pattern);
    this.transform = function(file, path, line, content) {
        content = content.replace(line, "");
        return content;
    }
}

module.exports = ExcludePlugin;
