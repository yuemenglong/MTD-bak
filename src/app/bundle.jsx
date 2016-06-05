var React = require("react");
var ReactDOM = require("react-dom");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var Provider = ReactRedux.Provider;

var App = require(".");
var reducer = App.reducer;

var store = Redux.createStore(reducer, window.__INITIAL_STATE__);

var tpl = `
Provider(store={store})
	App`;

ReactDOM.render(jade(tpl), document.getElementById("container"));
