var _ = require("lodash");
var React = require("react");
var Todo = require("../../component/Todo");
var EventEmitter = require("events").EventEmitter;
var Redux = require("redux");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;

var reducer = require("./reducer");
var todoAction = require("./reducer/todo").action;

require("./style.less");

function AppClass() {
    this.getInitialState = function() {
        var event = new EventEmitter();
        event.on("insert", function(text) {
            this.props.dispatch(todoAction.addItem(text));
        }.bind(this))
        return { event: event };
    }
    this.render = function() {
        return jade("Todo({...this.props} event={this.state.event})");
    }
}

function mapStateToProps(state) {
    return { list: state.todo };
}

module.exports = connect(mapStateToProps)(React.createClass(new AppClass()));
module.exports.reducer = reducer;
