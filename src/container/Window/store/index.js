var Redux = require("redux");
var thunk = require("redux-thunk").default;
var createStore = Redux.createStore;
var applyMiddleware = Redux.applyMiddleware;

var reducer = require("../reducer");

var store = applyMiddleware(thunk)(createStore)(reducer, typeof window !== "undefined" && window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : undefined);

module.exports = store;

