var _ = require("lodash");

var STOP_LOSS = 0.005;
var RATIO = 0.05;

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
}

module.exports = function(state) {
    return new Context(state);
}
