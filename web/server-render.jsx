var jade = require("jade");
var fs = require("fs");
var server = require("react-dom/server");
var React = require("react");
var ReactRedux = require("react-redux");
var Redux = require("redux");
var Provider = ReactRedux.Provider;

var tpl = `
Provider(store={store})
	App`;

function serverRender(App, state) {
    state = state || {};
    var reducer = App.reducer;
    var store = Redux.createStore(reducer, state);
    var app = jade(tpl);
    var html = server.renderToStaticMarkup(app);
    var init = JSON.stringify(store.getState());
    return { html, init };
}

module.exports = serverRender;
