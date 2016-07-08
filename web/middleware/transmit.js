var util = require("util");
var http = require("http");
var logger = require("yy-logger");

function transmit(host, port) {
    function handler(req, res) {
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
                    return res.status(500).end(JSON.stringify({ name: "BACKEND_ERROR", message: backendRes.statusCode }));
                }
                logger.info("[%s] [%d] %s%s", req.method.toUpperCase(), backendRes.statusCode, req.originalUrl, body)
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
        res.on("error", errorHandler);
        backendReq.on("error", errorHandler);
    }

    var _get = [];
    var _post = [];
    var _put = [];
    var _delete = [];

    var _exclude = [];
    var excludeRegex = null;

    var methodMap = {};

    function mergeRegex(arr) {
        if (!arr.length) {
            return;
        }
        var buf = arr.join(")|(");
        buf = `(${buf})`;
        return new RegExp(buf);
    }

    function normalizeUrl(url) {
        var ret = "^" + url.replace(/\*/g, ".*").replace(/:[^/]*/g, "[^/]*") + "$";
        return ret;
    }

    function ret(req, res, next) {
        var method = req.method;
        debugger;
        if (excludeRegex && excludeRegex.test(req.path)) {
            return next();
        }
        if (!methodMap[method] || !methodMap[method].test(req.path)) {
            return next();
        }
        return handler(req, res);
    }
    ret.get = function(url) {
        url = normalizeUrl(url);
        _get.push(url);
        methodMap.GET = mergeRegex(_get);
    }
    ret.post = function(url) {
        url = normalizeUrl(url);
        _post.push(url);
        methodMap.POST = mergeRegex(_post);
    }
    ret.put = function(url) {
        url = normalizeUrl(url);
        _put.push(url);
        methodMap.PUT = mergeRegex(_put);
    }
    ret.delete = function(url) {
        url = normalizeUrl(url);
        _delete.push(url);
        methodMap.DELETE = mergeRegex(_delete);
    }
    ret.exclude = function(url) {
        url = normalizeUrl(url);
        _exclude.push(url);
        excludeRegex = mergeRegex(_exclude);
    }
    return ret;
}

module.exports = transmit;
