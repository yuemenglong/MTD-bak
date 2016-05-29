var React = require("react");
var ReactDOM = require("react-dom");

// var EventEmitter = require('fbemitter').EventEmitter;
var EventEmitter = require("events").EventEmitter;
// var EventEmitter = require('eventemitter3');

function LinkClass() {
    this.emit = function() {
        if (this.props.event) {
            this.props.event.emit.apply(this.props.event, arguments);
        }
    }
    this.onClick = function() {
        console.log("log click");
        this.emit("click");
    }
    this.render = function() {
        return jade("a(href='#' onClick={this.onClick}) hi");
    }
}
var event = new EventEmitter();
event.on("click", function() {
    console.log("event");
});
var Link = React.createClass(new LinkClass());

var app = ReactDOM.render(jade("Link(event={event})"), document.body);
