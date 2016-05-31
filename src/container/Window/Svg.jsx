var Bar = require("./bar");
var alg = require("./alg");
var _ = require("lodash");
var React = require("react");
var ReactDOM = require("react-dom");
var moment = require("moment");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;
var Provider = ReactRedux.Provider;

var Svg = require("../../component/Svg");

function setRects(props, state) {
    props.rects = state.displayBars.map(bar => bar.getRectCoord());
}

function setLines(props, state) {
    var upperLines = state.displayBars.map(bar => bar.getUpperLineCoord());
    var underLines = state.displayBars.map(bar => bar.getUnderLineCoord());
    var gridLines = alg.getGridLines(state.gridWidth, state.gridWidth, state.style.width, state.style.height);
    props.lines = [].concat(upperLines).concat(underLines).concat(gridLines);
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
    var props = { style: state.style };
    var displayBars = state.displayBars;
    setRects(props, state);
    setLines(props, state);
    setPaths(props, state);
    setTexts(props, state);
    return props;
}

module.exports = connect(mapStateToProps)(Svg);
