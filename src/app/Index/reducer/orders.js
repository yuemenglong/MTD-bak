var _ = require("lodash");

function Order(order) {
    _.merge(this, order)
    var times = ["createTime", "openTime", "closeTime"];
    _.forEach(times, function(field) {
        this[field] = this[field] && new Date(this[field]);
    }.bind(this))
}

Order.prototype.toJSON = function() {
    var order = _.mapValues(this, o => _.isDate(o) ? moment(o).format("YYYY-MM-DD HH:mm:ss") : o);
    return order;
}

function reducer(state, action) {
    state = state || [];
    switch (action.type) {
        case "FETCH_ORDER_SUCC":
            var orders = action.orders.map(function(o) {
                return new Order(o);
            })
            return orders;
        default:
            return state;
    }
}

function Action() {
    this.fetchOrder = function() {
        return function(dispatch, getState) {
            fetch("/order").then(function(res) {
                return res.json();
            }).then(function(json) {
                dispatch({ type: "FETCH_ORDER_SUCC", orders: json })
            })
        }
    }

    //{type, volumn}
    this.sendOrder = function(order) {
        return function(dispatch, getState) {
            var wnd = getState().data.window;
            if (order.type === "BUY" || order.type === "SELL") {
                var bar = getState().data.displayBars[0];
                _.merge(order, {
                    price: bar.close,
                    openPrice: bar.close,
                    createTime: bar.datetime,
                    openTime: bar.datetime,
                    status: "OPEN"
                });
            }
            order = new Order(order);
            var json = JSON.stringify(order);
            console.log(json);
            $.post("/order", json, function(res) {
                dispatch({ type: "SEND_ORDER_SUCC", order: new Order(res) });
            });
        }
    };

    this.updateOrder = function(order) {
        return function(dispatch, getState) {
            var json = JSON.stringify(order);
            $.post("/order/" + order.id, json, function(res) {
                dispatch({ type: "UPDATE_ORDER_SUCC", order: new Order(res) });
            });
        }
    }
}

module.exports = reducer;
module.exports.action = new Action();
