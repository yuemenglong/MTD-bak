var _ = require("lodash");
var moment = require("moment");
var React = require("react");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;

var ordersAction = require("./reducer/orders").action;

// orders[] 
function OrderTableClass() {
    this.onCloseClick = function(id) {
        this.props.dispatch(ordersAction.closeOrder(id));
        return false;
    }
    this.onDeleteClick = function(id) {
        this.props.dispatch(ordersAction.deleteOrder(id));
        return false;
    }
    this.renderOperate = function(id) {
        return jade(`
            td(key="op")
                a(href="javascript:void(0);" onClick={this.onCloseClick.bind(null, id)}) 平仓
                a(href="javascript:void(0);" onClick={this.onDeleteClick.bind(null, id)}) 删除
            `)
    }
    this.renderDate = function(o) {
        if (_.isDate(o)) {
            return o.toLocaleString();
        } else {
            return o;
        }
    }
    this.render = function() {
        var header = ["type", "price", "volumn", "stopLoss", "stopWin", "status", "profit",
            "createTime", "openPrice", "openTime", "closePrice", "closeTime", "operate"
        ];
        var that = this;
        return jade(`
            table(className="table table-bordered")
                thead
                    tr #{}
                tbody #{}`,
            function() {
                return _.map(header, o => jade("th(key={o}) {o}"));
            },
            function() {
                return _.map(that.props.orders, function(order) {
                    return jade("tr(key={order.id}) #{}", function() {
                        return _.map(header.slice(0, -1), o => jade("td(key={o}) {that.renderDate(order[o])}"))
                            .concat([that.renderOperate(order.id)]);
                    });
                })
            }
        );
    }
}

function mapStateToProps(state) {
    var orders = state.orders.map(function(o) {
        return _.mapValues(o, function(value) {
            if (_.isDate(value)) {
                return moment(value).format("YYYY-MM-DD HH:mm:SS");
            }
            return value;
        });
    })
    orders = _.sortBy(orders, function(o) {
        return o.createTime;
    })
    return { orders: orders };
}

var OrderTable = React.createClass(new OrderTableClass());
module.exports = connect(mapStateToProps)(OrderTable);

if (require.main == module) {
    // var orders = [{ id: 1, price: 10, volumn: 0.2, createTime: new Date().toLocaleString(), type: "BUY" }];
    // var server = require("react-dom/server");
    // var app = jade("OrderTable(orders={orders})");
    // var html = server.renderToStaticMarkup(app);
    // console.log(html);
}
