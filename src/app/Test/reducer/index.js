var Redux = require("redux");
var combineReducers = Redux.combineReducers;
var todo = require("./todo");

module.exports = combineReducers({ todo });
