var _ = require("lodash");

exports.keyObject = function(obj) {
    if (obj == undefined) {
        return { _key: Math.random() };
    }
    return recursive(obj);

    function recursive(obj) {
        if (_.isPlainObject(obj)) {
            for (var name in obj) {
                recursive(obj[name]);
            }
        } else if (_.isArray(obj)) {
            obj.map(function(item) {
                recursive(item);
                item._key = Math.random();
            })
        }
    }
}
