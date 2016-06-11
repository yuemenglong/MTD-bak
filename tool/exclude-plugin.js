function ExcludePlugin(exclude) {
    var pattern = "^((" + exclude.join(")|(") + "))$";
    this.test = new RegExp(pattern);
    this.transform = function(file, paths, lines, content) {
        lines.splice(0);
        return content;
    }
}

module.exports = ExcludePlugin;
