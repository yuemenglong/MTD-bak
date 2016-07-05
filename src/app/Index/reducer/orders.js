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

Order.prototype.getProfit = function() {
    var profit = 0;
    if (this.type === "BUY") {
        profit = (this.closePrice - this.openPrice) * this.volumn * 100000;
    } else if (this.type === "SELL") {
        profit = (this.openPrice - this.closePrice) * this.volumn * 100000;
    }
    profit = _.round(profit, 2);
    return profit;
}

function reducer(state, action) {
    state = state || [];
    state = _.cloneDeep(state);
    switch (action.type) {
        case "FETCH_ORDER_SUCC":
            var orders = action.orders.map(function(o) {
                return new Order(o);
            })
            return orders;
        case "SEND_ORDER_SUCC":
            var order = action.order;
            state.push(order);
            return state;
        case "CLOSE_ORDER_SUCC":
            state = state.map(function(o) {
                if (o.id == action.order.id) {
                    return action.order;
                }
                return o;
            })
            return state;
        case "CLOSE_ORDERS_SUCC":
            var ordersMap = _.fromPairs(action.orders.map(function(o) {
                return [o.id, o];
            }));
            state = state.map(function(o) {
                if (ordersMap[o.id]) {
                    return ordersMap[o.id];
                }
                return o;
            })
            return state;
        case "DELETE_ORDER_SUCC":
            state = state.filter(function(o) {
                return o.id != action.id;
            })
            return state;
        default:
            return state;
    }
}

function between(n, a, b) {
    return Math.min(a, b) <= n && n <= Math.max(a, b);
}

var STOP_LOSS = 0.005;
var RATIO = 0.05;

function getVolumn(balance) {
    return (balance * RATIO) / (STOP_LOSS * 100000);
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
    this.buyOrder = function() {
        return function(dispatch, getState) {
            var id = getState().account.current.id;
            if (!id) return;
            var wnd = getState().data.window;
            var bar = getState().data.displayBars[0];
            if (order.stopLoss && order.stopLoss < 0) {
                order.stopLoss += bar.close;
            }
            var volumn = getVolumn(getState().account.current.balance);
            var stopLoss = bar.close - STOP_LOSS;
            var order = {
                type: "BUY",
                volumn: 0.2,
                price: bar.close,
                stopLoss: stopLoss,
                openPrice: bar.close,
                createTime: bar.datetime,
                openTime: bar.datetime,
                status: "OPEN"
            };
            order = new Order(order);
            var json = JSON.stringify(order);
            $.post("/account/" + id + "/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
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
            order.profit = order.getProfit();
            var json = JSON.stringify(order);
            // $.post("/order/" + id, json, function(res) {});
            $.ajax({
                url: "/account/0/order/" + id,
                type: "PUT",
                data: json,
                success: function(res) {
                    dispatch({ type: "CLOSE_ORDER_SUCC", order: new Order(res) });
                }
            })
        }
    }
    this.deleteOrder = function(id) {
        return function(dispatch, getState) {
            $.ajax({
                url: "/account/0/order/" + id,
                type: "DELETE",
                success: function() {
                    dispatch({ type: "DELETE_ORDER_SUCC", id: id })
                }
            });
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
                o.profit = o.getProfit();
                return o;
            })
            if (!closeOrders.length) {
                return;
            }
            var ids = closeOrders.map(function(o) {
                return o.id;
            }).join(",");
            var json = JSON.stringify(closeOrders);
            $.ajax({
                url: "/account/0/order/",
                type: "PUT",
                data: json,
                success: function(res) {
                    dispatch({ type: "CLOSE_ORDERS_SUCC", orders: res.map(o => new Order(o)) });
                }
            });
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
