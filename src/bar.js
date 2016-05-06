var _ = require("lodash");

var originBars = [];

var BAR_WIDTH = 10;
var BAR_GAP = 5;

var Window = {
    x1: 0,
    x2: 100,
    y1: 0.5,
    y2: 2,
    width: 100,
    height: 100,
}

var displayBars = [];

function Bar(open, high, low, close, time) {
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
    this.time = time;
}

function parseDate(str) {
    var match = str.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    return new Date(match[1], match[2] - 1, match[3],
        match[4], match[5], match[6]);
}

Bar.push = function(bar) {
    if (bar instanceof Bar) {
        originBars.push(bar);
    } else {
        originBars.push(new Bar(bar.open, bar.high, bar.low, bar.close,
            parseDate(bar.time)));
    }
}

Bar.unshift = function(bar) {
    if (bar instanceof Bar) {
        originBars.unshift(bar);
    } else {
        originBars.push(new Bar(bar.open, bar.high, bar.low, bar.close,
            parseDate(bar.time)));
    }
}

Bar.update = function() {
    if (!originBars.length) {
        return;
    }
    originBars[0].x1 = 0.5 * BAR_GAP;
    for (var i in originBars) {
        (i > 0) && (originBars[i].x1 = originBars[i - 1].x2 + BAR_GAP);
        originBars[i].x2 = originBars[i].x1 + BAR_WIDTH;
        originBars[i].y1 = Math.min(originBars[i].open, originBars[i].close);
        originBars[i].y2 = Math.max(originBars[i].open, originBars[i].close);
    }
    var start = _.sortedIndexBy(originBars, { x2: Window.x1 }, "x2");
    var end = _.sortedIndexBy(originBars, { x1: Window.x2 }, "x1");
    displayBars = originBars.slice(start, end);
}

Bar.prototype.getRectCoord = function() {
    var x1 = Window.x2 - this.x1;
    var x2 = Window.x2 - this.x2;
    var y1 = (Window.y2 - this.y1) / (Window.y2 - Window.y1) * Window.height;
    var y2 = (Window.y2 - this.y2) / (Window.y2 - Window.y1) * Window.height;
    return { x1: x1, y1: y1, x2: x2, y2: y2 };
}

module.exports = Bar;

if (require.main == module) {
    for (var i = 0; i < 100; i++) {
        var bar = new Bar(1.0, 1.5, 0.8, 1.2, new Date());
        Bar.push(bar);
    }
    Bar.update();
    console.log(originBars);
    console.log(originBars[0].getRectCoord());
}
