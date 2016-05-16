var _ = require("lodash");
var React = require("react");

var DatePickerProto = function() {
    //{day, thisMonth, week, select}
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
    this.setDate = function(year, month, day) {
        if (arguments.length === 3) {
            return arguments.callee(new Date(year, month - 1, day));
        }
        var date = _(arguments).filter(_.isDate).nth(0);
        var panel = getPanelData(date);
        this.setState({ panel: panel });
    }
    this.onMouseOver = function(row, column, e) {
            var mouseOver = { row: row, column: column };
            this.setState({ mouseOver: mouseOver });
        }
        //{panel, select, mouseOver}
    this.getInitialState = function() {
        var panel = getPanelData(new Date());
        return { panel: panel };
    }
    this.render = function() {
        var that = this;
        return jade(`
            div(className="date-picker")
                table
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
                            if (_.isEqual(that.state.mouseOver, { row: i, column: j })) {
                                className.push("mouse-over");
                            }
                            className = className.join(" ");
                            var onMouseOver = that.onMouseOver.bind(that, i, j);
                            return jade("td(className={className} key={item.day} onMouseOver={onMouseOver}) {item.day}")
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
