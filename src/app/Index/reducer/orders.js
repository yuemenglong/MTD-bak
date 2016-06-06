var Bar = require("../busi/bar");
var Window = require("../busi/window");
var Order = require("../busi/order");
var Redux = require("redux");
var combineReducers = Redux.combineReducers;
var Action = require("../action");

module.exports = reducer;

function reducer(state, action) {
    state = state || [];
    switch (action.type) {
        case "FETCH_ORDER_SUCC":
            Order.push(action.orders);
            return Order.originOrders();
        case "SEND_ORDER_SUCC":
            Order.push(action.order);
            return Order.originOrders();
        default:
            return state;
    }
}
