var Redux = require("redux");
var combineReducers = Redux.combineReducers;
// var init = require("./init");
// var displayBars = require("./displayBars");
// var displayOrders = require("./displayOrders");
var data = require("./data");
var orders = require("./orders");
var account = require("./account");
var mouse = require("./mouse");

module.exports = combineReducers({ data, orders, account, mouse });
