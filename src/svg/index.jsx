var React = require("react");
var ReactDOM = require("react-dom");

var SvgClass = function() {
    this.getInitialState = function() {
        return { lines: [], rects: [] };
    }
    this.drawLine = function(x1, y1, x2, y2, style) {
        var copy = this.state.lines.slice();
        var key = `${x1}${y1}${x2}${y2}`;
        copy.push({ x1: x1, y1: y1, x2: x2, y2: y2, key: key, style: style });
        this.setState({ lines: copy });
    }
    this.drawLines = function(lines) {
        var copy = this.state.lines.slice();
        lines.map(function(line) {
            var x1 = line.x1;
            var y1 = line.y1;
            var x2 = line.x2;
            var y2 = line.y2;
            var style = line.style;
            var key = `${x1}${y1}${x2}${y2}`;
            copy.push({ x1: x1, y1: y1, x2: x2, y2: y2, key: key, style: style });
        })
        this.setState({ lines: copy });
    }
    this.drawRect = function(x1, y1, x2, y2, style) {
        var copy = this.state.rects.slice();
        var key = `${x1}${y1}${x2}${y2}`;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        var width = Math.max(x1, x2) - x;
        var height = Math.max(y1, y2) - y;
        copy.push({ x: x, y: y, width: width, height: height, key: key, style: style });
        this.setState({ rects: copy });
    }
    this.drawRects = function(rects) {
        var copy = this.state.rects.slice();
        rects.map(function(rect) {
            var x1 = rect.x1;
            var y1 = rect.y1;
            var x2 = rect.x2;
            var y2 = rect.y2;
            var style = rect.style;
            var key = `${x1}${y1}${x2}${y2}`;
            var x = Math.min(x1, x2);
            var y = Math.min(y1, y2);
            var width = Math.max(x1, x2) - x;
            var height = Math.max(y1, y2) - y;
            copy.push({ x: x, y: y, width: width, height: height, key: key, style: style });
        })
        this.setState({ rects: copy });
    }
    this.clear = function() {
        this.setState({ lines: [], rects: [] });
    }
    this.render = function() {
        var that = this;
        return jade(`svg({...this.props}) #{}#{}`, function() {
            return that.state.lines.map(function(item) {
                return jade("line({...item})");
            })
        }, function() {
            return that.state.rects.map(function(item) {
                return jade("rect({...item})");
            });
        });
    }
}


var Svg = React.createClass(new SvgClass());

module.exports = Svg;
