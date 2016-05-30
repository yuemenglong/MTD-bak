var Bar = require("./bar");
var Svg = require("../svg");
var alg = require("./alg");
var _ = require("lodash");
var React = require("react");
var ReactDOM = require("react-dom");

var GRID_WIDTH = 32;

//use bar as state
function WindowClass() {
    this.getDefaultProps = function() {
        return {
            width: 1280,
            height: 640,
            style: {
                backgroundColor: "#888",
            }
        };
    }
    this.getInitialState = function() {
        Bar.setWindowSize(this.props.width, this.props.height);
        return {};
    }
    this.pushData = function(data) {
        Bar.push(data);
        Bar.updateBars();
        this.refresh();
    }
    this.refresh = function() {
        Bar.adjustWindow();
        Bar.updateWindow();
        var state = {};
        state.rects = Bar.displayBars().map(bar => bar.getRectCoord());
        var upperLines = Bar.displayBars().map(bar => bar.getUpperLineCoord());
        var underLines = Bar.displayBars().map(bar => bar.getUnderLineCoord());
        var gridLines = alg.getGridLines(GRID_WIDTH, GRID_WIDTH, this.props.width, this.props.height);
        state.lines = [].concat(upperLines).concat(underLines).concat(gridLines);
        var ma = Bar.displayBars().map(bar => bar.getMACoord("ma30")).filter(o => !_.isNil(o));
        state.paths = [{ points: ma, style: { stroke: '#c00', strokeWidth: '2', fill: 'none' } }];
        this.setState(state);
    }
    this.setDate = function(date) {
        var n = alg.getIndexByTime(Bar.originBars(), date);
        var bar = Bar.originBars()[n];
        Bar.setWindowPos(bar.x1);
        this.refresh();
    }
    this.prev = function() {
        var pos = Bar.window().x1 + (Bar.GAP + Bar.WIDTH);
        Bar.setWindowPos(pos);
        this.refresh();
    }
    this.next = function() {
        var pos = Bar.window().x1 - (Bar.GAP + Bar.WIDTH);
        pos = pos >= 0 ? pos : 0;
        Bar.setWindowPos(pos);
        this.refresh();
    }
    this.render = function() {
        var props = Object.assign(this.state, this.props);
        return jade(`
            div(className="svg-window")
                Svg({...props})`);
    }
}

var Window = React.createClass(new WindowClass());

module.exports = Window;
