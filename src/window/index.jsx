var Bar = require("./bar");
var Data = require("../data");
var Svg = require("../svg");

//{displayBars}
function WindowClass() {
    this.render = function() {
        var style = {
            width: this.props.width,
            height: this.props.height
        };
        return jade("Svg(style={style})", function() {

        });
    }
}
