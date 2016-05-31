var express = require("express");
var jade = require("jade");
var fs = require("fs");
var param = require("./server");

var app = express();

app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/data', express.static(__dirname + '/data'));

console.log(param);

app.get("/", function(req, res) {
    // cleanCache("./server");
    var tpl = fs.readFileSync(__dirname + "/jade/index.jade");
    // var html = jade.compile(tpl)({ app: appHtml });
    var html = jade.compile(tpl)(param);
    res.end(html);
})

app.listen(80);
