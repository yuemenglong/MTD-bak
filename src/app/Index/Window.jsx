var _ = require("lodash");
var React = require("react");
var ReactRedux = require("react-redux");
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

var Bar = require("./busi/bar");
var Order = require("./busi/order");
var Action = require("./action");

var Svg = require("./Svg");
var OrderTable = require("./OrderTable");

function WindowClass() {
    this.componentDidMount = function() {
        var dispatch = this.props.dispatch;
        $.ajaxSetup({ contentType: "application/json; charset=utf-8" });
        $(document).keydown(function(e) {
            console.log(e.keyCode);
            if (e.keyCode === 39) {
                dispatch({ type: "MOVE_NEXT" });
            } else if (e.keyCode === 37) {
                dispatch({ type: "MOVE_PREV" });
                // } else if (e.keyCode === 66) {
                //     var bar = Bar.displayBars()[0];
                //     var order = new Order({
                //         type: "BUY",
                //         price: bar.close,
                //         volumn: 0.2,
                //         createTime: bar.datetime,
                //         openPrice: bar.close,
                //         openTime: bar.datetime,
                //         status: "OPEN",
                //     });
                //     dispatch(Action.sendOrder(order));
            }
        })
        $(document).ready(function() {
            dispatch(Action.fetchData());
            // dispatch(Action.fetchOrder());
        })
    }
    this.render = function() {
        return jade("Svg");
    }
}

var Window = React.createClass(new WindowClass());

module.exports = connect()(Window);
