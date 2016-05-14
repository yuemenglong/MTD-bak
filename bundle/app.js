(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Svg = require('./svg');
var Bar = require('./bar');
var data = require('./data/2001.json');

var WINDOW_WIDTH = 100;
var WINDOW_HEIGHT = 100;
var svg = ReactDOM.render(React.createElement(Svg, { width: WINDOW_WIDTH, height: WINDOW_HEIGHT }), document.body);
init();
refresh();
$(document).keydown(function (e) {
    if (e.keyCode === 39) {
        next();
    } else if (e.keyCode === 37) {
        prev();
    }
});
function init() {
    svg.drawRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    Bar.push(data);
    Bar.updateBars();
    Bar.setWindowSize(100, 100);
    Bar.setWindowPos(-100);
    Bar.normalizeWindow();
    Bar.updateWindow();
}
function refresh() {
    svg.clear();
    svg.drawRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    Bar.displayBars().map(function (item) {
        var rect = item.getRectCoord();
        svg.drawRect(rect.x1, rect.y1, rect.x2, rect.y2, '#000', item.color());
        var line = item.getUpperLineCoord();
        svg.drawLine(line.x1, line.y1, line.x2, line.y2);
        var line = item.getUnderLineCoord();
        svg.drawLine(line.x1, line.y1, line.x2, line.y2);
    });
}
function next() {
    var x = Bar.window().x1 - Bar.WIDTH - Bar.GAP;
    if (x <= 0) {
        x = 0;
    }
    Bar.setWindowPos(x);
    Bar.normalizeWindow();
    Bar.updateWindow();
    refresh();
}
function prev() {
    var x = Bar.window().x1 + Bar.WIDTH + Bar.GAP;
    if (x >= Bar.max()) {
        x = Bar.max();
    }
    Bar.setWindowPos(x);
    Bar.normalizeWindow();
    Bar.updateWindow();
    refresh();
}
},{"./bar":2,"./data/2001.json":3,"./svg":4}],2:[function(require,module,exports){


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

}

},{}],3:[function(require,module,exports){
module.exports=[
  {
    "datetime": "2001-02-23 12:00:00",
    "open": 0.9432,
    "high": 0.9446,
    "low": 0.9385,
    "close": 0.9393
  },
  {
    "datetime": "2001-02-23 16:00:00",
    "open": 0.9394,
    "high": 0.9408,
    "low": 0.9369,
    "close": 0.9389
  },
  {
    "datetime": "2001-02-23 20:00:00",
    "open": 0.939,
    "high": 0.941,
    "low": 0.9343,
    "close": 0.9347
  },
  {
    "datetime": "2001-02-24 00:00:00",
    "open": 0.9346,
    "high": 0.9359,
    "low": 0.9342,
    "close": 0.9353
  },
  {
    "datetime": "2001-02-24 04:00:00",
    "open": 0.9353,
    "high": 0.9367,
    "low": 0.9346,
    "close": 0.9359
  },
  {
    "datetime": "2001-02-24 08:00:00",
    "open": 0.9361,
    "high": 0.9373,
    "low": 0.9307,
    "close": 0.9326
  },
  {
    "datetime": "2001-02-24 12:00:00",
    "open": 0.9324,
    "high": 0.9328,
    "low": 0.9225,
    "close": 0.9248
  },
  {
    "datetime": "2001-02-24 16:00:00",
    "open": 0.925,
    "high": 0.9274,
    "low": 0.9215,
    "close": 0.9262
  },
  {
    "datetime": "2001-02-24 20:00:00",
    "open": 0.9261,
    "high": 0.9264,
    "low": 0.9209,
    "close": 0.9241
  },
  {
    "datetime": "2001-02-25 00:00:00",
    "open": 0.9239,
    "high": 0.9241,
    "low": 0.9206,
    "close": 0.9217
  },
  {
    "datetime": "2001-02-25 04:00:00",
    "open": 0.9215,
    "high": 0.9229,
    "low": 0.9202,
    "close": 0.9229
  },
  {
    "datetime": "2001-02-25 08:00:00",
    "open": 0.9227,
    "high": 0.924,
    "low": 0.9154,
    "close": 0.9166
  },
  {
    "datetime": "2001-02-25 12:00:00",
    "open": 0.9165,
    "high": 0.9208,
    "low": 0.9115,
    "close": 0.9189
  },
  {
    "datetime": "2001-02-25 16:00:00",
    "open": 0.9187,
    "high": 0.924,
    "low": 0.9173,
    "close": 0.9224
  },
  {
    "datetime": "2001-02-25 20:00:00",
    "open": 0.9223,
    "high": 0.9252,
    "low": 0.9199,
    "close": 0.9247
  },
  {
    "datetime": "2001-02-26 00:00:00",
    "open": 0.9244,
    "high": 0.9257,
    "low": 0.9228,
    "close": 0.9233
  },
  {
    "datetime": "2001-02-26 04:00:00",
    "open": 0.9237,
    "high": 0.9246,
    "low": 0.9218,
    "close": 0.9229
  },
  {
    "datetime": "2001-02-26 08:00:00",
    "open": 0.9227,
    "high": 0.9317,
    "low": 0.922,
    "close": 0.9281
  },
  {
    "datetime": "2001-02-26 12:00:00",
    "open": 0.9281,
    "high": 0.9309,
    "low": 0.9206,
    "close": 0.9219
  },
  {
    "datetime": "2001-02-26 16:00:00",
    "open": 0.9218,
    "high": 0.9232,
    "low": 0.9198,
    "close": 0.9223
  },
  {
    "datetime": "2001-02-26 20:00:00",
    "open": 0.9222,
    "high": 0.9255,
    "low": 0.9221,
    "close": 0.9246
  },
  {
    "datetime": "2001-03-01 00:00:00",
    "open": 0.9239,
    "high": 0.9247,
    "low": 0.9217,
    "close": 0.9247
  },
  {
    "datetime": "2001-03-01 04:00:00",
    "open": 0.9245,
    "high": 0.926,
    "low": 0.9228,
    "close": 0.9236
  },
  {
    "datetime": "2001-03-01 08:00:00",
    "open": 0.9234,
    "high": 0.9262,
    "low": 0.92,
    "close": 0.9216
  },
  {
    "datetime": "2001-03-01 12:00:00",
    "open": 0.9215,
    "high": 0.9218,
    "low": 0.9175,
    "close": 0.9207
  },
  {
    "datetime": "2001-03-01 16:00:00",
    "open": 0.9206,
    "high": 0.9212,
    "low": 0.9177,
    "close": 0.9187
  },
  {
    "datetime": "2001-03-01 20:00:00",
    "open": 0.9187,
    "high": 0.9194,
    "low": 0.9159,
    "close": 0.9172
  },
  {
    "datetime": "2001-03-02 00:00:00",
    "open": 0.9169,
    "high": 0.9186,
    "low": 0.9153,
    "close": 0.9165
  },
  {
    "datetime": "2001-03-02 04:00:00",
    "open": 0.9164,
    "high": 0.918,
    "low": 0.9161,
    "close": 0.9173
  },
  {
    "datetime": "2001-03-02 08:00:00",
    "open": 0.9172,
    "high": 0.9187,
    "low": 0.9143,
    "close": 0.917
  }
]
},{}],4:[function(require,module,exports){
var Svg = React.createClass({
    displayName: 'Svg',

    getInitialState: function () {
        return {
            lines: [],
            rects: []
        };
    },
    drawLine: function (x1, y1, x2, y2, clr) {
        clr = clr || '#000';
        var copy = this.state.lines.slice();
        var key = `${ x1 }${ y1 }${ x2 }${ y2 }`;
        var style = { stroke: clr };
        copy.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            key: key,
            style: style
        });
        this.setState({ lines: copy });
    },
    drawRect: function (x1, y1, x2, y2, clr, fillClr) {
        clr = clr || '#000';
        fillClr = fillClr || null;
        var copy = this.state.rects.slice();
        var key = `${ x1 }${ y1 }${ x2 }${ y2 }`;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        var width = Math.max(x1, x2) - x;
        var height = Math.max(y1, y2) - y;
        var style = { stroke: clr };
        if (fillClr) {
            style.fill = fillClr;
        } else {
            style.fillOpacity = 0;
        }
        copy.push({
            x: x,
            y: y,
            width: width,
            height: height,
            key: key,
            style: style
        });
        this.setState({ rects: copy });
    },
    clear: function () {
        this.setState({
            lines: [],
            rects: []
        });
    },
    render: function () {
        return React.createElement(
            'svg',
            this.props,
            this.state.lines.map(function (item) {
                return React.createElement('line', item);
            }),
            this.state.rects.map(function (item) {
                return React.createElement('rect', item);
            })
        );
    }
});
module.exports = Svg;
},{}]},{},[1]);
