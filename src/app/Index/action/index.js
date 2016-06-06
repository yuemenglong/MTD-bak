var Order = require("../busi/order");
var Window = require("../busi/window");
var fetch = require("isomorphic-fetch");
var moment = require("moment");

var Action = {};

Action.fetchOrder = function() {
    return function(dispatch, getState) {
        fetch("/order").then(function(res) {
            return res.json();
        }).then(function(json) {
            var orders = json.map(o => new Order(o));
            dispatch({ type: "FETCH_ORDER_SUCC", orders: orders })
        })
    }
}

Action.sendOrder = function(order) {
    return function(dispatch, getState) {
        var json = JSON.stringify(order);
        console.log(json);
        $.post("/order", json, function(res) {
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
