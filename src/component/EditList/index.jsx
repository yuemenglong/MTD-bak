var React = require("react");
var List = require("../List");

//[list, event] 
//click
function EditListClass() {
    this.render = function() {
        var props = Object.assign({ list: [] }, this.props);
        return jade(`
			div
				List(list={props.list})
				a(href="#" onClick={this.onClick}) New`);
    }
    this.onClick = function() {
        if (!this.props.event) return;
        this.props.event.emit("click");
    }
}

module.exports = React.createClass(new EditListClass());
