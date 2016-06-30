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
    state = state || { accounts: [], current: {} };
    state = _.cloneDeep(state);
    switch (action.type) {
        case "GET_ACCOUNTS_SUCC":
            state.accounts = action.accounts;
            return state;
        case "CHANGE_ACCOUNT":
            state.current[action.name] = action.value;
            return state;
        case "ADD_ACCOUNT_SUCC":
            state.current = {};
            state.accounts.push(action.account);
            return state;
        default:
            return state;
    }
}

function Action() {
    this.changeAccount = function(name, value) {
        return { type: "CHANGE_ACCOUNT", name: name, value: value };
    }
    this.getAccounts = function() {
        return function(dispatch, getState) {
            $.ajax({
                url: "/account",
                type: "GET",
                success: function(res) {
                    dispatch({ type: "GET_ACCOUNTS_SUCC", accounts: res });
                }
            })
        }
    }
    this.addAccount = function() {
        return function(dispatch, getState) {
            $.ajax({
                url: "/account",
                data: JSON.stringify(getState().account.current),
                type: "POST",
                success: function(res) {
                    dispatch({ type: "ADD_ACCOUNT_SUCC", account: res });
                }
            })
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
