var _ = require("lodash");
var update = require('react-addons-update');
var ordersAction = require("./orders").action;

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
        case "FETCH_ACCOUNTS_SUCC":
            state.accounts = action.accounts;
            return state;
        case "UPDATE_ACCOUNT":
            state.current[action.name] = action.value;
            return state;
        case "ADD_ACCOUNT_SUCC":
            state.current = _.clone(action.account);
            state.accounts.push(action.account);
            return state;
        case "SELECT_ACCOUNT":
            var account = state.accounts.filter(function(o) {
                return o.id == action.id;
            })[0];
            state.current = account ? _.clone(account) : {};
            return state;
        case "DELETE_ACCOUNT_SUCC":
            state.accounts = _.dropWhile(state.accounts, function(o) {
                return o.id == action.id;
            });
            state.current = {};
            return state;
        case "CLOSE_ORDER_SUCC":
            state.current = action.order.account;
            return state;
        case "UPDATE_ORDERS_SUCC":
            state.current = action.orders[0].account;
            return state;
        default:
            return state;
    }
}

function Action() {
    this.updateAccount = function(name, value) {
        return { type: "UPDATE_ACCOUNT", name: name, value: value };
    }
    this.fetchAccounts = function() {
        return function(dispatch, getState) {
            $.ajax({
                url: "/account",
                type: "GET",
                success: function(res) {
                    dispatch({ type: "FETCH_ACCOUNTS_SUCC", accounts: res });
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
    this.selectAccount = function(id) {
        return function(dispatch, getState) {
            dispatch({ type: "SELECT_ACCOUNT", id: id });
            dispatch(ordersAction.fetchOrders());
        }
    }
    this.deleteAccount = function(id) {
        return function(dispatch, getState) {
            if (!id) return;
            $.ajax({
                url: "/account/" + id,
                type: "DELETE",
                success: function(res) {
                    dispatch({ type: "DELETE_ACCOUNT_SUCC", id: id });
                }
            })
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
