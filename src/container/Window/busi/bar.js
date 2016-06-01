var _ = require("lodash");

var Window = require("./window");

Bar.WIDTH = 4;
Bar.GAP = 4;
Bar.strokeWidth = 0.8;

Bar.RIGHT_GAP = 0;

var originBars = [];
var displayBars = [];

function Bar(open, high, low, close, datetime) {
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.datetime = datetime;
    this.x1 = null;
    this.y1 = null;
    this.x2 = null;
    this.y2 = null;
}

Bar.max = function() {
    return _(originBars).nth(-1).x2;
}

Bar.originBars = function() {
    return originBars;
}

Bar.displayBars = function() {
    return displayBars;
}

Bar.push = function(bar) {
    if (Array.isArray(bar)) {
        bar.map(Bar.push);
        return;
    }
    if (bar instanceof Bar) {
        originBars.unshift(bar);
    } else {
        originBars.unshift(new Bar(bar.open, bar.high, bar.low, bar.close,
            new Date(bar.datetime)));
    }
}

Bar.pop = function(n) {
    n = n || 1;
    _.range(n).map(function() {
        originBars.pop(bar);
    })
}

Bar.updateOrigin = function() {
    if (!originBars.length) {
        return;
    }
    originBars[0].x1 = 0.5 * Bar.GAP;
    for (var i in originBars) {
        (i > 0) && (originBars[i].x1 = originBars[i - 1].x2 + Bar.GAP);
        originBars[i].x2 = originBars[i].x1 + Bar.WIDTH;
        originBars[i].y1 = Math.min(originBars[i].open, originBars[i].close);
        originBars[i].y2 = Math.max(originBars[i].open, originBars[i].close);
    }
    MA(originBars);
}


Bar.updateDisplay = function() {
    var start = _.sortedIndexBy(originBars, { x2: Window.x1() - Bar.RIGHT_GAP }, "x2");
    var end = _.sortedIndexBy(originBars, { x1: Window.x2() }, "x1");
    displayBars = originBars.slice(start, end);
}


Bar.prototype.getRectCoord = function() {
    var x1 = Window.getX(this.x1);
    var x2 = Window.getX(this.x2);
    var y1 = Window.getY(this.y1);
    var y2 = Window.getY(this.y2);
    var fillClr = this.close >= this.open ? "#FFF" : "#000";
    var style = { fill: fillClr, stroke: "#000", strokeWidth: Bar.strokeWidth };
    return { x1: x1, y1: y1, x2: x2, y2: y2, style: style };
}

Bar.prototype.getUpperLineCoord = function() {
    var x1 = Window.getX((this.x1 + this.x2) / 2);
    var x2 = Window.getX((this.x1 + this.x2) / 2);
    var y1 = Window.getY(this.y2);
    var y2 = Window.getY(this.high);
    // var x1 = Window.x2 - (this.x1 + this.x2) / 2;
    // var x2 = Window.x2 - (this.x1 + this.x2) / 2;
    // var y1 = (Window.y2 - this.y2) / (Window.y2 - Window.y1) * Window.height;
    // var y2 = (Window.y2 - this.high) / (Window.y2 - Window.y1) * Window.height;
    var style = { stroke: "#000", strokeWidth: Bar.strokeWidth };
    return { x1: x1, y1: y1, x2: x2, y2: y2, style: style };
}

Bar.prototype.getUnderLineCoord = function() {
    var x1 = Window.getX((this.x1 + this.x2) / 2);
    var x2 = Window.getX((this.x1 + this.x2) / 2);
    var y1 = Window.getY(this.low);
    var y2 = Window.getY(this.y1);
    // var x1 = Window.x2 - (this.x1 + this.x2) / 2;
    // var x2 = Window.x2 - (this.x1 + this.x2) / 2;
    // var y1 = (Window.y2 - this.low) / (Window.y2 - Window.y1) * Window.height;
    // var y2 = (Window.y2 - this.y1) / (Window.y2 - Window.y1) * Window.height;
    var style = { stroke: "#000", strokeWidth: Bar.strokeWidth };
    return { x1: x1, y1: y1, x2: x2, y2: y2, style: style };
}

Bar.prototype.getMACoord = function(name) {
    if (!this[name]) return;
    var x = Window.getX((this.x1 + this.x2) / 2);
    var y = Window.getY(this[name]);
    return { x: x, y: y };
}

Bar.getBarByTime = function(datetime, from, to) {
    //返回大于等于给定时间的第一个
    //如果给定时间大于所有的，则返回最大的时间，idx为0
    from = from === undefined ? 0 : from;
    to = to === undefined ? originBars.length - 1 : to;
    if (from == to) {
        return originBars[from];
    }
    var mid = _.floor((from + to) / 2);
    var small = originBars[mid + 1].datetime;
    var large = originBars[mid].datetime;
    if (small < datetime && datetime <= large) {
        return originBars[mid];
    }
    if (datetime <= small) {
        return arguments.callee(datetime, mid + 1, to);
    } else {
        return arguments.callee(datetime, from, mid);
    }
}

function MA(bars, n, name) {
    n = n || 30;
    name = name || "ma" + n;
    var total = 0;
    for (var i = bars.length - 1; i >= 0; i--) {
        var bar = bars[i];
        var count = bars.length - i - 1;
        total += bar.close;
        if (count >= n - 1) {
            bar[name] = total / n;
            total -= bars[i + n - 1].close;
        }
    }
}


module.exports = Bar;
