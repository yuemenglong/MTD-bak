var React = require("react");
var ReactDOM = require("react-dom");
var server = require("react-dom/server");

var app = require("./app").app;
var store = require("./app").store;

// var html = server.renderToString(app);
var html = server.renderToStaticMarkup(app);
var state = JSON.stringify(store.getState());

module.exports = { html: html, state: state };
