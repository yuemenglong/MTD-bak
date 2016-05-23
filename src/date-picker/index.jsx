var _ = require("lodash");
var Selector = require("../selector");

//{date}
//{panel, mouseOver, date}
var DatePickerPanelClass = function() {
    //{day, thisMonth, week}
    function getPanelData(year, month, day) {
        if (arguments.length === 3) {
            return arguments.callee(new Date(year, month - 1, day));
        }
        var date = _(arguments).filter(_.isDate).nth(0);
        var info = { day: date.getDate(), thisMonth: true, week: date.getDay() };
        var ret = [info];
        var prev = date;
        var finishPrev = prev.getMonth() !== date.getMonth();
        var reachSunday = prev.getDay() === 0;
        while (!finishPrev || !reachSunday) {
            prev = moveDate(prev, -1);
            info = { day: prev.getDate(), thisMonth: prev.getMonth() === date.getMonth(), week: prev.getDay() };
            finishPrev = prev.getMonth() !== date.getMonth();
            reachSunday = prev.getDay() === 0;
            ret.unshift(info);
        }
        var next = date;
        var finishNext = next.getMonth() !== date.getMonth();
        var reachSaturday = next.getDay() === 6;
        while (ret.length != 6 * 7) {
            next = moveDate(next, 1);
            info = { day: next.getDate(), thisMonth: next.getMonth() === date.getMonth(), week: next.getDay() };
            // finishNext = next.getMonth() !== date.getMonth();
            // reachSaturday = next.getDay() === 6;
            ret.push(info);
        }
        return _(ret).chunk(7).value();
    }
    this.getInitialState = function() {
        //{panel, select, mouseOver}
        var date = this.props.date || new Date();
        var panel = getPanelData(date);
        return { panel: panel, date: date };
    }
    this.getDate = function() {
        return new Date(this.state.date);
    }
    this.setDate = function(year, month, day) {
        if (arguments.length === 3) {
            return arguments.callee(new Date(year, month - 1, day));
        }
        var date = _(arguments).filter(_.isDate).nth(0);
        var panel = getPanelData(date);
        this.setState({ panel: panel, date: date });
    }
    this.setMonth = function(year, month) {
        if (arguments.length === 2) {
            var date = new Date(year, month - 1, this.state.date.getDate());
            while (date.getMonth() != month) {
                date = moveDate(date, -1);
            }
            return arguments.callee(date);
        }
        var date = _(arguments).filter(_.isDate).nth(0);
        var panel = getPanelData(date);
        this.setState({ panel: panel, date: date });
    }
    this.onMouseOver = function(row, column, e) {
        var mouseOver = { row: row, column: column };
        this.setState({ mouseOver: mouseOver });
    }
    this.onClick = function(row, column, e) {
        var item = this.state.panel[row][column];
        var newDate = null;
        if (!item.thisMonth && item.day > 15) {
            //prev month
            newDate = moveMonth(this.state.date, -1);
            newDate.setDate(item.day);
            this.setMonth(newDate);
        } else if (!item.thisMonth && item.day < 15) {
            //next month
            newDate = moveMonth(this.state.date, 1);
            newDate.setDate(item.day);
            this.setMonth(newDate);
        } else {
            newDate = new Date(this.state.date);
            newDate.setDate(item.day);
        }
        this.setState({ date: newDate });
        this.props.onPick && this.props.onPick(newDate);
    }
    this.onMouseLeave = function(e) {
        this.setState({ mouseOver: null });
    }
    this.render = function() {
        var that = this;
        return jade(`
            table
                thead
                    tr #{}
                tbody(onMouseLeave={this.onMouseLeave}) #{}`,
            function() {
                return ["日", "一", "二", "三", "四", "五", "六"].map(function(item, i) {
                    return jade("th(key={i}) {item}");
                })
            },
            function() {
                return that.state.panel.map(function(line, i) {
                    return jade("tr(key={i})", function() {
                        return line.map(function(item, j) {
                            var className = [];
                            if (item.thisMonth) {
                                className.push("this-month");
                            }
                            var td = { row: i, column: j };
                            if (_.isEqual(that.state.mouseOver, td)) {
                                className.push("mouse-over");
                            }
                            if (item.thisMonth && item.day == that.state.date.getDate()) {
                                className.push("select");
                            }
                            var props = {
                                key: item.day,
                                className: className.join(" "),
                                onMouseOver: that.onMouseOver.bind(null, i, j),
                                onClick: that.onClick.bind(null, i, j)
                            }
                            return jade("td({...props}) {item.day}")
                        })
                    });
                })
            }
        )
    }
}

//{date}
//{date}
var DatePickerSelectorClass = function() {
    this.listener = [];
    this.getInitialState = function() {
        return { date: this.props.date || new Date() };
    }
    this.setDate = function(date) {
        this.setState({ date: date });
        this.listener.map(l => l(date));
    }
    this.prevMonth = function() {
        var date = new Date(this.state.date);
        date = moveMonth(date, -1);
        this.setDate(date);
    }
    this.nextMonth = function() {
        var date = new Date(this.state.date);
        date = moveMonth(date, 1);
        this.setDate(date);
    }
    this.prevYear = function() {
        var date = new Date(this.state.date);
        date = moveYear(date, -1);
        this.setDate(date);
    }
    this.nextYear = function() {
        var date = new Date(this.state.date);
        date = moveYear(date, 1);
        this.setDate(date);
    }
    this.addListener = function(listener) {
        this.listener.push(listener);
    }
    this.onYearChange = function(year) {
        var date = new Date(this.state.date);
        date = moveYear(date, year - date.getFullYear());
        this.setDate(date);
    }
    this.onMonthChange = function(month) {
        var date = new Date(this.state.date);
        date = moveMonth(date, month - (date.getMonth() + 1));
        this.setDate(date);
    }
    this.onPick = function(date) {
        this.setDate(date);
    }
    this.render = function() {
        var yearSelector = {
            key: this.state.date.getFullYear(),
            ref:"yearSelector",
            list: _.range(2000, 2021),
            value: this.state.date.getFullYear(),
            listener: this.onYearChange,
        }
        var monthSelector = {
            key: this.state.date.getMonth() + 1,
            ref:"monthSelector",
            list: _.range(1, 13),
            value: this.state.date.getMonth() + 1,
            listener: this.onMonthChange,
        }
        return jade(`
            div(className="date-picker")
                input(type="button" name="prevYear" value="prevYear" onClick={this.prevYear})
                Selector({...yearSelector})
                input(type="button" name="nextYear" value="nextYear" onClick={this.nextYear})
                input(type="button" name="prevMonth" value="prevMonth" onClick={this.prevMonth})
                Selector({...monthSelector})
                input(type="button" name="nextMonth" value="nextMonth" onClick={this.nextMonth})
                span {this.state.date.toLocaleString()}
                DatePickerPanel(key={this.state.date} ref="panel" date={this.state.date} onPick={this.onPick})
            `);
    }
}

var DatePickerPanel = React.createClass(new DatePickerPanelClass());
var DatePickerSelector = React.createClass(new DatePickerSelectorClass());

function moveDate(date, day) {
    return new Date(date.valueOf() + day * 24 * 3600 * 1000);
}

function moveMonth(date, month) {
    var cur = new Date(date);
    cur.setDate(1);
    cur.setMonth(cur.getMonth() + month);
    var targetMonth = cur.getMonth();
    cur.setDate(date.getDate());
    while (cur.getMonth() != targetMonth) {
        cur = moveDate(cur, -1);
    }
    return cur;
}

function moveYear(date, year) {
    var cur = new Date(date);
    cur.setDate(1);
    cur.setFullYear(cur.getFullYear() + year);
    var targetMonth = cur.getMonth();
    cur.setDate(date.getDate());
    while (cur.getMonth() != targetMonth) {
        cur = moveDate(cur, -1);
    }
    return cur;
}

module.exports = DatePickerSelector;


