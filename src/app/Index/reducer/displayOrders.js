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
        case "FETCH_ORDER_SUCC":
        case "UPDATE_ORDER_SUCC":
        case "MOVE_PREV":
        case "MOVE_NEXT":
            Order.updateDisplay();
            return Order.displayOrders();
        default:
            return state;
    }
}
