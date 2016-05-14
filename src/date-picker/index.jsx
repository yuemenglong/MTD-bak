var _ = require("lodash");

var DatePicker = React.createClass({
    setPanelData: function(panel) {
        this.setState({ panel: panel });
    },
    getInitialState: function() {
        var panel = [];
        for (var i = 1; i <= 35; i++) {
            if (i % 7 === 1) {
                panel.push([]);
            }
            _(panel).nth(-1).push(i);
        }
        return { panel: panel };
    },
    render: function() {
        return jade(`
            div(className="date-picker")
                table
                    thead
                        tr #{}
                    tbody #{}`,
            function() {
                ["日", "一", "二", "三", "四", "五", "六"].map(function(item, i) {
                    return jade("th(key={i}) {item}");
                })
            },
            function() {
                this.state.panel.map(function(line, i) {
                    return jade("tr(key={i})", function() {
                        line.map(function(item) {
                            return jade("td(key={item}) {item}")
                        })
                    });
                })
            })
    }
})

module.exports = DatePicker;
