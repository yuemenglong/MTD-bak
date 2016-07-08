// 1、挡恶意url和未登录url（只要session中没有cookieid即可）
// 2、

// 作用：判断有没有权限
// 1、获取cookieid，session中是否有,若有,判断auth表中是否有权限
// 2、获取url
var http = require("http");
var logger = require("yy-logger");

function auth(host, port, serviceName) {
    function handler(req, res, next) {
        function errorHandler(err) {
            logger.error(err);
            res.status(500).end(JSON.stringify(err));
        };
        var path = `/auth/${serviceName}?path=${encodeURIComponent(req.path)}`;
        var options = {
            hostname: host,
            port: port,
            path: path,
            method: 'GET',
            headers: req.headers,
        };
        if (!req.cookies.CCHID) {
            res.setHeader("Set-Cookie", ["CCHID=adsfasdf"]);
        }
        var authReq = http.request(options, function(authRes) {
            authRes.on("error", errorHandler);
            logger.info("[AUTH] [%d] %s", authRes.statusCode, req.path);
            if (authRes.statusCode == 403) {
                return res.redirect("/login");
            } else if (authRes.statusCode == 200) {
                return next();
            } else {
                return res.status(authRes.statusCode).end();
            }
        })
        authReq.end();
        req.on("error", errorHandler);
        res.on("error", errorHandler);
        authReq.on("error", errorHandler);
    }

    var exclude = [];
    var excludeRegex = null;

    function ret(req, res, next) {
        if (excludeRegex && excludeRegex.test(req.path)) {
            return next();
        }
        return handler(req, res, next);
    }

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

    ret.exclude = function(url) {
        url = normalizeUrl(url);
        exclude.push(url);
        excludeRegex = mergeRegex(exclude);
    }
    return ret;
}
module.exports = auth;
