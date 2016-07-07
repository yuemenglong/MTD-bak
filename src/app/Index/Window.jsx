var _ = require("lodash");
var React = require("react");
var ReactRedux = require("react-redux");
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var dataAction = require("./reducer/data").action;
var ordersAction = require("./reducer/orders").action;
var accountAction = require("./reducer/account").action;

var Svg = require("./Svg");
var OrderTable = require("./OrderTable");
var AccountOperate = require("./AccountOperate");

function WindowClass() {
    this.componentDidMount = function() {
        var dispatch = this.props.dispatch;
        $.ajaxSetup({ contentType: "application/json; charset=utf-8" });
        $(document).keydown(function(e) {
            // console.log(e.keyCode);
            if (e.keyCode === 39) {
                dispatch(dataAction.moveNext());
            } else if (e.keyCode === 37) {
                dispatch({ type: "MOVE_PREV" });
            } else if (e.keyCode === 66) {
                dispatch(ordersAction.buyOrder());
            }
        })
        $(document).ready(function() {
            dispatch(dataAction.fetchData());
            dispatch(ordersAction.fetchOrders());
            dispatch(accountAction.fetchAccounts());
        })
    }
    this.render = function() {
        return jade(`
            div
                Svg
                AccountOperate
                OrderTable`);
    }
}

var Window = React.createClass(new WindowClass());

module.exports = connect()(Window);
