var _ = require("lodash");
var update = require('react-addons-update');
var context = require("../context");

var STOP_LOSS = 0.005;
var RATIO = 0.05;

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
    if (_.startsWith(this.type, "BUY")) {
        profit = (this.closePrice - this.openPrice) * this.volumn * 100000;
    } else if (_.startsWith(this.type, "SELL")) {
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
        case "UPDATE_ORDERS_SUCC":
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
        case "DELETE_ACCOUNT_SUCC":
            return [];
        default:
            return state;
    }
}

function between(n, a, b) {
    return Math.min(a, b) <= n && n <= Math.max(a, b);
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
            var ctx = context(getState());
            var wnd = getState().data.window;
            var bar = getState().data.displayBars[0];

            var price = ctx.getMousePrice();
            var volumn = ctx.getVolumn();
            var stopLoss = price - ctx.getStopLoss();
            var createTime = ctx.getBar().datetime;
            var order = {
                type: "BUYLIMIT",
                volumn: volumn,
                price: price,
                stopLoss: stopLoss,
                createTime: createTime,
                status: "CREATE"
            };
            order = new Order(order);
            var json = JSON.stringify(order);
            $.post("/account/" + id + "/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
            });
        }
    }
    this.sellOrder = function() {
        return function(dispatch, getState) {
            var id = getState().account.current.id;
            if (!id) return;
            var ctx = context(getState());
            var wnd = getState().data.window;
            var bar = getState().data.displayBars[0];

            var price = ctx.getMousePrice();
            var volumn = ctx.getVolumn();
            var stopLoss = price + ctx.getStopLoss();
            var createTime = ctx.getBar().datetime;
            var order = {
                type: "SELLLIMIT",
                volumn: volumn,
                price: price,
                stopLoss: stopLoss,
                createTime: createTime,
                status: "CREATE"
            };
            order = new Order(order);
            var json = JSON.stringify(order);
            $.post("/account/" + id + "/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
            });
        }
    }
    this.smartOrder = function() {
        return function(dispatch, getState) {
            var id = getState().account.current.id;
            if (!id) return;
            var ctx = context(getState());
            var order = ctx.getSmartOrder();
            if (!order) {
                return;
            }
            order = new Order(order);
            $.ajax({
                url: "/account/" + id + "/order",
                type: "POST",
                data: JSON.stringify(order),
                success: function(res) {
                    dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
                }
            })
        }
    }
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
    this.resendOrder = function(id) {
        return function(dispatch, getState) {
            var ctx = context(getState());
            var state = getState();
            var order = state.orders.filter(function(o) {
                return o.id === id;
            })[0];
            dispatch(this.closeOrder(id));
            var aid = getState().account.current.id;
            var resend = {
                type: order.type,
                volumn: order.volumn,
                price: order.price,
                stopLoss: order.stopLoss,
                createTime: ctx.getBar().datetime,
                status: "CREATE"
            };
            resend = new Order(resend);
            var json = JSON.stringify(resend);
            $.post("/account/" + aid + "/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
            });
        }.bind(this);
    }
    this.deleteOrder = function(id) {
        return function(dispatch, getState) {
            $.ajax({
                url: "/account/0/order/" + id,
                type: "DELETE",
                success: function(account) {
                    dispatch({ type: "DELETE_ORDER_SUCC", id: id, account: account })
                }
            });
        }
    }
    this.checkOrders = function() {
        return function(dispatch, getState) {
            var ctx = context(getState());
            var closeOrders = ctx.getCloseOrders();
            closeOrders = closeOrders.map(function(o) {
                o.status = "CLOSE";
                o.closePrice = o.stopLoss;
                o.closeTime = ctx.getBar().datetime;
                o.profit = o.getProfit();
                return o;
            })
            var openOrders = ctx.getOpenOrders();
            openOrders = openOrders.map(function(o) {
                o.status = "OPEN";
                o.openPrice = o.price;
                o.openTime = ctx.getBar().datetime;
                return o;
            })
            var updateOrders = [].concat(openOrders).concat(closeOrders);
            // var orders = getState().orders;
            // var closeOrders = orders.filter(function(o) {
            //     return o.status === "OPEN" && between(o.stopLoss, bar.high, bar.low);
            // }).map(function(o) {

            // });
            if (!updateOrders.length) {
                return;
            }
            var json = JSON.stringify(updateOrders);
            $.ajax({
                url: "/account/0/order/",
                type: "PUT",
                data: json,
                success: function(res) {
                    dispatch({ type: "UPDATE_ORDERS_SUCC", orders: res.map(o => new Order(o)) });
                }
            });
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
