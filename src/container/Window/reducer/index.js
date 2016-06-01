var Window = require("..");
var Bar = require("./bar");
var Redux = require("redux");
var combineReducers = Redux.combineReducers;
var init = require("./init");
var displayBars = require("./displayBars");

module.exports = combineReducers({ init, displayBars });
