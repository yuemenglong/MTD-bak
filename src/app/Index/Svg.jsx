var _ = require("lodash");
var React = require("react");
var ReactDOM = require("react-dom");
var moment = require("moment");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;
var Provider = ReactRedux.Provider;

var Svg = require("../../component/Svg");

function getGridLines(gridWidth, gridHeight, windowWidth, windowHeight) {
    var ret = [];
    var style = { strokeDasharray: "3 3", stroke: "#FFF", strokeWidth: 0.5 };
    //horizen
    for (var i = 0; i < windowHeight; i += gridHeight) {
        ret.push({ x1: 0, y1: i, x2: windowWidth, y2: i, style: style });
    }
    for (var i = 0; i < windowWidth; i += gridWidth) {
        ret.push({ x1: i, y1: 0, x2: i, y2: windowHeight, style: style });
    }
    return ret;
}

function setRects(props, state) {
    props.rects = state.displayBars.map(bar => bar.getRectCoord());
}

function setLines(props, state) {
    var upperLines = state.displayBars.map(bar => bar.getUpperLineCoord());
    var underLines = state.displayBars.map(bar => bar.getUnderLineCoord());
    var gridLines = getGridLines(state.init.gridWidth, state.init.gridWidth, state.init.style.width, state.init.style.height);
    var orderLines = _.flatten(state.displayOrders.map(order => order.getLinesCoord()));
    props.lines = [].concat(upperLines).concat(underLines).concat(gridLines).concat(orderLines);
}

function setPaths(props, state) {
    var ma = state.displayBars.map(bar => bar.getMACoord("ma30")).filter(o => !_.isNil(o));
    props.paths = [{ points: ma, style: { stroke: '#c00', strokeWidth: '2', fill: 'none' } }];
}

function setTexts(props, state) {
    if (!state.displayBars.length) return;
    var text = moment(state.displayBars[0].datetime).format("YYYY-MM-DD HH:mm:ss");
    props.texts = [{ x: 10, y: 30, text: text, style: { stroke: "#0f0", fill: "#0f0", fontSize: "30" } }];
}

// input:
// bars[{open,high,low,close,x1,y1,x2,y2,ma30}] 
// window{width, height, pos}
// output:
// {style, rects[], lines[], paths[], texts[]}
function mapStateToProps(state) {
    var bars = state.data.bars;
    var wnd = _.clone(state.data.window);
    var style = { width: wnd.width, height: wnd.height, backgroundColor: "#888" };
    var props = { style: style, rects: [], lines: [], paths: [], texts: [] };
    addBars(bars, wnd, props);
    // setRects(props, state);
    // setLines(props, state);
    // setPaths(props, state);
    // setTexts(props, state);
    return props;
}
var BAR_STROKE_WIDTH = 0.8;

function addBars(bars, wnd, props) {
    var displayBars = bars.filter(function(bar) {
        var mid = (bar.x1 + bar.x2) / 2;
        return wnd.pos <= mid && mid <= wnd.pos + wnd.width;
    })
    wnd.high = (_(displayBars).maxBy(item => item.high) || { high: 0 }).high;
    wnd.low = (_(displayBars).minBy(item => item.low) || { low: 0 }).low;

    displayBars.map(function(bar) {
        props.rects.push(getBarRect(wnd, bar));
        props.lines.push(getUpperLine(wnd, bar));
        props.lines.push(getUnderLine(wnd, bar));
    })
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


module.exports = connect(mapStateToProps)(Svg);
