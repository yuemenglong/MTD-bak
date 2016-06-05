var _ = require("lodash");
var React = require("react");
var Todo = require("../../component/Todo");
var EventEmitter = require("events").EventEmitter;

function ExportClass() {
    this.getInitialState = function() {
        var event = new EventEmitter();
        event.on("insert", function(text) {
            console.log(text);
        })
        return { event: event };
    }
    this.render = function() {
        return jade("Todo(list={['a','b']} text='hello' event={this.state.event})");
    }
}

module.exports = React.createClass(new ExportClass());
