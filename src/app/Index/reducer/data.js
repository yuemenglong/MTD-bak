var _ = require("lodash");

var BAR_WIDTH = 4;
var BAR_GAP = 4;

function reducer(state, action) {
    state = state || { bars: [], window: { width: 1280, height: 640, pos: 0 } };
    switch (action.type) {
        case "FETCH_DATA_SUCC":
            var wnd = _.clone(state.window);
            var bars = action.data.reduce(function(acc, item) {
                acc.unshift(item);
                return acc;
            }, []);
            updateBars(bars);
            wnd.pos = _.nth(bars, -1).x2;
            updateWindow(bars, wnd);
            return { bars: bars, window: wnd };
        case "MOVE_PREV":
            var wnd = _.clone(state.window);
            wnd.pos += (BAR_WIDTH + BAR_GAP);
            updateWindow(state.bars, wnd);
            return { bars: state.bars, window: wnd };
        case "MOVE_NEXT":
            var wnd = _.clone(state.window);
            wnd.pos -= (BAR_WIDTH + BAR_GAP);
            updateWindow(state.bars, wnd);
            return { bars: state.bars, window: wnd };
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

module.exports = reducer;
