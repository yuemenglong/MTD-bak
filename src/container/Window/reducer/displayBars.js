var Window = require("..");
var Bar = require("./bar");
var Redux = require("redux");
var combineReducers = Redux.combineReducers;

module.exports = reducer;

function reducer(state, action) {
    state = state || [];
    // Bar.setWindowSize(state.style.width, state.style.height);
    switch (action.type) {
        case "FETCH_DATA":
            console.log("FETCH_DATA");
            return state;
        case "FETCH_DATA_SUCC":
            console.log("FETCH_DATA_SUCC");
            Bar.push(action.data);
            Bar.updateBars();
            Bar.setWindowPos(Bar.originBars().slice(-1)[0].x1);
            Bar.adjustWindow();
            Bar.updateWindow();
            return Bar.displayBars()
        case "FETCH_DATA_FAIL":
            console.log("FETCH_DATA_FAIL");
            return state;
        case "MOVE_PREV":
            var pos = Bar.window().x1 + (Bar.GAP + Bar.WIDTH);
            Bar.setWindowPos(pos);
            Bar.adjustWindow();
            Bar.updateWindow();
            return Bar.displayBars()
        case "MOVE_NEXT":
            var pos = Bar.window().x1 - (Bar.GAP + Bar.WIDTH);
            pos = pos >= 0 ? pos : 0;
            Bar.setWindowPos(pos);
            Bar.adjustWindow();
            Bar.updateWindow();
            return Bar.displayBars()
        default:
            return state;
    }
}
