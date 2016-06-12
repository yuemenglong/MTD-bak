var _ = require("lodash");

function reducer(state, action) {
    state = state || { bars: [], window: { width: 1280, height: 640, pos: 0 } };
    switch (action.type) {
        case "FETCH_DATA_SUCC":
            var wnd = _.clone(state.window);
            var bars = action.data;
            updateBars(bars);
            updateWindow(bars, wnd);
            state = { bars: bars, window: wnd };
            return state;
        default:
            return state;
    }
}

var BAR_WIDTH = 4;
var BAR_GAP = 4;

function updateBars(bars) {
    if (!bars.length) {
        return;
    }
    bars[0].x1 = 0.5 * BAR_GAP;
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
