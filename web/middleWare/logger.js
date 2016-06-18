var logger = require("yy-logger");
var util = require("util");

module.exports = function() {
    return function(req, res, next) {
        var buf = [];
        var info = util.format("[%s] %s", req.method, req.originalUrl);
        req.on("data", function(data) {
            buf.push(data);
        });
        req.on("end", function() {
            var content = "";
            if (buf.length) {
                buf.unshift("\n");
                content = Buffer.concat(buf).toString();
            }
            logger.log(JSON.stringify(req.headers));
            logger.info("%s%s", info, content);
            next();
        })
        req.on("error", function(err) {
            err.info = info;
            logger.error(err);
        })
    }
}
