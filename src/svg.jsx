var Svg = React.createClass({
    getInitialState: function() {
        return { lines: [], rects: [] };
    },
    drawLine: function(x1, y1, x2, y2, clr) {
        clr = clr || "#000";
        var copy = this.state.lines.slice();
        var key = `${x1}${y1}${x2}${y2}`;
        var style = { stroke: clr };
        copy.push({ x1: x1, y1: y1, x2: x2, y2: y2, key: key, style: style });
        this.setState({ lines: copy });
    },
    drawRect: function(x1, y1, x2, y2, clr, fillClr) {
        clr = clr || "#000";
        fillClr = fillClr || null;
        var copy = this.state.rects.slice();
        var key = `${x1}${y1}${x2}${y2}`;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        var width = Math.max(x1, x2) - x;
        var height = Math.max(y1, y2) - y;
        var style = { stroke: clr };
        if (fillClr) {
            style.fill = fillClr;
        } else {
            style.fillOpacity = 0;
        }
        copy.push({ x: x, y: y, width: width, height: height, key: key, style: style });
        this.setState({ rects: copy });
    },
    clear: function() {
        this.setState({ lines: [], rects: [] });
    },
    render: function() {
        return jade(`svg({...this.props}) #{}#{}`, function() {
            this.state.lines.map(function(item) {
                return jade("line({...item})");
            })
        }, function() {
            this.state.rects.map(function(item) {
                return jade("rect({...item})");
            });
        });
    }
});

module.exports = Svg;
