var React = require("react");
var ReactDOM = require("react-dom");
var server = require("react-dom/server");

var app = require("./app").app;
var state = require("./app").state;

// var html = server.renderToString(app);
var html = server.renderToStaticMarkup(app);
var state = JSON.stringify(state);

module.exports = { html: html, state: state };
