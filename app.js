var util = require("util");
var express = require("express");
var jade = require("jade");
var fs = require("fs");
var bodyParser = require("body-parser");
var Promise = require("bluebird");
var http = require("http");
var morgan = require("morgan")
var logger = require("yy-logger");

var loggerMiddleware = require("./web/middleware/logger");
var orderService = require("./web/service/order");
var Index = require("./dist/app/Index");

var serverRender = require("./web/server-render");
var loggerMiddleware = require("./web/middleware/logger");

var app = express();
app.use(loggerMiddleware());
// app.use(morgan("combined"));
// app.use(bodyParser.json());
app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/static', express.static(__dirname + '/static'));

process.on("uncaughtException", function(err) {
    logger.error(err);
})

app.get("/", function(req, res) {
    var tpl = fs.readFileSync(__dirname + "/web/jade/Index.jade");
    var html = jade.compile(tpl)();
    res.end(html);
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

app.post("/order", function(req, res) {
    var order = req.body;
    Promise.try(() => orderService.sendOrder(order))
        .then((order) => res.json(order));
})

app.post("/order/:id", function(req, res) {
    var order = req.body;
    Promise.try(() => orderService.updateOrder(order))
        .then(() => res.json(order));
})

app.get("/order", function(req, res) {
    Promise.try(() => orderService.listOrder())
        .then((orders) => res.json(orders));
})

app.delete("/order/:id", function(req, res) {
    var id = req.params.id;
    Promise.try(function() {
        return orderService.delete(id);
    }).then(function() {
        res.end();
    })
})

var trans = transparent("127.0.0.1", 8080);
app.get("/account", trans);
app.post("/account", trans);
app.delete("/account/:id", trans);

app.listen(80, function(err) {
    if (err) {
        console.log("Start Fail !!!");
    } else {
        console.log("Start Succ ...");
    }
});

function transparent(host, port) {
    return function(req, res) {
        var reqBuf = [];
        var resBuf = [];
        var options = {
            hostname: host,
            port: port,
            path: req.originalUrl,
            method: req.method,
            headers: req.headers,
        };
        var backendReq = http.request(options, function(backendRes) {
            backendRes.on("data", function(data) {
                resBuf.push(data);
            })
            backendRes.on("end", function() {
                var ret = resBuf.join("");
                var body = ret.length ? "\n" + ret : "";
                var info = util.format("[%s] [%d] %s%s", req.method.toUpperCase(), backendRes.statusCode, req.originalUrl, body);
                if (backendRes.statusCode !== 200) {
                    logger.error(info);
                } else {
                    logger.info("[%s] [%d] %s%s", req.method.toUpperCase(), backendRes.statusCode, req.originalUrl, body)
                }
                if (req.xhr) {
                    res.writeHead(backendRes.statusCode, backendRes.headers);
                    return res.end(ret);
                }
                var mv = JSON.parse(ret);
                res.render(mv.view, { init: mv.model });
            });
        });
        req.on("data", function(data) {
            reqBuf.push(data);
            backendReq.write(data);
        })
        req.on("end", function() {
            var body = reqBuf.length ? "\n" + reqBuf.join("") : "";
            logger.info("[%s] %s%s", req.method.toUpperCase(), req.originalUrl, body)
            backendReq.end();
        })
    }
}
