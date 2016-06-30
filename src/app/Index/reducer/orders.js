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
            return updateOrder(action.order, state);
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

function between(n, a, b) {
    return Math.min(a, b) <= n && n <= Math.max(a, b);
}

function updateOrder(orders, state) {
    orders = _.flatten([orders]);
    var ids = orders.map(function(o) {
        return o.id;
    });
    ids.forEach(function(id, i) {
        var idx = _.findIndex(state, function(o) {
            return o.id === id;
        })
        var cond = {};
        cond[idx] = { $set: orders[i] };
        state = update(state, cond);
    });
    return state;
}

function Action() {
    this.fetchOrders = function() {
        return function(dispatch, getState) {
            var id = getState().account.current.id;
            if (!id) {
                dispatch({ type: "FETCH_ORDER_SUCC", orders: [] });
                return;
            }
            $.ajax({
                url: "/account/" + id + "/order",
                type: "GET",
                success: function(res) {
                    dispatch({ type: "FETCH_ORDER_SUCC", orders: res });
                }
            });
        }
    }
    this.sendOrder = function(order) {
        //{type, volumn}
        return function(dispatch, getState) {
            var id = getState().account.current.id;
            if (!id) return;
            var wnd = getState().data.window;
            if (order.type === "BUY" || order.type === "SELL") {
                var bar = getState().data.displayBars[0];
                if (order.stopLoss && order.stopLoss < 0) {
                    order.stopLoss += bar.close;
                }
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
            $.post("/account/" + id + "/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
            });
        }
    };
    this.closeOrder = function(id, price) {
        return function(dispatch, getState) {
            var state = getState();
            var order = state.orders.filter(function(o) {
                return o.id === id;
            })[0];
            order.closeTime = state.data.displayBars[0].datetime;
            order.closePrice = price || state.data.displayBars[0].close;
            order.status = "CLOSE";
            var json = JSON.stringify(order);
            $.post("/order/" + id, json, function(res) {
                dispatch({ type: "CLOSE_ORDER_SUCC", order: new Order(res) });
            });
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
    this.checkOrders = function(bar) {
        return function(dispatch, getState) {
            var orders = getState().orders;
            var closeOrders = orders.filter(function(o) {
                return o.status === "OPEN" && between(o.stopLoss, bar.high, bar.low);
            }).map(function(o) {
                o.status = "CLOSE";
                o.closePrice = o.stopLoss;
                o.closeTime = bar.datetime;
                return o;
            })
            if (!closeOrders.length) {
                return;
            }
            var ids = closeOrders.map(function(o) {
                return o.id;
            }).join(",");
            var json = JSON.stringify(orders);
            $.post("/order/" + ids, json, function(res) {
                dispatch({
                    type: "CLOSE_ORDER_SUCC",
                    order: res.map(function(o) {
                        return new Order(o);
                    })
                });
            });
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
