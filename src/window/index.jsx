var Bar = require("./bar");
var data = require("../data");
var Svg = require("../svg");
var _ = require("lodash");

function WindowClass() {
    this.getDefaultProps = function() {
        return {
            width: 100,
            height: 100
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
        var rects = Bar.displayBars().map(bar => bar.getRectCoord())
        this.refs.svg.drawRects(rects);
    }
    this.setDate = function(date) {
        var clone = _.clone(Bar.originBars()).reverse();
        var n = _(clone).sortedIndexBy({ datetime: date }, "datetime");
        var bar = clone[n] || clone[n - 1];
        Bar.setWindowPos(bar.x1);
        this.refresh();
    }
    this.prev = function() {
        var pos = Bar.window().x1 + (Bar.GAP);
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
        return jade(`
            div(className="svg-window")
                Svg({...this.props} ref="svg")`);
    }
}

var Window = React.createClass(new WindowClass());

module.exports = Window;
