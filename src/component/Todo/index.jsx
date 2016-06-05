var _ = require("lodash");
var React = require("react");

var tpl = `
div 
	ul 
		#{}
	input(type="text" value={this.state.text} onChange={this.onInputChange})
	input(type="button" value="ok" onClick={this.onInputClick})
`;

//{list[], text}
//{text}
//insert
function TodoClass() {
    this.getInitialState = function() {
        return { text: this.props.text }
    }
    this.onInputChange = function(e) {
        this.setState({ text: e.target.value });
    }
    this.onInputClick = function() {
        var text = this.state.text;
        this.setState({ text: "" });
        if (!this.props.event) return;
        this.props.event.emit("insert", text);
    }
    this.render = function() {
        var that = this;
        return jade(tpl, function() {
            return that.props.list.map(o => jade("li(key={o}) {o}"));
        })
    }
}

module.exports = React.createClass(new TodoClass());
