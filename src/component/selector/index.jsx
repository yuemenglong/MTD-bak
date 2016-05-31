var _ = require("lodash");

function normalizePropsList(list) {
    var ret = list.map(function(item) {
        if (typeof item === "object") {
            return item;
        } else {
            return { value: item, option: item };
        }
    });
    [].splice.bind(list, 0, list.length).apply(list, ret);
    // list.splice(0, list.length);
    // list.concat(ret);
}

//{list, value, listener}
//{select, ulDisplay, listener}
function SelectorClass() {
    this.listener = [];
    this.getInitialState = function() {
        normalizePropsList(this.props.list);
        var select = this.props.list.filter(o => o.value == this.props.value)[0] || this.props.list[0];
        var listener = this.props.listener ? [this.props.listener] : [];
        return { select: select, ulDisplay: "none", listener: listener };
    }
    this.onFocus = function() {
        this.setState({ ulDisplay: "block" });
    }
    this.onBlur = function(e) {
        this.setState({ ulDisplay: "none" });
    }
    this.onLiMouseDown = function(value, i, option) {
        this.setState({ select: { value: value, index: i, option: option } });
        this.state.listener.map(l => l(value, option));
    }
    this.getValue = function() {
        return this.state.select.value;
    }
    this.getOption = function() {
        return this.state.select.option;
    }
    this.getIndex = function() {
        return this.state.select.index;
    }
    this.setValue = function(value) {
        var select = this.props.list.filter(o => o.value == value)[0] || this.props.list[0];
        this.setState({ select: select });
    }
    this.addListener = function(l) {
        var listener = _.clone(this.state.listener);
        listener.push(l)
        this.setState({ listener: listener });
    }
    this.removeListener = function(l) {
        var listener = this.state.listener.filter(o => o !== l);
        this.setState({ listener: listener });
    }
    this.render = function() {
        var ulStyle = {
            display: this.state.ulDisplay,
        }
        var event = {
            onFocus: this.onFocus,
            onBlur: this.onBlur,
        }
        var that = this;
        return jade(`
            div(className="selector")
                input(type="text" value={this.state.select.option} className="input" readOnly="true" {...event})
                ul(style={ulStyle})`,
            function() {
                return that.props.list.map(function(item, i) {
                    item = typeof item === "object" ? item : { value: item, option: item };
                    var onMouseDown = that.onLiMouseDown.bind(null, item.value, i, item.option);
                    return jade("li(key={item.value} onMouseDown={onMouseDown}) {item.option}")
                })
            }
        );
    }
}

var Selector = React.createClass(new SelectorClass());

module.exports = Selector;
