var Window = require("../busi/window");
var Redux = require("redux");

module.exports = reducer;

function reducer(state, action) {
    state = state || { gridWidth: 32, style: { width: 1280, height: 640, backgroundColor: "#888", } };
    Window.setSize(state.style.width, state.style.height);
    return state;
}
