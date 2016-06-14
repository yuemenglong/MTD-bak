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
    state = state || [];
    switch (action.type) {
        case "FETCH_ORDER_SUCC":
            var orders = action.orders.map(function(o) {
                return new Order(o);
            })
            return orders;
        case "SEND_ORDER_SUCC":
            var order = action.order;
            return update(state, { $push: [order] });
        case "CLOSE_ORDER_SUCC":
            var order = action.order;
            var idx = _.findIndex(state, function(o) {
                return o.id === order.id;
            })
            var cond = {};
            cond[idx] = { $set: order };
            return update(state, cond);
        case "DELETE_ORDER_SUCC":
            var id = action.id;
            var idx = _.findIndex(state, function(o) {
                return o.id === id;
            })
            return update(state, {
                $splice: [
                    [idx, 1]
                ]
            });
        default:
            return state;
    }
}

function Action() {
    this.fetchOrder = function() {
        return function(dispatch, getState) {
            fetch("/order").then(function(res) {
                return res.json();
            }).then(function(json) {
                dispatch({ type: "FETCH_ORDER_SUCC", orders: json })
            })
        }
    }
    this.sendOrder = function(order) {
        //{type, volumn}
        return function(dispatch, getState) {
            var wnd = getState().data.window;
            if (order.type === "BUY" || order.type === "SELL") {
                var bar = getState().data.displayBars[0];
                _.merge(order, {
                    price: bar.close,
                    openPrice: bar.close,
                    createTime: bar.datetime,
                    openTime: bar.datetime,
                    status: "OPEN"
                });
            }
            order = new Order(order);
            var json = JSON.stringify(order);
            $.post("/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
            });
        }
    };
    this.closeOrder = function(id) {
        return function(dispatch, getState) {
            var state = getState();
            var order = state.orders.filter(function(o) {
                return o.id === id;
            })[0];
            order.closeTime = state.data.displayBars[0].datetime;
            order.closePrice = state.data.displayBars[0].close;
            order.status = "CLOSE";
            var json = JSON.stringify(order);
            $.post("/order/" + id, json, function(res) {
                dispatch({ type: "CLOSE_ORDER_SUCC", order: new Order(res) });
            });
        }
    }
    this.updateOrder = function(order) {
        return function(dispatch, getState) {

        }
    }
    this.deleteOrder = function(id) {
        return function(dispatch, getState) {
            var opt = {
                method: "DELETE",
                success: function() {
                    dispatch({ type: "DELETE_ORDER_SUCC", id: id })
                }
            };
            $.ajax("/order/" + id, opt);
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
