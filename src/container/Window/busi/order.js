var Bar = require("./bar");
var Window = require("./window");

module.exports = Order;

var originOrders = [];
var displayOrders = [];

function Order(type, price, volumn, stopLoss) {
    this.type = type;
    this.price = price;
    this.volumn = volumn;
    this.stopLoss = stopLoss;
    this.createTime = Bar.displayBars()[0].datetime;
}

Order.send = function(order) {
    originOrders.push(order);
}

Order.updateDisplay = function() {
    displayOrders = _.filter(originOrders, function(order) {
        return order.createTime <= Window.endTime();
    })
}

Order.displayOrders = function() {
    return displayOrders;
}

Order.originOrders = function() {
    return originOrders;
}

Order.prototype.getLinesCoord = function(now) {
    now = now || new Date(2999, 0, 1);
    if (this.closeTime && this.closeTime <= now) {
        //1. 已经成交且时间在成交时间之后
        var startBar = Bar.getBarByTime(this.openTime);
        var endBar = Bar.getBarByTime(this.closeTime);
        //todo
    } else {
        //2. 只显示挂单和止损线
        var style = { stroke: "#0f0" }
        var y = Window.getY(this.price);
        return [{ x1: 0, y1: y, x2: Window.width(), y2: y, style: style }];
    }
}
