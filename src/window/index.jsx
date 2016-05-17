var Bar = require("./bar");
var Data = require("../data");
var Svg = require("../svg");
var _ = require("lodash");

function WindowClass() {
    this.setDate = function(date) {
        var n = _.sortedIndexBy(Bar.originBars(), { datetime: date }, "datetime");
    }
    this.prev = function() {

    }
    this.next = function() {

    }
    this.render = function() {
        return jade("Svg({...this.props})");
    }
}
