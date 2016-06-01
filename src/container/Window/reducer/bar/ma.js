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

module.exports = MA;
