var Bar = require('./bar');
var Svg = React.createClass({
    getInitialState: function () {
        return {
            lines: [],
            rects: []
        };
    },
    drawLine: function (x1, y1, x2, y2, clr) {
        clr = clr || '#888';
        var copy = this.state.lines.slice();
        var key = `${ x1 }${ y1 }${ x2 }${ y2 }`;
        var style = { stroke: clr };
        copy.push({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            key: key,
            style: style
        });
        this.setState({ lines: copy });
    },
    drawRect: function (x1, y1, x2, y2, clr, fill) {
        clr = clr || '#888';
        fill = fill || false;
        var copy = this.state.rects.slice();
        var key = `${ x1 }${ y1 }${ x2 }${ y2 }`;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        var width = Math.max(x1, x2) - x;
        var height = Math.max(y1, y2) - y;
        var style = { stroke: clr };
        if (fill) {
            style.fill = clr;
        } else {
            style.fillOpacity = 0;
        }
        copy.push({
            x: x,
            y: y,
            width: width,
            height: height,
            key: key,
            style: style
        });
        this.setState({ rects: copy });
    },
    render: function () {
        return <svg {...this.props}>
{this.state.lines.map(function (item) {
    return <line {...item}>
</line>
;
})}
{this.state.rects.map(function (item) {
    return <rect {...item}>
</rect>
;
})}
</svg>
;
    }
});
var svg = ReactDOM.render(<Svg width='100' height='100'>
</Svg>
, document.body);
svg.drawLine(20, 20, 80, 30);
svg.drawRect(20, 20, 90, 90);
var bar = new Bar(10, 10, 20, 20);