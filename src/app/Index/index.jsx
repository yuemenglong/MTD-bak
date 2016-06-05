var _ = require("lodash");
var fetch = require("isomorphic-fetch");
var React = require("react");
var ReactRedux = require("react-redux");
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var Bar = require("./busi/bar");
var Order = require("./busi/order");
var action = require("./action");

var Svg = require("./Svg");
var OrderTable = require("./OrderTable");
var reducer = require("./reducer");

function WindowClass() {
    this.componentDidMount = function() {
        var dispatch = this.props.dispatch;
        $.ajaxSetup({ contentType: "application/json; charset=utf-8" });
        $(document).keydown(function(e) {
            console.log(e.keyCode);
            if (e.keyCode === 39) {
                dispatch({ type: "MOVE_NEXT" });
            } else if (e.keyCode === 37) {
                dispatch({ type: "MOVE_PREV" });
            } else if (e.keyCode === 66) {
                var bar = Bar.displayBars()[0];
                var order = { type: "BUY", price: bar.close, volumn: 0.2 };
                dispatch(action.sendOrder(order));
            }
        })
        $(document).ready(function() {
            dispatch(function(dispatch, getState) {
                dispatch({ type: "FETCH_DATA" });
                fetch("/data/2001.json").then(function(res) {
                    return res.json();
                }).then(function(json) {
                    dispatch({ type: "FETCH_DATA_SUCC", data: json });
                })
            })
        })
    }
    this.render = function() {
        return jade(`
            div
                Svg
                OrderTable`);
    }
}

var Window = React.createClass(new WindowClass());

module.exports = connect()(Window);
module.exports.reducer = reducer;
