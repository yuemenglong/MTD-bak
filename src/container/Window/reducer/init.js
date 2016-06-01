var Window = require("..");
var Bar = require("./bar");
var Redux = require("redux");

module.exports = reducer;

function reducer(state, action) {
    state = state || { gridWidth: 32, style: { width: 1280, height: 640, backgroundColor: "#888", } };
    Bar.setWindowSize(state.style.width, state.style.height);
    return state;
}
