var EditList = require("../component/EditList");
var React = require("react");
var EventEmitter = require("events").EventEmitter;
var connect = require("react-redux").connect;
var Provider = require("react-redux").Provider;
var createStore = require("redux").createStore;

function mapStateToProps(state) {
    return { list: state.list };
}

function mapDispatchToProps(dispatch) {
    var event = new EventEmitter();
    event.on("click", () => dispatch({ type: "CLICK_NEW" }));
    return { event: event };
}

function reducer(state, action) {
    state = state || { list: [] };
    switch (action.type) {
        case "CLICK_NEW":
            var list = state.list.slice(0);
            list.push(new Date().toLocaleString());
            return { list: list };
        default:
            return state;
    }
}

var store = createStore(reducer);

var App = connect(mapStateToProps, mapDispatchToProps)(EditList);

var app = ReactDOM.render(jade(`
	Provider(store={store})
		App`), document.body);

module.exports = app;
