var ReactDOM = require("react-dom");
var React = require("react");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var thunk = require("redux-thunk").default;
var createStore = Redux.createStore;
var applyMiddleware = Redux.applyMiddleware;
var Provider = ReactRedux.Provider;

var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

var tpl = `
Provider(store={store})
	App`;

var App = require(".");

var reducer = App.reducer;
var store = createStoreWithMiddleware(reducer, window.__INITIAL_STATE__);
var app = jade(tpl);

ReactDOM.render(app, document.getElementById("container"));
