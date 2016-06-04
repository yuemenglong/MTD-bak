var Order = require("../busi/order");

var Action = {};

Action.sendOrder = function(order) {
    return function(dispatch, getState) {
        $.post("/order", JSON.stringify(order), function(res) {
            console.log(res);
            dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
        });
    }
};
Action.SEND_ORDER_SUCC = "SEND_ORDER_SUCC";
Action.REFRESH_DISPLAY_ORDERS = "REFRESH_DISPLAY_ORDERS";


module.exports = Action;
