var _ = require("lodash");

//返回大于等于给定时间的第一个
//如果给定时间大于所有的，则返回最大的时间，idx为0
function Alg() {
    this.getIndexByTime = function(bars, datetime, from, to) {
        from = from === undefined ? 0 : from;
        to = to === undefined ? bars.length - 1 : to;
        if (from == to) {
            return from;
        }
        var mid = _.floor((from + to) / 2);
        var small = bars[mid + 1].datetime;
        var large = bars[mid].datetime;
        if (small < datetime && datetime <= large) {
            return mid;
        }
        if (datetime <= small) {
            return arguments.callee(bars, datetime, mid + 1, to);
        } else {
            return arguments.callee(bars, datetime, from, mid);
        }
    }
    this.getGridLines = function(gridWidth, gridHeight, windowWidth, windowHeight) {
        var ret = [];
        var style = { strokeDasharray: "3 3", stroke: "#FFF", strokeWidth: 0.5 };
        //horizen
        for (var i = 0; i < windowHeight; i += gridHeight) {
            ret.push({ x1: 0, y1: i, x2: windowWidth, y2: i, style: style });
        }
        for (var i = 0; i < windowWidth; i += gridWidth) {
            ret.push({ x1: i, y1: 0, x2: i, y2: windowHeight, style: style });
        }
        return ret;
    }
}



var alg = new Alg();

module.exports = alg;

if (require.main == module) {
    var data = require("../data");
    var bars = data.getData();
    var n = alg.getIndexByTime(bars, bars[bars.length - 1].datetime);
    console.log(n);
    for (var i = 0; i < bars.length; i++) {
        var n = alg.getIndexByTime(bars, bars[i].datetime);
        console.log(n);
    }
    for (var i = 0; i < bars.length; i++) {
        var n = alg.getIndexByTime(bars, new Date(bars[i].datetime.valueOf() + 1));
        console.log(n);
    }
    for (var i = 0; i < bars.length; i++) {
        var n = alg.getIndexByTime(bars, new Date(bars[i].datetime.valueOf() - 1));
        console.log(n);
    }
}
