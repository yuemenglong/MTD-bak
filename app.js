var util = require("util");
var express = require("express");
var jade = require("jade");
var fs = require("fs");
var bodyParser = require("body-parser");
var Promise = require("bluebird");
var http = require("http");
var logger = require("yy-logger");

var transmitMiddleware = require("./web/middleware/transmit");
var loggerMiddleware = require("./web/middleware/logger");

var transmit = transmitMiddleware("127.0.0.1", 8080);

var app = express();
app.set('view engine', 'jade');
app.set("views", __dirname + '/web/jade');
app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/static', express.static(__dirname + '/static'));
app.use(transmit);
app.use(loggerMiddleware());

app.get("/", function(req, res) {
    res.render("Index");
})

app.post("/", function(req, res) {
    req.on("data", function(data) {
        console.log(data.toString());
    })
    res.end();
})

app.get("/test", function(req, res) {
    console.log(req.path);
    var tpl = fs.readFileSync(__dirname + "/web/jade/Test.jade");
    var html = jade.compile(tpl)();
    res.end(html);
})

transmit.get("/account");
transmit.get("/account/:id");
transmit.get("/account/:id/order");
transmit.post("/account");
transmit.delete("/account/:id");

transmit.post("/account/:id/order");
transmit.put("/account/:id/order/:orderId");
transmit.put("/account/:id/order");
transmit.delete("/account/:id/order/:orderId");

transmit.get("/bar");

app.listen(80, function(err) {
    if (err) {
        console.log("Start Fail !!!");
    } else {
        console.log("Start Web Server Succ ...");
    }
});

process.on("uncaughtException", function(err) {
    logger.error(err);
})
