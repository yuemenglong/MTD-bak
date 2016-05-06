var express = require("express");
var jade = require("pug");
var fs = require("fs");

var app = express();

app.use('/static', express.static(__dirname + '/public'));

app.get("/", function(req, res) {
    var tpl = fs.readFileSync(__dirname + "/jade/index.jade");
    var html = jade.compile(tpl)();
    res.end(html);
})

app.listen(80);
