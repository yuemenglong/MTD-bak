var _ = require("lodash");
var React = require("react");

//{panel, mouseOver, select, date}
var DatePickerProto = function() {
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
        while (!finishNext || !reachSaturday) {
            next = moveDate(next, 1);
            info = { day: next.getDate(), thisMonth: next.getMonth() === date.getMonth(), week: next.getDay() };
            finishNext = next.getMonth() !== date.getMonth();
            reachSaturday = next.getDay() === 6;
            ret.push(info);
        }
        return _(ret).chunk(7).value();
    }

    function moveDate(date, day) {
        return new Date(date.valueOf() + day * 24 * 3600 * 1000);
    }

    function getSelectPos(date, panel) {
        var select = null;
        panel.map(function(line, i) {
            line.map(function(item, j) {
                if (item.day == date.getDate()) {
                    select = { row: i, column: j };
                }
            })
        })
        return select;
    }
    this.pickHandler = null;
    this.setDate = function(year, month, day) {
        if (arguments.length === 3) {
            return arguments.callee(new Date(year, month - 1, day));
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
            newDate = new Date(this.state.date.valueOf() - 30 * 86400 * 1000);
            newDate.setDate(item.day);
        } else if (!item.thisMonth && item.day < 15) {
            //next month
            newDate = new Date(this.state.date.valueOf() + 30 * 86400 * 1000);
            newDate.setDate(item.day);
        } else {
            newDate = new Date(this.state.date);
            newDate.setDate(item.day);
        }
        this.setState({ date: newDate });
    }
    this.onMouseLeave = function(e) {
        this.setState({ mouseOver: null });
    }
    this.getInitialState = function() {
        //{panel, select, mouseOver}
        var panel = getPanelData(new Date());
        return { panel: panel, date: new Date() };
    }
    this.render = function() {
        var that = this;
        var props = {
            onMouseLeave: that.onMouseLeave,
        }
        return jade(`
            div(className="date-picker")
                table({...props})
                    thead
                        tr #{}
                    tbody #{}`,
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

var DatePicker = React.createClass(new DatePickerProto());

module.exports = DatePicker;


if (require.main == module) {
    console.log(ret);
}
