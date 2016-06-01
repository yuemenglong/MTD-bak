var Bar = require("../bar");
var Window = Bar.getWindow();

function Order(type, price, volumn, stopLoss) {
    this.type = type;
    this.price = price;
    this.volumn = volumn;
    this.stopLoss = stopLoss;
    this.createTime = Bar.displayBar()[0].datetime;
}

Order.prototype.getLines = function(now) {
    now = now || new Date(2999, 0, 1);
    //1. 已经成交且时间在成交时间之后
    if (this.closeTime && this.closeTime <= now) {
        var startBar = getBarByTime(this.openTime);
        var endBar = getBarByTime(this.closeTime);
    }
}
