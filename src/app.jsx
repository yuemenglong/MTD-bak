var test = require("./test");
test();

// var Svg = require("./svg");
// var Bar = require("./bar");
// var data = require("./2001.json");

// var WINDOW_WIDTH = 100;
// var WINDOW_HEIGHT = 100;

// var svg = ReactDOM.render(
//     html("Svg(width={WINDOW_WIDTH}, height={WINDOW_HEIGHT})"),
//     document.body
// );

// function init() {
//     Bar.push(data);
//     Bar.updateBars();
//     var w = Bar.window();
//     w.x1 = 0;
//     w.x2 = WINDOW_WIDTH;
//     w.height = WINDOW_HEIGHT;
//     Bar.updateWindow(w);
//     drawBars(Bar.displayBars());
// }

// function drawBars(bars) {
//     bars.map(drawBar);
// }

// function drawBar(bar) {
//     var rect = bar.getRectCoord();
//     svg.drawRect(rect);
// }

// init();
// console.log("hello");

// console.log(Bar.originBars());
// console.log(Bar.displayBars());
// console.log(Bar.window());



// var i = 0;
// setInterval(function() {
//     svg.drawLine(0, 0, 100, i * 5);
//     i++;
// }, 1000);
