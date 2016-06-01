var Bar = require("../busi/bar");
var Window = require("../busi/window");
var Order = require("../busi/order");
var Redux = require("redux");
var combineReducers = Redux.combineReducers;

module.exports = reducer;

function reducer(state, action) {
    state = state || [];
    switch (action.type) {
        case "ORDER_SEND":
            Order.send(action.order);
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
