var Svg = require("./svg");
var Bar = require("./bar");

var svg = ReactDOM.render(
    html("Svg(width='100', height='100')"),
    document.body
);

var i = 0;
setInterval(function() {
    svg.drawLine(0, 0, 100, i * 5);
    i++;
}, 1000);
