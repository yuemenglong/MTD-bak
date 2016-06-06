var Order = require("../busi/order");
var fetch = require("isomorphic-fetch");
var moment = require("moment");

var Action = {};

function transDate(obj) {
    return _.mapValues(obj, o => _.isDate(o) ? moment(o).format("YYYY-MM-DD HH:mm:ss") : o);
}

Action.fetchOrder = function() {
    return function(dispatch, getState) {
        fetch("/order").then(function(res) {
            return res.json();
        }).then(function(json) {
            var orders = JSON.parse(json);
            console.log(orders);
        })
    }
}

Action.sendOrder = function(order) {
    return function(dispatch, getState) {
        order = transDate(order);
        $.post("/order", JSON.stringify(order), function(res) {
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
