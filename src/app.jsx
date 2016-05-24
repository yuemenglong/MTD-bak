var _ = require("lodash");
var React = require("react");
var ReactDOM = require("react-dom");
var Window = require("./window");
var Selector = require("./selector");
var DatePicker = require("./date-picker");

var list = _.range(1990, 2010);

// var app = ReactDOM.render(
//     jade("DatePicker"),
//     document.body
// );

var app = ReactDOM.render(jade("Window"), document.body);

$(document).keydown(function(e) {
    if (e.keyCode === 39) {
        app.next();
    } else if (e.keyCode === 37) {
        app.prev();
    }
})

// function init() {
//     svg.drawRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
//     Bar.push(data);
//     Bar.updateBars();
//     Bar.setWindowSize(100, 100);
//     Bar.setWindowPos(-100);
//     Bar.normalizeWindow();
//     Bar.updateWindow();
// }

// function refresh() {
//     svg.clear();
//     svg.drawRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
//     Bar.displayBars().map(function(item) {
//         var rect = item.getRectCoord();
//         svg.drawRect(rect.x1, rect.y1, rect.x2, rect.y2, "#000", item.color());
//         var line = item.getUpperLineCoord();
//         svg.drawLine(line.x1, line.y1, line.x2, line.y2);
//         var line = item.getUnderLineCoord();
//         svg.drawLine(line.x1, line.y1, line.x2, line.y2);
//     });
// }

// function next() {
//     var x = Bar.window().x1 - Bar.WIDTH - Bar.GAP;
//     if (x <= 0) {
//         x = 0;
//     }
//     Bar.setWindowPos(x);
//     Bar.normalizeWindow();
//     Bar.updateWindow();
//     refresh();
// }

// function prev() {
//     var x = Bar.window().x1 + Bar.WIDTH + Bar.GAP;
//     if (x >= Bar.max()) {
//         x = Bar.max();
//     }
//     Bar.setWindowPos(x);
//     Bar.normalizeWindow();
//     Bar.updateWindow();
//     refresh();
// }
