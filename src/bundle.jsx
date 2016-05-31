var React = require("react");
var ReactDOM = require("react-dom");
// var app = require("./app");
var fetch = require("whatwg-fetch");
var app = require("./app");

ReactDOM.render(app, document.body);
// app.refresh();

// fetch("/data/2001.json").then(function(res) {
//     return res.json();
// }).then(function(json) {
//     app.pushData(json);
//     app.setDate(new Date(json[0].datetime));
// })

// $(document).keydown(function(e) {
//     if (e.keyCode === 39) {
//         app.next();
//     } else if (e.keyCode === 37) {
//         app.prev();
//     }
// })
