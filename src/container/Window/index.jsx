var _ = require("lodash");
var fetch = require("isomorphic-fetch");
var React = require("react");
var ReactRedux = require("react-redux");
var Provider = ReactRedux.Provider;

var Bar = require("./busi/bar");
var Order = require("./busi/order");
var action = require("./action");

var Svg = require("./Svg");
var OrderTable = require("./OrderTable");

var store = require("./store");

function WindowClass() {
    if (typeof $ !== "undefined") {
        $.ajaxSetup({ contentType: "application/json; charset=utf-8" });
        $(document).keydown(function(e) {
            console.log(e.keyCode);
            if (e.keyCode === 39) {
                store.dispatch({ type: "MOVE_NEXT" });
            } else if (e.keyCode === 37) {
                store.dispatch({ type: "MOVE_PREV" });
            } else if (e.keyCode === 66) {
                var bar = Bar.displayBars()[0];
                var order = { type: "BUY", price: bar.close, volumn: 0.2 };
                store.dispatch(action.sendOrder(order));
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
                div
                    Svg
                    OrderTable`);
    }
}

module.exports = React.createClass(new WindowClass());
module.exports.store = store;
