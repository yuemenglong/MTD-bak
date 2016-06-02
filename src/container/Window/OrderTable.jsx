var _ = require("lodash");
var React = require("react");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;

function OrderTableClass() {
    this.render = function() {
        var header = ["id", "type", "price", "volumn", "stopLoss", "stopWin", "createTime", "openTime", "closeTime"];
        var that = this;
        return jade(`
			table
				thead
					tr #{}
				tbody #{}`,
            function() {
                return _.map(header, o => jade("th(key={o}) {o}"));
            },
            function() {
                return _.map(that.props.orders, function(order) {
                    return jade("tr(key={order.id}) #{}", function() {
                        return _.map(header, o => jade("td(key={o}) {order[o]}"));
                    });
                })
            }
        );
    }
}

function mapStateToProps(state) {
    var orders = _.map(state.orders, function(order) {
        var order = _.clone(order);
        _.map(["createTime", "openTime", "closeTime"], function(o) {
            order[o] = order[o] && order[o].toLocaleString();
        })
        return order;
    })
    return { orders: orders };
}

var OrderTable = React.createClass(new OrderTableClass());
module.exports = connect(mapStateToProps)(OrderTable);
