var _ = require("lodash");
var React = require("react");
var ReactDOM = require("react-dom");
var moment = require("moment");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;
var Provider = ReactRedux.Provider;

var Svg = require("../../component/Svg");

// input:
// bars[{open,high,low,close,x1,y1,x2,y2,ma30}] 
// window{width, height, pos}
// output:
// {style, rects[], lines[], paths[], texts[]}
function mapStateToProps(state) {
    var bars = state.data.bars;
    var displayBars = state.data.displayBars;
    var wnd = state.data.window;
    var orders = state.orders;
    var style = { width: wnd.width, height: wnd.height, backgroundColor: "#888" };
    var props = { style: style, rects: [], lines: [], paths: [], texts: [] };

    addGrid(props);
    addBars(displayBars, wnd, props);
    addOrders(orders, displayBars, wnd, props);
    return props;
}

var BAR_STROKE_WIDTH = 0.8;
var GRID = 32;

function between(n, a, b) {
    return Math.min(a, b) <= n && n <= Math.max(a, b);
}

function addOrders(orders, displayBars, wnd, props) {
    if (!wnd.startTime || !wnd.endTime) return;
    orders.map(function(o) {
        if (o.closeTime && between(o.openTime, wnd.startTime, wnd.endTime) ||
            o.closeTime && between(o.closeTime, wnd.startTime, wnd.endTime)) {
            //1. 已经成交且时间与窗口有重合
            var startBar = getBarByTime(displayBars, o.openTime);
            var endBar = getBarByTime(displayBars, o.closeTime);
            var style = { stroke: "#00f", strokeDasharray: "5,5" }
            var key = o.id;
            var x1 = getX(wnd, (startBar.x1 + startBar.x2) / 2);
            var x2 = getX(wnd, (endBar.x1 + endBar.x2) / 2);
            var y1 = getY(wnd, o.openPrice);
            var y2 = getY(wnd, o.closePrice);
            var line = { x1: x1, y1: y1, x2: x2, y2: y2, key: key, style: style };
            props.lines.push(line);
        } else if (!o.closeTime && o.createTime <= wnd.endTime) {
            //2. 未成交但是挂单时间在窗口之前
            var style = { stroke: "#0f0", strokeDasharray: "5,5" }
            var y = getY(wnd, o.price);
            var key = `price-${o.id}`;
            props.lines.push({ x1: 0, y1: y, x2: wnd.width, y2: y, style: style, key: key });
            if (o.stopLoss) {
                var style = { stroke: "#c00", strokeDasharray: "5,5" }
                var y = getY(wnd, o.stopLoss);
                var key = `sl-${o.id}`;
                props.lines.push({ x1: 0, y1: y, x2: wnd.width, y2: y, style: style, key: key });
            }
        }
    })
}

function addBars(bars, wnd, props) {
    bars.map(function(bar) {
        props.rects.push(getBarRect(wnd, bar));
        props.lines.push(getUpperLine(wnd, bar));
        props.lines.push(getUnderLine(wnd, bar));
    })
    var ma = bars.map(function(bar) {
        return getMa(wnd, bar);
    }).filter(function(o) {
        return !_.isNil(o);
    });
    var maStyle = { stroke: '#c00', strokeWidth: '2', fill: 'none' }
    props.paths.push({ points: ma, style: maStyle });
}

function addGrid(props) {
    var style = { strokeDasharray: "3 3", stroke: "#FFF", strokeWidth: 0.5 };
    //horizen
    for (var i = 0; i < props.style.height; i += GRID) {
        props.lines.push({ x1: 0, y1: i, x2: props.style.width, y2: i, style: style });
    }
    for (var i = 0; i < props.style.width; i += GRID) {
        props.lines.push({ x1: i, y1: 0, x2: i, y2: props.style.height, style: style });
    }
}

function getX(wnd, x) {
    return wnd.pos + wnd.width - x;
}

function getY(wnd, y) {
    return (wnd.high - y) / (wnd.high - wnd.low) * wnd.height;
}

function getBarRect(wnd, bar) {
    var x1 = getX(wnd, bar.x1);
    var x2 = getX(wnd, bar.x2);
    var y1 = getY(wnd, bar.y1);
    var y2 = getY(wnd, bar.y2);
    var fillClr = bar.close >= bar.open ? "#FFF" : "#000";
    var style = { fill: fillClr, stroke: "#000", strokeWidth: BAR_STROKE_WIDTH };
    return { x1: x1, y1: y1, x2: x2, y2: y2, style: style };
}

function getUpperLine(wnd, bar) {
    var x1 = getX(wnd, (bar.x1 + bar.x2) / 2);
    var x2 = getX(wnd, (bar.x1 + bar.x2) / 2);
    var y1 = getY(wnd, bar.y2);
    var y2 = getY(wnd, bar.high);
    var style = { stroke: "#000", strokeWidth: BAR_STROKE_WIDTH };
    return { x1: x1, y1: y1, x2: x2, y2: y2, style: style };
}

function getUnderLine(wnd, bar) {
    var x1 = getX(wnd, (bar.x1 + bar.x2) / 2);
    var x2 = getX(wnd, (bar.x1 + bar.x2) / 2);
    var y1 = getY(wnd, bar.low);
    var y2 = getY(wnd, bar.y1);
    var style = { stroke: "#000", strokeWidth: BAR_STROKE_WIDTH };
    return { x1: x1, y1: y1, x2: x2, y2: y2, style: style };
}

function getMa(wnd, bar) {
    if (!bar.ma30) {
        return;
    }
    var x = getX(wnd, (bar.x1 + bar.x2) / 2);
    var y = getY(wnd, bar.ma30);
    return { x: x, y: y };
}

function getBarByTime(bars, datetime, from, to) {
    //返回大于等于给定时间的第一个
    //如果给定时间大于所有的，则返回最大的时间，idx为0
    from = from === undefined ? 0 : from;
    to = to === undefined ? bars.length - 1 : to;
    if (from == to) {
        return bars[from];
    }
    var mid = _.floor((from + to) / 2);
    var small = bars[mid + 1].datetime;
    var large = bars[mid].datetime;
    if (small < datetime && datetime <= large) {
        return bars[mid];
    }
    if (datetime <= small) {
        return getBarByTime(bars, datetime, mid + 1, to);
    } else {
        return getBarByTime(bars, datetime, from, mid);
    }
}

module.exports = connect(mapStateToProps)(Svg);
