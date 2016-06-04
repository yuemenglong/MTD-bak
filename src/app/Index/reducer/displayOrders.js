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
        case "SEND_ORDER_SUCC":
            Order.updateDisplay();
            return Order.displayOrders();
        case "MOVE_NEXT":
            Order.updateDisplay();
            return Order.displayOrders();
        case "MOVE_NEXT":
            Order.updateDisplay();
            return Order.displayOrders();
        default:
            return state;
    }
}
