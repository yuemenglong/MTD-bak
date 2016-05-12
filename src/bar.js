var _ = require("lodash");

var originBars = [];

var Window = {
    x1: 0,
    x2: 100,
    y1: 0,
    y2: 0,
    width: 100,
    height: 100,
}

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

Bar.WIDTH = 10;
Bar.GAP = 5;

Bar.max = function() {
    return _(originBars).nth(-1).x2;
}

Bar.window = function() {
    return _.clone(Window);
}

Bar.setWindowSize = function(width, height) {
    Window.width = width;
    Window.height = height;
}

Bar.setWindowPos = function(x) {
    if (x >= 0) {
        Window.x1 = x;
        Window.x2 = Window.x1 + Window.width;
    } else {
        var max = _(originBars).nth(-1).x2;
        Window.x1 = max + x;
        Window.x2 = Window.x1 + Window.width;
    }
}

Bar.normalizeWindow = function() {
    var n = _(originBars).sortedIndexBy({ x2: Window.x1 }, "x2");
    var first = _(originBars).nth(n);
    Window.x1 = first.x1 - Bar.GAP / 2;
    Window.x2 = Window.x1 + Window.width;
}

Bar.updateWindow = function() {
    var start = _.sortedIndexBy(originBars, { x2: Window.x1 }, "x2");
    var end = _.sortedIndexBy(originBars, { x1: Window.x2 }, "x1");
    displayBars = originBars.slice(start, end);

    var high = _(displayBars).maxBy(item => item.high);
    var low = _(displayBars).minBy(item => item.low);

    Window.y1 = low.low;
    Window.y2 = high.high;
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
        originBars.push(bar);
    } else {
        originBars.push(new Bar(bar.open, bar.high, bar.low, bar.close,
            new Date(bar.datetime)));
    }
}

Bar.unshift = function(bar) {
    if (Array.isArray(bar)) {
        bar.map(Bar.unshift);
        return;
    }
    if (bar instanceof Bar) {
        originBars.unshift(bar);
    } else {
        originBars.push(new Bar(bar.open, bar.high, bar.low, bar.close,
            new Date(bar.datetime)));
    }
}

Bar.updateBars = function() {
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

}

Bar.prototype.getRectCoord = function() {
    var x1 = Window.x2 - this.x1;
    var x2 = Window.x2 - this.x2;
    var y1 = (Window.y2 - this.y1) / (Window.y2 - Window.y1) * Window.height;
    var y2 = (Window.y2 - this.y2) / (Window.y2 - Window.y1) * Window.height;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}


Bar.prototype.getUpperLineCoord = function() {
    var x1 = Window.x2 - (this.x1 + this.x2) / 2;
    var x2 = Window.x2 - (this.x1 + this.x2) / 2;
    var y1 = (Window.y2 - this.y2) / (Window.y2 - Window.y1) * Window.height;
    var y2 = (Window.y2 - this.high) / (Window.y2 - Window.y1) * Window.height;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}

Bar.prototype.getUnderLineCoord = function() {
    var x1 = Window.x2 - (this.x1 + this.x2) / 2;
    var x2 = Window.x2 - (this.x1 + this.x2) / 2;
    var y1 = (Window.y2 - this.low) / (Window.y2 - Window.y1) * Window.height;
    var y2 = (Window.y2 - this.y1) / (Window.y2 - Window.y1) * Window.height;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}

Bar.prototype.color = function() {
    if (this.open >= this.close) {
        return "#FFF";
    } else {
        return "#000";
    }
}

module.exports = Bar;

if (require.main == module) {
    var data = require("./2001.json");
    var WINDOW_WIDTH = 100;
    var WINDOW_HEIGHT = 100;
    init();

    function init() {
        Bar.push(data);
        Bar.updateBars();
        Bar.setWindowSize(100, 100);
        Bar.setWindowPos(-100);
        Bar.normalizeWindow();
        Bar.updateWindow();
        console.log(Bar.window());
    }

}
