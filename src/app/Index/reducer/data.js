var _ = require("lodash");

var BAR_WIDTH = 4;
var BAR_GAP = 4;

function Bar(bar) {
    _.merge(this, bar);
    this.datetime = new Date(this.datetime);
}

function reducer(state, action) {
    state = state || { bars: [], displayBars: [], window: { width: 1280, height: 640, pos: 0 } };
    switch (action.type) {
        case "FETCH_DATA_SUCC":
            var wnd = _.clone(state.window);
            var bars = action.data.reduce(function(acc, item) {
                acc.unshift(new Bar(item));
                return acc;
            }, []);
            updateBars(bars);
            wnd.pos = _.nth(bars, -1).x2;
            var displayBars = updateWindow(bars, wnd);
            return { bars: bars, displayBars: displayBars, window: wnd };
        case "MOVE_PREV":
            var wnd = _.clone(state.window);
            wnd.pos += (BAR_WIDTH + BAR_GAP);
            var displayBars = updateWindow(state.bars, wnd);
            return { bars: state.bars, displayBars: displayBars, window: wnd };
        case "MOVE_NEXT":
            var wnd = _.clone(state.window);
            wnd.pos -= (BAR_WIDTH + BAR_GAP);
            var displayBars = updateWindow(state.bars, wnd);
            return { bars: state.bars, displayBars: displayBars, window: wnd };
        default:
            return state;
    }
}


function updateBars(bars) {
    if (!bars.length) {
        return;
    }
    bars[0].x1 = BAR_GAP / 2;
    for (var i in bars) {
        (i > 0) && (bars[i].x1 = bars[i - 1].x2 + BAR_GAP);
        bars[i].x2 = bars[i].x1 + BAR_WIDTH;
        bars[i].y1 = Math.min(bars[i].open, bars[i].close);
        bars[i].y2 = Math.max(bars[i].open, bars[i].close);
    }
    MA(bars);
}

function updateWindow(bars, wnd) {
    var n = _(bars).sortedIndexBy({ x2: wnd.pos }, "x2");
    var first = bars[n] || bars[n - 1] || { x1: 0 };
    wnd.pos = first.x1 - BAR_GAP / 2;

    var displayBars = bars.filter(function(bar) {
        var mid = (bar.x1 + bar.x2) / 2;
        return wnd.pos <= mid && mid <= wnd.pos + wnd.width;
    })
    wnd.high = (_(displayBars).maxBy(item => item.high) || { high: 0 }).high;
    wnd.low = (_(displayBars).minBy(item => item.low) || { low: 0 }).low;
    wnd.startTime = (_.nth(displayBars, -1) || { datetime: null }).datetime;
    wnd.endTime = (_.nth(displayBars, 0) || { datetime: null }).datetime;
    return displayBars;
}

function MA(bars, n, name) {
    n = n || 30;
    name = name || "ma" + n;
    var total = 0;
    for (var i = bars.length - 1; i >= 0; i--) {
        var bar = bars[i];
        var count = bars.length - i - 1;
        total += bar.close;
        if (count >= n - 1) {
            bar[name] = total / n;
            total -= bars[i + n - 1].close;
        }
    }
}

function Action() {
    this.fetchData = function() {
        return function(dispatch, getState) {
            fetch("/static/data/2001.json").then(function(res) {
                return res.json();
            }).then(function(json) {
                dispatch({ type: "FETCH_DATA_SUCC", data: json });
            })
        };
    }
}

module.exports = reducer;
module.exports.action = new Action();
