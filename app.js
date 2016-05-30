var express = require("express");
var jade = require("pug");
var fs = require("fs");
var appHtml = require("./server");

var app = express();

app.use('/bundle', express.static(__dirname + '/bundle'));

app.get("/", function(req, res) {
    cleanCache("./server");
    var tpl = fs.readFileSync(__dirname + "/jade/index.jade");
    var html = jade.compile(tpl)({ app: appHtml });
    res.end(html);
})

app.listen(80);

function cleanCache(module) {
    var modulePath = require.resolve(module);
    var module = require.cache[modulePath];
    // remove reference in module.parent
    if (module && module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    require.cache[modulePath] = null;
}
