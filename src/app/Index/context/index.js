var _ = require("lodash");

var STOP_LOSS = 0.005;
var RATIO = 0.05;

function between(n, a, b) {
    return Math.min(a, b) <= n && n <= Math.max(a, b);
}

function Context(state) {
    this.getMousePrice = function() {
        var wnd = state.data.window;
        var mouse = state.mouse;
        var high = _.maxBy(state.data.displayBars, "high").high;
        var low = _.minBy(state.data.displayBars, "low").low;
        var price = (wnd.height - mouse.y) / wnd.height * (high - low) + low;
        return _.round(price, 5);
        return price;
    }
    this.getVolumn = function() {
        var balance = state.account.current.balance;
        var volumn = (balance * RATIO) / (STOP_LOSS * 100000);
        return _.round(volumn, 2);
    }
    this.getStopLoss = function() {
        return STOP_LOSS;
    }
    this.getBar = function(n) {
        n = n || 0;
        return state.data.displayBars[n];
    }
    this.getOpenOrders = function() {
        var bar = this.getBar();
        var orders = state.orders;
        var openOrders = orders.filter(function(order) {
            return order.status == "CREATE" &&
                order.createTime < bar.datetime &&
                between(order.price, bar.high, bar.low);
        })
        return openOrders;
    }
    this.getCloseOrders = function() {
        var bar = this.getBar();
        var orders = state.orders;
        var closeOrders = orders.filter(function(order) {
            return order.status == "OPEN" &&
                order.openTime < bar.datetime &&
                between(order.stopLoss, bar.high, bar.low);
        })
        return closeOrders;
    }
}

module.exports = function(state) {
    return new Context(state);
}
