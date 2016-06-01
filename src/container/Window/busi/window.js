module.exports = new WINDOW();

var _ = require("lodash");
var Bar = require("./bar");

var Window = { x1: 0, x2: 100, y1: 0, y2: 0, width: 100, height: 100, }

function WINDOW() {
    this.x1 = function() {
        return Window.x1;
    }
    this.y1 = function() {
        return Window.y1;
    }
    this.x2 = function() {
        return Window.x2;
    }
    this.y2 = function() {
        return Window.y2;
    }
    this.width = function() {
        return Window.width;
    }
    this.height = function() {
        return Window.height;
    }
    this.startTime = function() {
        return _.nth(Bar.displayBars(), -1).datetime;
    }
    this.endTime = function() {
        return _.nth(Bar.displayBars(), 0).datetime;
    }
    this.getX = function(x) {
        return Window.x2 - x;
    }
    this.getY = function(y) {
        return (Window.y2 - y) / (Window.y2 - Window.y1) * Window.height;
    }
    this.setSize = function(width, height) {
        Window.width = width;
        Window.height = height;
    }
    this.setPos = function(x) {
        if (x >= 0) {
            Window.x1 = x;
            Window.x2 = Window.x1 + Window.width;
        } else {
            var max = _(Bar.originBars()).nth(-1).x2;
            Window.x1 = max + x;
            Window.x2 = Window.x1 + Window.width;
        }
    }
    this.adjust = function() {
        var n = _(Bar.originBars()).sortedIndexBy({ x2: Window.x1 - Bar.RIGHT_GAP }, "x2");
        var first = Bar.originBars()[n] || Bar.originBars()[n - 1] || { x1: 0 };
        Window.x1 = first.x1 - Bar.GAP / 2;
        Window.x2 = Window.x1 + Window.width;
    }
    this.update = function() {
        var displayBars = Bar.displayBars();

        var high = _(displayBars).maxBy(item => item.high) || { high: 0 };
        var low = _(displayBars).minBy(item => item.low) || { low: 0 };

        Window.y1 = low.low;
        Window.y2 = high.high;
    }
}
