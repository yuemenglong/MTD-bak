var Bar = require("../busi/bar");
var Window = require("../busi/window");
var Redux = require("redux");
var combineReducers = Redux.combineReducers;

module.exports = reducer;

function reducer(state, action) {
    state = state || [];
    // Bar.setWindowSize(state.style.width, state.style.height);
    switch (action.type) {
        case "FETCH_DATA":
            return state;
        case "FETCH_DATA_SUCC":
            Bar.push(action.data);
            Bar.updateOrigin();
            Window.setPos(Bar.originBars().slice(-1)[0].x1);
            Window.adjust();
            Bar.updateDisplay();
            Window.update();
            return Bar.displayBars()
        case "FETCH_DATA_FAIL":
            return state;
        case "MOVE_PREV":
            var pos = Window.x1() + (Bar.GAP + Bar.WIDTH);
            Window.setPos(pos);
            Window.adjust();
            Bar.updateDisplay();
            Window.update();
            return Bar.displayBars()
        case "MOVE_NEXT":
            var pos = Window.x1() - (Bar.GAP + Bar.WIDTH);
            pos = pos >= 0 ? pos : 0;
            Window.setPos(pos);
            Window.adjust();
            Bar.updateDisplay();
            Window.update();
            return Bar.displayBars()
        default:
            return state;
    }
}
