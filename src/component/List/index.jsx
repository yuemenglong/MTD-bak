var React = require("react");

//[list]
function ListClass() {
    this.render = function() {
    	var that = this;
        return jade(`ul`, function() {
            return that.props.list.map(function(o, i) {
                return jade("li(key={i}) {o}");
            })
        });
    }
}

module.exports = React.createClass(new ListClass());
