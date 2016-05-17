var _ = require("lodash");

//{list, dft}
//{cur, ulDisplay}
function YearSelectorClass() {
    this.getInitialState = function() {
        return { cur: this.props.dft, ulDisplay: "none" };
    }
    this.onFocus = function() {
        this.setState({ ulDisplay: "block" });
    }
    this.onBlur = function(e) {
        console.log(document.body);
        this.setState({ ulDisplay: "none" });
    }
    this.onLiClick = function(item) {
        console.log("click");
        this.setState({ cur: item });
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
                input(type="text" onClick={onClick} value={this.state.cur} className="input" readOnly="true" {...event})
                ul(style={ulStyle})`,
            function() {
                return that.props.list.map(function(item) {
                    return jade("li(key={item} onClick={onClick}) {item}")
                })
            }
        );
    }
}

function onClick() {
    console.log("click");
}

var YearSelector = React.createClass(new YearSelectorClass());

module.exports = YearSelector;
