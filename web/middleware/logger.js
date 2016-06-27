var logger = require("yy-logger");

module.exports = function() {
    return function(req, res, next) {
        var buf = [];
        req.on("data", function(data) {
            buf.push(data);
        })
        req.on("end", function() {
            var content = Buffer.concat(buf).toString();
            logger.log("[%s] %s", req.method.toUpperCase(), req.originalUrl);
            if (content.length) {
                logger.log(content);
            }
        })
        req.on("error", function(err) {
            logger.error(err);
        })
        next();
    }
}
