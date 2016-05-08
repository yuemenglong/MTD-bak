(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var svg = require("./svg");
var Bar = require("./bar");

},{"./bar":2,"./svg":3}],2:[function(require,module,exports){
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

},{"lodash":undefined}],3:[function(require,module,exports){
var Svg = React.createClass({
    getInitialState: function () {
        return {
            lines: [],
            rects: []
        };
    },
    drawLine: function (x1, y1, x2, y2, clr) {
        clr = clr || '#888';
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
    drawRect: function (x1, y1, x2, y2, clr, fill) {
        clr = clr || '#888';
        fill = fill || false;
        var copy = this.state.rects.slice();
        var key = `${ x1 }${ y1 }${ x2 }${ y2 }`;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        var width = Math.max(x1, x2) - x;
        var height = Math.max(y1, y2) - y;
        var style = { stroke: clr };
        if (fill) {
            style.fill = clr;
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
var svg = ReactDOM.render(React.createElement(Svg, { width: '100', height: '100' }), document.body);
svg.drawLine(20, 20, 80, 30);
svg.drawRect(20, 20, 90, 90);
},{}]},{},[1]);
