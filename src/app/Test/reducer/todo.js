function reducer(state, action) {
    state = state || [];
    switch (action.type) {
        case "ADD_ITEM":
            return state.concat([action.text]);
        default:
            return state;
    }
}

function Action() {
    this.addItem = function(text) {
        return function(dispatch, getState) {
            console.log(getState());
            dispatch({ type: "ADD_ITEM", text: text });
            console.log(getState());
            dispatch({ type: "ADD_ITEM", text: text });
            console.log(getState());
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
