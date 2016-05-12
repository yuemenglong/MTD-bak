var Svg = require("./svg");
var Bar = require("./bar");
var data = require("./2001.json");
var _ = require("lodash");

var WINDOW_WIDTH = 100;
var WINDOW_HEIGHT = 100;

var svg = ReactDOM.render(
    html("Svg(width={WINDOW_WIDTH}, height={WINDOW_HEIGHT})"),
    document.body
);
init();
refresh();

$(document).keydown(function(e) {
    if (e.keyCode === 39) {
        next();
    } else if (e.keyCode === 37) {
        prev();
    }
})

function init() {
    svg.drawRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    Bar.push(data);
    Bar.updateBars();
    Bar.setWindowSize(100, 100);
    Bar.setWindowPos(-100);
    Bar.normalizeWindow();
    Bar.updateWindow();
}

function refresh() {
    svg.clear();
    svg.drawRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    Bar.displayBars().map(function(item) {
        var rect = item.getRectCoord();
        svg.drawRect(rect.x1, rect.y1, rect.x2, rect.y2, "#888", item.color());
        var line = item.getUpperLineCoord();
        svg.drawLine(line.x1, line.y1, line.x2, line.y2);
        var line = item.getUnderLineCoord();
        svg.drawLine(line.x1, line.y1, line.x2, line.y2);
    });
}

function next() {
    var x = Bar.window().x1 - Bar.WIDTH - Bar.GAP;
    if (x <= 0) {
        x = 0;
    }
    Bar.setWindowPos(x);
    Bar.normalizeWindow();
    Bar.updateWindow();
    refresh();
}

function prev() {
    var x = Bar.window().x1 + Bar.WIDTH + Bar.GAP;
    if (x >= Bar.max()) {
        x = Bar.max();
    }
    Bar.setWindowPos(x);
    Bar.normalizeWindow();
    Bar.updateWindow();
    refresh();
}
