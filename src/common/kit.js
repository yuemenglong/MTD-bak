var _ = require("lodash");

function keyObject(obj) {
    if (_.isPlainObject(obj)) {
        for (var name in obj) {
            keyObject(obj[name]);
        }
    } else if (_.isArray(obj)) {
        obj.map(function(item) {
            keyObject(item);
            item._key = Math.random();
        })
    }
}

exports.keyObject = keyObject;
