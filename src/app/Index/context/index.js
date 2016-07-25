var _ = require("lodash");
var alg = require("./alg");

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
    this.getSmartOrder = function(n) {
        n = n || 40;
        if (state.data.displayBars.length < n) {
            return;
        }
        //1. determine it's up/down
        var xn = _.range(0, n);
        var yn = _.reverse(state.data.displayBars.slice(0, 40)).map(function(bar) {
            return bar.close;
        })
        var ret = alg.polyfit(xn, yn);
        var k = ret.k * 10000;
        console.log(k);
        //2. get the extreme point
        var displayBars = state.data.displayBars;
        for (var i = 0; i < displayBars.length; i++) {
            if (k < 0) {
                var va = _.max([displayBars[i + 1].open, displayBars[i + 1].close]);
                var vb = _.max([displayBars[i].open, displayBars[i].close]);
                if (va < vb) {
                    break;
                }
            } else if (k > 0) {
                var va = _.min([displayBars[i + 1].open, displayBars[i + 1].close]);
                var vb = _.min([displayBars[i].open, displayBars[i].close]);
                if (va > vb) {
                    break;
                }
            }
        }
        var bar = displayBars[i];
        var type = k > 0 ? "SELLLIMIT" : "BUYLIMIT";
        var volumn = this.getVolumn();
        var price = vb;
        var stopLoss = price + STOP_LOSS * k / Math.abs(k);
        var createTime = bar.datetime;
        return {
            type: type,
            volumn: volumn,
            price: price,
            stopLoss: stopLoss,
            createTime: createTime,
            status: "CREATE"
        }
        // console.log(k, va, vb);
        // console.log(bar.datetime);
    }
}

module.exports = function(state) {
    return new Context(state);
}
