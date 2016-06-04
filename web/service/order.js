var _ = require("lodash");
var orm = require("yy-orm");
var uuid = require("node-uuid");
var type = orm.type;
var cond = orm.cond;
var db = orm.create({ host: 'localhost', user: 'root', password: 'root', database: 'test' })

var Order = db.define("orders", {
    id: type.varchar(64).pkey(),
    type: type.varchar(16).notNull(),
    price: type.double().notNull(),
    volumn: type.double().notNull(),
    stopLoss: type.double(),
    stopWin: type.double(),
    createTime: type.datetime().notNull(),
    openTime: type.datetime(),
    openPrice: type.double(),
    closeTime: type.datetime(),
    closePrice: type.double(),
    profit: type.double(),
    status: type.varchar(16).notNull(),
})

db.build();

var service = {};

service.sendOrder = function(order) {
    order.id = uuid.v1();
    if (order.type === "BUY" || order.type === "SELL") {
        order.openTime = order.createTime;
        order.openPrice = order.price;
    }
    return Order.insert(order);
}

module.exports = service;
