var Redux = require("redux");
var combineReducers = Redux.combineReducers;
var init = require("./init");
var displayBars = require("./displayBars");
var displayOrders = require("./displayOrders");

module.exports = combineReducers({ init, displayBars, displayOrders });
