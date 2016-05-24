var Bar = require("./bar");
var data = require("../data");
var Svg = require("../svg");
var _ = require("lodash");
var React = require("react");
var ReactDOM = require("react-dom");

//use bar as state
function WindowClass() {
    this.getDefaultProps = function() {
        return {
            width: 1000,
            height: 300,
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
        this.refs.svg.drawRects(rects);
        var upperLines = Bar.displayBars().map(bar => bar.getUpperLineCoord());
        var underLines = Bar.displayBars().map(bar => bar.getUnderLineCoord());
        this.refs.svg.drawLines(upperLines.concat(underLines));
        // this.refs.svg.drawLines(underLines);
    }
    this.setDate = function(date) {
        var n = Bar.getIndexByTime(Bar.originBars(), date);
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
