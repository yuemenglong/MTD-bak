var Bar = require("./bar");
var data = require("../data");
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
        Bar.push(data.getData());
        Bar.updateBars();
        Bar.setWindowSize(this.props.width, this.props.height);
        return {};
    }
    this.refresh = function() {
        Bar.adjustWindow();
        Bar.updateWindow();
        this.refs.svg.clear();
        var rects = Bar.displayBars().map(bar => bar.getRectCoord());
        var upperLines = Bar.displayBars().map(bar => bar.getUpperLineCoord());
        var underLines = Bar.displayBars().map(bar => bar.getUnderLineCoord());
        var gridLines = alg.getGridLines(GRID_WIDTH,GRID_WIDTH, this.props.width, this.props.height);
        var lines = [].concat(upperLines).concat(underLines).concat(gridLines);
        // var style = { "stroke-dasharray": "3 3", stroke: "#FFF" };
        // lines.push({ x1: 0, y1: 0, x2: 100, y2: 100, style: style })
        this.refs.svg.drawRects(rects);
        this.refs.svg.drawLines(lines);
        // this.refs.svg.drawLines(underLines);
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
    this.componentDidMount = function() {
        this.setDate(this.props.date || new Date());
    }
    this.render = function() {
        return jade(`
            div(className="svg-window")
                Svg({...this.props} ref="svg")`);
    }
}

var Window = React.createClass(new WindowClass());

module.exports = Window;
