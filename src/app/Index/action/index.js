var Order = require("../busi/order");
var fetch = require("isomorphic-fetch");

var Action = {};

Action.sendOrder = function(order) {
    return function(dispatch, getState) {
        $.post("/order", JSON.stringify(order), function(res) {
            console.log(res);
            dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
        });
    }
};

Action.fetchData = function() {
    return function(dispatch, getState) {
        dispatch({ type: "FETCH_DATA" });
        fetch("/static/data/2001.json").then(function(res) {
            return res.json();
        }).then(function(json) {
            dispatch({ type: "FETCH_DATA_SUCC", data: json });
        })
    };
}

module.exports = Action;
