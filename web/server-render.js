'use strict';

var jade = require('jade');
var fs = require('fs');
var server = require('react-dom/server');
var React = require('react');
var ReactRedux = require('react-redux');
var Redux = require('redux');
var Provider = ReactRedux.Provider;

function serverRender(App, state) {
    state = state || {};
    var reducer = App.reducer;
    var store = Redux.createStore(reducer, state);
    var app = React.createElement(
        Provider,
        { store: store },
        React.createElement(App, null)
    );
    var html = server.renderToStaticMarkup(app);
    var init = JSON.stringify(store.getState());
    return {
        html: html,
        init: init
    };
}
module.exports = serverRender;

