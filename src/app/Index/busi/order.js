var _ = require("lodash");
var Bar = require("./bar");
var Window = require("./window");
// var uuid = require('node-uuid');

module.exports = Order;

var originOrders = [];
var displayOrders = [];

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

Order.push = function(order) {
    originOrders = originOrders.concat(_.flatten([order]));
}

Order.get = function(id) {
    return _.filter(originOrders, o => o.id === id).nth(0);
}

Order.update = function(order) {
    _.assign(originOrders.filter(function(o) {
        return o.id === order.id;
    })[0], order);
}

Order.prototype.close = function() {
    this.closeTime = Window.endTime();
}

Order.updateDisplay = function() {
    displayOrders = _.filter(originOrders, function(order) {
        return (order.status !== "CLOSE" && order.createTime <= Window.endTime()) ||
            (order.status === "CLOSE" && order.closeTime >= Window.startTime());
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
        var style = { stroke: "#00f", strokeDasharray: "5,5" }
        var key = this.id;
        var x1 = Window.getX(startBar.getX());
        var x2 = Window.getX(endBar.getX());
        var y1 = Window.getY(this.openPrice);
        var y2 = Window.getY(this.closePrice);
        return [{ x1: x1, y1: y1, x2: x2, y2: y2, key: key, style: style }];
    } else {
        //2. 只显示挂单和止损线
        var style = { stroke: "#0f0", strokeDasharray: "5,5" }
        var y = Window.getY(this.price);
        var key = `open-${this.id}`;
        return [{ x1: 0, y1: y, x2: Window.width(), y2: y, style: style, key: key }];
    }
}
