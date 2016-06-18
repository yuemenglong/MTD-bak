var Redux = require("redux");
var combineReducers = Redux.combineReducers;
// var init = require("./init");
// var displayBars = require("./displayBars");
// var displayOrders = require("./displayOrders");
var data = require("./data");
var orders = require("./orders");

module.exports = combineReducers({ data, orders });
