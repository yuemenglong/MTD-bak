var express = require("express");
var jade = require("jade");
var fs = require("fs");
var bodyParser = require("body-parser");
var Promise = require("bluebird");

var orderService = require("./web/service/order");
var Index = require("./build/app/Index");

var serverRender = require("./web/server-render");

var app = express();
app.use(bodyParser.json())

app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/static', express.static(__dirname + '/static'));

app.get("/", function(req, res) {
    var tpl = fs.readFileSync(__dirname + "/web/jade/index.jade");
    Promise.try(() => orderService.listOrder())
        .then((orders) => {
            var html = jade.compile(tpl)(serverRender(Index, { orders: orders }));
            res.end(html);
        })
})

app.post("/order", function(req, res) {
    var order = req.body;
    Promise.try(() => orderService.sendOrder(order))
        .then((order) => res.json(order));
})

app.post("/order/:id", function(req, res) {
    var order = req.body;
    Promise.try(() => orderService.updateOrder(order))
        .then((order) => res.json(order));
})

app.get("/order", function(req, res) {
    Promise.try(() => orderService.listOrder())
        .then((orders) => res.json(orders));
})

app.listen(80);
