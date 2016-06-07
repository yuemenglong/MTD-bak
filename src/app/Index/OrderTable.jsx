var _ = require("lodash");
var React = require("react");
var ReactRedux = require("react-redux");
var connect = ReactRedux.connect;

var Action = require("./action");
var Window = require("./busi/window");

// orders[] 
function OrderTableClass() {
    this.onCloseClick = function(id) {
        var order = this.props.orders.filter(function(o) {
            return o.id === id;
        })[0];
        if (!order) return;
        order.closeTime = Window.endTime();
        order.closePrice = Window.endPrice();
        order.status = "CLOSE";
        this.props.dispatch(Action.updateOrder(order));
        return false;
    }
    this.renderOperate = function(id) {
        return jade(`
            td(key="op")
                a(href="#" onClick={this.onCloseClick.bind(null, id)}) 平仓
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
        var header = ["id", "type", "price", "volumn", "stopLoss", "stopWin", "status", "createTime", "openTime", "closeTime", "operate"];
        var that = this;
        return jade(`
            table(className="table")
                thead
                    tr #{}
                tbody #{}`,
            function() {
                return _.map(header, o => jade("th(key={o}) {o}"));
            },
            function() {
                return _.map(that.props.orders, function(order) {
                    return jade("tr(key={order.id}) #{}", function() {
                        return _.map(header, o => jade("td(key={o}) {that.renderDate(order[o])}"))
                            .concat([that.renderOperate(order.id)]);
                    });
                })
            }
        );
    }
}

function mapStateToProps(state) {
    return { orders: state.orders };
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
