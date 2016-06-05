var server = require("react-dom/server");
var React = require("react");
var Redux = require("redux");
var ReactRedux = require("react-redux");
var thunk = require("redux-thunk").default;
var createStore = Redux.createStore;
var applyMiddleware = Redux.applyMiddleware;
var Provider = ReactRedux.Provider;

var createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

var tpl = `
Provider(store={store})
	App`;

function serverRender(App, state) {
    state = state || {};
    var reducer = App.reducer;
    var store = createStoreWithMiddleware(reducer, state);
    var app = jade(tpl);
    var html = server.renderToStaticMarkup(app);
    var init = JSON.stringify(store.getState());
    return { html, init };
}

module.exports = serverRender;
