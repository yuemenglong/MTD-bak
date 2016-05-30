var React = require("react");
var ReactDOM = require("react-dom");

var SvgClass = function() {
    this.defaultProps = function() {
        return { lines: [], rects: [], paths: [] };
    }
    this.renderLine = function(o) {
        var key = `${o.x1}${o.y1}${o.x2}${o.y2}`;
        var style = o.style;
        var item = { x1: o.x1, y1: o.y1, x2: o.x2, y2: o.y2, key: key, style: style };
        return jade("line({...item})");
    }
    this.renderRect = function(o) {
        var key = `${o.x1}${o.y1}${o.x2}${o.y2}`;
        var x = Math.min(o.x1, o.x2);
        var y = Math.min(o.y1, o.y2);
        var width = Math.max(o.x1, o.x2) - x;
        var height = Math.max(o.y1, o.y2) - y;
        var style = o.style;
        var item = { x: x, y: y, width: width, height: height, key: key, style: style };
        return jade("rect({...item})");
    }
    this.renderPath = function(o) {
        var points = o.points;
        var style = o.style;
        if (!points.length) return;
        var path = points.reduce(function(res, item) {
            res.push(`L ${item.x} ${item.y}`)
            return res;
        }, [`M ${points[0].x} ${points[0].y}`]).join(" ");
        var key = path;
        var item = { path: path, key: key, style: style };
        return jade("path({...item})");
    }

    //lines, rects, paths
    this.render = function() {
        var that = this;
        var dft = { lines: [], rects: [], paths: [] };
        var props = Object.assign(dft, this.props);
        return jade(`svg({...this.props}) #{}#{}#{}`, function() {
            return props.lines.map(that.renderLine);
        }, function() {
            return props.rects.map(that.renderRect);
        }, function() {
            return props.paths.map(that.renderPath);
            // return jade("path(d={that.state.path} stroke='#c00' strokeWidth='2' fill='none')");
        });
    }
}


var Svg = React.createClass(new SvgClass());

module.exports = Svg;
