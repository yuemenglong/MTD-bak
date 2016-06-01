var reducer = require("./reducer");
var _ = require("lodash");
var fetch = require("isomorphic-fetch");
var React = require("react");
var ReactDOM = require("react-dom");
var Redux = require("redux");
var thunk = require("redux-thunk").default;
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;
var Provider = ReactRedux.Provider;
var createStore = Redux.createStore;
var applyMiddleware = Redux.applyMiddleware;

var Bar = require("./busi/bar");
var Order = require("./busi/order");

var Svg = require("./Svg");

var store = applyMiddleware(thunk)(createStore)(reducer, typeof window !== "undefined" && window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : undefined);

function WindowClass() {
    if (typeof $ !== "undefined") {
        $(document).keydown(function(e) {
            console.log(e.keyCode);
            if (e.keyCode === 39) {
                store.dispatch({ type: "MOVE_NEXT" });
            } else if (e.keyCode === 37) {
                store.dispatch({ type: "MOVE_PREV" });
            } else if (e.keyCode === 38) {
                var bar = Bar.displayBars()[0];
                var order = new Order("BUY", bar.close, 0.2);
                store.dispatch({ type: "ORDER_SEND", order: order });
            }
        })
        $(document).ready(function() {
            store.dispatch(function(dispatch, getState) {
                store.dispatch({ type: "FETCH_DATA" });
                fetch("/data/2001.json").then(function(res) {
                    return res.json();
                }).then(function(json) {
                    store.dispatch({ type: "FETCH_DATA_SUCC", data: json });
                })
            })
        })
    }
    this.render = function() {
        return jade(`
            Provider(store={store})
                Svg`);
    }
}

module.exports = React.createClass(new WindowClass());
module.exports.state = store.getState();
