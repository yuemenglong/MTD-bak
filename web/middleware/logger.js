var logger = require("yy-logger");

module.exports = function() {
    return function(req, res, next) {
        var buf = [];
        req.on("data", function(data) {
            buf.push(data);
        })
        req.on("end", function() {
            var content = Buffer.concat(buf).toString();
            content = content.length ? "\n" + content : "";
            logger.log("[%s] %s%s", req.method.toUpperCase(), req.originalUrl, content);
        })
        req.on("error", function(err) {
            logger.error(err);
        })
        next();
    }
}
