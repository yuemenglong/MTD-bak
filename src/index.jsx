var React = require("react");
var ReactDOM = require("react-dom");
var server = require("react-dom/server");
var app = require("./app");

var html = server.renderToString(app);
console.log(html);

module.exports = html;
