var util = require("util");
var express = require("express");
var jade = require("jade");
var fs = require("fs");
var bodyParser = require("body-parser");
var Promise = require("bluebird");
var http = require("http");
var logger = require("yy-logger");

var transmit = require("./web/middleware/transmit");
// var orderService = require("./web/service/order");

var serverRender = require("./web/server-render");

var app = express();
app.set('view engine', 'jade');
app.set("views", __dirname + '/web/jade');
// app.use(loggerMiddleware());
// app.use(morgan("combined"));
// app.use(bodyParser.json());
app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/static', express.static(__dirname + '/static'));

process.on("uncaughtException", function(err) {
    logger.error(err);
})

app.get("/", function(req, res) {
    // var tpl = fs.readFileSync(__dirname + "/web/jade/Index.jade");
    // var html = jade.compile(tpl)();
    // res.end(html);
    res.render("Index");
})

app.post("/", function(req, res) {
    req.on("data", function(data) {
        console.log(data.toString());
    })
    res.end();
})

app.get("/test", function(req, res) {
    var tpl = fs.readFileSync(__dirname + "/web/jade/Test.jade");
    var html = jade.compile(tpl)();
    res.end(html);
})

var trans = transmit("127.0.0.1", 8080);
app.get("/account", trans);
app.get("/account/:id", trans);
app.get("/account/:id/order", trans);
app.post("/account", trans);
app.delete("/account/:id", trans);

app.post("/account/:id/order", trans);
app.put("/account/:id/order/:orderId", trans);
app.delete("/account/:id/order/:orderId", trans);

app.listen(80, function(err) {
    if (err) {
        console.log("Start Fail !!!");
    } else {
        console.log("Start Succ ...");
    }
});
