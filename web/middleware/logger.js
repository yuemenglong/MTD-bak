var logger = require("yy-logger");
var util = require("util");

module.exports = function() {
    return function(req, res, next) {
        var buf = [];
        req.on("data", function(data) {
            buf.push(data);
        })
        req.on("end", function() {
            var content = Buffer.concat(buf).toString();
            content = content.length ? "\n" + content : "";
            logger.log("[%s] [%d] %s%s", req.method.toUpperCase(), res.statusCode, req.originalUrl, content);
        })
        req.on("error", function(err) {
            logger.error(err);
        })
        next();
    }
}
