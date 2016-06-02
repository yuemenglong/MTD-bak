var express = require("express");
var jade = require("jade");
var fs = require("fs");
var bodyParser = require("body-parser");
var param = require("./server");
var uuid = require("node-uuid");

var app = express();
app.use(bodyParser.json())

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

app.post("/order", function(req, res) {
    var order = req.body;
    order.id = uuid.v1();
    console.log(order);
    res.json(order);
})

app.listen(80);
