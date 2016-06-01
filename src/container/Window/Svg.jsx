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

function mapStateToProps(state) {
    var props = { style: state.init.style };
    setRects(props, state);
    setLines(props, state);
    setPaths(props, state);
    setTexts(props, state);
    return props;
}

module.exports = connect(mapStateToProps)(Svg);
