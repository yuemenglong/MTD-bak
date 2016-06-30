var util = require("util");
var http = require("http");
var logger = require("yy-logger");

function transmit(host, port) {
    return function(req, res) {
        function errorHandler(err) {
            logger.error(err);
            res.status(500).end(JSON.stringify(err));
        }
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
            backendRes.on("error", errorHandler);
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
        req.on("error", errorHandler);
        backendReq.on("error", errorHandler);

    }
}

module.exports = transmit;
