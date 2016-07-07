var _ = require("lodash");

function reducer(state, action) {
    state = state || { x: 0, y: 0 };
    state = _.cloneDeep(state);
    switch (action.type) {
        case "MOUSE_MOVE":
            return { x: action.x, y: action.y };
        default:
            return state;
    }
}

function Action() {
    this.mouseMove = function(x, y) {
        return { type: "MOUSE_MOVE", x: x, y: y };
    }
}

module.exports = reducer;
module.exports.action = new Action();
