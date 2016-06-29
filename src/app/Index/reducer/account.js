var _ = require("lodash");
var update = require('react-addons-update');

function Order(order) {
    _.merge(this, order)
    var times = ["createTime", "openTime", "closeTime"];
    _.forEach(times, function(field) {
        this[field] = this[field] && new Date(this[field]);
    }.bind(this))
}

Order.prototype.toJSON = function() {
    var order = _.mapValues(this, o => _.isDate(o) ? moment(o).format("YYYY-MM-DD HH:mm:ss") : o);
    return order;
}

function reducer(state, action) {
    state = state || { list: [] };
    switch (action.type) {
        case "ADD_ACCOUNT_SUCC":
            return state;
        default:
            return state;
    }
}

function Action() {
    this.addAccount = function() {
        return function(dispatch, getState) {
            $.post("/", "{}", function() {
                console.log("addAccount");
            })
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
