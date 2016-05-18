var _ = require("lodash");

//{list, select}
//{select, ulDisplay}
function SelectorClass() {
    this.getInitialState = function() {
        var select = this.props.list[this.props.select];
        select = typeof select === "object" ? select : { value: select, index: this.props.select, option: select };
        return { select: select, ulDisplay: "none" };
    }
    this.onFocus = function() {
        this.setState({ ulDisplay: "block" });
    }
    this.onBlur = function(e) {
        this.setState({ ulDisplay: "none" });
    }
    this.onLiMouseDown = function(value, i, option) {
        this.setState({ select: { value: value, index: i, option: option } });
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
            div(className="year-selector")
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
