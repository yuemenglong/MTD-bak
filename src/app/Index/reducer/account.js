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
    state = state || { list: [], current: { name: "", balance: 0 } };
    state = _.cloneDeep(state);
    switch (action.type) {
        case "CHANGE_ACCOUNT":
            state.current[action.name] = action.value;
            return state;
        case "ADD_ACCOUNT_SUCC":
            return state;
        default:
            return state;
    }
}

function Action() {
    this.changeAccount = function(name, value) {
        return { type: "CHANGE_ACCOUNT", name: name, value: value };
    }
    this.addAccount = function() {
        return function(dispatch, getState) {
            // $.post("/", "{}", function() {
            //     console.log("addAccount");
            // })
            $.ajax({
                url: "/account",
                data: JSON.stringify(getState().account.current),
                type: "POST",
                success: function(res) {
                    console.log(res);
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
